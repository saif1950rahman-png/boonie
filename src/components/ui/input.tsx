import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-card px-3 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus-visible:border-berry focus-visible:ring-2 focus-visible:ring-berry/30",
        className,
      )}
      {...props}
    />
  );
}
