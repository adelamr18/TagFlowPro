import Index from "views/Index";
import Login from "views/Login";
import AdminPanel from "views/AdminPanel";
import ForgetPassword from "views/ForgetPassword";
import ProtectedRoute from "components/Utils/ProtectedRoute.tsx";
import Logout from "views/Logout";
import FileUpload from "views/FileUpload";
import FileStatus from "views/FileStatus";
import Profile from "views/Profile";

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
    path: "/file-upload",
    name: "File Upload",
    icon: "ni ni-cloud-upload-96 text-blue",
    component: (
      <ProtectedRoute>
        <FileUpload />
      </ProtectedRoute>
    ),
    layout: "/file",
  },
  {
    path: "/file-status",
    name: "File Status",
    icon: "ni ni-chart-bar-32 text-orange",
    component: (
      <ProtectedRoute>
        <FileStatus />
      </ProtectedRoute>
    ),
    layout: "/file",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/user",
  },
  {
    path: "/forget-password",
    name: "Forget Password",
    component: <ForgetPassword />,
    layout: "/auth",
  },
];

export default routes;
