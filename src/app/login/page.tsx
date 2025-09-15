"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    setErrors({});
    setFormError("");

    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // parse JSON even on non-2xx to show backend message
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage = (data && data.message) || "Login failed";
        setFormError(errorMessage);
        return;
      }

      const { token, user } = data;

      const userPayload = {
        id: Number(user.id),
        username: user.username,
        name: user.name,
        role: user.role,
        barangayId: user.barangayId === null ? null : Number(user.barangayId),
      };

      login(userPayload, token);

      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      setFormError(
        "Network error. Please check your connection and try again."
      );
    }
  };

  return (
    <AuthProvider>
      <section
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h3 className="text-center mb-4 text-primary">Login</h3>
                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        className={`form-control ${
                          errors.username ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      {errors.username && (
                        <div className="invalid-feedback">
                          {errors.username}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary">
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuthProvider>
  );
}
