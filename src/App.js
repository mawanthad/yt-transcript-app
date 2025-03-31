import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import DashboardPage from "./pages/DashboardPage";
import { Button, Typography } from "antd";

const { Title } = Typography;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert("Login failed. Try again.");
    }
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Title level={2}>🔐 Login to Start Scraping</Title>
        <Button type="primary" onClick={handleLogin}>
          Sign in with Google
        </Button>
      </div>
    );
  }

  return <DashboardPage user={user} />;
}

export default App;
