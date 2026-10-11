import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-line bg-card px-3 py-3 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus-visible:border-berry focus-visible:ring-2 focus-visible:ring-berry/30",
        className,
      )}
      {...props}
    />
  );
}
