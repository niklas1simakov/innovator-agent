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


class DocumentData(SearchResult):
    abstract: str
    publication_date: str
    authors: list[str]
    institutions: list[str]
    similarities: list[str] | None
    differences: list[str] | None


class NoveltyAnalysis(BaseModel):
    novelty_score: float
    novelty_analysis: str


class AuthorData(BaseModel):
    name: str
    number_of_publications: int


class AnalysisResponse(BaseModel):
    documents: list[DocumentData]
    novelty_score: float
    novetly_analysis: str
    publication_dates: list[str]
    authors: list[AuthorData]
