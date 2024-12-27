import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/tag-flow-pro.scss";

import AdminLayout from "layouts/Admin.tsx";
import AuthLayout from "layouts/Auth.tsx";
import ContextProvider from "./context/ContextProvider.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ContextProvider children={undefined}>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/admin/index" replace />} />
      </Routes>
      <ToastContainer aria-label={undefined} />
    </BrowserRouter>
  </ContextProvider>
);
