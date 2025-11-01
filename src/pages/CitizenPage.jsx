import React from "react";
import CitizenNavbar from "../components/global_components/Navbars/CitizenNavbar";
import ReportForm from "../components/reportingModule/ReportForm";

const CitizenPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-900 to-black text-white">
      {/* Navbar */}
      <CitizenNavbar />

      {/* Main Content */}
      <main className="grow flex justify-center items-center p-6">
        <ReportForm />
      </main>

    </div>
  );
};

export default CitizenPage;
