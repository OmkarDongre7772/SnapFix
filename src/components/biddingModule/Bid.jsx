import React, { useState, useEffect } from "react";
import { addBidToDB } from "../../DB/bid"; // ✅ Using centralized bid.js functions

const Bid = ({ reportId, gigId, existingBid = null, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState(existingBid?.amount || "");
  const [duration, setDuration] = useState(existingBid?.duration || "");
  const [note, setNote] = useState(existingBid?.note || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingBid) {
      setAmount(existingBid.amount || "");
      setDuration(existingBid.duration || "");
      setNote(existingBid.note || "");
    }
  }, [existingBid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportId || !gigId) {
      alert("Missing report or gig ID.");
      return;
    }

    setLoading(true);

    try {
      const bidData = {
        amount: parseFloat(amount),
        duration,
        note,
      };

      if (existingBid && onSubmit) {
        // ✅ Update existing bid
        await onSubmit(bidData);
        alert("✅ Bid updated successfully!");
      } else {
        // ✅ Add new bid
        await addBidToDB({
          report_id: reportId,
          gig_id: gigId,
          ...bidData,
        });
        alert("✅ Bid submitted successfully!");
        setAmount("");
        setDuration("");
        setNote("");
      }
    } catch (error) {
      console.error("❌ Error submitting bid:", error.message);
      alert(error.message || "Failed to submit bid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ Fullscreen overlay for consistent popup behavior
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-gray-900 backdrop-blur-sm border border-white/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl transition-transform transform hover:scale-[1.01] duration-300 text-white">
        {/* ✅ Close Button (works for both new and update modes) */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl font-bold transition-all"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          {existingBid ? "Update Your Bid" : "Place Your Bid"}
        </h2>
        <p className="text-sm text-gray-300 mb-6 text-center">
          {existingBid
            ? "Modify your bid details below and save your changes."
            : "Enter your bid amount, expected duration, and an optional note."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Input */}
          <input
            type="number"
            placeholder="Bid Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            required
          />

          {/* Duration Input */}
          <input
            type="text"
            placeholder="Expected Duration (e.g., 3 days)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            required
          />

          {/* Note Input */}
          <textarea
            placeholder="Add a note (optional)"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-all duration-300"
          />

          {/* Buttons */}
          <div
            className={`flex ${
              existingBid ? "justify-between" : "justify-center"
            } items-center gap-4`}
          >
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? existingBid
                  ? "Saving..."
                  : "Submitting..."
                : existingBid
                ? "Save Changes"
                : "Submit Bid"}
            </button>

            {/* Cancel Button (only in update mode) */}
            {existingBid && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all font-medium text-white shadow-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bid;
