"use client";

import { Search as SearchIcon } from "lucide-react";

interface CategorySearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export default function CategorySearch({
  searchTerm,
  onSearchChange,
}: CategorySearchProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-[280px] pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
