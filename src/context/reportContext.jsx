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
  uploadImageToSupabase,
} from "../DB/db";

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  // Add this new state
const [userReports, setUserReports] = useState([]);

  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState({
    image: null,
    title: "",
    description: "",
    location: null,
    upvotes:0,
    bids:0,
    status:"pending",
    user_id:null
  });
  const [loading, setLoading] = useState(false);

  const { addReport: addToFeed } = useContext(FeedContext);
  const { user, isLoggedIn } = useContext(UserContext);

  // Load all reports
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

  // Sync with feed
  useEffect(() => {
    if (addToFeed && reports.length > 0) {
      reports.forEach((r) => addToFeed(r));
    }
  }, [reports, addToFeed]);

  // Detect location
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

  // Manual pin select
  const handleManualLocationSelect = useCallback((coords) => {
    const { latitude, longitude } = coords;
    const mapURL = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;

    setCurrentReport((prev) => ({
      ...prev,
      location: { latitude, longitude },
      mapPreview: mapURL,
    }));
  }, []);

  // Image upload (preview)
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

  // Input change
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentReport((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Submit report
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

      let imageUrl = null;
      if (currentReport.image instanceof File) {
        imageUrl = await uploadImageToSupabase(currentReport.image);
      }

      const reportData = {
        ...currentReport,
        image: imageUrl || currentReport.image || null,
        user_id: (isLoggedIn && user && user.id) ? user.id : null,
        upvotes: 0,
        bids: 0,
        status: "pending",
      };
      console.log(reportData);

      const savedReport = await addReportToDB(reportData);

      setReports((prev) => [savedReport, ...prev]);
      if (addToFeed) addToFeed(savedReport);

      alert("Report submitted successfully!");

      setCurrentReport({
        image: null,
    title: "",
    description: "",
    location: null,
    upvotes:0,
    bids:0,
    status:"pending",
    user_id:null
      });
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report. Try again.");
    } finally {
      setLoading(false);
    }
  }, [currentReport, user, isLoggedIn, addToFeed]);

  // Load user reports
const loadUserReports = useCallback(async () => {
  if (user && user.id) {
    try {
      const reports = await getReportsByUser(user.id);
      setUserReports(reports || []);
    } catch (err) {
      console.error("Error fetching user reports:", err);
    }
  }
}, [user]);


useEffect(() => {
  if (isLoggedIn && user) {
    loadUserReports();
  }
}, [isLoggedIn, user, loadUserReports]);


  // Reset form
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
        userReports, 
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
