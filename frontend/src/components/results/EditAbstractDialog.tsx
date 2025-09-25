import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditAbstractDialogProps {
  open: boolean;
  onClose: () => void; // parent will set open=false
  title: string;
  abstract: string;
  onSave: (mode: "update" | "new", values: { title: string; abstract: string }) => void;
}

export function EditAbstractDialog({
  open,
  onClose,
  title: initialTitle,
  abstract: initialAbstract,
  onSave,
}: EditAbstractDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [abstract, setAbstract] = useState(initialAbstract);
  const isMobile = useIsMobile();

  // Sync fields each time the dialog opens or the source values change while open.
  useEffect(() => {
    if (open) {
      setTitle(initialTitle ?? "");
      setAbstract(initialAbstract ?? "");
    }
  }, [open, initialTitle, initialAbstract]);

  const isValid = title.trim().length > 0 && abstract.trim().length > 0;

  const save = (mode: "update" | "new") => {
    const t = title.trim();
    const a = abstract.trim();
    if (!t || !a) return;
    onSave(mode, { title: t, abstract: a });
    // let the parent close the dialog via onClose() it triggers,
    // or you can call onClose() here if that's your flow:
    onClose();
  };

  const Form = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter research title..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-abstract">Abstract</Label>
        <Textarea
          id="edit-abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          placeholder="Enter abstract text..."
          rows={8}
          className="resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button onClick={() => save("update")} disabled={!isValid} className="flex-1">
          Save Changes
        </Button>
        <Button onClick={() => save("new")} variant="outline" disabled={!isValid} className="flex-1">
          Save as New
        </Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
          <SheetHeader><SheetTitle>Edit Abstract</SheetTitle></SheetHeader>
          <div className="mt-6">{Form}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Abstract</DialogTitle></DialogHeader>
        {Form}
      </DialogContent>
    </Dialog>
  );
}
