import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext.tsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "services/authService";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [isEmailInvalid, setIsInvalidEmail] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordInvalid, setIsInvalidPassword] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // New state for "Remember Me"

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,}$/;

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);

    if (value.trim() === "") {
      setIsInvalidEmail(true);
      setEmailErrorMessage("Email is required.");
    } else if (!emailRegex.test(value)) {
      setIsInvalidEmail(true);
      setEmailErrorMessage("Please enter a valid email address.");
    } else {
      setIsInvalidEmail(false);
      setEmailErrorMessage("");
    }
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);

    if (value.trim() === "") {
      setIsInvalidPassword(true);
      setPasswordErrorMessage("Password is required.");
    } else if (!passwordRegex.test(value)) {
      setIsInvalidPassword(true);
      setPasswordErrorMessage(
        "Password must be at least 9 characters long, start with a capital letter, and include numbers and special characters."
      );
    } else {
      setIsInvalidPassword(false);
      setPasswordErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      setIsInvalidEmail(true);
      setEmailErrorMessage("Email is required.");
    } else if (!emailRegex.test(email)) {
      setIsInvalidEmail(true);
      setEmailErrorMessage("Please enter a valid email address.");
    }

    if (password.trim() === "") {
      setIsInvalidPassword(true);
      setPasswordErrorMessage("Password is required.");
    } else if (!passwordRegex.test(password)) {
      setIsInvalidPassword(true);
      setPasswordErrorMessage(
        "Password must be at least 9 characters long, start with a capital letter, and include numbers and special characters."
      );
    }

    if (!isEmailInvalid && !isPasswordInvalid) {
      const result = await authService.login(email, password);

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem("authToken", result.token);
        } else {
          sessionStorage.setItem("authToken", result.token);
        }

        setToken(result.token);
        toast.success(result.message);
        navigate("/dashboard");
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <span>Login</span>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="emailInput"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    invalid={isEmailInvalid}
                  />
                </InputGroup>
                {isEmailInvalid && (
                  <FormFeedback className="error-message-input">
                    {emailErrorMessage}
                  </FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    invalid={isPasswordInvalid}
                  />
                </InputGroup>
                {isPasswordInvalid && (
                  <FormFeedback className="error-message-input">
                    {passwordErrorMessage}
                  </FormFeedback>
                )}
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} // Handle checkbox state
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Login
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/forget-password");
              }}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
