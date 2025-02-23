import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo@example");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border min-w-sm px-8 py-10 overflow-hidden border-gray-200 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? "Register" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              className="border rounded-3xl text-base px-4 py-1.5 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:ring-offset-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              className="border rounded-3xl text-base px-4 py-1.5 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:ring-offset-2"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex -mt-2 ml-auto items-center gap-2">
            <input
              id="show-password"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="show-password" className="text-xs cursor-pointer">
              Show Password
            </label>
          </div>
          {isRegistering && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                className="border rounded-3xl text-base px-4 py-1.5 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:ring-offset-2"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            className="cursor-pointer bg-black text-white rounded-3xl text-sm mt-2 px-6 py-2 mb-4 font-medium focus:outline-none focus:ring-1 focus:ring-blue-300 focus:ring-offset-2"
            type="submit"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
          {!isRegistering && (
            <p className="text-center mb-4 font-medium bg-yellow-100 border border-yellow-200 rounded-full py-0.5 text-yellow-700 text-sm">
              Use demo account; click on Login
            </p>
          )}
        </form>
        <hr className="w-full border-gray-200 mb-6 mt-2" />
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="underline text-center text-sm cursor-pointer"
        >
          {isRegistering ? "Switch to Login?" : "Switch to Register?"}
        </button>
        {message && (
          <p className="text-center mt-4 text-red-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
