from document_types import Document, DocumentType, SearchResult
from patent_loader import PatentLoader
from publication_loader import PublicationLoader


class DocumentLoader:
    def get_document(self, search_result: SearchResult) -> Document:
        if search_result.type == DocumentType.PUBLICATION:
            return PublicationLoader(search_result).get_document()
        elif search_result.type == DocumentType.PATENT:
            return PatentLoader(search_result).get_document()
        else:
            raise ValueError(f'Unknown document type: {search_result.type}')
