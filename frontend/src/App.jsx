import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VendorAuth from "./pages/VendorAuth";
import VendorDashBoard from "./pages/VendorDashBoard"
import Register from "./components/VendorRegister/Register"
import EventPlanning from "./pages/EventPlanning";
import AIRecommendations from "./pages/AIRecommendations";
import Services from "./pages/Services";
import FileUploadTest from "./components/FileUploadTest";
import Admin from "./pages/Admin";
import VendorUsers from "./pages/VendorUsers";
import VendorUsersList from "./pages/VendorUsersList";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDetails from "./components/VendorDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThankYou from "./components/ThankYou";
import VendorProfile from "./components/VendorProfile";
import CustomerDashBoard from "./pages/customer/CustomerDashBoard";
import VendorUserForm from "./components/VendorUserForm";




function App() {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  console.log(authUser);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor-auth" element={<VendorAuth />} />
        <Route path="/:userId/vendor-dashboard" element={<VendorDashBoard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event-planning" element={<EventPlanning />} />
        <Route path="/services" element={<Services />} />
        <Route path="/recommendations" element={<AIRecommendations />} />
        <Route path="/test-upload" element={<FileUploadTest />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/vendors/:id" element={<VendorDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/vendor-users" element={<VendorUsersList />} />
        <Route path="/admin/vendor-users/:vendorId" element={<VendorUsers />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/vendor-profile" element={<VendorProfile userId={authUser?.id} />} />
        <Route path="/vendor/:userId/profile" element={<VendorProfile />} />
        <Route path="/customer" element={<CustomerDashBoard />} />
        <Route path="/vendor-auth/forgot-password/:email" element={<VendorUserForm />} />

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </Router>
  );
}

export default App;
