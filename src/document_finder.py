from src.types import SearchResult


class DocumentFinder:
    def __init__(self, abstract: str):
        self.abstract = abstract
        self.results = self.find_documents()

    def find_documents(self) -> list[SearchResult]:
        # TODO: Fetch data from Logic Mill
        return []
