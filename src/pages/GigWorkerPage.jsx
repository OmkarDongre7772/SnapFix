import React from "react";
import ReportFeed from "../components/reportingModule/ReportFeed";
import GigNavbar from "../components/global_components/Navbars/GigNavbar";

const GigWorkerPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-900 to-black text-white">

      <GigNavbar/>
      {/* Main Content */}
      <main className="grow flex justify-center items-center p-6">
        <ReportFeed />
      </main>
    </div>
  );
};

export default GigWorkerPage;
