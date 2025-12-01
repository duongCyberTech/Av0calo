import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Subscription from "./pages/Subscription";
import Signup from "./components/Signup";
import OtpSignUp from "./components/OtpSignUp";
import SignupSuccess from "./components/SignupSuccess";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-signup" element={<OtpSignUp />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
