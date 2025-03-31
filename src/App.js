import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <DashboardPage user={user} />
  ) : (
    <LoginPage onLogin={setUser} />
  );
}

export default App;
