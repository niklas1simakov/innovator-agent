from document_types import DocumentData, DocumentType, SearchResult
from patent_loader import PatentLoader
from publication_loader import PublicationLoader


class DocumentLoader:
    def __init__(self, search_results: list[SearchResult]) -> None:
        self.search_results = search_results

    def get_documents(self) -> list[DocumentData]:
        return [self.load_document(search_result) for search_result in self.search_results]

    def load_document(self, search_result: SearchResult) -> DocumentData:
        if search_result.type == DocumentType.PUBLICATION:
            return PublicationLoader(search_result).get_document()
        elif search_result.type == DocumentType.PATENT:
            return PatentLoader(search_result).get_document()
        else:
            raise ValueError(f'Unknown document type: {search_result.type}')
