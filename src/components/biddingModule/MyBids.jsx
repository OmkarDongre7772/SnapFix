import React, { useContext, useEffect, useState } from "react";
import { getBidsByGig, deleteBidFromDB, updateBidInDB } from "../../DB/bid";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { UserContext } from "../../context/userContext";
import GigNavbar from "../global_components/Navbars/GigNavbar";
import Bid from "../biddingModule/Bid"; // ✅ Reusing your Bid component

const MyBids = () => {
  const { user } = useContext(UserContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBid, setEditingBid] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBids = async () => {
      try {
        setLoading(true);
        const data = await getBidsByGig(user.id);
        setBids(data);
      } catch (error) {
        console.error("❌ Failed to fetch bids:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [user?.id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bid?")) return;
    try {
      await deleteBidFromDB(id);
      setBids((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      alert("Failed to delete bid.");
    }
  };

  // 🔄 Handle saving the updated bid using updateBidInDB()
  const handleBidUpdate = async (bidId, bidData) => {
    try {
      await updateBidInDB(bidId, bidData);
      setBids((prev) =>
        prev.map((b) =>
          b.id === bidId ? { ...b, ...bidData } : b
        )
      );
      setEditingBid(null);
      alert("✅ Bid updated successfully!");
    } catch (error) {
      alert("Failed to update bid.");
    }
  };

  return (
    <>
      <GigNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-6xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">My Bids</h1>
          <p className="text-sm text-gray-300 mb-8 text-center">
            View and manage all your placed bids across reports.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-indigo-400" size={28} />
              <span className="ml-3 text-gray-300">Loading your bids...</span>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p>You haven’t placed any bids yet.</p>
            </div>
          ) : editingBid ? (
            // ✅ Use Bid.jsx for editing mode
            <div className="w-full flex justify-center items-center">
              <Bid
                reportId={editingBid.report_id}
                gigId={user.id}
                existingBid={editingBid}
                onSubmit={async (updatedData) => {
                  await handleBidUpdate(editingBid.id, updatedData);
                }}
                onCancel={() => setEditingBid(null)}
              />
            </div>
          ) : (
            // 📋 Display all bids normally
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
                >
                  {/* 🧾 Report Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {bid.report?.title || "Untitled Report"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Category: {bid.report?.category || "N/A"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Report Status:{" "}
                      <span
                        className={`${
                          bid.report?.status === "resolved"
                            ? "text-green-400"
                            : bid.report?.status === "in_progress"
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        {bid.report?.status || "Pending"}
                      </span>
                    </p>
                  </div>

                  {/* 💰 Bid Details */}
                  <div className="text-gray-300 space-y-2">
                    <p>
                      💰{" "}
                      <span className="text-indigo-300 font-semibold">
                        ₹{bid.amount}
                      </span>
                    </p>
                    <p>⏱ Duration: {bid.duration}</p>
                    {bid.note && (
                      <p className="text-sm italic text-gray-400">
                        📝 “{bid.note}”
                      </p>
                    )}
                    <p>
                      📅 Placed{" "}
                      <span className="text-indigo-300">
                        {formatDistanceToNow(new Date(bid.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </p>
                    <p>
                      ⚙️ Status:{" "}
                      <span
                        className={`font-semibold ${
                          bid.status === "approved"
                            ? "text-green-400"
                            : bid.status === "rejected"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </p>

                    {/* ✏️ Edit / Delete Buttons */}
                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        onClick={() => setEditingBid(bid)}
                        className="text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(bid.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBids;
