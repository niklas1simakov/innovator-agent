import os
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed

from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.providers.anthropic import AnthropicProvider

from src.models import AuthorData, DocumentData, DocumentType, NoveltyAnalysis

CLAUDE_OPUS_41 = 'claude-opus-4-1-20250805'  # Best quality: 13s
CLAUDE_OPUS_4 = 'claude-opus-4-20250514'  # Best quality: 14s
CLAUDE_SONNET_4 = 'claude-sonnet-4-20250514'  # Recommended alternative: 10s
CLAUDE_SONNET_37 = 'claude-3-7-sonnet-20250219'  # Budget option: 9s
CLAUDE_HAIKU_3 = 'claude-3-haiku-20240307'  # Fastest/cheapest: 2.3s
CLAUDE_DEFAULT = CLAUDE_HAIKU_3

# Global prompts for different document types
PATENT_COMPARISON_PROMPT = """
You are a critical patent analyst conducting thorough novelty assessment and IP risk evaluation.

**Your Publication Abstract:**
{my_publication_abstract}

**This Patent Abstract:**
{patent_abstract}

Critically analyze your publication against this patent and provide specific bullet points for display on this patent's information card:

**SIMILARITIES:**
Identify overlaps between your work and this patent that could impact novelty or create IP risks:
- Technical methods or processes where your work matches this patent's claims
- Core functional elements or system architectures shared between your work and this patent
- Problem-solution combinations where your approach aligns with this patent's scope
- Application domains where your work overlaps with this patent's coverage
- Technical terminology indicating your work falls within this patent's claimed subject matter
- End results or performance characteristics where your work produces similar outcomes to this patent

**DIFFERENCES:**
Critically assess what makes your work genuinely novel compared to this patent or areas of potential risk:
- Specific technical innovations in your work not disclosed in this patent
- Different implementation approaches in your work that bypass this patent's claims
- Novel problem formulations or use cases in your work not covered by this patent
- Enhanced performance metrics or capabilities your work achieves beyond this patent
- Distinct methodological advances or algorithmic improvements your work offers over this patent
- Areas where this patent has scope limitations that your work exploits or extends beyond
- Critical gaps in this patent's coverage that your work addresses with genuine innovation

Focus on: How does your work compare to this specific patent? What's already covered by this patent versus your genuine innovations? What are the IP implications of this patent for your work's commercialization potential?
"""

PUBLICATION_COMPARISON_PROMPT = """
You are a critical research analyst evaluating your publication's novelty and competitive positioning against this existing work.

**Your Publication Abstract:**
{my_publication_abstract}

**This Other Publication Abstract:**
{other_publication_abstract}

Critically analyze your publication against this other publication and provide specific bullet points for display on this publication's information card:

**SIMILARITIES:**
Identify areas where this publication already covers work similar to yours, potentially reducing your novelty:
- Methodological approaches where your work uses similar techniques to this publication
- Problem statements or research questions where your work addresses the same issues as this publication
- Experimental designs or evaluation frameworks where your work follows similar patterns to this publication
- Findings or conclusions where your work reaches comparable results to this publication
- Technical contributions where your work demonstrates similar innovations to this publication
- Theoretical foundations or conceptual frameworks where your work shares the same basis as this publication

**DIFFERENCES:**
Critically assess your genuine contributions compared to this publication versus incremental changes:
- Substantial methodological innovations in your work not attempted in this publication
- Novel problem angles or applications your work explores beyond this publication's scope
- Significant performance improvements your work achieves over this publication's results
- New theoretical insights or conceptual breakthroughs your work provides beyond this publication
- Different experimental conditions in your work that reveal knowledge not found in this publication
- Enhanced scope, scale, or generalizability your work offers compared to this publication
- Critical gaps in this publication's work that your research addresses with genuine innovation

Focus on: How does your work specifically compare to this publication? What knowledge does this publication already contribute versus your unique additions? How significant is your work's advancement beyond what this publication has already established in the field?
"""


def get_novetly_analysis(documents: list[DocumentData]) -> NoveltyAnalysis:
    return NoveltyAnalysis(novelty_score=0.0, novelty_analysis='')


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


# Define your structure
class DocumentAnalysis(BaseModel):
    similarities: list[str]
    differences: list[str]


class DocumentAnalyzer:
    def __init__(self, api_key: str | None = None, model_name: str = CLAUDE_DEFAULT) -> None:
        """
        Initialize the DocumentAnalyzer with API key and model configuration.

        Args:
            api_key (str | None): Anthropic API key. If None, reads from ANTHROPIC_API_KEY env var
            model_name (str): Model to use for analysis
        """
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        self.model_name = model_name

        # Initialize the model and agent
        self.model = AnthropicModel(model_name=self.model_name, provider=AnthropicProvider(api_key=self.api_key))
        self.agent = Agent(
            model=self.model,
            output_type=DocumentAnalysis,
        )

    def analyze_texts(self, my_title: str, my_abstract: str, other_document: DocumentData, doc2_type: DocumentType) -> DocumentAnalysis:
        """
        Analyze similarities and differences between your document and another document.

        Args:
            my_title (str): Title of your document
            my_abstract (str): Abstract of your document
            other_document (DocumentData): Other document to compare against
            doc2_type (DocumentType): Type of the other document to choose appropriate prompt

        Returns:
            DocumentAnalysis: Structured result with similarities and differences
        """
        # Choose prompt based on document type
        if doc2_type == DocumentType.PUBLICATION:
            # Format the publication prompt with actual abstracts
            my_publication_text = f'Title: {my_title}\nAbstract: {my_abstract}'
            other_publication_text = f'Title: {other_document.title}\nAbstract: {other_document.abstract}'

            full_prompt = PUBLICATION_COMPARISON_PROMPT.format(
                my_publication_abstract=my_publication_text, other_publication_abstract=other_publication_text
            )
        else:
            # Format the patent prompt with actual abstracts
            my_publication_text = f'Title: {my_title}\nAbstract: {my_abstract}'
            patent_text = f'Title: {other_document.title}\nAbstract: {other_document.abstract}'

            full_prompt = PATENT_COMPARISON_PROMPT.format(my_publication_abstract=my_publication_text, patent_abstract=patent_text)

        result = self.agent.run_sync(full_prompt)
        return result

    def analyze_multiple_concurrent(
        self, my_title: str, my_abstract: str, other_documents: list[DocumentData], max_workers: int = 5
    ) -> None:
        """
        Analyze your document against multiple others concurrently and update DocumentData objects in-place.

        Args:
            my_title (str): Title of your document
            my_abstract (str): Abstract of your document
            other_documents (list[DocumentData]): List of documents to compare against
            max_workers (int): Maximum number of concurrent requests (default: 5)

        Returns:
            None: Updates the similarities and differences fields of the DocumentData objects in-place
        """
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks with document indices for mapping results back
            future_to_doc = {executor.submit(self.analyze_texts, my_title, my_abstract, doc, doc.type): doc for doc in other_documents}

            # Collect results and update DocumentData objects
            for future in as_completed(future_to_doc):
                doc = future_to_doc[future]
                result = future.result()

                # Update the DocumentData object's fields directly
                doc.similarities = result.output.similarities
                doc.differences = result.output.differences

    def analyze_multiple_sequential(self, my_title: str, my_abstract: str, other_documents: list[DocumentData], delay: float = 0.5) -> None:
        """
        Analyze your document against multiple others sequentially and update DocumentData objects in-place.

        Args:
            my_title (str): Title of your document
            my_abstract (str): Abstract of your document
            other_documents (list[DocumentData]): List of documents to compare against
            delay (float): Delay between requests in seconds (default: 0.5)

        Returns:
            None: Updates the similarities and differences fields of the DocumentData objects in-place
        """
        for i, doc in enumerate(other_documents):
            if i > 0:  # Don't delay before the first request
                time.sleep(delay)

            result = self.analyze_texts(my_title, my_abstract, doc, doc.type)

            # Update the DocumentData object's fields directly
            doc.similarities = result.output.similarities
            doc.differences = result.output.differences

    def _analyze_single_pair(self, my_title: str, my_abstract: str, other_document: DocumentData) -> DocumentAnalysis:
        """Helper method for concurrent analysis."""
        return self.analyze_texts(my_title, my_abstract, other_document, other_document.type)


# Example usage
if __name__ == '__main__':
    import dotenv

    dotenv.load_dotenv()

    # Initialize analyzer
    analyzer = DocumentAnalyzer()

    # Create dummy documents
    doc1 = DocumentData(
        type=DocumentType.PATENT,
        id='US123456',
        title='Airbag Safety System for Motor Vehicles',
        abstract='Airbags are one of the most important safety gears in motor vehicles such as cars and SUVs. These are cushions built into a vehicle that are intended to inflate in case of a car accident.',
        publication_date='2023-01-15',
        authors=['John Smith', 'Jane Doe'],
        score=0.95,
        institutions=['MIT', 'Stanford'],
        url='https://patents.uspto.gov/patent/documents/US123456.pdf',
    )

    doc2 = DocumentData(
        type=DocumentType.PUBLICATION,
        id='PUB789012',
        title='Analysis of Automobile Airbag Effectiveness and Associated Injuries',
        abstract='The wide use of automobile airbags has undoubtedly reduced mortality and serious injuries from motor vehicle accidents. However, airbags appear to be associated with various injuries.',
        publication_date='2023-03-20',
        authors=['Dr. Sarah Johnson', 'Prof. Michael Brown'],
        score=0.88,
        institutions=['Harvard Medical', 'Johns Hopkins'],
        url='https://pubmed.ncbi.nlm.nih.gov/789012',
    )

    # Analyze documents with new method signature
    import time

    start_time = time.time()
    result = analyzer.analyze_texts(doc1.title, doc1.abstract, doc2, doc2.type)
    end_time = time.time()
    single_processing_time = round(end_time - start_time, 2)

    # Print the results directly
    print('Single Analysis Results:')
    print(f'Similarities: {result.output.similarities}')
    print(f'Differences: {result.output.differences}')

    print('\n' + '=' * 60)
    print('CONCURRENT ANALYSIS EXAMPLE')
    print('=' * 60)

    # Create multiple documents to compare against
    import copy

    other_docs = [copy.deepcopy(doc2) for _ in range(3)]  # Create separate copies for clarity

    # Run concurrent analysis (updates documents in-place)
    start_time = time.time()
    analyzer.analyze_multiple_concurrent(doc1.title, doc1.abstract, other_docs, max_workers=5)
    end_time = time.time()
    multiple_processing_time = round(end_time - start_time, 2)

    print(f'Analyzed {len(other_docs)} documents concurrently')
    print(f'First doc similarities: {other_docs[0].similarities}')
    print(f'First doc differences: {other_docs[0].differences}')

    print('\n' + '=' * 60)

    print(f'Second doc similarities: {other_docs[1].similarities}')
    print(f'Second doc differences: {other_docs[1].differences}')

    print('\n' + '=' * 60)

    print(f'Third doc similarities: {other_docs[2].similarities}')
    print(f'Third doc differences: {other_docs[2].differences}')

    print('\n' + '=' * 60)

    print(f'\nSingle analysis time: {single_processing_time}s')
    print(f'\nMultiple analysis time: {multiple_processing_time}s')
