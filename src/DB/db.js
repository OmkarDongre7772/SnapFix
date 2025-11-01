import Dexie from "dexie";

// ✅ Create Dexie database
export const db = new Dexie("CivicAppDB");

// ✅ Define tables
db.version(1).stores({
  reports:
    "++id, title, description, location, image, upvotes, bids, status, user_id",
  users: "++user_id, type, email, password",
});

// ✅ Add a new user (prevent duplicates)
export const addUserToDB = async (userData) => {
  const newUser = {
    type: userData.type || "citizen",
    email: userData.email.toLowerCase(),
    password: userData.password || "",
  };

  const existingUser = await db.users.where("email").equals(newUser.email).first();
  if (existingUser) throw new Error("Email already registered");

  const user_id = await db.users.add(newUser);
  return { user_id, ...newUser };
};

// ✅ Authenticate existing user
export const authenticateUser = async (email, password) => {
  const user = await db.users.where("email").equals(email.toLowerCase()).first();

  if (!user) throw new Error("User not found");
  if (user.password !== password) throw new Error("Invalid password");

  return user;
};

// ✅ Fetch all reports
export const getAllReports = async () => {
  const reports = await db.reports.toArray();
  return reports.sort((a, b) => b.id - a.id);
};

// ✅ Fetch reports by user_id
export const getReportsByUser = async (user_id) => {
  return await db.reports.where("user_id").equals(user_id).toArray();
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
    user_id: reportData.user_id ?? 0,
    date: new Date().toLocaleString(),
  };

  const id = await db.reports.add(newReport);
  return { id, ...newReport };
};

// ✅ Update & delete reports
export const updateReportInDB = async (id, updatedFields) => {
  await db.reports.update(id, updatedFields);
};

export const deleteReportFromDB = async (id) => {
  await db.reports.delete(id);
};
