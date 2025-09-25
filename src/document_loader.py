from document_types import Document, DocumentType, SearchResult
from patent_loader import Patent
from publication_loader import Publication


class DocumentLoader:
    def get_document(self, search_result: SearchResult) -> Document:
        if self.type == DocumentType.PUBLICATION:
            return Publication(search_result.url)
        elif self.type == DocumentType.PATENT:
            return Patent(search_result.url.split('search?q=')[-1])
        else:
            raise ValueError(f'Unknown document type: {self.type}')
