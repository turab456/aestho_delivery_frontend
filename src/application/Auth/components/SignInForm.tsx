import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/custom/CustomButton";
import CustomInput from "../../../components/custom/CustomInput";
import { useAuth } from "../../../context/AuthContext";

export default function SignInForm() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await signIn({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col flex-1"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <h1
            className="text-center mb-8"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#111827",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            SIGN IN
          </h1>
          <div>
            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "24px" }}
              >
                <CustomInput
                  label="Email"
                  type="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <div style={{ position: "relative" }}>
                  <CustomInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: "16px",
                      bottom: "12px",
                      cursor: "pointer",
                      zIndex: 10,
                      pointerEvents: "auto",
                    }}
                  >
                    {showPassword ? (
                      <Eye
                        style={{
                          color: "#6b7280",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    ) : (
                      <EyeOff
                        style={{
                          color: "#6b7280",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    )}
                  </span>
                </div>

                {error && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "14px",
                      marginTop: "-8px",
                    }}
                  >
                    {error}
                  </p>
                )}

                <CustomButton
                  type="submit"
                  disabled={isSubmitting || !email || !password}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
