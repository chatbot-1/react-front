import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthState } = useContext(AuthContext);

  const login = () => {
    const data = { userName: userName, password: password };
    axios.post("http:react-back.azurewebsites.net/user/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          userName: response.data.userName,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }

      console.log(response.data);
    });
  };

  return (
    <div>
      <input
        type="text"
        name="userName"
        id=""
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <input
        type="password"
        name="password"
        id=""
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button type="submit" onClick={login}>
        Login
      </button>
    </div>
  );
};

export default Login;
