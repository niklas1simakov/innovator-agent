from enum import Enum

from pydantic import BaseModel


class DocumentType(str, Enum):
    PATENT = 'patent'
    PUBLICATION = 'publication'


class Document(BaseModel):
    type: DocumentType
    id: str
    title: str
    abstract: str
    publication_date: str
    authors: list[str]
    score: float
    institutions: list[str]
