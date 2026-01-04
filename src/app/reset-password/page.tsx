"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Reset code is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        return;
      }

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url(/kevin/login-background-image.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
          transform: "scale(1.05)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="text-center mb-4 text-primary">Reset Password</h3>
                
                {success ? (
                  <div>
                    <div className="alert alert-success" role="alert">
                      <strong>Password Reset Successful!</strong>
                      <p className="mb-0 mt-2">
                        Your password has been reset successfully. Redirecting to login...
                      </p>
                    </div>
                    <div className="d-grid">
                      <Link href={ROUTES.LOGIN} className="btn btn-primary">
                        Go to Login
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="code" className="form-label">
                          Reset Code
                        </label>
                        <input
                          type="text"
                          id="code"
                          className={`form-control ${error ? "is-invalid" : ""}`}
                          placeholder="Enter reset code"
                          value={code}
                          required
                          onChange={(e) => setCode(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className={`form-control ${error ? "is-invalid" : ""}`}
                          placeholder="Enter new password"
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className={`form-control ${error ? "is-invalid" : ""}`}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          required
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading || !code.trim() || !password.trim() || !confirmPassword.trim()}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Resetting...
                            </>
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <Link href={ROUTES.LOGIN} className="text-decoration-none">
                          Back to Login
                        </Link>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

