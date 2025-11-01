import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { FeedContext } from "./feedContext";
import { UserContext } from "./userContext";
import {
  addReportToDB,
  getReportsByUser,
  getAllReports,
} from "../DB/db";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState({
    image: null,
    title: "",
    description: "",
    location: null,
    previewImage: null,
    mapPreview: null,
  });
  const [loading, setLoading] = useState(false);

  const { addReport: addToFeed } = useContext(FeedContext);
  const { user, isLoggedIn } = useContext(UserContext);

  // ✅ Load all reports (for global view)
  useEffect(() => {
    const loadReports = async () => {
      try {
        const storedReports = await getAllReports();
        setReports(storedReports);
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    };
    loadReports();
  }, []);

  // ✅ Keep feed context updated dynamically
  useEffect(() => {
    if (addToFeed && reports.length > 0) {
      reports.forEach((r) => addToFeed(r));
    }
  }, [reports, addToFeed]);

  // 📍 Detect location
  const detectLocation = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const mapURL = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
            const loc = { latitude, longitude, mapURL };

            setCurrentReport((prev) => ({
              ...prev,
              location: loc,
              mapPreview: mapURL,
            }));

            resolve(loc);
          },
          (err) => reject(err.message)
        );
      }
    });
  }, []);

  // 📍 Manual pin selection
  const handleManualLocationSelect = useCallback((coords) => {
    const { latitude, longitude } = coords;
    const mapURL = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;

    setCurrentReport((prev) => ({
      ...prev,
      location: { latitude, longitude },
      mapPreview: mapURL,
    }));
  }, []);

  // 🖼️ Image upload
  const handleImageUpload = useCallback((file) => {
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setCurrentReport((prev) => ({
        ...prev,
        image: file,
        previewImage: previewURL,
      }));
    }
  }, []);

  // ✍️ Input change
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentReport((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 🚀 Submit report (with DB persistence + live feed)
  const submitReport = useCallback(async () => {
    setLoading(true);
    try {
      if (
        !currentReport.title ||
        !currentReport.description ||
        !currentReport.location
      ) {
        alert("Please fill all fields and enable location access.");
        return;
      }

      const reportData = {
        ...currentReport,
        user_id: isLoggedIn && user ? user.user_id : 0,
        upvotes: 0,
        bids: 0,
        status: "pending",
      };

      const savedReport = await addReportToDB(reportData);

      // ✅ Update in-memory reports + feed instantly
      setReports((prev) => [savedReport, ...prev]);
      if (addToFeed) addToFeed(savedReport);

      alert("Report submitted successfully!");

      setCurrentReport({
        image: null,
        title: "",
        description: "",
        location: null,
        previewImage: null,
        mapPreview: null,
      });
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report. Try again.");
    } finally {
      setLoading(false);
    }
  }, [currentReport, user, isLoggedIn, addToFeed]);

  // 🔄 Load reports for logged-in user
  const loadUserReports = useCallback(async () => {
    if (user && user.user_id) {
      const userReports = await getReportsByUser(user.user_id);
      setReports(userReports);
    }
  }, [user]);

  // 🔄 Reset report form manually
  const resetReportForm = useCallback(() => {
    setCurrentReport({
      image: null,
      title: "",
      description: "",
      location: null,
      previewImage: null,
      mapPreview: null,
    });
  }, []);

  return (
    <ReportContext.Provider
      value={{
        reports,
        currentReport,
        loading,
        handleInputChange,
        handleImageUpload,
        detectLocation,
        handleManualLocationSelect,
        submitReport,
        resetReportForm,
        loadUserReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
