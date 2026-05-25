import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

export default function Signup() {
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useAuth();

  async function handleRegister(e) {
    try {
      e.preventDefault();
      if (newUser.password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Error registering a new user");
        return;
      }
      toast.success(data.message);
      setUser(data.user);
      navigate("/tasks");
    } catch (err) {
      toast.error(`Error registering a new user: ${err.message}`);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((prev) => !prev);
  }
  return (
    <div className="signup-form-container">
      <h2 className="text-center mt-10">Signup</h2>
      <form
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md signup-form"
        onSubmit={handleRegister}
      >
        <div className="mb-4">
          <label
            htmlFor="first_name"
            className="text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <Input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="John"
            required
            value={newUser.first_name}
            onChange={(e) =>
              setNewUser({ ...newUser, first_name: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="last_name"
            className="text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <Input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Doe"
            required
            value={newUser.last_name}
            onChange={(e) =>
              setNewUser({ ...newUser, last_name: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="john.doe@example.com"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>
        <div className="mb-4 password-input-container">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            className="password-input"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            minLength="6"
            placeholder="••••••••"
            required
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="show-password-btn"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="mb-4 password-input-container">
          <label
            htmlFor="confirm_password"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <Input
            className="password-input"
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            name="confirm_password"
            minLength="6"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="show-password-btn"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <Button type="submit">Signup</Button>
        <p className="text-center">
          Already have an account?{" "}
          <Link className="link-text" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
