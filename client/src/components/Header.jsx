import { useAuth } from "../context/AuthContext";
import { FaCaretDown } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, setUser, loading } = useAuth();
  const [hideLogoutButton, setHideLogoutButton] = useState(true);
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(
      "https://task-management-app-4-ina7.onrender.com/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      },
    );
    setUser(null);
    navigate("/login");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="navbar">
      <h1>Daily Task</h1>
      {user ? (
        <div className="user-info">
          <span>Welcome, {user.first_name + " " + user.last_name}!</span>
          <button onClick={() => setHideLogoutButton((prev) => !prev)}>
            <FaCaretDown />
          </button>
          {!hideLogoutButton && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
