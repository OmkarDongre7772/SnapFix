import React, { useState } from "react";
import IssueHeader from "./IssueHeader";
import IssueImage from "./IssueImage";
import IssueFooter from "./IssueFooter";
import IssueMapPreview from "./IssueMapPreview";

const IssueCard = ({ report }) => {
  if (!report) return null;

  const {
    title,
    description,
    image,
    mapPreview,
    location,
    date,
    status = "Pending",
  } = report;

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="
        bg-[#121212] 
        rounded-2xl 
        border border-gray-800 
        overflow-hidden 
        shadow-lg 
        mx-auto 
        mb-8 
        transition-all 
        hover:shadow-2xl 
        w-full
        max-w-[95%] 
        sm:max-w-sm 
        md:max-w-md 
        lg:max-w-lg
      "
    >
      <IssueHeader
        title={title}
        date={date}
        expanded={expanded}
        setExpanded={setExpanded}
      />

      <IssueImage title={title} image={image} location={location} status={status} />

      <div className="px-4 pt-3 pb-2 text-gray-200 text-sm sm:text-base">
        <p className="leading-relaxed wrap-break-word">
          {description || "No description provided."}
        </p>
      </div>

      <div className="px-4 pb-4">
        <IssueFooter location={location} mapPreview={mapPreview} />
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <IssueMapPreview location={location} mapPreview={mapPreview} />
        </div>
      )}
    </div>
  );
};

export default IssueCard;
