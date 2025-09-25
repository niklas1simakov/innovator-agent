import os

from requests import Session
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

from document import DocumentType, SearchResult

# API settings
TOKEN = os.getenv('API_KEY_LOGIC_MILL')
URL = 'https://api.logic-mill.net/api/v1/graphql/'
headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + TOKEN,
}

# Build GraphQL query
query = """
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


# Build variables function
def build_variables(title: str, abstract: str, amount: int = 50, indices: list[str] | None = None) -> dict:
    if indices is None:
        indices = ['patents', 'publications']

    return {
        'model': 'patspecter',
        'data': [
            {'key': 'title', 'value': title},
            {'key': 'abstract', 'value': abstract},
        ],
        'amount': amount,
        'indices': indices,
    }


class DocumentFinder:
    def __init__(self, title: str, abstract: str) -> None:
        self.title = title
        self.abstract = abstract
        self.results = self.find_documents()

    def find_documents(self) -> list[SearchResult]:
        # Establish session for robust connection
        s = Session()
        retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 501, 502, 503, 504, 524])
        s.mount('https://', HTTPAdapter(max_retries=retries))

        variables = build_variables(title=self.title, abstract=self.abstract)
        # Send request
        r = s.post(URL, headers=headers, json={'query': query, 'variables': variables})

        # Handle response
        if r.status_code != 200:
            print(f'Error executing\n{query}\non {URL}')
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
