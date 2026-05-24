import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { setUser } = useAuth();

  async function handleRegister(e) {
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      console.log("User registered: ", data);
      setUser(data.user);
      navigate("/tasks");
    } catch (err) {
      console.log("Error registering a new user: ", err);
    }
  }
  console.log(newUser);
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
        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            type="password"
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
