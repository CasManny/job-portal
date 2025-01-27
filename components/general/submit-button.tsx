'use client'
import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneralSubmitButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className: string;
  icon?: ReactNode;
}

const GeneralSubmitButton = ({
  text,
  variant,
  className,
  icon,
}: GeneralSubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} className={cn(className)} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};

export default GeneralSubmitButton;
