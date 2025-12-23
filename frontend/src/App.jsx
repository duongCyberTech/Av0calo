import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import WriteReview from "./pages/WriteReview";
import Subscription from "./pages/Subscription";
import SubscriptionCart from "./pages/SubscriptionCart";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
import SubSuccess from "./pages/SubSuccess";
import Signup from "./pages/Signup";
import OtpSignUp from "./pages/OtpSignUp";
import SignupSuccess from "./pages/SignupSuccess";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import OTPForgotPass from "./pages/OTPForgotPass";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import CommentAnalysis from "./pages/CommentAnalysis";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ResetSuccess from "./pages/ResetSuccess";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:pid" element={<ProductDetail />} />
        <Route path="/product/:pid/review" element={<WriteReview />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/subscription-cart" element={<SubscriptionCart />} />
        <Route path="/subscription-checkout" element={<SubscriptionCheckout />} />
        <Route path="/subsuccess" element={<SubSuccess />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/send-otp-forgotpass" element={<OTPForgotPass />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/otp-signup" element={<OtpSignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/comment-analysis" element={<CommentAnalysis />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
