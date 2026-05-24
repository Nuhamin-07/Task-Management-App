import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        navigate("/tasks");
        console.log("User logged in: ", data);
      }
    } catch (err) {
      console.log("Error logging in user: ", err);
    }
  }

  return (
    <div className="login-form-container">
      <h2>Login</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md login-form"
      >
        <div>
          <label>Email</label>
          <Input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label>Password</label>
          <Input
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            minLength={6}
          />
        </div>
        <Button type="submit">Login</Button>
        <p>
          Don't have an account?{" "}
          <Link className="link-text" to="/signup">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
