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
        "/api/auth/signup",
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
        "/api/auth/verify-otp",
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
        "/api/auth/login",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 border border-gray-100 transform transition-all hover:shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-2">
            Campus OLX
          </h1>
          <h2 className="text-xl font-medium text-slate-600">
            {otpStep ? "Enter Verification Code" : signup ? "Create your Account" : "Welcome Back"}
          </h2>
        </div>


        {!otpStep && (
          <form onSubmit={signup ? handleSignup : handleLogin} className="space-y-5">

            <div>
              <input
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
                type="email"
                placeholder="Institute Email (@iiti.ac.in)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {signup && (
              <div>
                <input
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
                  type="text"
                  placeholder="Contact Number (10 digits)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            )}

            <button 
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 active:translate-y-1 active:scale-95 active:shadow-inner"
            >
              {signup ? "Sign Up" : "Sign In"}
            </button>

          </form>
        )}


        {otpStep && (
          <form onSubmit={handleVerify} className="space-y-5">

            <div>
              <input
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
                type="number"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-center text-sm text-slate-500 mt-2">Check your email for the OTP.</p>
            </div>

            <button 
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 active:translate-y-1 active:scale-95 active:shadow-inner"
            >
              Verify OTP
            </button>

          </form>
        )}


        {!otpStep && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {signup ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none active:scale-95 active:translate-y-0.5 inline-block"
              onClick={() => setSignup(!signup)}
            >
              {signup ? "Sign in instead" : "Create one now"}
            </button>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl max-w-xs mx-auto shadow-sm">
              <p className="text-sm text-blue-800 font-bold mb-1">Test Account Details</p>
              <p className="text-xs text-blue-700 font-medium tracking-wide">Email: nitya@iiti.ac.in</p>
              <p className="text-xs text-blue-700 font-medium tracking-wide">Password: 123456</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default Login;