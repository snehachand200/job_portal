
import { useState } from "react";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import JobList from "./components/JobList.jsx";

function App() {
  // Always start with Registration
  const [page, setPage] = useState("register");

  const handleLoginSuccess = () => {
    setPage("jobs");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setPage("login");
  };

  return (
    <div>
      {page === "register" && (
        <Register
          onRegisterSuccess={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {page === "jobs" && (
        <>
          <header className="top-bar">
            <h2>Job Portal</h2>

            <div>
              <span>
                Welcome, {localStorage.getItem("username")}
              </span>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <JobList />
        </>
      )}
    </div>
  );
}

export default App;
