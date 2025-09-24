import requests

# Constants
ABSTRACT_PREVIEW_LENGTH = 100


class Publication:
    def __init__(self, publication_id: str) -> None:
        """
        Initialize a Publication object with data from OpenAlex API.

        Args:
            publication_id (str): Can be the short ID (W4409125250) or the full URL
        """
        self.publication_id = publication_id
        self._fetch_data()

    def _fetch_data(self) -> None:
        """Fetch publication data from OpenAlex API."""
        self._initialize_fields()

        try:
            data = self._get_api_data()
            self._parse_fields(data)
        except Exception as e:
            print(f'Warning: Failed to fetch publication data for {self.publication_id}: {e!s}')

    def _initialize_fields(self) -> None:
        """Initialize all fields with default empty values."""
        self.title = ''
        self.abstract = ''
        self.publication_date = ''
        self.authors = []
        self.institutions = []

    def _get_api_data(self) -> dict:
        """Fetch data from OpenAlex API."""
        if self.publication_id.startswith('http'):
            url = self.publication_id
        else:
            url = f'https://api.openalex.org/works/{self.publication_id}'

        r = requests.get(url)
        r.raise_for_status()
        return r.json()

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

    def __str__(self) -> str:
        """String representation of the publication."""
        abstract_preview = (
            self.abstract[:ABSTRACT_PREVIEW_LENGTH] + '...' if len(self.abstract) > ABSTRACT_PREVIEW_LENGTH else self.abstract
        )
        return (
            f'Publication(\n'
            f"  id='{self.publication_id}',\n"
            f"  title='{self.title}',\n"
            f"  abstract='{abstract_preview}',\n"
            f"  publication_date='{self.publication_date}',\n"
            f'  authors={self.authors},\n'
            f'  institutions={self.institutions}\n'
            f')'
        )

    def __repr__(self) -> str:
        """Detailed string representation of the publication."""
        return f"Publication(id='{self.publication_id}', title='{self.title}')"
