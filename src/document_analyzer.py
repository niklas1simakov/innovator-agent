from collections import Counter

from src.models import AuthorData, DocumentData, NoveltyAnalysis


def get_novetly_analysis(documents: list[DocumentData]) -> NoveltyAnalysis:
    if not documents:
        return NoveltyAnalysis(novelty_score=0.0, novelty_analysis='No documents to analyze')

    # Sort documents by similarity score in descending order
    sorted_documents = sorted(documents, key=lambda doc: doc.score, reverse=True)

    # Take the first 10 elements (or all if less than 10)
    top_documents = sorted_documents[:10]

    # Calculate the average score as novelty_score
    novelty_score = 1 - (sum(doc.score for doc in top_documents) / len(documents))

    novelty_analysis = f'Novelty score calculated from top {len(top_documents)} documents with highest similarity scores'

    return NoveltyAnalysis(novelty_score=novelty_score, novelty_analysis=novelty_analysis)


def get_publication_dates(documents: list[DocumentData]) -> list[str]:
    dates = [document.publication_date for document in documents]
    dates.sort()
    return dates


def get_authors(documents: list[DocumentData]) -> list[AuthorData]:
    # Count how many publications each author appears in across all documents
    author_publication_counts: Counter[str] = Counter()
    for document in documents:
        # Use a set per document to avoid double-counting the same author within one doc
        unique_authors_for_document = set(document.authors or [])
        for author_name in unique_authors_for_document:
            if author_name:
                author_publication_counts[author_name] += 1

    author_data = [AuthorData(name=author_name, number_of_publications=count) for author_name, count in author_publication_counts.items()]

    # Sort by number_of_publications (desc), then by name (asc) for stability
    author_data.sort(key=lambda a: (-a.number_of_publications, a.name.lower()))
    return author_data


class DocumentAnalyzer:
    def analyze(self, documents: list[DocumentData]) -> list[DocumentData]:
        return documents
