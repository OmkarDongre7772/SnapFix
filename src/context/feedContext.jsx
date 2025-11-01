import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  db,
  getAllReports,
  addReportToDB,
  updateReportInDB,
  deleteReportFromDB,
} from "../DB/db";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feedReports, setFeedReports] = useState([]);

  // ✅ Load all reports from IndexedDB on mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        const reports = await getAllReports();
        setFeedReports(reports);
      } catch (err) {
        console.error("Error loading feed reports:", err);
      }
    };
    loadReports();
  }, []);

  // ✅ Add a new report to DB + feed
  const addReport = useCallback(async (newReport) => {
    try {
      const saved = await addReportToDB(newReport);
      setFeedReports((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Error adding report:", err);
    }
  }, []);

  // ✅ Remove a report (from DB + state)
  const removeReport = useCallback(async (id) => {
    try {
      await deleteReportFromDB(id);
      setFeedReports((prev) => prev.filter((report) => report.id !== id));
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  }, []);

  // ✅ Update a report (both DB + state)
  const updateReport = useCallback(async (id, updatedFields) => {
    try {
      await updateReportInDB(id, updatedFields);
      setFeedReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
      );
    } catch (err) {
      console.error("Error updating report:", err);
    }
  }, []);

  return (
    <FeedContext.Provider
      value={{
        feedReports,
        addReport,
        removeReport,
        updateReport,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
