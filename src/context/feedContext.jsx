import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getAllReports,
  // addReportToDB,
  updateReportInDB,
  deleteReportFromDB,
} from "../DB/db"; // these functions are now Supabase based

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feedReports, setFeedReports] = useState([]);

  // ✅ Load all reports on mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        const reports = await getAllReports();
        setFeedReports(reports || []);
      } catch (err) {
        console.error("Error loading feed reports:", err);
      }
    };
    loadReports();
  }, []);

  // ✅ Add a new report (DB + state)
  // const addReport = useCallback(async (newReport) => {
  //   try {
  //     const saved = await addReportToDB(newReport); // inserts into Supabase
  //     setFeedReports((prev) => {
  //       const exists = prev.some((r) => r.id === saved.id);
  //       if (exists) return prev;
  //       return [saved, ...prev];
  //     });
  //   } catch (err) {
  //     console.error("Error adding report:", err.message);
  //   }
  // }, []);

  // ✅ Remove a report (DB + state)
  const removeReport = useCallback(async (id) => {
    try {
      await deleteReportFromDB(id); // delete from Supabase
      setFeedReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting report:", err.message);
    }
  }, []);

  // ✅ Update a report (DB + state)
  const updateReport = useCallback(async (id, updatedFields) => {
    try {
      const updated = await updateReportInDB(id, updatedFields); // update in Supabase
      setFeedReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
    } catch (err) {
      console.error("Error updating report:", err.message);
    }
  }, []);

  return (
    <FeedContext.Provider
      value={{
        feedReports,
        // addReport,
        removeReport,
        updateReport,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
