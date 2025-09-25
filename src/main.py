from document import Document, DocumentType
from document_finder import DocumentFinder

# Example usage
title = 'Airbags'
abstract = 'Airbags are one of the most important safety gears in motor vehicles such as cars and SUVs. These are cushions built into a vehicle that are intended to inflate in case of a car accident in order to protect occupants from injuries by preventing them from striking the interior of vehicle during a crash.'
finder = DocumentFinder(abstract=abstract, title=title)
results = finder.find_documents()

# Print 5 first publications, their title, similarity score, and abstract
for search_result in results[:5]:
    if search_result.type == DocumentType.PUBLICATION:
        print(search_result.title)
        print(search_result.score)
        doc = Document(search_result)
        print(doc.abstract + '\n\n')
