from enum import Enum

from patent_loader import Patent
from publication_loader import Publication


class DocumentType(str, Enum):
    PATENT = 'patent'
    PUBLICATION = 'publication'


class SearchResult:
    id: str
    title: str
    type: DocumentType
    score: float
    url: str

    def __init__(self, id: str, title: str, type: DocumentType, score: float, url: str) -> None:
        self.id = id
        self.title = title
        self.type = type
        self.score = score
        self.url = url


class Document(SearchResult):
    abstract: str
    publication_date: str
    authors: list[str]
    institutions: list[str]

    def __init__(self, search_result: SearchResult) -> None:
        # Initialize inherited fields from SearchResult
        super().__init__(
            id=search_result.id, title=search_result.title, type=search_result.type, score=search_result.score, url=search_result.url
        )

        # Initialize document-specific fields from document parameter
        doc = self.get_document()
        self.abstract = doc.abstract
        self.publication_date = doc.publication_date
        self.authors = doc.authors
        self.institutions = doc.institutions

    def get_document(self) -> object:
        if self.type == DocumentType.PUBLICATION:
            return Publication(self.url)
        elif self.type == DocumentType.PATENT:
            return Patent(self.url.split('search?q=')[-1])
        else:
            raise ValueError(f'Unknown document type: {self.type}')
