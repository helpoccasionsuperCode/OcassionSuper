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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThankYou from "./components/ThankYou";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor-auth" element={<VendorAuth/>} />
        <Route path="/vendor" element={<VendorDashBoard/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/event-planning" element={<EventPlanning />} />
        <Route path="/services" element={<Services />} />
        <Route path="/recommendations" element={<AIRecommendations />} />
        <Route path="/test-upload" element={<FileUploadTest />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/vendor-users" element={<VendorUsersList />} />
        <Route path="/admin/vendor-users/:vendorId" element={<VendorUsers />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </Router>
  );
}

export default App;
