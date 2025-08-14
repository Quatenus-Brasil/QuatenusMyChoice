import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { userLogged } from "../services/userService";

// TODO: Mover toda a lógica de cookies para o backend

const Login = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onLogin = (data) => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/user/login`, data)
      .then(async (response) => {
        Cookies.set("token", response.data, { expires: rememberMe ? 365 : 3, sameSite: "strict" });
        const userResponse = await userLogged();
        setUser(userResponse.data);
        navigate("/");
      })
      .catch((error) => {
        alert(`Oops, algo deu errado!
        - ${error.response.data.message}`);
        console.error(error);
      });
  };

  return (
    <div className="py-5 bg-light d-flex">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card p-4 shadow-sm">
              <div className="card-body">
                <h1 className="h3 mb-3 fw-normal text-center">Login</h1>
                <form onSubmit={handleSubmit(onLogin)}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      id="floatingEmail"
                      placeholder="E-mail"
                      {...register("email", { required: "O e-mail é obrigatório" })}
                    />
                    <label htmlFor="floatingEmail">E-mail</label>
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="floatingPassword"
                      placeholder="Senha"
                      {...register("password", { required: "A senha é obrigatória" })}
                    />
                    <label htmlFor="floatingPassword">Senha</label>
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div title="Irá manter seu usuário logado por 1 ano.">
                      <input className="form-check-input" type="checkbox" id="flexCheckDefault" onChange={(e) => setRememberMe(e.target.checked)} />
                      <label className="ms-2 mb-3">Manter-me logado</label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Link to="/register">
                      <p className="">Não tem uma conta?</p>
                    </Link>
                    <Link onClick={() => alert("Entre em contato com o suporte para recuperar sua senha.")}>
                      <p>Esqueceu sua senha?</p>
                    </Link>
                  </div>
                  <button className="btn btn-lg btn-qorange w-100" type="submit">
                    Entrar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
