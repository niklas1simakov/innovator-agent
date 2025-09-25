from document_finder import DocumentFinder
from document_types import DocumentData, DocumentType


def test_usage() -> None:
    # Example usage
    title = 'Airbags'
    abstract = 'Airbags are one of the most important safety gears in motor vehicles such as cars and SUVs. These are cushions built into a vehicle that are intended to inflate in case of a car accident in order to protect occupants from injuries by preventing them from striking the interior of vehicle during a crash.'
    finder = DocumentFinder(abstract=abstract, title=title)
    results = finder.find_documents()

    # Print 5 first publications, their title, similarity score, and abstract
    publications = [result for result in results if result.type == DocumentType.PUBLICATION]
    for search_result in publications[:5]:
        print(search_result.title)
        print(search_result.score)
        doc = DocumentData(search_result)
        print(doc.abstract + '\n\n')


if __name__ == '__main__':
    test_usage()
