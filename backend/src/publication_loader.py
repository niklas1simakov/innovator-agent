import requests

from src.models import DocumentData, DocumentType, SearchResult


class PublicationLoader:
    def __init__(self, search_result: SearchResult) -> None:
        self.search_result = search_result
        self.title: str = ''
        self.abstract: str = ''
        self.publication_date: str = ''
        self.authors: list[str] = []
        self.institutions: list[str] = []
        self.api_url: str = self._get_api_url(search_result.id)
        self.data_fetch_successful = False
        self._fetch_data()

    def get_document(self) -> DocumentData | None:
        if not self.data_fetch_successful:
            return None

        return DocumentData(
            id=self.search_result.id,
            type=DocumentType.PUBLICATION,
            score=self.search_result.score,
            url=self.search_result.url,
            title=self.title or self.search_result.title,
            abstract=self.abstract,
            publication_date=self.publication_date,
            authors=self.authors,
            institutions=self.institutions,
        )

    def _get_api_url(self, id: str) -> str:
        """Return an OpenAlex API works URL given a web or API works URL."""
        return f'https://api.openalex.org/works/{id}'

    def _fetch_data(self) -> None:
        """Fetch publication data from OpenAlex API."""
        try:
            data = self._get_api_data()
            if data:
                self._parse_fields(data)
                self.data_fetch_successful = True
        except ValueError as e:
            print(f'Error: Invalid URL format: {e!s}')
            self.data_fetch_successful = False
        except Exception as e:
            print(f'Warning: Failed to fetch publication data for {self.api_url}: {e!s}')
            self.data_fetch_successful = False

    def _get_api_data(self) -> dict:
        """Fetch data from OpenAlex API."""
        r = requests.get(self.api_url, timeout=10)
        r.raise_for_status()

        # Check if response has content
        if not r.text.strip():
            raise ValueError('Empty response from API')

        try:
            return r.json()
        except ValueError as e:
            raise ValueError(f'Invalid JSON response: {e!s}') from e

    def _parse_fields(self, data: dict) -> None:
        """Parse publication fields from API data."""
        self.title = data.get('title', '')
        self.publication_date = data.get('publication_date', '')
        self.authors = [a['author']['display_name'] for a in data.get('authorships', [])]

        # Extract institutions from authorships
        institutions = set()
        for authorship in data.get('authorships', []):
            for institution in authorship.get('institutions', []):
                if institution.get('display_name'):
                    institutions.add(institution['display_name'])
        self.institutions = list(institutions)

        # Reconstruct abstract from inverted index
        abstract_inverted_index = data.get('abstract_inverted_index')
        self.abstract = self._reconstruct_abstract(abstract_inverted_index) or ''

    def _reconstruct_abstract(self, inverted: dict[str, list[int]] | None) -> str | None:
        """Reconstruct abstract text from inverted index."""
        if not inverted:
            return None
        positions = []
        for word, indexes in inverted.items():
            for i in indexes:
                positions.append((i, word))
        return ' '.join(word for _, word in sorted(positions))
