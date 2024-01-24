import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ViewPost from "./pages/ViewPost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthContext } from "./helpers/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";

function App() {
  const [authState, setAuthState] = useState({
    userName: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://react-back.azurewebsites.net/user/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({
            ...authState,
            status: false,
          });
        } else {
          setAuthState({
            userName: response.data.userName,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      userName: "",
      id: 0,
      status: false,
    });
  };

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <BrowserRouter>
          {!authState.status ? (
            <div>
              <Link to="/login">Login</Link>
              <br />
              <Link to="/register">SignUp</Link>
            </div>
          ) : (
            <>
              <Link to="/create">Create a post</Link>
              <Link to="/">Go to home</Link>
            </>
          )}
          <div>
            <h2>{authState.userName}</h2>
            {authState.status && <button onClick={logout}>Logout</button>}
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/view-post/:id" element={<ViewPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;
