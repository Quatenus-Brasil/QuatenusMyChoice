import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const FamilyList = ({ family }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="d-flex border-bottom py-3 bg-white">
      <img
        src={family.bannerLink}
        width="250"
        height="150"
        style={{
          objectFit: "cover",
          borderRadius: "6px",
          marginRight: "20px",
          flexShrink: 0,
        }}
      />
      <div className="flex-grow-1 d-flex flex-column justify-content-between">
        <div>
          <h5 className="mb-1">{family.name}</h5>
          <p className="mb-2" style={{ fontSize: "0.9rem", color: "#333" }}>
            {family.desc}
          </p>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Link to={`/family/seemore/${family._id}`}>
            <button type="button" className="btn btn-sm btn-qblue">
              Ver mais
            </button>
          </Link>
          {user && user.admin === true ? (
            <>
              <Link to={`/family/delete/${family._id}`}>
                <button type="button" className="btn btn-sm btn-danger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                  </svg>
                </button>
              </Link>
            </>
          ): <></>}
        </div>
      </div>
    </div>
  );
};

export default FamilyList;
