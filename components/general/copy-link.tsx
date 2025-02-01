"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"



interface CopyLinkMenuItemProps {
  jobUrl: string;
}

export function CopyLinkMenuItem({ jobUrl }: CopyLinkMenuItemProps) {
    const { toast } = useToast()
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
        toast({
          title: "Url copied",
          description: "copied successfully"
      })
    } catch (err) {
      console.error("Could not copy text: ", err);
        toast({
            title: "Error",
            description: "An error occurred",
            variant: "destructive"
      })
    }
  };

  return (
    <DropdownMenuItem onSelect={handleCopy}>
      <Link2 className=" h-4 w-4" />
      <span>Copy Job URL</span>
    </DropdownMenuItem>
  );
}