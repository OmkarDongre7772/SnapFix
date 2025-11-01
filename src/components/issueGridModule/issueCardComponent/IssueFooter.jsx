import React, { useState } from "react";
import { Heart, ExternalLink } from "lucide-react";

const IssueFooter = ({ location }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));

  const googleMapsLink = location
    ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : null;

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
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
