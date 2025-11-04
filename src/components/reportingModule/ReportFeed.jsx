import React, { useContext, useEffect, useState } from "react";
import { FeedContext } from "../../context/feedContext";
import IssueGrid from "../issueGridModule/IssueGrid";
import GigNavbar from "../global_components/Navbars/GigNavbar";

const ReportFeed = () => {
  const { feedReports } = useContext(FeedContext);
  const [reports, setReports] = useState(feedReports);

  // 🔄 Dynamically update when feedReports change in context
  useEffect(() => {
    setReports(feedReports);
  }, [feedReports]);

  return (
    <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 md:px-8 transition-all">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
          Reports Feed
        </h1>

        {reports.length > 0 ? (
          <IssueGrid reports={reports} />
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600 dark:text-gray-300 transition-all">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
              alt="No Reports"
              className="w-32 h-32 opacity-80 mb-4"
            />
            <p className="text-lg font-medium">No issues reported yet.</p>
            <p className="text-sm text-gray-500">
              Be the first to report a civic issue in your area.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ReportFeed;
