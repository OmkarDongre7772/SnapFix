import React, { createContext, useState, useEffect } from "react";
import {
  addUserToDB,
  authenticateUser,
  getReportsByUser,
} from "../DB/db";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userReports, setUserReports] = useState([]);

  // ✅ Load from localStorage on startup (persistent session)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedReports = localStorage.getItem("userReports");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserType(parsedUser.type);
      setIsLoggedIn(true);

      if (storedReports) {
        setUserReports(JSON.parse(storedReports));
      } else {
        loadUserReports(parsedUser.user_id);
      }
    }
  }, []);

  // ✅ Persist user to localStorage when state changes
  useEffect(() => {
    if (isLoggedIn && user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [isLoggedIn, user]);

  // ✅ Persist user reports to localStorage
  useEffect(() => {
    localStorage.setItem("userReports", JSON.stringify(userReports));
  }, [userReports]);

  // ✅ Fetch reports from Dexie
  const loadUserReports = async (user_id) => {
    try {
      const reports = await getReportsByUser(user_id);
      setUserReports(reports);
      localStorage.setItem("userReports", JSON.stringify(reports));
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // ✅ Register user (Dexie)
  const register = async ({ name, email, password, role }) => {
    if (!name || !email || !password) throw new Error("All fields are required");

    const newUser = await addUserToDB({
      type: role,
      email,
      password,
    });

    setUser(newUser);
    setUserType(newUser.type);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(newUser));

    console.log("✅ Registered user:", newUser);
    return newUser;
  };

  // ✅ Login user (Dexie)
  const login = async ({ email, password, role }) => {
    if (!email || !password) throw new Error("Email and password required");

    const existingUser = await authenticateUser(email, password);

    if (role && existingUser.type !== role) {
      throw new Error(`Account exists as ${existingUser.type}, not ${role}.`);
    }

    setUser(existingUser);
    setUserType(existingUser.type);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(existingUser));

    await loadUserReports(existingUser.user_id);

    console.log("✅ Logged in user:", existingUser);
    return existingUser;
  };

  // ✅ Logout user
  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsLoggedIn(false);
    setUserReports([]);
    localStorage.removeItem("user");
    localStorage.removeItem("userReports");
    console.log("🚪 User logged out");
  };

  const value = {
    user,
    userType,
    isLoggedIn,
    userReports,
    login,
    register,
    logout,
    loadUserReports,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
