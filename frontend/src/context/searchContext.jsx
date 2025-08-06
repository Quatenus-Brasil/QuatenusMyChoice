import { createContext, useState, useEffect } from "react";

export const SearchContext = createContext();

export default function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState(() => {
    const saved = sessionStorage.getItem("familiesSearchTerm");
    return saved || "";
  });

  const [selectedTags, setSelectedTags] = useState(() => {
    const saved = sessionStorage.getItem("familiesSelectedTags");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("familiesSearchTerm", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem("familiesSelectedTags", JSON.stringify(selectedTags));
  }, [selectedTags]);

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedTags([]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
        clearSearch,
      }}>
      {children}
    </SearchContext.Provider>
  );
}
