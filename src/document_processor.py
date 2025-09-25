import os
from textwrap import dedent

from requests import Session
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

from document_types import DocumentData, DocumentType, SearchResult
from patent_loader import PatentLoader
from publication_loader import PublicationLoader


class DocumentProcessor:
    def __init__(self, abstract: str, title: str) -> None:
        self.abstract = abstract
        self.title = title
        self.search_results = self._find_documents()
        self.documents = self._load_documents()

    def _find_documents(self) -> list[SearchResult]:
        # Establish session for robust connection
        s = Session()
        retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 501, 502, 503, 504, 524])
        s.mount('https://', HTTPAdapter(max_retries=retries))

        query = dedent(
            """
            query embedDocumentAndSimilaritySearch($data: [EncodeDocumentPart], $indices: [String], $amount: Int, $model: String!) {
              encodeDocumentAndSimilaritySearch(
                data: $data
                indices: $indices
                amount: $amount
                model: $model
              ) {
                id
                score
                index
                document {
                  title
                  url
                }
              }
            }
            """
        )

        variables = {
            'model': 'patspecter',
            'data': [
                {'key': 'title', 'value': self.title},
                {'key': 'abstract', 'value': self.abstract},
            ],
            'amount': 50,
            'indices': ['patents', 'publications'],
        }

        r = s.post(
            'https://api.logic-mill.net/api/v1/graphql/',
            headers={
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + os.getenv('API_KEY_LOGIC_MILL'),
            },
            json={'query': query, 'variables': variables},
        )

        if r.status_code != 200:
            print(f'Error executing\n{query}')
        else:
            search_results = []
            response = r.json()
            response = response['data']['encodeDocumentAndSimilaritySearch']
            for item in response:
                sr = SearchResult(
                    id=item['id'],
                    title=item['document']['title'],
                    url=item['document']['url'],
                    type=DocumentType.PATENT if item['index'] == 'patents' else DocumentType.PUBLICATION,
                    score=item['score'],
                )
                search_results.append(sr)
        return search_results

    def _load_documents(self, search_results: list[SearchResult]) -> list[DocumentData]:
        return [self._load_single_document(search_result) for search_result in search_results]

    def _load_single_document(self, search_result: SearchResult) -> DocumentData:
        if search_result.type == DocumentType.PUBLICATION:
            return PublicationLoader(search_result).get_document()
        elif search_result.type == DocumentType.PATENT:
            return PatentLoader(search_result).get_document()
        else:
            raise ValueError(f'Unknown document type: {search_result.type}')
