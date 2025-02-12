import { Link, useNavigate } from "react-router-dom";
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import "./AuthNavbar.css";
import { useAuth } from "context/AuthContext";
import { ADMIN_ROLE_ID, VIEWER_ROLE_ID } from "shared/consts";

const AdminNavbar = () => {
  const { logout, userName, roleId } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const success = logout();

    if (success) {
      navigate("/auth/login");
    }
  };

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link} className="navbar-brand-custom">
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                alt="Selat Logo"
                src={require("../../assets/img/brand/selat-logo.png")}
                className="navbar-brand-img-modified"
                style={{ marginBottom: 0 }}
              />
              <h4
                className="navbar-brand-text-modified"
                style={{
                  margin: 0,
                  padding: 0,
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                Selat Check
                <br />
                Insurance System
              </h4>
            </div>
          </NavbarBrand>

          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col
                  className="collapse-brand d-flex align-items-center"
                  xs="6"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Link to="/" className="collapse-brand-link">
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          alt="React Logo"
                          src={require("../../assets/img/brand/selat-logo.png")}
                          className="collapse-brand-img"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            height: "50px",
                          }}
                        />
                        <h3
                          className="collapse-brand-text"
                          style={{
                            margin: 0,
                            padding: 0,
                            lineHeight: 1,
                            marginTop: "35px", // 35px gap between image and text
                            textAlign: "center",
                          }}
                        >
                          Selat Check
                          <br />
                          Insurance System
                        </h3>
                      </div>
                    </Link>
                  </div>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              <NavItem>
                {userName && (
                  <NavLink className="nav-link-icon" to="/" tag={Link}>
                    <i className="ni ni-planet" />
                    <span className="nav-link-inner--text">Dashboard</span>
                  </NavLink>
                )}
              </NavItem>
              <NavItem>
                <NavLink className="nav-link-icon" to="/auth/login" tag={Link}>
                  <i className="ni ni-key-25" />
                  <span className="nav-link-inner--text">Login</span>
                </NavLink>
              </NavItem>
              <NavItem>
                {userName &&
                  (parseInt(roleId) === ADMIN_ROLE_ID ||
                    parseInt(roleId) === VIEWER_ROLE_ID) && (
                    <NavLink
                      className="nav-link-icon"
                      to="/admin/admin-panel"
                      tag={Link}
                    >
                      <i className="ni ni-bullet-list-67" />
                      <span className="nav-link-inner--text">Admin Panel</span>
                    </NavLink>
                  )}
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link-icon"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <i className="ni ni-user-run" />
                  <span className="nav-link-inner--text">Logout</span>
                </NavLink>
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
