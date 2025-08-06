import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const DeleteFamily = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [familyName, setFamilyName] = useState("");

  useEffect(() => {
    const fetchFamily = () => {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/api/families/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
        .then((response) => {
          setFamilyName(response.data.name);
          setIsLoading(false);
        })
        .catch((error) => {
          alert(`Oops, algo deu errado! 
        - ${error.response.data.message}`);
          console.error(error.response);
          setIsLoading(false);
        });
    };
    fetchFamily();
  }, [id]);

  const handleDeleteFamily = () => {
    axios
      .delete(`${import.meta.env.VITE_BASE_URL}/api/families/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        alert(`Oops, algo deu errado! 
        - ${error.response.data.message}`);
        console.error(error.response);
      });
  };
  return (
    <div className="py-5 bg-light d-flex">
      <div className="container">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-4">
                <div className="card p-4 shadow-sm">
                  <div className="card-body">
                    <h3 className="mb-3 fw-normal text-center">Deletar familia</h3>
                    <h5 className="mb-3 fw-normal text-center">Você quer mesmo excluir a família "{familyName}"? É impossível reverter essa ação.</h5>
                    <div className="text-center">
                      <button className="btn btn-danger me-1" onClick={handleDeleteFamily}>
                        Sim, excluir
                      </button>
                      <button className="btn btn-success" onClick={() => navigate("/")}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteFamily;
