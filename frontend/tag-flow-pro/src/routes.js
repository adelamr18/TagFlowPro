import React from "react";
import Index from "views/Index.js";
import Login from "views/examples/Login.js";
import AdminPanel from "views/examples/AdminPanel.js";
import Icons from "views/examples/Icons.js";
import ForgetPassword from "views/examples/ForgetPassword.js";
import ProtectedRoute from "components/Utils/ProtectedRoute";
import Logout from "views/examples/Logout.js"; // Import the Logout component

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: (
      <ProtectedRoute>
        <Icons />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/logout",
    name: "Logout",
    component: <Logout />,
    layout: "/auth",
    icon: "ni ni-user-run",
  },
  {
    path: "/admin-panel",
    name: "Admin Panel",
    icon: "ni ni-bullet-list-67 text-red",
    component: (
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    ),
    layout: "/admin",
  },
  {
    path: "/forget-password",
    name: "Forget Password",
    component: <ForgetPassword />,
    layout: "/auth",
  },
];

export default routes;
