"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions/projects";
import { useTransition } from "react";

interface DeleteProjectButtonProps {
  id: string;
}

export function DeleteProjectButton({ id }: DeleteProjectButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deleteProject(id);
        } catch (error) {
          console.error("Failed to delete project:", error);
          alert("Error: Could not delete project.");
        }
      });
    }
  };

  return (
    <Button 
      onClick={handleDelete}
      disabled={isPending}
      size="icon" 
      variant="destructive" 
      className="size-8 rounded-lg shadow-md hover:bg-red-700 transition-all z-[60] relative pointer-events-auto"
      title="Delete Project"
    >
      <Trash2 className={`size-4 ${isPending ? "animate-pulse" : ""}`} />
    </Button>
  );
}
