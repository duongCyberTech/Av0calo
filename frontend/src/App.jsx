import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Subscription from "./pages/Subscription";
import Signup from "./pages/Signup";
import OtpSignUp from "./pages/OtpSignUp";
import SignupSuccess from "./pages/SignupSuccess";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import OTPForgotPass from "./pages/OTPForgotPass";
import Profile from "./pages/Profile";
import CommentAnalysis from "./pages/CommentAnalysis";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/send-otp-forgotpass" element={<OTPForgotPass />} />
        <Route path="/otp-signup" element={<OtpSignUp />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/comment-analysis" element={<CommentAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
