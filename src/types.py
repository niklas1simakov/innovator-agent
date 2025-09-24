from enum import Enum

from pydantic import BaseModel

from publication_loader import Publication


class DocumentType(str, Enum):
    PATENT = 'patent'
    PUBLICATION = 'publication'


class SearchResult(BaseModel):
    id: str
    title: str
    type: DocumentType
    score: float
    url: str


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
        self.abstract = self.get_document().abstract
        self.publication_date = self.get_document().publication_date
        self.authors = self.get_document().authors
        self.institutions = self.get_document().institutions

    def get_document(self) -> object:
        if self.type == DocumentType.PUBLICATION:
            return Publication(self.id)
        elif self.type == DocumentType.PATENT:
            # Placeholder for Patent class, assuming similar structure to Publication
            raise NotImplementedError('Patent class is not implemented yet.')
        else:
            raise ValueError(f'Unknown document type: {self.type}')
