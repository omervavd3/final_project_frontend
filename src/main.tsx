import React from "react";
import ReactDOM from "react-dom/client"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import EditUser from "./components/EditUser";
import ViewPost from "./components/ViewPost";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/editUser" element={<EditUser />} />
        <Route path="viewPost/:postId" element={<ViewPost />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
