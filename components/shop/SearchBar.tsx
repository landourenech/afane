"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  className,
}: SearchBarProps) {
  return (
    <div className={`relative w-full max-w-xl ${className ?? ""}`}>
      
      {/* ICÔNE */}
      <Search
        className="
          absolute
          left-4
          top-1/2
          size-5
          -translate-y-1/2
          text-[var(--color-secondary)]
        "
      />

      {/* INPUT */}
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          h-14
          rounded-full
          border-2
          border-[var(--color-secondary)]
          bg-white
          pl-12
          pr-5
          text-[var(--color-tertairy)]
          placeholder:text-slate-400
          focus-visible:ring-2
          focus-visible:ring-[var(--color-secondary)]
        "
      />
    </div>
  );
}