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

const AdminNavbar = () => {
  const { logout } = useAuth();
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
            <img
              alt="React Logo"
              src={require("../../assets/img/brand/react-icon.png")}
              className="navbar-brand-img-modified"
            />
            <h4 className="navbar-brand-text">TagFlowPro</h4>
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
                  <Link to="/" className="collapse-brand-link">
                    <img
                      alt="React Logo"
                      src={require("../../assets/img/brand/react-icon.png")}
                      className="collapse-brand-img"
                    />
                    <h3 className="collapse-brand-text">TagFlowPro</h3>
                  </Link>
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
                <NavLink className="nav-link-icon" to="/" tag={Link}>
                  <i className="ni ni-planet" />
                  <span className="nav-link-inner--text">Dashboard</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link-icon" to="/auth/login" tag={Link}>
                  <i className="ni ni-key-25" />
                  <span className="nav-link-inner--text">Login</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="nav-link-icon"
                  to="/admin/admin-panel"
                  tag={Link}
                >
                  <i className="ni ni-bullet-list-67" />
                  <span className="nav-link-inner--text">Admin Panel</span>
                </NavLink>
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
