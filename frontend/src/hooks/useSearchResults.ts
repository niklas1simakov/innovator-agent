import { useState, useEffect } from "react";
import { SearchResults, SearchInput, ResearchItem, NoveltyAnalysis } from "@/types/research";

// Mock data generators
const generateMockPatents = (): ResearchItem[] => {
  const patents = [
    {
      id: "pat-1",
      type: "patent" as const,
      title: "Machine Learning Framework for Automated Document Classification Using Neural Networks",
      authorsOrAssignee: ["Google LLC"],
      year: 2022,
      date: "2022-08-15",
      similarity: 87,
      similarities: [
        "Uses neural network architecture for document processing",
        "Implements supervised learning for classification tasks",
        "Employs feature extraction from textual content"
      ],
      differences: [
        "Focuses on general documents rather than research papers",
        "Uses different neural network topology",
        "Patent covers broader commercial applications"
      ],
      jurisdiction: "US",
      citationCount: 23,
      patentWarning: true
    },
    {
      id: "pat-2",
      type: "patent" as const,
      title: "Deep Learning System for Content Analysis and Similarity Detection",
      authorsOrAssignee: ["Microsoft Corporation"],
      year: 2021,
      date: "2021-12-03",
      similarity: 73,
      similarities: [
        "Applies deep learning to content analysis",
        "Includes similarity scoring mechanisms",
        "Uses transformer-based models"
      ],
      differences: [
        "Optimized for multimedia content analysis",
        "Different training methodology",
        "Focuses on real-time processing capabilities"
      ],
      jurisdiction: "US",
      citationCount: 41
    },
    {
      id: "pat-3",
      type: "patent" as const,
      title: "Natural Language Processing Method for Academic Text Mining",
      authorsOrAssignee: ["IBM Corporation"],
      year: 2023,
      date: "2023-03-22",
      similarity: 91,
      similarities: [
        "Specifically targets academic text processing",
        "Uses similar NLP preprocessing techniques",
        "Implements semantic similarity algorithms",
        "Applies machine learning for pattern recognition"
      ],
      differences: [
        "Limited to bibliometric analysis",
        "Uses rule-based components alongside ML",
        "Patent restricted to library science applications"
      ],
      jurisdiction: "US",
      citationCount: 15,
      patentWarning: true
    },
    {
      id: "pat-4",
      type: "patent" as const,
      title: "Automated Research Paper Evaluation Using Computational Intelligence",
      authorsOrAssignee: ["Adobe Inc."],
      year: 2020,
      date: "2020-11-18",
      similarity: 64,
      similarities: [
        "Evaluates research papers computationally",
        "Uses machine learning for assessment",
        "Incorporates citation analysis"
      ],
      differences: [
        "Focuses on peer review automation",
        "Different evaluation criteria",
        "Patent covers publishing workflow integration"
      ],
      jurisdiction: "EP",
      citationCount: 8
    },
    {
      id: "pat-5",
      type: "patent" as const,
      title: "Intelligent Document Similarity Engine with Multi-Modal Analysis",
      authorsOrAssignee: ["Amazon Technologies Inc."],
      year: 2022,
      date: "2022-05-07",
      similarity: 58,
      similarities: [
        "Implements document similarity algorithms",
        "Uses multi-modal data processing"
      ],
      differences: [
        "Designed for e-commerce applications",
        "Includes image and text analysis",
        "Different similarity metrics",
        "Patent covers recommendation systems"
      ],
      jurisdiction: "US",
      citationCount: 19
    },
    {
      id: "pat-6",
      type: "patent" as const,
      title: "AI-Powered Citation Network Analysis for Novelty Detection",
      authorsOrAssignee: ["Tesla Inc."],
      year: 2023,
      date: "2023-07-14",
      similarity: 82,
      similarities: [
        "Specifically addresses novelty detection",
        "Uses citation network analysis",
        "Applies AI for pattern recognition",
        "Implements graph-based algorithms"
      ],
      differences: [
        "Focused on patent novelty rather than publications",
        "Uses different graph neural network architecture",
        "Patent limited to automotive industry applications"
      ],
      jurisdiction: "US",
      citationCount: 6,
      patentWarning: true
    }
  ];

  return patents;
};

const generateMockPublications = (): ResearchItem[] => {
  const publications = [
    {
      id: "pub-1",
      type: "publication" as const,
      title: "A Comprehensive Survey of Machine Learning Approaches for Document Classification",
      authorsOrAssignee: ["Sarah Chen", "Michael Rodriguez", "Dr. Emma Thompson"],
      year: 2023,
      date: "2023-04-12",
      similarity: 76,
      similarities: [
        "Surveys machine learning for document classification",
        "Covers neural network methodologies",
        "Includes comparative analysis of algorithms"
      ],
      differences: [
        "Survey paper rather than novel methodology",
        "Broader scope covering multiple domains",
        "Different evaluation metrics",
        "Focuses on traditional ML alongside deep learning"
      ],
      venue: "Journal of Machine Learning Research",
      citationCount: 127
    },
    {
      id: "pub-2",
      type: "publication" as const,
      title: "Deep Neural Networks for Semantic Analysis of Scientific Literature",
      authorsOrAssignee: ["Dr. James Wilson", "Prof. Lisa Zhang", "Alex Kumar"],
      year: 2022,
      date: "2022-09-28",
      similarity: 83,
      similarities: [
        "Uses deep neural networks for semantic analysis",
        "Targets scientific literature specifically",
        "Employs transformer architectures",
        "Includes novelty assessment components"
      ],
      differences: [
        "Focuses on semantic understanding rather than classification",
        "Different neural network architecture",
        "Uses unsupervised learning approaches"
      ],
      venue: "Nature Machine Intelligence",
      citationCount: 94
    },
    {
      id: "pub-3",
      type: "publication" as const,
      title: "Automated Novelty Detection in Research Publications Using Graph Neural Networks",
      authorsOrAssignee: ["Dr. Maria Garcia", "Prof. David Lee", "Jennifer Wang", "Dr. Robert Kim"],
      year: 2023,
      date: "2023-01-15",
      similarity: 89,
      similarities: [
        "Directly addresses novelty detection in research",
        "Uses graph neural networks for analysis",
        "Implements automated evaluation systems",
        "Targets research publications specifically"
      ],
      differences: [
        "Uses citation graphs as primary input",
        "Different GNN architecture and training approach",
        "Focuses on temporal novelty patterns"
      ],
      venue: "ACM Computing Surveys",
      citationCount: 156
    },
    {
      id: "pub-4",
      type: "publication" as const,
      title: "Transformer-Based Models for Academic Text Understanding and Classification",
      authorsOrAssignee: ["Prof. Alice Johnson", "Dr. Mark Chen", "Sophie Williams"],
      year: 2022,
      date: "2022-06-20",
      similarity: 71,
      similarities: [
        "Uses transformer models for academic text",
        "Implements classification algorithms",
        "Focuses on understanding academic content"
      ],
      differences: [
        "Primarily concerned with subject classification",
        "Different transformer fine-tuning approach",
        "Uses different evaluation datasets",
        "Focuses on multi-language support"
      ],
      venue: "IEEE Transactions on Pattern Analysis",
      citationCount: 203
    },
    {
      id: "pub-5",
      type: "publication" as const,
      title: "Comparative Analysis of Similarity Metrics for Research Paper Recommendation",
      authorsOrAssignee: ["Dr. Kevin Brown", "Prof. Nancy Davis"],
      year: 2021,
      date: "2021-11-08",
      similarity: 67,
      similarities: [
        "Analyzes similarity metrics for research papers",
        "Includes recommendation system components"
      ],
      differences: [
        "Focuses on recommendation rather than novelty",
        "Uses collaborative filtering approaches",
        "Different similarity calculation methods",
        "Targets reader recommendation systems"
      ],
      venue: "Information Retrieval Journal",
      citationCount: 78
    },
    {
      id: "pub-6",
      type: "publication" as const,
      title: "Machine Learning for Prior Art Search and Patent Analysis",
      authorsOrAssignee: ["Dr. Rachel Green", "Prof. Thomas Anderson", "Dr. Julia Martinez"],
      year: 2023,
      date: "2023-02-03",
      similarity: 85,
      similarities: [
        "Applies ML to prior art search",
        "Includes patent analysis components",
        "Uses similarity detection algorithms",
        "Addresses novelty assessment challenges"
      ],
      differences: [
        "Focuses on patent prior art rather than publications",
        "Uses different feature extraction methods",
        "Includes legal terminology processing"
      ],
      venue: "Artificial Intelligence and Law",
      citationCount: 42,
      patentWarning: true
    },
    {
      id: "pub-7",
      type: "publication" as const,
      title: "Neural Approaches to Scientific Document Understanding: A Meta-Analysis",
      authorsOrAssignee: ["Prof. Daniel White", "Dr. Christina Lee", "Michael Brown", "Dr. Anna Singh"],
      year: 2022,
      date: "2022-12-11",
      similarity: 59,
      similarities: [
        "Focuses on scientific document understanding",
        "Uses neural network approaches"
      ],
      differences: [
        "Meta-analysis rather than novel method",
        "Covers broader range of understanding tasks",
        "Different evaluation framework",
        "Includes non-textual scientific content"
      ],
      venue: "Annual Review of Information Science",
      citationCount: 311
    }
  ];

  return publications;
};

const calculateNoveltyAnalysis = (patents: ResearchItem[], publications: ResearchItem[]): NoveltyAnalysis => {
  const allItems = [...patents, ...publications];
  const maxSimilarity = Math.max(...allItems.map(item => item.similarity));
  const noveltyPercentage = Math.max(0, 100 - maxSimilarity);
  
  let analysisText = "";
  if (maxSimilarity < 60) {
    analysisText = "High novelty detected. Your research shows limited overlap with existing prior art, suggesting strong potential for novel contributions to the field.";
  } else if (maxSimilarity < 80) {
    analysisText = "Moderate novelty identified. Some overlapping concepts are present in existing work, but your approach appears to offer meaningful differentiation.";
  } else {
    analysisText = "Low novelty warning. Significant overlap detected with existing work. Consider focusing on the key differentiating aspects of your research.";
  }

  return {
    noveltyPercentage,
    analysisText,
    maxSimilarity
  };
};

export const useSearchResults = (input?: SearchInput): SearchResults => {
  const [results, setResults] = useState<SearchResults>({
    patents: [],
    publications: [],
    analysis: {
      noveltyPercentage: 0,
      analysisText: "",
      maxSimilarity: 0
    },
    isLoading: false
  });

  useEffect(() => {
    if (!input?.title || !input?.abstract) {
      return;
    }

    setResults(prev => ({ ...prev, isLoading: true }));

    // Simulate API delay
    const timer = setTimeout(() => {
      const patents = generateMockPatents();
      const publications = generateMockPublications();
      const analysis = calculateNoveltyAnalysis(patents, publications);

      setResults({
        patents,
        publications,
        analysis,
        isLoading: false
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [input?.title, input?.abstract]);

  return results;
};

export default useSearchResults;