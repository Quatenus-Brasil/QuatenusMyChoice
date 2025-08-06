import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext.jsx";
import Cookies from "js-cookie";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const SeeMoreFamily = () => {
  const { user } = useContext(UserContext);
  const [family, setFamily] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWithMembership, setSelectedWithMembership] = useState(12);
  const [selectedNoMembership, setSelectedNoMembership] = useState(12);
  const [showCompactTable, setShowCompactTable] = useState(true);
  const [showFullTable, setShowFullTable] = useState(false);
  const [showRenovationTable, setShowRenovationTable] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/families/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((response) => {
        setFamily(response.data);
        window.scrollTo(0, 0);
        setIsLoading(false);
      })
      .catch((error) => {
        navigate("*");
        console.error(error.response.data.message);
        setIsLoading(false);
      });
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const handleWithMembershipChange = (event) => {
    setSelectedWithMembership(Number(event.target.value));
  };

  const handleNoMembershipChange = (event) => {
    setSelectedNoMembership(Number(event.target.value));
  };

  // Essa função está dessa maneira pois o MyChoice é servido via HTTP.
  // TODO: Quando o MyChoice for servido via HTTPS, essa função deve alterada.
  const copyToClipboard = (name, desc) => {
    if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = `${name}: \n${desc}`;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand("copy");
      } catch (error) {
        console.warn("Erro ao copiar o texto", error);
      } finally {
        document.body.removeChild(textarea);
        setTimeout(() => setCopied(false), 1500);
        setCopied(true);
      }
    }
  };

  const togleFullTable = () => {
    setShowFullTable(true);
    setShowCompactTable(false);
    setShowRenovationTable(false);
    setMenuOpen(false);
  };

  const togleCompactTable = () => {
    setShowFullTable(false);
    setShowCompactTable(true);
    setShowRenovationTable(false);
    setMenuOpen(false);
  };

  const togleRenovationTable = () => {
    setShowFullTable(false);
    setShowCompactTable(false);
    setShowRenovationTable(true);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const hasTelemetry = family.products ? Object.keys(family.products).some((productName) => family.products[productName].telemetry) : false;

  return (
    <div className="py-2 bg-light">
      <div className="container">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="sticky-top" style={{ top: "80px", zIndex: "1" }}>
              <button className="btn btn-sm btn-qorange mb-2 float-end" onClick={goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left mb-1" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"
                  />
                </svg>
              </button>
              {user && user.admin === true ? (
                <>
                  <Link to={`/family/edit/${family._id}`}>
                    <button type="button" className="btn btn-sm btn-warning me-1 text-white float-end">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                      </svg>
                    </button>
                  </Link>
                </>
              ) : null}
            </div>
            <div>
              <h3 className="mt-1">
                {family.name} - {family.qbmCode}
              </h3>
              <hr className="mt-0 shadow" />
            </div>

            <div>
              <h4>Visão geral da família:</h4>
              {family.desc ? (
                <div className="mb-2">
                  {family.desc.split("\n").map((text, index) => (
                    <p className="m-0" key={index}>
                      {text}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            {family.links && Object.keys(family.links).length > 0 && (
              <div>
                <h6>Links úteis:</h6>
                <ul>
                  {Object.entries(family.links).map(([key, url]) => (
                    <li key={key}>
                      <Link to={url} target="_blank" rel="noopener noreferrer">
                        {key}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {family.observations ? (
              <div className="alert alert-warning p-2" role="alert">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-exclamation-triangle float-start mt-1 me-1"
                  viewBox="0 0 16 16">
                  <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                </svg>
                <p className="p-0 m-0 fw-bold">Atenção:</p>
                <div>
                  {family.observations.split("\n").map((text, index) => (
                    <p className="m-0" key={index}>
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            <hr />

            {family.canvaLink ? (
              <>
                <img style={{ width: "100%" }} src={family.canvaLink} alt="Canva Value Proposition" />
                <hr />
              </>
            ) : null}

            {hasTelemetry && (
              <div>
                <div className="row">
                  <h4>Telemetria</h4>
                  <div className="col-6">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>Acessório Digital</th>
                            <th>Nº de Entradas Usadas</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>SENSOR RPM</td>
                            <td>1</td>
                          </tr>
                          <tr>
                            <td>SENSOR EMB</td>
                            <td>1</td>
                          </tr>
                          <tr>
                            <td>SENSOR FREIO</td>
                            <td>1</td>
                          </tr>
                          <tr>
                            <td>SENSOR PORTA</td>
                            <td>1</td>
                          </tr>
                          <tr>
                            <td>SENSOR BAÚ</td>
                            <td>1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>Acessório Analógico</th>
                            <th>Nº de Entradas Usadas</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>SENSOR MOTOR</td>
                            <td>1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th scope="col">Produto</th>
                          <th colSpan="2" className="text-center">
                            Entradas Livres
                          </th>
                        </tr>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col" className="text-center">
                            Digital
                          </th>
                          <th scope="col" className="text-center">
                            Analógica
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {family.products.map((product) => {
                          if (product.telemetry) {
                            return (
                              <tr key={product.name}>
                                <td>
                                  <p className="m-0 p-0" style={{ fontSize: "12px" }}>
                                    {product.qbmCode}
                                  </p>
                                  <p className="m-0 p-0">{product.name}</p>
                                </td>
                                <td className="text-center">{product.telemetry.digital}</td>
                                <td className="text-center">{product.telemetry.analog}</td>
                              </tr>
                            );
                          }
                          return null;
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <hr />
              </div>
            )}

            <div>
              <h4 className="d-flex align-items-center">
                Segmentos de produtos:
                <div className="dropdown ms-2">
                  <button className="btn btn-sm" onClick={toggleMenu} type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                      <path
                        fillRule="evenodd"
                        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                      />
                    </svg>
                  </button>
                  {menuOpen && (
                    <ul className="dropdown-menu show">
                      <li>
                        <button className="dropdown-item" onClick={togleCompactTable}>
                          Tabela Compacta
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={togleFullTable}>
                          Tabela Completa
                        </button>
                      </li>
                      {user && (user.admin === true || user.role === "cs") && (
                        <li>
                          <button className="dropdown-item" onClick={togleRenovationTable}>
                            Tabela de Renovação
                          </button>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </h4>

              <div className="table-responsive overflow-visible">
                {copied && (
                  <div
                    style={{
                      position: "fixed",
                      top: 20,
                      right: 20,
                      background: "#222",
                      color: "#fff",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      zIndex: 99999,
                      fontWeight: "bold",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>
                    Copiado
                  </div>
                )}
                {showCompactTable && (
                  <table className="table table-bordered table-hover table-sm">
                    <thead>
                      <tr>
                        <th scope="col">Produto</th>
                        <th scope="col" className="text-center">
                          Adesão
                        </th>
                        <th colSpan="1" className="text-center">
                          Com adesão
                        </th>
                        <th colSpan="1" className="text-center">
                          Sem adesão
                        </th>
                        <th scope="col" className="text-center">
                          Fecho
                        </th>
                      </tr>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col" className="text-center"></th>
                        <th colSpan="1" className="text-center">
                          <select className="form-select form-select-sm" value={selectedWithMembership} onChange={handleWithMembershipChange}>
                            <option value={12}>12 meses</option>
                            <option value={24}>24 meses</option>
                            <option value={36}>36 meses</option>
                          </select>
                        </th>
                        <th colSpan="1" className="text-center">
                          <select className="form-select form-select-sm" value={selectedNoMembership} onChange={handleNoMembershipChange}>
                            <option value={12}>12 meses</option>
                            <option value={24}>24 meses</option>
                            <option value={36}>36 meses</option>
                            <option value={48}>48 meses</option>
                            <option value={60}>60 meses</option>
                          </select>
                        </th>
                        <th scope="col" className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {family.products ? (
                        family.products.map((product) => {
                          return (
                            <tr key={product.name}>
                              <td>
                                <div className="d-flex align-items-center justify-content-between g-4">
                                  <span>
                                    <p className="m-0 p-0" style={{ fontSize: "12px" }}>
                                      {product.qbmCode}
                                    </p>
                                    <p className="m-0 p-0 d-inline">{product.name}</p>
                                  </span>
                                  <span className="custom-tooltip-wrapper" onClick={() => copyToClipboard(product.name, product.desc)}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-info-circle"
                                      viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                    </svg>
                                    <span className="custom-tooltip">{product.desc}</span>
                                  </span>
                                </div>
                              </td>
                              <td className="text-center align-middle">{product.price.withMembership[0] || "N/A"}</td>
                              <td className="text-center align-middle">{product.price.withMembership[selectedWithMembership / 12] || "N/A"}</td>
                              <td className="text-center align-middle">{product.price.noMembership[selectedNoMembership / 12 - 1] || "N/A"}</td>
                              <td className="text-center align-middle">{product.price.closure || "N/A"}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center bg-danger text-white">
                            Erro
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                {showFullTable && (
                  <table className="table table-bordered table-hover table-sm">
                    <thead>
                      <tr>
                        <th scope="col">Produto</th>
                        <th scope="col" className="text-center">
                          Adesão
                        </th>
                        <th colSpan="3" className="text-center">
                          Com adesão
                        </th>
                        <th colSpan="5" className="text-center">
                          Sem adesão
                        </th>
                        <th scope="col" className="text-center">
                          Fecho
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="2"></th>
                        <th className="text-center">12 meses</th>
                        <th className="text-center">24 meses</th>
                        <th className="text-center">36 meses</th>
                        <th className="text-center">12 meses</th>
                        <th className="text-center">24 meses</th>
                        <th className="text-center">36 meses</th>
                        <th className="text-center">48 meses</th>
                        <th className="text-center">60 meses</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {family.products ? (
                        family.products.map((product) => {
                          return (
                            <tr key={product.name}>
                              <td>
                                <div className="d-flex align-items-center justify-content-between g-4">
                                  <span>
                                    <p className="m-0 p-0" style={{ fontSize: "12px" }}>
                                      {product.qbmCode}
                                    </p>
                                    <p className="m-0 p-0 d-inline">{product.name}</p>
                                  </span>
                                  <span className="custom-tooltip-wrapper" onClick={() => copyToClipboard(product.name, product.desc)}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-info-circle"
                                      viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                    </svg>
                                    <span className="custom-tooltip">{product.desc}</span>
                                  </span>
                                </div>
                              </td>
                              {product.price.withMembership[0] ? (
                                <td className="text-center text-truncate align-middle">{product.price.withMembership[0]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.withMembership[1] ? (
                                <td className="text-center text-truncate align-middle">{product.price.withMembership[1]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.withMembership[2] ? (
                                <td className="text-center text-truncate align-middle">{product.price.withMembership[2]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.withMembership[3] ? (
                                <td className="text-center text-truncate align-middle">{product.price.withMembership[3]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}

                              {product.price.noMembership[0] ? (
                                <td className="text-center text-truncate align-middle">{product.price.noMembership[0]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.noMembership[1] ? (
                                <td className="text-center text-truncate align-middle">{product.price.noMembership[1]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.noMembership[2] ? (
                                <td className="text-center text-truncate align-middle">{product.price.noMembership[2]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.noMembership[3] ? (
                                <td className="text-center text-truncate align-middle">{product.price.noMembership[3]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.noMembership[4] ? (
                                <td className="text-center text-truncate align-middle">{product.price.noMembership[4]}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                              {product.price.closure ? (
                                <td className="text-center text-truncate align-middle">{product.price.closure}</td>
                              ) : (
                                <td className="text-center align-middle">N/A</td>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center bg-danger text-white">
                            Erro
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                {showRenovationTable && (
                  <div>
                    <div className="alert alert-warning p-2" role="alert">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-exclamation-triangle float-start mt-1 me-1"
                        viewBox="0 0 16 16">
                        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                      </svg>
                      <p className="p-0 m-0 fw-bold">Atenção:</p>
                      <div>
                        <p className="m-0">Não é permitido conceder valores abaixo dos apresentados nesta tabela sem autorização.</p>
                      </div>
                    </div>
                    <table className="table table-bordered table-hover table-sm">
                      <thead>
                        <tr>
                          <th scope="col">Produto</th>
                          <th className="text-center">12 meses</th>
                          <th className="text-center">24 meses</th>
                          <th className="text-center">36 meses</th>
                          <th scope="col" className="text-center">
                            Fecho
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {family.products ? (
                          family.products.map((product) => {
                            return (
                              <tr key={product.name}>
                                <td>
                                  <div className="d-flex align-items-center justify-content-between g-4">
                                    <span>
                                      <p className="m-0 p-0" style={{ fontSize: "12px" }}>
                                        {product.qbmCode}
                                      </p>
                                      <p className="m-0 p-0 d-inline">{product.name}</p>
                                    </span>
                                    <span className="custom-tooltip-wrapper" onClick={() => copyToClipboard(product.name, product.desc)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-info-circle"
                                        viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                      </svg>
                                      <span className="custom-tooltip">{product.desc}</span>
                                    </span>
                                  </div>
                                </td>
                                {product.price.renovation[0] ? (
                                  <td className="text-center text-truncate align-middle">{product.price.renovation[0]}</td>
                                ) : (
                                  <td className="text-center align-middle">N/A</td>
                                )}
                                {product.price.renovation[1] ? (
                                  <td className="text-center text-truncate align-middle">{product.price.renovation[1]}</td>
                                ) : (
                                  <td className="text-center align-middle">N/A</td>
                                )}
                                {product.price.renovation[2] ? (
                                  <td className="text-center text-truncate align-middle">{product.price.renovation[2]}</td>
                                ) : (
                                  <td className="text-center align-middle">N/A</td>
                                )}
                                {product.price.closure ? (
                                  <td className="text-center text-truncate align-middle">{product.price.closure}</td>
                                ) : (
                                  <td className="text-center align-middle">N/A</td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center bg-danger text-white">
                              Erro
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <hr />

            <div>
              {family.addInfoLink ? (
                <>
                  <h4>Informação adicional da família:</h4>
                  <img style={{ width: "100%" }} src={family.addInfoLink} alt="Informação adicional da família" />
                </>
              ) : null}
            </div>

            <div className="mt-2">
              <Link to={`${import.meta.env.VITE_GA_LINK}`} target="_blank" rel="noopener noreferrer">
                Guias de Instalação
              </Link>
            </div>

            <div>
              <hr />
              <p className="m-0 p-0">
                {family._id} - Atualizado em: {new Date(family.updatedAt).toLocaleString()}.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeeMoreFamily;
