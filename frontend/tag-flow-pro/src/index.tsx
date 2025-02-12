import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/tag-flow-pro.scss";

import AdminLayout from "layouts/Admin.tsx";
import AuthLayout from "layouts/Auth.tsx";
import FileLayout from "layouts/File.tsx";
import UserLayout from "layouts/User.tsx";

import ContextProvider from "./context/ContextProvider.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout location={undefined} />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/file/*" element={<FileLayout location={undefined} />} />
        <Route path="/user/*" element={<UserLayout location={undefined} />} />
        <Route path="*" element={<Navigate to="/admin/index" replace />} />
      </Routes>
      <ToastContainer aria-label={undefined} />
    </BrowserRouter>
  </ContextProvider>
);
