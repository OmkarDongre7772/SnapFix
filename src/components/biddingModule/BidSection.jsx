import React, { useState, useEffect } from "react";
import { supabase } from "../../DB/db";
import Bid from "../biddingModule/Bid";
// import Assign from "../biddingModule/Assign"; // create later similar to Bid.jsx

const BidSection = ({ report, user }) => {
  const [bidCount, setBidCount] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // ✅ Fetch total bids for this report
  useEffect(() => {
    const fetchBidCount = async () => {
      if (!report?.id) return;
      const { count, error } = await supabase
        .from("bids")
        .select("*", { count: "exact", head: true })
        .eq("report_id", report.id);

      if (!error) setBidCount(count || 0);
    };

    fetchBidCount();
  }, [report?.id]);

  if (!user?.role) return null;

  return (
    <div className="flex items-center gap-4">
      {/* ✅ GIG WORKER SECTION */}
      {user.role === "gigworker" && (
        <>
          <button
            onClick={() => setShowBidModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow-md transition-all"
          >
            Bid Now
          </button>

          {/* ✅ Modal Render */}
          {showBidModal && (
            <Bid
              reportId={report?.id}
              gigId={user?.id}
              onCancel={() => setShowBidModal(false)} // ✅ Proper prop for Bid.jsx
            />
          )}
        </>
      )}

      {/* ✅ GOVERNMENT SECTION (Assign functionality later) */}
      {user.role === "government" && (
        <>
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm shadow-md transition-all"
          >
            Assign
          </button>

          {/* Modal placeholder (for Assign.jsx) */}
          {showAssignModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="relative bg-white/10 p-6 rounded-2xl border border-white/20 text-white">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="absolute top-2 right-3 text-white text-lg"
                >
                  ✕
                </button>
                <p className="text-center text-gray-300">
                  Assign module coming soon...
                </p>
                {/* <Assign
                  reportId={report?.id}
                  onClose={() => setShowAssignModal(false)}
                /> */}
              </div>
            </div>
          )}
        </>
      )}

      {/* ✅ CITIZEN SECTION */}
      {user.role === "citizen" && (
        <p className="text-gray-400 text-sm">Bids: {bidCount}</p>
      )}
    </div>
  );
};

export default BidSection;
