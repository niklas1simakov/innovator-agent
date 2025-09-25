from src.models import AuthorData, DocumentData, NoveltyAnalysis


def get_novetly_analysis(documents: list[DocumentData]) -> NoveltyAnalysis:
    return NoveltyAnalysis(novelty_score=0.0, novelty_analysis='')


def get_publication_dates(documents: list[DocumentData]) -> list[str]:
    return [document.publication_date for document in documents]


def get_authors(documents: list[DocumentData]) -> list[AuthorData]:
    return [AuthorData(name=document.authors[0], number_of_publications=len(document.authors)) for document in documents]


class DocumentAnalyzer:
    def analyze(self, documents: list[DocumentData]) -> list[DocumentData]:
        return documents
