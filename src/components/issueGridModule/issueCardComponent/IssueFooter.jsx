import React, { useState, useEffect } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { supabase } from "../../../DB/db"; // uses your existing Supabase client
import Bid from "../../biddingModule/Bid";
import BidSection from "../../biddingModule/BidSection";


const IssueFooter = ({ report, user }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(report.upvotes || 0);

  const googleMapsLink = report.location
    ? `https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}`
    : null;

  /* ✅ Check if this user has liked this report */
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user?.id || !report?.id) return;
      const { data, error } = await supabase
        .from("report_upvotes")
        .select("*")
        .eq("report_id", report.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setLiked(true);
    };
    checkIfLiked();
  }, [user?.id, report?.id]);

  /* ✅ Like/Unlike toggle */
  const handleLike = async () => {
    console.log(user);
    if (!user) {
      alert("Please log in to upvote reports.");
      return;
    }

    if (liked) {
      // Unlike (delete row)
      const { error } = await supabase
        .from("report_upvotes")
        .delete()
        .eq("report_id", report.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Error unliking report:", error.message);
        return;
      }

      setLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      // Like (insert row)
      const { error } = await supabase
        .from("report_upvotes")
        .insert([{ report_id: report.id, user_id: user.id }]);

      if (error) {
        console.error("❌ Error liking report:", error.message);
        return;
      }

      setLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  return (
    <div className="flex justify-between items-center pt-2 text-sm sm:text-base">
      {/* ❤️ Like Button */}
      <button
        onClick={handleLike}
        className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-all"
      >
        <Heart
          size={22}
          className={`transition-transform ${
            liked ? "fill-pink-500 text-pink-500 scale-110" : "scale-100"
          }`}
        />
        <span>{likes}</span>
      </button>

      {/* 💼 Bid Section */}
  <BidSection report={report} user={user} />
      

      {/* 🌍 Google Maps Link */}
      {googleMapsLink && (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <ExternalLink size={14} />{" "}
          <span className="hidden sm:inline">View in Maps</span>
        </a>
      )}
    </div>
  );
};

export default IssueFooter;
