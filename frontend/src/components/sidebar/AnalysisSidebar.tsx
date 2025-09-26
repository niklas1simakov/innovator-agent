import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilePlus, Search, MoreVertical, Trash2, Copy, Edit3, FileText, ChevronRight, ChevronLeft, PanelLeftClose } from "lucide-react";
import { Analysis } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { MiniRing } from "@/components/results/HeaderStrip";
interface AnalysisSidebarProps {
  analyses: Analysis[];
  activeId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `today ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
const getNoveltyBadgeVariant = (percent: number) => {
  if (percent >= 80) return "default"; // High novelty - primary color
  if (percent >= 50) return "secondary"; // Moderate novelty  
  return "destructive"; // Low novelty
};
const getNoveltyLabel = (percent: number) => {
  if (percent >= 80) return "High";
  if (percent >= 50) return "Moderate";
  return "Low";
};
export function AnalysisSidebar({
  analyses,
  activeId,
  collapsed,
  onToggleCollapse,
  onSelect,
  onCreateNew,
  onRename,
  onDuplicate,
  onDelete
}: AnalysisSidebarProps) {
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const filteredAnalyses = analyses.filter(analysis => analysis.input.title.toLowerCase().includes(filter.toLowerCase()));

  // Group analyses by date
  const groupAnalysesByDate = (analyses: Analysis[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const groups = {
      today: [] as Analysis[],
      yesterday: [] as Analysis[],
      earlier: [] as Analysis[]
    };
    analyses.forEach(analysis => {
      const date = new Date(analysis.input.createdAt);
      if (date.toDateString() === today.toDateString()) {
        groups.today.push(analysis);
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(analysis);
      } else {
        groups.earlier.push(analysis);
      }
    });
    return groups;
  };
  const groupedAnalyses = groupAnalysesByDate(filteredAnalyses);
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };
  const saveRename = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };
  const cancelRename = () => {
    setEditingId(null);
    setEditTitle("");
  };
  if (collapsed) {
    return <TooltipProvider>
        <div className="w-[72px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
          {/* Collapse Toggle */}
          <div className="p-4 border-b border-sidebar-border flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Expand sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* New Search Icon */}
          <div className="p-4 border-b border-sidebar-border flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onCreateNew} variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                  <FilePlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>New Search</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Collapsed History */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {analyses.slice(0, 10).map(analysis => <Tooltip key={analysis.input.id}>
                  <TooltipTrigger asChild>
                    
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="max-w-48">{analysis.input.title}</p>
                  </TooltipContent>
                </Tooltip>)}
            </div>
          </ScrollArea>
        </div>
      </TooltipProvider>;
  }
  return <div className="w-[280px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="App logo" className="h-8 w-auto" />
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={onCreateNew} className="w-full mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <FilePlus className="h-4 w-4" />
          New Search
        </Button>
      </div>

      {/* Search Input - Always Visible */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
          <Input 
            placeholder="Filter analyses..." 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50" 
          />
        </div>
      </div>

      {/* History List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredAnalyses.length === 0 ? <div className="p-8 text-center">
              {analyses.length === 0 ? <>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-sidebar-foreground/30" />
                  <p className="text-sidebar-foreground/60 text-sm">No analyses yet</p>
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <div className="text-2xl text-sidebar-foreground/40">→</div>
                  </div>
                  <p className="text-sidebar-foreground/40 text-xs">
                    Click "New Search" to get started
                  </p>
                </> : <div>
                  <Search className="h-8 w-8 mx-auto mb-2 text-sidebar-foreground/30" />
                  <p className="text-sidebar-foreground/60 text-sm">No matches found</p>
                  <Button variant="ghost" size="sm" onClick={() => setFilter("")} className="mt-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground">
                    Clear search
                  </Button>
                </div>}
            </div> : <div className="space-y-4">
              {/* Today */}
              {groupedAnalyses.today.length > 0 && <div>
                  <h5 className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-2">Today</h5>
                  <div className="space-y-1">
                    {groupedAnalyses.today.map(analysis => <AnalysisItem key={analysis.input.id} analysis={analysis} isActive={analysis.input.id === activeId} timeLabel={formatTime(analysis.input.createdAt)} editingId={editingId} editTitle={editTitle} onSelect={onSelect} onRename={handleRename} onDuplicate={onDuplicate} onDelete={onDelete} onSaveEdit={saveRename} onCancelEdit={cancelRename} onEditTitleChange={setEditTitle} />)}
                  </div>
                </div>}

              {/* Yesterday */}
              {groupedAnalyses.yesterday.length > 0 && <div>
                  <h5 className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-2">Yesterday</h5>
                  <div className="space-y-1">
                    {groupedAnalyses.yesterday.map(analysis => <AnalysisItem key={analysis.input.id} analysis={analysis} isActive={analysis.input.id === activeId} timeLabel={formatTime(analysis.input.createdAt)} editingId={editingId} editTitle={editTitle} onSelect={onSelect} onRename={handleRename} onDuplicate={onDuplicate} onDelete={onDelete} onSaveEdit={saveRename} onCancelEdit={cancelRename} onEditTitleChange={setEditTitle} />)}
                  </div>
                </div>}

              {/* Earlier */}
              {groupedAnalyses.earlier.length > 0 && <div>
                  <h5 className="text-xs font-medium text-sidebar-foreground/60 mb-2 px-2">Earlier</h5>
                  <div className="space-y-1">
                    {groupedAnalyses.earlier.map(analysis => <AnalysisItem key={analysis.input.id} analysis={analysis} isActive={analysis.input.id === activeId} timeLabel={formatDateShort(analysis.input.createdAt)} editingId={editingId} editTitle={editTitle} onSelect={onSelect} onRename={handleRename} onDuplicate={onDuplicate} onDelete={onDelete} onSaveEdit={saveRename} onCancelEdit={cancelRename} onEditTitleChange={setEditTitle} />)}
                  </div>
                </div>}
            </div>}
        </div>
      </ScrollArea>
    </div>;
}

// Individual Analysis Item Component
interface AnalysisItemProps {
  analysis: Analysis;
  isActive: boolean;
  timeLabel: string;
  editingId: string | null;
  editTitle: string;
  onSelect: (id: string) => void;
  onRename: (id: string, currentTitle: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTitleChange: (title: string) => void;
}
const AnalysisItem = ({
  analysis,
  isActive,
  timeLabel,
  editingId,
  editTitle,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  onEditTitleChange
}: AnalysisItemProps) => {
  return <div className={cn("group relative rounded-lg p-3 cursor-pointer transition-colors", isActive ? "bg-sidebar-accent border border-sidebar-border" : "hover:bg-sidebar-accent/50")} onClick={() => onSelect(analysis.input.id)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {editingId === analysis.input.id ? <Input value={editTitle} onChange={e => onEditTitleChange(e.target.value)} onBlur={onSaveEdit} onKeyDown={e => {
          if (e.key === 'Enter') onSaveEdit();
          if (e.key === 'Escape') onCancelEdit();
        }} className="h-6 px-1 py-0 text-sm border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-sidebar-ring" autoFocus onClick={e => e.stopPropagation()} /> : <h3 className="font-medium text-sm text-sidebar-foreground line-clamp-2 leading-tight">
              {analysis.input.title}
            </h3>}
          
          <div className="flex items-center gap-2 mt-2">
            <MiniRing percentage={analysis.result.noveltyPercent} size={16} strokeWidth={2} className="shrink-0" />
            <span className="text-xs text-sidebar-foreground/50">
              {timeLabel}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={e => e.stopPropagation()}>
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={e => {
            e.stopPropagation();
            onRename(analysis.input.id, analysis.input.title);
          }} className="gap-2">
              <Edit3 className="h-3 w-3" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={e => {
            e.stopPropagation();
            onDuplicate(analysis.input.id);
          }} className="gap-2">
              <Copy className="h-3 w-3" />
              Duplicate
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem onClick={e => {
            e.stopPropagation();
            onDelete(analysis.input.id);
          }} className="gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-3 w-3" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>;
};