from enum import Enum

from pydantic import BaseModel


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
    id: str
    title: str
    type: DocumentType
    score: float
    url: str
    abstract: str
    publication_date: str
    authors: list[str]
    institutions: list[str]
