import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.tsx";
import AdminFooter from "components/Footers/AdminFooter.tsx";
import Sidebar from "components/Sidebar/Sidebar.tsx";

import routes from "routes.js";
import { useEffect, useRef } from "react";
import { useAuth } from "context/AuthContext"; // Import AuthContext
import { AppRoute } from "types/AppRoute";
import { OPERATOR_ROLE_ID, VIEWER_ROLE_ID } from "shared/consts";

interface AdminProps {
  location: Location;
}

const User = (props: AdminProps) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const { roleId } = useAuth();
  const parsedRoleId = parseInt(roleId, 10);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  const filterRoutesByRole = (routes: AppRoute[]) => {
    if (parsedRoleId === VIEWER_ROLE_ID) {
      return routes.filter((route) => route.name !== "Admin Panel");
    } else if (parsedRoleId === OPERATOR_ROLE_ID) {
      return [];
    }
    return routes;
  };

  const filteredRoutes = filterRoutesByRole(routes);

  const getRoutes = (routes: AppRoute[]) => {
    return routes.map((prop) => {
      if (prop.layout === "/user") {
        return (
          <Route key={prop.path} path={prop.path} element={prop.component} />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={filteredRoutes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/selat-logo.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        {!filteredRoutes.some((route) => route.path === location.pathname) && (
          <AdminNavbar {...props} brandText={getBrandText()} />
        )}

        <Routes>
          {getRoutes(filteredRoutes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default User;
