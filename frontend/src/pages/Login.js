import { useState } from "react";
import axios from "axios";
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

    if (!contact || contact.length !== 10) {
      alert("Enter valid 10 digit contact number");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { email, password, contact }
      );

      alert(res.data.message);
      setOtpStep(true);

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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

      alert(res.data.message);

      setOtpStep(false);
      setSignup(false);

    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };


  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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