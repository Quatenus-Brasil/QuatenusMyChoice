import { useNavigate } from "react-router-dom";

const Card = ({ icon, title, path, canAccess }) => {
  const navigate = useNavigate();

  return (
    <div className={`col-md-4 mb-4`} onClick={canAccess ? () => navigate(path) : null} style={{ cursor: "pointer" }}>
      <div className="card border-0 shadow text-center h-100 position-relative card-zoom">
        <div className="card-body d-flex flex-column justify-content-center align-items-center p-5">
          <div>
            <div className="w-25 mb-3">{icon}</div>
            <h5 className="card-title text-orange mb-0">{title}</h5>  
          </div>
          {!canAccess && (
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="currentColor"
                className="bi bi-lock-fill text-qorange"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
