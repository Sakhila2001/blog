import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";
import Login from "./components/admin/Login";
import 'quill/dist/quill.snow.css';

const App = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />

        {/* Public login route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? <Layout /> : <Navigate to="/admin/login" />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="list-blog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
