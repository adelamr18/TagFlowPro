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
  Col,
  FormFeedback,
} from "reactstrap";
import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import authService from "services/authService";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailInvalid, setIsInvalidEmail] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [firstPassword, setFirstPassword] = useState("");
  const [isFirstPasswordInvalid, setIsInvalidFirstPassword] = useState(false);
  const [firstPasswordErrorMessage, setFirstPasswordErrorMessage] =
    useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordInvalid, setIsInvalidConfirmPassword] =
    useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");

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

  const handleFirstPasswordChange = (event) => {
    const value = event.target.value;
    setFirstPassword(value);

    if (value.trim() === "") {
      setIsInvalidFirstPassword(true);
      setFirstPasswordErrorMessage("New password is required.");
    } else if (!passwordRegex.test(value)) {
      setIsInvalidFirstPassword(true);
      setFirstPasswordErrorMessage(
        "Password must be at least 9 characters long, start with a capital letter, and include numbers and special characters."
      );
    } else {
      setIsInvalidFirstPassword(false);
      setFirstPasswordErrorMessage("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);

    if (value.trim() === "") {
      setIsInvalidConfirmPassword(true);
      setConfirmPasswordErrorMessage("Confirmation password is required.");
    } else if (value !== firstPassword) {
      setIsInvalidConfirmPassword(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
    } else {
      setIsInvalidConfirmPassword(false);
      setConfirmPasswordErrorMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsInvalidEmail(false);
    setIsInvalidFirstPassword(false);
    setIsInvalidConfirmPassword(false);

    let isValid = true;

    if (email.trim() === "") {
      setIsInvalidEmail(true);
      setEmailErrorMessage("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setIsInvalidEmail(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    }

    // Validate first password
    if (firstPassword.trim() === "") {
      setIsInvalidFirstPassword(true);
      setFirstPasswordErrorMessage("New password is required.");
      isValid = false;
    } else if (!passwordRegex.test(firstPassword)) {
      setIsInvalidFirstPassword(true);
      setFirstPasswordErrorMessage(
        "Password must be at least 9 characters long, start with a capital letter, and include numbers and special characters."
      );
      isValid = false;
    }

    if (confirmPassword.trim() === "") {
      setIsInvalidConfirmPassword(true);
      setConfirmPasswordErrorMessage("Confirmation password is required.");
      isValid = false;
    } else if (confirmPassword !== firstPassword) {
      setIsInvalidConfirmPassword(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      isValid = false;
    }

    if (isValid) {
      authService.forgetPassword(email, firstPassword);
      navigate("/auth/login");
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <large>Forget Password</large>
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
                    placeholder="Please enter your new password"
                    type="password"
                    value={firstPassword}
                    onChange={handleFirstPasswordChange}
                    invalid={isFirstPasswordInvalid}
                  />
                </InputGroup>
                {isFirstPasswordInvalid && (
                  <FormFeedback className="error-message-input">
                    {firstPasswordErrorMessage}
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
                    placeholder="Confirm your new password"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    invalid={isConfirmPasswordInvalid}
                  />
                </InputGroup>
                {isConfirmPasswordInvalid && (
                  <FormFeedback className="error-message-input">
                    {confirmPasswordErrorMessage}
                  </FormFeedback>
                )}
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Confirm
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default ForgetPassword;
