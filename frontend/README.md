# Innovator Agent Frontend

Modern React TypeScript application providing an intuitive interface for research analysis, patent discovery, and AI-powered voice interactions.

## Overview

The frontend serves as the user interface for the Innovator Agent research analysis platform, offering:

- **Research Input**: Simple form for entering research titles and abstracts
- **Analysis Dashboard**: Comprehensive visualization of research findings
- **Voice Assistant**: Interactive voice chat for discussing research results
- **History Management**: Persistent storage and retrieval of past analyses
- **Advanced Filtering**: Sophisticated filtering and sorting capabilities

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with full type coverage
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn/UI**: High-quality component library built on Radix UI
- **ElevenLabs React SDK**: Voice AI integration for conversational features
- **React Hook Form**: Efficient form handling and validation
- **Lucide React**: Beautiful icon library

## Dependencies

### Core Libraries
- `react`: UI library
- `react-dom`: React DOM rendering
- `typescript`: Type system
- `vite`: Build tool and dev server
- `tailwindcss`: CSS framework

### UI Components
- `@radix-ui/*`: Primitive components for accessible UI
- `@shadcn/ui`: Pre-built component library
- `lucide-react`: Icon library
- `class-variance-authority`: Component variant management

### Voice Integration
- `@elevenlabs/react`: Voice AI SDK for conversational features

### Form Handling
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Form validation resolvers
- `zod`: Schema validation

## Quick Start

### 1. Install Node.js

Ensure you have Node.js 18+ installed:
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

Download from [Node.js official website](https://nodejs.org/) if needed.

### 2. Setup Project

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Development**: Auto-reload enabled

### 3. Environment Setup

The frontend connects to the backend API. Ensure the backend is running on `http://localhost:8000`.

If you need to change the backend URL, modify the API calls in `/src/lib/api.ts`.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── analysis/       # Analysis visualization components
│   │   ├── filters/        # Filtering and search components
│   │   ├── input/          # Form input components
│   │   ├── results/        # Results display components
│   │   ├── sidebar/        # Navigation and history sidebar
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   └── voice/         # Voice chat components
│   ├── hooks/             # Custom React hooks
│   │   ├── useAnalysisHistory.ts  # Analysis storage and management
│   │   ├── useSearchResults.ts    # Search result processing
│   │   ├── useLocalStorage.ts     # Browser storage utilities
│   │   └── useUIState.ts          # UI state management
│   ├── lib/               # Utility libraries
│   │   ├── api.ts         # Backend API integration
│   │   └── utils.ts       # Helper utilities
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main application page
│   │   └── NotFound.tsx   # 404 error page
│   ├── types/             # TypeScript type definitions
│   │   ├── analysis.ts    # Analysis data types
│   │   └── research.ts    # Research item types
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── README.md             # This file
```

## Key Components

### 1. Research Input (`/src/components/input/SearchForm.tsx`)
- Clean, intuitive form for entering research details
- Real-time validation and error handling
- Loading states during analysis processing

### 2. Results Dashboard (`/src/components/results/ResultsLayout.tsx`)
- Comprehensive display of analysis results
- Publications and patents with similarity scores
- Interactive filtering and sorting capabilities

### 3. Voice Assistant (`/src/components/voice/VoiceChat.tsx`)
- Integration with ElevenLabs conversational AI
- Microphone access and audio processing
- Context-aware discussions about research findings

### 4. Analysis Sidebar (`/src/components/sidebar/AnalysisSidebar.tsx`)
- History of past analyses
- Quick navigation between different analyses
- Analysis management (rename, duplicate, delete)

### 5. Filtering System (`/src/components/filters/FilterBar.tsx`)
- Advanced filtering by similarity thresholds
- Sorting by relevance, date, or similarity
- Search within results

## Usage Guide

### Running Your First Analysis

1. **Start the Application**
   ```bash
   cd frontend
   npm run dev
   ```
   Open http://localhost:5173 in your browser

2. **Enter Research Details**
   - Click on the title field and enter your research title
   - Fill in the abstract field with your research summary
   - Click "Analyze Novelty" to start the analysis

3. **Review Results**
   - View the novelty percentage and analysis
   - Explore similar publications and patents
   - Check similarity scores and key differences
   - Use filters to refine the results

4. **Use Voice Assistant**
   - Click "Request Microphone & Start" to enable voice chat
   - Ask questions about your research findings
   - Discuss similarities, differences, and implications

### Understanding the Results

#### Novelty Score
- **High (80-100%)**: Highly novel research with minimal similar work
- **Medium (40-79%)**: Moderate novelty with some similar research
- **Low (0-39%)**: Limited novelty with significant prior work

#### Similarity Scores
- **High (85%+)**: Very similar work - potential patent conflicts
- **Medium (50-84%)**: Notable similarities - review differences carefully
- **Low (0-49%)**: Limited similarities - generally safe to proceed

#### Patent Warnings
- **Red Flag**: Publications/patents with 85%+ similarity
- **Caution**: Review detailed similarities and differences
- **Action**: Consider design modifications if needed

### Voice Assistant Features

#### Getting Started
1. Grant microphone permissions when prompted
2. Wait for "Connected - Ready to chat!" status
3. Speak naturally about your research

#### Example Questions
- *"What are the main similarities between my research and the publications?"*
- *"Tell me about the patent with the highest similarity score"*
- *"What are the key differences I should focus on?"*
- *"Who are the top researchers in this field?"*
- *"How novel is my research compared to existing work?"*

#### Best Practices
- Speak clearly and at normal pace
- Wait for the assistant to finish before asking next question
- Use specific terms from your research domain
- Ask follow-up questions for deeper insights

### Advanced Features

#### Analysis History
- All analyses are automatically saved locally
- Access past analyses from the sidebar
- Compare different versions of your research
- Export or share analysis results

#### Filtering and Search
- **Similarity Threshold**: Show only items above certain similarity
- **Date Range**: Filter by publication/patent dates
- **Sort Options**: By similarity, date, or relevance
- **Search**: Find specific terms within results

#### Data Management
- **Rename Analysis**: Update titles for better organization
- **Duplicate Analysis**: Create copies for comparison
- **Delete Analysis**: Remove unwanted analyses
- **Local Storage**: Data persists between browser sessions

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Development Guidelines

#### Component Structure
```typescript
// Use functional components with TypeScript
interface ComponentProps {
  title: string;
  onAction: (data: string) => void;
}

export function Component({ title, onAction }: ComponentProps) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
}
```

#### Custom Hooks
```typescript
// Create reusable logic with custom hooks
export function useCustomHook() {
  const [state, setState] = useState();
  
  // Hook logic
  
  return { state, setState };
}
```

#### API Integration
```typescript
// Use the centralized API module
import { fetchAnalysis } from '@/lib/api';

const result = await fetchAnalysis({ title, abstract });
```

### Styling Guidelines

#### Tailwind CSS Classes
- Use semantic class names when possible
- Group related classes together
- Use responsive prefixes (sm:, md:, lg:) for responsive design

#### Component Variants
```typescript
// Use class-variance-authority for component variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
  }
);
```

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   ```
   Error: Failed to fetch analysis
   ```
   - Ensure backend is running on http://localhost:8000
   - Check backend health at http://localhost:8000/health
   - Verify CORS settings in backend

2. **Voice Chat Not Working**
   ```
   Error: Microphone access denied
   ```
   - Grant microphone permissions in browser
   - Ensure HTTPS in production (required for microphone)
   - Check ElevenLabs API keys in backend

3. **Build Errors**
   ```
   Error: Module not found
   ```
   - Run `npm install` to ensure all dependencies are installed
   - Check import paths are correct
   - Verify TypeScript configuration

4. **Styling Issues**
   ```
   Styles not applying correctly
   ```
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS rules
   - Verify component class names are correct

### Debug Mode

Enable detailed logging by opening browser developer tools:
- **Console**: View application logs and errors
- **Network**: Monitor API requests and responses
- **Application**: Inspect local storage data

### Performance Tips

1. **Optimize Rendering**
   - Use React.memo for expensive components
   - Implement proper key props for lists
   - Avoid unnecessary re-renders

2. **Bundle Size**
   - Use dynamic imports for large components
   - Tree-shake unused dependencies
   - Optimize images and assets

3. **API Calls**
   - Implement request caching where appropriate
   - Use loading states for better UX
   - Handle errors gracefully

## Testing

### Manual Testing Checklist

#### Basic Functionality
- [ ] Research form accepts title and abstract
- [ ] Analysis results display correctly
- [ ] Voice chat connects and responds
- [ ] Sidebar navigation works
- [ ] Filtering and sorting functions

#### Edge Cases
- [ ] Empty or invalid input handling
- [ ] Network error scenarios
- [ ] Large result sets
- [ ] Long analysis processing times

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Automated Testing

```bash
# Add testing framework (example with Vitest)
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

## Performance Monitoring

### Metrics to Monitor
- **Initial Load Time**: Time to first contentful paint
- **API Response Times**: Backend request latency
- **Bundle Size**: JavaScript bundle size impact
- **Memory Usage**: Application memory footprint

### Optimization Strategies
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Service worker for caching
- Bundle analysis with webpack-bundle-analyzer

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run preview
```

### Deployment Options

#### Static Hosting (Recommended)
- **Vercel**: Deploy with `vercel` CLI
- **Netlify**: Drag and drop build folder
- **GitHub Pages**: Use Actions for automated deployment

#### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

### Environment Variables

For production deployment, configure:
- **API Base URL**: Update API endpoints for production backend
- **Domain Configuration**: Set proper CORS origins
- **Analytics**: Add tracking codes if needed
