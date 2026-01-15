"use client";

import React from "react";
import { Search as SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface CategorySearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export default function CategorySearch({
  searchTerm,
  onSearchChange,
}: CategorySearchProps) {
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  React.useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  return (
    <div className="relative sm:w-auto w-full">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar productos..."
        value={localSearchTerm}
        onChange={handleSearchChange}
        className="w-full sm:w-[280px] pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
