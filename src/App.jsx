import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import { ReportProvider } from "./context/reportContext"; // 🆕 Added for report management
import "leaflet/dist/leaflet.css";

// Global components
import Navbar from "./components/global_components/Navbars/Navbar";
import Footer from "./components/global_components/Footer";
import CitizenNavbar from "./components/global_components/Navbars/CitizenNavbar"; // 🆕 For citizen-specific navigation

// Pages
import HomePage from "./pages/HomePage";
import CitizenPage from "./pages/CitizenPage";
import MyReports from "./components/reportingModule/MyReports"; // 🆕
import ReportForm from "./components/reportingModule/ReportForm"; // 🆕
import AuthenticationWindow from "./components/loginModule/AuthenticationWindow";
import ReportFeed from "./components/reportingModule/ReportFeed";
// import GigWorkerPage from "./pages/GigWorkerPage";
// import GovernmentPage from "./pages/GovernmentPage";

function App() {
  return (
    <UserProvider>
      <ReportProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* Global Navbar only on non-citizen routes */}
            <Routes>
              <Route path="/citizen/*" element={<CitizenNavbar />} />
              <Route path="*" element={<Navbar />} />
            </Routes>

            <main className="grow">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/auth"
                  element={
                    <AuthenticationWindow
                      showLoginModal={true}
                      setShowLoginModal={() => {}}
                    />
                  }
                />

                {/* Citizen Routes */}
                <Route path="/citizen" element={<CitizenPage />} />
                <Route path="/citizen/my-reports" element={<MyReports />} />
                <Route path="/citizen/report-issue" element={<ReportForm />} />
                <Route path="/citizen/reports-feed" element={<ReportFeed />} />

                {/* Future routes */}
                {/* <Route path="/gigworker" element={<GigWorkerPage />} /> */}
                {/* <Route path="/government" element={<GovernmentPage />} /> */}
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </ReportProvider>
    </UserProvider>
  );
}

export default App;
