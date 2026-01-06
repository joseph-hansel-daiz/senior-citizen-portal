"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { getApiUrl } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("auth/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to request password reset");
        return;
      }

      setSuccess(true);
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
                <h3 className="text-center mb-4 text-primary">Forgot Password</h3>
                
                {success ? (
                  <div>
                    <div className="alert alert-success" role="alert">
                      <strong>Request Submitted</strong>
                      <p className="mb-0 mt-2">
                        If the username exists, a password reset code has been generated.
                        Please contact your administrator to obtain the reset code.
                      </p>
                    </div>
                    <div className="d-grid">
                      <Link href={ROUTES.LOGIN} className="btn btn-primary">
                        Back to Login
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
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          className={`form-control ${error ? "is-invalid" : ""}`}
                          placeholder="Enter your username"
                          value={username}
                          required
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Submitting...
                            </>
                          ) : (
                            "Request Reset Code"
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

