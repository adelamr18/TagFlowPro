/*eslint-disable*/
import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import "./Sidebar.css";

import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  const createLinks = (routes) => {
    return routes
      .filter(
        (route) =>
          route.path !== "/login" &&
          route.path !== "/logout" &&
          route.path !== "/user-profile"
      )
      .map((prop, key) => (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      ));
  };

  const { routes, logo } = props;
  const filteredRoutes = routes.filter(
    (route) => route.path !== "/forget-password"
  );
  let navbarBrandProps;

  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {logo ? (
          <NavbarBrand
            className="pt-0 d-flex align-items-center"
            {...navbarBrandProps}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <img
                alt={logo.imgAlt}
                className="navbar-brand-img-modified"
                src={logo.imgSrc}
              />
              <h3 className="navbar-brand-title-modified">
                Selat Check
                <br />
                Insurance System
              </h3>
            </div>
          </NavbarBrand>
        ) : null}

        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-calendar-grid-58" />
                <span>Activity</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-support-16" />
                <span>Support</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col
                  className="collapse-brand d-flex align-items-center"
                  xs="6"
                >
                  {logo.innerLink ? (
                    <Link to={logo.innerLink} className="collapse-brand-link">
                      <img
                        alt={logo.imgAlt}
                        src={logo.imgSrc}
                        className="collapse-brand-img"
                      />
                      <h3 className="collapse-brand-text">
                        {" "}
                        Selat Check
                        <br />
                        Insurance System
                      </h3>
                    </Link>
                  ) : (
                    <a href={logo.outterLink} className="collapse-brand-link">
                      <img
                        alt={logo.imgAlt}
                        src={logo.imgSrc}
                        className="collapse-brand-img"
                      />
                      <h3 className="collapse-brand-text">
                        {" "}
                        Selat Check
                        <br />
                        Insurance System
                      </h3>
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Form className="mt-4 mb-3 d-md-none"></Form>
          <Nav navbar>{createLinks(filteredRoutes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
