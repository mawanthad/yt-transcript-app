import React from "react";
import { Button, Typography } from "antd";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const { Title } = Typography;

function LoginPage({ onLogin }) {
  const handleLogin = () => {
    signInWithPopup(auth, provider).then((result) => {
      onLogin(result.user);
    });
  };

  return (
    <div style={{ padding: "5rem", textAlign: "center" }}>
      <Title level={2}>🔐 Login to Start Scraping</Title>
      <Button type="primary" onClick={handleLogin}>
        Sign in with Google
      </Button>
    </div>
  );
}

export default LoginPage;
