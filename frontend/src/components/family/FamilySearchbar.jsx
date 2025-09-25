import { useContext } from "react";
import Select from "react-select";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "../../context/userContext";
import { useState } from "react";

const FamilySearchbar = ({ searchTerm, setSearchTerm, tagOptions, selectedTags, setSelectedTags }) => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [showFamiliesModal, setShowFamiliesModal] = useState(false);
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);

  const handleFamiliesModal = () => {
    setShowFamiliesModal(true);
  };

  const handleFamiliesUpload = () => {
    if (!file) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/families/upload`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert(response.data.message);
        setShowFamiliesModal(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro ao fazer upload do arquivo:", error);
        alert(`Oops, algo deu errado! - ${error.response.data.message}`);
      });
  };

  const handleAccessoriesModal = () => {
    setShowAccessoriesModal(true);
  };

  const handleAccessoriesUpload = () => {
    if (!file) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/accessories/upload`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert(response.data.message);
        setShowFamiliesModal(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro ao fazer upload do arquivo:", error);
        alert(`Oops, algo deu errado! - ${error.response.data.message}`);
      });
  };

  return (
    <div className="input-group mb-3 mt-2">
      {user && user.admin === true ? (
        <div className="me-2">
          <button className="btn btn-qorange" type="button" title="Upload de Familias" onClick={handleFamiliesModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
              <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
            </svg>
          </button>
          <button className="btn btn-qblue ms-2" type="button" title="Upload de Acessórios" onClick={handleAccessoriesModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
              <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
            </svg>
          </button>
        </div>
      ) : null}

      {/* Family Modal */}
      <div className={`modal fade ${showFamiliesModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload de Arquivo - Famílias</h5>
            </div>
            <div className="modal-body">
              <input
                type="file"
                accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="form-control-file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowFamiliesModal(false)}>
                Fechar
              </button>
              <button type="button" className="btn btn-sm btn-qorange" onClick={handleFamiliesUpload}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessory Modal */}
      <div className={`modal fade ${showAccessoriesModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload de Arquivo - Acessórios</h5>
            </div>
            <div className="modal-body">
              <input
                type="file"
                accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="form-control-file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowAccessoriesModal(false)}>
                Fechar
              </button>
              <button type="button" className="btn btn-sm btn-qorange" onClick={handleAccessoriesUpload}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>

      <input type="search" className="form-control" placeholder="Pesquise aqui" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div className="ms-2" style={{ minWidth: 220 }}>
        <Select isMulti options={tagOptions} value={selectedTags} onChange={setSelectedTags} placeholder="Filtros" />
      </div>
      {/* <button className="btn btn-sm btn-qorange" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
              disabled
              checked={view === "list"}
              onChange={(e) => setView(e.target.checked ? "list" : "card")}
            />
            <label className="form-check-label" htmlFor="viewSwitch">
              Ver em lista
            </label>
          </div>
        </li>
      </ul> */}
    </div>
  );
};

export default FamilySearchbar;
