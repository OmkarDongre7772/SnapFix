import React, { useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { updateReportInDB } from "../../../DB/db";

const IssueFooter = ({ report }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(report.bids);

  const googleMapsLink = report.location
    ? `https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}`
    : null;

  const handleLike = async () => {
  const newLikes = liked ? report.bids - 1 : report.bids + 1;
  setLiked(!liked);
  setLikes(newLikes);

  await updateReportInDB(report.id, { bids: newLikes }); // ✅ send only the field that changes
};


  return (
    <div className="flex justify-between items-center pt-2 text-sm sm:text-base">
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

      {googleMapsLink && (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <ExternalLink size={14} /> <span className="hidden sm:inline">View in Maps</span>
        </a>
      )}
    </div>
  );
};

export default IssueFooter;
