import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ckzllqjsnvbppljaitvl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremxscWpzbnZicHBsamFpdHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzM0NzQsImV4cCI6MjA3NzU0OTQ3NH0.k8CO1GMEZDxA9VhMyNK0pU1VFcgc5uaazno9gLx2t_Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* 🧱 Centralized Error Handler */
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

/* 👤 Add new user (manual signup mode) */
export const addUserToDB = async (userData) => {
  const newUser = {
    role: userData.role || "citizen",
    email: userData.email.toLowerCase(),
    password: userData.password || "",
    name: userData.name || "",
    location: userData.location || null,
    created_at: new Date().toISOString(),
  };

  // Check if user already exists
  const { data: existingUser, error: existingError } = await supabase
    .from("users")
    .select("*")
    .eq("email", newUser.email)
    .maybeSingle();

  handleError(existingError, "addUserToDB - check existing");
  if (existingUser) throw new Error("Email already registered");

  // Insert new user
  const { data, error } = await supabase
    .from("users")
    .insert([newUser])
    .select()
    .single();

  handleError(error, "addUserToDB - insert");

  // Add a mirror citizen_id field for convenience
  return { ...data, citizen_id: data.id };
};

/* 🔐 Authenticate user (manual password check) */
export const authenticateUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  handleError(error, "authenticateUser");

  if (!user) throw new Error("User not found");
  if (user.password !== password) throw new Error("Invalid password");

  // Return consistent identity fields
  return { ...user, citizen_id: user.id };
};

/* 📄 Get all reports (for feed) */
export const getAllReports = async () => {
  const { data, error } = await supabase
    .from("reports")
    .select(
      `
      id,
      title,
      description,
      location,
      image,
      upvotes,
      status,
      category,
      created_at,
      citizen_id,
      citizen:citizen_id (
        name,
        email,
        role
      )
    `
    )
    .order("created_at", { ascending: false });

  handleError(error, "getAllReports");
  return data || [];
};

/* 📑 Get reports by specific citizen */
export const getReportsByUser = async (citizen_id) => {
  if (!citizen_id) throw new Error("Missing citizen_id in getReportsByUser");

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("citizen_id", citizen_id)
    .order("created_at", { ascending: false });

  handleError(error, "getReportsByUser");
  return data || [];
};

/* ➕ Add a new report */
export const addReportToDB = async (reportData) => {
  // Fix: auto-detect correct citizen_id from any valid field
  const citizenId =
    reportData.citizen_id || reportData.user_id || reportData.id;

  if (!citizenId)
    throw new Error(
      "Missing citizen_id: user must be logged in to submit a report."
    );

  const newReport = {
    title: reportData.title || "Untitled Report",
    description: reportData.description || "No description provided.",
    location: reportData.location || null,
    image: reportData.image || null,
    upvotes: reportData.upvotes ?? 0,
    status: reportData.status || "open",
    category: reportData.category || null,
    citizen_id: citizenId,
    created_at: new Date().toISOString(),
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
  if (!id) throw new Error("Missing report ID in updateReportInDB");

  const allowedFields = (({
    title,
    description,
    location,
    image,
    upvotes,
    status,
    category,
  }) => ({
    title,
    description,
    location,
    image,
    upvotes,
    status,
    category,
  }))(updatedFields);

  const { data, error } = await supabase
    .from("reports")
    .update(allowedFields)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  handleError(error, "updateReportInDB");
  return data;
};

/* 🗑 Delete report */
export const deleteReportFromDB = async (id) => {
  if (!id) throw new Error("Missing report ID in deleteReportFromDB");

  const { error } = await supabase.from("reports").delete().eq("id", id);
  handleError(error, "deleteReportFromDB");
};
