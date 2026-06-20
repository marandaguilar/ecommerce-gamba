"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface HeaderSearchProps {
  className?: string;
  /** Se llama tras enviar (p. ej. para cerrar el menú mobile). */
  onSubmitted?: () => void;
}

const HeaderSearch = ({ className, onSubmitted }: HeaderSearchProps) => {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    onSubmitted?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        className="pl-9"
      />
    </form>
  );
};

export default HeaderSearch;
