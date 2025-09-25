import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface AbstractViewerProps {
  title: string;
  abstract: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}
export function AbstractViewer({
  title,
  abstract,
  expanded,
  onToggle,
  onEdit
}: AbstractViewerProps) {
  const {
    toast
  } = useToast();
  const wordCount = abstract.split(/\s+/).filter(word => word.length > 0).length;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${abstract}`);
      toast({
        title: "Copied to clipboard",
        description: "Abstract copied successfully."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };
    return (
    <div className="bg-slate-50 border border-border rounded-lg">
      <Accordion
        type="single"
        collapsible
        value={expanded ? "abstract" : undefined}
        onValueChange={() => onToggle()}
      >
        <AccordionItem value="abstract" className="border-none">
          {/* Trigger: label left, word count right */}
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-100 transition-colors">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">Abstract</span>
              <span className="text-xs text-muted-foreground">{wordCount} words</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-4 space-y-4">
            <div className="space-y-3">
              <div className="font-medium text-sm text-foreground">{title}</div>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground"
                data-abstract-text
              >
                {abstract}
              </div>
            </div>

            {/* Actions row: buttons left */}
            <div className="flex items-center justify-start gap-2 pt-2 border-t border-border">
              <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-2">
                <Copy className="h-3 w-3" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit Abstract
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}