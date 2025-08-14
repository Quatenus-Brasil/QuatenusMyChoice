import { ViewContext } from "../../context/viewContext";
import { useContext } from "react";
import Select from "react-select";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";

const FamilySearchbar = ({ searchTerm, setSearchTerm, tagOptions, selectedTags, setSelectedTags }) => {
  const { user } = useContext(UserContext);
  const { view, setView } = useContext(ViewContext);

  return (
    <div className="input-group mb-3 mt-2">
      {user && user.admin === true ? (
        <Link to="/family/create">
          <div className="me-2" title="Criar nova família">
            <button className="btn btn-qorange" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"></path>
              </svg>
            </button>
          </div>
        </Link>
      ) : null}
      <input type="search" className="form-control" placeholder="Pesquise aqui" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div className="ms-2" style={{ minWidth: 220 }}>
        <Select isMulti options={tagOptions} value={selectedTags} onChange={setSelectedTags} placeholder="Filtros" />
      </div>
      <button className="btn btn-sm btn-qorange" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        </svg>
      </button>
      <ul className="dropdown-menu p-2">
        <li>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="viewSwitch"
              checked={view === "list"}
              onChange={(e) => setView(e.target.checked ? "list" : "card")}
            />
            <label className="form-check-label" htmlFor="viewSwitch">
              Ver em lista
            </label>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default FamilySearchbar;
