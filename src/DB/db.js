// src/DB/db.js
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client
const supabaseUrl = "https://ckzllqjsnvbppljaitvl.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremxscWpzbnZicHBsamFpdHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzM0NzQsImV4cCI6MjA3NzU0OTQ3NH0.k8CO1GMEZDxA9VhMyNK0pU1VFcgc5uaazno9gLx2t_Q"; // Replace with your public anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🧩 Utility: centralized error handler
const handleError = (error, context = "") => {
  if (error && error.message) {
    console.error(`❌ Supabase Error in ${context}:`, error.message);
    throw new Error(error.message);
  }
};

// ✅ Add new user (prevent duplicates)
export const addUserToDB = async (userData) => {
  const newUser = {
    type: userData.type || "citizen",
    email: userData.email.toLowerCase(),
    password: userData.password || "",
  };

  // Check for existing user
  const { data: existingUser, error: existingError } = await supabase
    .from("users")
    .select("*")
    .eq("email", newUser.email)
    .maybeSingle();

  if (existingError) handleError(existingError, "addUserToDB");
  if (existingUser) throw new Error("Email already registered");

  // Add new user
  const { data, error } = await supabase
    .from("users")
    .insert([newUser])
    .select()
    .single();

  if (error) handleError(error, "addUserToDB");
  return data;
};

// ✅ Authenticate existing user
export const authenticateUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) handleError(error, "authenticateUser");
  if (!user) throw new Error("User not found");
  if (user.password !== password) throw new Error("Invalid password");

  return user;
};

// ✅ Fetch all reports
export const getAllReports = async () => {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("id", { ascending: false }); // use id to stay aligned with old Dexie logic

  if (error) handleError(error, "getAllReports");
  return data || [];
};

// ✅ Fetch reports by user_id
export const getReportsByUser = async (user_id) => {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user_id)
    .order("id", { ascending: false });

  if (error) handleError(error, "getReportsByUser");
  return data || [];
};

// ✅ Add new report
export const addReportToDB = async (reportData) => {
  const newReport = {
    title: reportData.title || "Untitled Report",
    description: reportData.description || "No description provided.",
    location: reportData.location || null,
    image: reportData.image || null,
    upvotes: reportData.upvotes ?? 0,
    bids: reportData.bids ?? 0,
    status: reportData.status || "pending",
    user_id: reportData.user_id ?? null,
  };

  const { data, error } = await supabase
    .from("reports")
    .insert([newReport])
    .select()
    .single();

  if (error) handleError(error, "addReportToDB");
  return data;
};

// ✅ Update a report
export const updateReportInDB = async (id, updatedFields) => {
  const { data, error } = await supabase
    .from("reports")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) handleError(error, "updateReportInDB");
  return data;
};

// ✅ Delete a report
export const deleteReportFromDB = async (id) => {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) handleError(error, "deleteReportFromDB");
};
