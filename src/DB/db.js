import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ckzllqjsnvbppljaitvl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremxscWpzbnZicHBsamFpdHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzM0NzQsImV4cCI6MjA3NzU0OTQ3NH0.k8CO1GMEZDxA9VhMyNK0pU1VFcgc5uaazno9gLx2t_Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* 🧩 Centralized Error Handler */
const handleError = (error, context = "") => {
  if (error) {
    console.error(`❌ Supabase Error in ${context}:`, error.message);
    throw new Error(error.message);
  }
};

/* 🖼 Upload image to Supabase Storage (returns public URL) */
export const uploadImageToSupabase = async (file) => {
  if (!file) return null;
  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("report-images")
    .upload(fileName, file, { upsert: false });

  handleError(uploadError, "uploadImageToSupabase");

  const { data: publicUrlData } = supabase.storage
    .from("report-images")
    .getPublicUrl(fileName);

  return publicUrlData?.publicUrl || null;
};

/* 👤 Add new user */
export const addUserToDB = async (userData) => {
  const newUser = {
    type: userData.type || "citizen",
    email: userData.email.toLowerCase(),
    password: userData.password || "",
  };

  const { data: existingUser, error: existingError } = await supabase
    .from("users")
    .select("*")
    .eq("email", newUser.email)
    .maybeSingle();

  handleError(existingError, "addUserToDB check existing");
  if (existingUser) throw new Error("Email already registered");

  const { data, error } = await supabase
    .from("users")
    .insert([newUser])
    .select()
    .single();

  handleError(error, "addUserToDB insert");
  return data;
};

/* 🔐 Authenticate user */
export const authenticateUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  handleError(error, "authenticateUser");
  if (!user) throw new Error("User not found");
  if (user.password !== password) throw new Error("Invalid password");

  return user;
};

/* 📄 Get all reports (newest first) */
export const getAllReports = async () => {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  handleError(error, "getAllReports");
  return data || [];
};

/* 📑 Get reports by specific user */
export const getReportsByUser = async (user_id) => {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  handleError(error, "getReportsByUser");
  return data || [];
};

/* ➕ Add a new report */
export const addReportToDB = async (reportData) => {
  const newReport = {
    title: reportData.title || "Untitled Report",
    description: reportData.description || "No description provided.",
    location: reportData.location || "",
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

  handleError(error, "addReportToDB");
  return data;
};

/* 🔁 Update report */
export const updateReportInDB = async (id, updatedFields) => {
  const { data, error } = await supabase
    .from("reports")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  handleError(error, "updateReportInDB");
  return data;
};

/* 🗑 Delete report */
export const deleteReportFromDB = async (id) => {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  handleError(error, "deleteReportFromDB");
};
