import React from "react";
import { Container, Button } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

function HomeScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Container className="py-4">
      <h1>Welcome to satya-eo</h1>
      <p>satya-eo is a secure authentication portal. Sign in or register to continue.</p>
      {userInfo ? (
        <div>
          <p>
            You are signed in as <strong>{userInfo.name || userInfo.email}</strong>.
          </p>
        </div>
      ) : (
        <div className="d-flex gap-2">
          <LinkContainer to="/login">
            <Button variant="primary">Login</Button>
          </LinkContainer>
          <LinkContainer to="/signup">
            <Button variant="secondary">Signup</Button>
          </LinkContainer>
        </div>
      )}
    </Container>
  );
}

export default HomeScreen;
