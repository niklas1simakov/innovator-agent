import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { AnalysisSidebar } from "./AnalysisSidebar";
import { Analysis } from "@/types/analysis";

interface MobileSidebarProps {
  analyses: Analysis[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MobileSidebar(props: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    props.onSelect(id);
    setOpen(false);
  };

  const handleCreateNew = () => {
    props.onCreateNew();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost" 
          size="sm"
          className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border hover:bg-accent"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <AnalysisSidebar
          {...props}
          collapsed={false}
          onToggleCollapse={() => {}}
          onSelect={handleSelect}
          onCreateNew={handleCreateNew}
        />
      </SheetContent>
    </Sheet>
  );
}