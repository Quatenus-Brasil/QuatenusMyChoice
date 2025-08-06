import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import FamilySearchbar from "../../components/family/FamilySearchbar";
import FamilyCard from "../../components/family/FamilyCard";
import FamilyList from "../../components/family/FamilyList";
import Cookies from "js-cookie";
import { ViewContext } from "../../context/viewContext";
import { SearchContext } from "../../context/searchContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const Families = () => {
  const [families, setFamilies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { view } = useContext(ViewContext);

  const { searchTerm, setSearchTerm, selectedTags, setSelectedTags } = useContext(SearchContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/families/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        setFamilies(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error.response?.data?.message || error.message);
        setIsLoading(false)
      });
  }, []);

  // Monta as opções únicas de tags dos produtos
  const tagOptions = useMemo(() => {
    const tagsSet = new Set();
    families.forEach((family) => family.products.forEach((product) => (product.tags || []).forEach((tag) => tagsSet.add(tag))));
    return Array.from(tagsSet)
      .sort()
      .map((tag) => ({ value: tag, label: tag }));
  }, [families]);

  // Filtra famílias por nome e tags selecionadas
  const filteredFamilies = families.filter((family) =>
    family.products.some((product) => {
      if (!product.name) return false;
      const normalizedProductName = normalize(product.name);

      const matchesName = searchTerm
        .split(" ")
        .filter(Boolean)
        .every((term) => normalizedProductName.includes(normalize(term)));

      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => (product.tags || []).includes(tag.value));

      return matchesName && matchesTags;
    })
  );

  return (
    <div className="py-2 bg-light">
      <div className="container">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div>
              <FamilySearchbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                tagOptions={tagOptions}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </div>
            {view === "card" ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {filteredFamilies
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((family) => (
                    <FamilyCard key={family._id} family={family} />
                  ))}
              </div>
            ) : (
              <div className="row m-0 p-0">
                {filteredFamilies
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((family) => (
                    <FamilyList key={family._id} family={family} />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Families;
