import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
        toast.success("User logged in successfully");
      } else {
        toast.error(data.error || "Error logging in user");
      }
    } catch (err) {
      toast.error(`Error logging in user: ${err.message}`);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
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
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="mb-4 password-input-container">
          <label>Password</label>
          <Input
            className="password-input"
            type={showPassword ? "text" : "password"}
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            minLength={6}
            placeholder="******"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="show-password-btn"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
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
