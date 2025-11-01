import React, { useContext } from "react";
import { ReportContext } from "../../context/reportContext";
import ImageUpload from "./ImageUpload";
import LocationPicker from "./LocationPicker";

const ReportForm = () => {
  const {
    currentReport,
    handleInputChange,
    handleImageUpload,
    detectLocation,
    handleManualLocationSelect,
    submitReport,
    loading,
  } = useContext(ReportContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitReport();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 to-black text-white p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Report an Issue</h2>
        <p className="text-sm text-gray-300 mb-6 text-center">
          Capture an image, describe the issue, and select or auto-detect your location.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <ImageUpload
            image={currentReport.image}
            previewImage={currentReport.previewImage}
            handleImageUpload={handleImageUpload}
          />

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={currentReport.title}
            onChange={handleInputChange}
            className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={currentReport.description}
            onChange={handleInputChange}
            className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            required
          />

          <LocationPicker
            location={currentReport.location}
            detectLocation={detectLocation}
            onLocationSelect={handleManualLocationSelect}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
