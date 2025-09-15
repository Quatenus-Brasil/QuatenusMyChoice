import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const PanelNavbar = () => {
  const [file, setFile] = useState(null);
  const [showFamiliesModal, setShowFamiliesModal] = useState(false);
  const [showBomsModal, setShowBomsModal] = useState(false);

  const handleBomsModal = () => {
    setShowBomsModal(true);
  };

  const handleBomsDownload = () => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/bom/download`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "boms.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Erro ao baixar o arquivo", error);
        alert("Erro ao baixar o arquivo");
      });
  };

  const handleBomsUpload = () => {
    if (!file) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/bom/upload`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert(response.data.message);
        setShowBomsModal(false);
      })
      .catch((error) => {
        console.error("Erro ao fazer upload do arquivo:", error);
        alert(`Oops, algo deu errado! - ${error.response.data.message}`);
      });
  };

  return (
    <div className="mb-3">
      <Link to={`/panel/users`}>
        <button type="button" className="btn btn-sm btn-qblue mb-1 mt-1 ms-1">
          Usuários
        </button>
      </Link>
      <button type="button" className="btn btn-sm btn-qblue mb-1 mt-1 ms-1" onClick={handleBomsModal}>
        Upload de Boms
      </button>
      <button type="button" className="btn btn-sm btn-qblue mb-1 mt-1 ms-1" onClick={handleBomsDownload}>
        Download de Boms
      </button>

      {/* Bom Modal */}
      <div className={`modal fade ${showBomsModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload de Arquivo - B.O.M</h5>
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
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowBomsModal(false)}>
                Fechar
              </button>
              <button type="button" className="btn btn-sm btn-qorange" onClick={handleBomsUpload}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelNavbar;
