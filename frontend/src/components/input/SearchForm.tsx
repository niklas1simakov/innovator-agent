import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText } from "lucide-react";
import { SearchInput } from "@/types/research";

interface SearchFormProps {
  onSubmit: (input: SearchInput) => void;
  isLoading?: boolean;
  className?: string;
}

export const SearchForm = ({ onSubmit, isLoading = false, className = "" }: SearchFormProps) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && abstract.trim()) {
      onSubmit({ title: title.trim(), abstract: abstract.trim() });
    }
  };

  const isValid = title.trim().length > 0 && abstract.trim().length > 0;

  return (
    <Card className={`w-full max-w-4xl bg-gradient-to-br from-card to-accent/20 shadow-lg border-0 ${className}`}>
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/logo.png" alt="App logo" className="h-10 w-auto" />
        </div>
        <p className="text-muted-foreground text-lg">
          Analyze your research for novelty by comparing against existing patents and publications
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Research Paper Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your paper title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 text-base"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="abstract" className="text-base font-medium">
              Abstract
            </Label>
            <Textarea
              id="abstract"
              placeholder="Paste your paper abstract here..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="min-h-32 text-base resize-none"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Analyze Novelty
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;