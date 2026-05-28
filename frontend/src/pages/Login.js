import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../App.css";

function Login({ setUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");

  const [signup, setSignup] = useState(false);
  const [otpStep, setOtpStep] = useState(false);


  // ---------- SIGNUP ----------
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@iiti.ac.in")) {
      toast.error("Please use your institute email (@iiti.ac.in)");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!contact || contact.length !== 10) {
      toast.error("Enter valid 10 digit contact number");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { email, password, contact }
      );

      toast.success(res.data.message);
      setOtpStep(true);

    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };


  // ---------- VERIFY OTP ----------
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      toast.success(res.data.message);

      setOtpStep(false);
      setSignup(false);

    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };


  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@iiti.ac.in")) {
      return toast.error("Please login with your institute email id");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Welcome back!");
      setUser(res.data.user);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="login-page">

      <div className="login-card">

        <h1 className="login-title">Campus OLX</h1>

        <h2>
          {otpStep ? "Enter OTP" : signup ? "Create Account" : "Login"}
        </h2>


        {!otpStep && (
          <form onSubmit={signup ? handleSignup : handleLogin}>

            <input
              className="login-input"
              type="email"
              placeholder="Institute Email (@iiti.ac.in)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {signup && (
              <input
                className="login-input"
                type="text"
                placeholder="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            )}

            <button className="login-btn" type="submit">
              {signup ? "Signup" : "Login"}
            </button>

          </form>
        )}


        {otpStep && (
          <form onSubmit={handleVerify}>

            <input
              className="login-input"
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="login-btn">
              Verify OTP
            </button>

          </form>
        )}


        {!otpStep && (
          <button
            className="switch-btn"
            onClick={() => setSignup(!signup)}
          >
            {signup ? "Go to Login" : "Create Account"}
          </button>
        )}

      </div>

    </div>
  );
}

export default Login;