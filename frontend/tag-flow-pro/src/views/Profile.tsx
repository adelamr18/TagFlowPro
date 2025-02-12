import Header from "components/Headers/Header";
import { useAdmin } from "context/AdminContext";
import { useAuth } from "context/AuthContext";
import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

const Profile = () => {
  const { userName, userEmail, roleId, userId } = useAuth();
  const { updateUserByUsername } = useAdmin();
  const [newUsername, setNewUsername] = useState(userName);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    await updateUserByUsername(newUsername, parseInt(roleId), userId);
  };

  return (
    <>
      <Header canShowDashboard={false} />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Account Information</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Settings
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSaveChanges}>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            id="input-username"
                            placeholder="Username"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={userEmail}
                            id="input-email"
                            placeholder="Email Address"
                            type="email"
                            readOnly // non-editable email
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-right" xs="12">
                        <Button color="primary" type="submit">
                          Save Changes
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
