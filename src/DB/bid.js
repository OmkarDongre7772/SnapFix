import { supabase } from "./db";

/* 🧱 Centralized Error Handler */
const handleError = (error, context = "") => {
  if (error) {
    console.error(`❌ Supabase Error in ${context}:`, error.message);
    throw new Error(error.message);
  }
};

/* 🎯 Add a new bid */
export const addBidToDB = async (bidData) => {
  if (!bidData.report_id || !bidData.gig_id)
    throw new Error("Missing report_id or gig_id for new bid");

  // Ensure uniqueness: one bid per gig per report
  const { data: existingBid, error: checkError } = await supabase
    .from("bids")
    .select("*")
    .eq("report_id", bidData.report_id)
    .eq("gig_id", bidData.gig_id)
    .maybeSingle();

  handleError(checkError, "addBidToDB - check existing");

  if (existingBid) throw new Error("Bid already exists for this report");

  const newBid = {
    report_id: bidData.report_id,
    gig_id: bidData.gig_id,
    amount: bidData.amount || 0,
    duration: bidData.duration || "",
    note: bidData.note || "",
    status: bidData.status || "pending",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("bids")
    .insert([newBid])
    .select()
    .single();

  handleError(error, "addBidToDB");
  return data;
};

/* 📋 Fetch all bids for a specific report */
export const getBidsByReport = async (report_id) => {
  if (!report_id) throw new Error("Missing report_id in getBidsByReport");

  const { data, error } = await supabase
    .from("bids")
    .select(
      `
      id,
      amount,
      duration,
      note,
      status,
      created_at,
      gig: gig_id (
        id,
        name,
        email,
        role
      )
    `
    )
    .eq("report_id", report_id)
    .order("created_at", { ascending: false });

  handleError(error, "getBidsByReport");
  return data || [];
};

/* 👤 Fetch all bids placed by a specific gig worker */
export const getBidsByGig = async (gig_id) => {
  if (!gig_id) throw new Error("Missing gig_id in getBidsByGig");

  const { data, error } = await supabase
    .from("bids")
    .select(
      `
      id,
      report_id,
      amount,
      duration,
      note,
      status,
      created_at,
      report: report_id (
        id,
        title,
        status,
        category
      )
    `
    )
    .eq("gig_id", gig_id)
    .order("created_at", { ascending: false });

  handleError(error, "getBidsByGig");
  return data || [];
};

/* 🔁 Update bid status or details */
export const updateBidInDB = async (id, updatedFields) => {
  if (!id) throw new Error("Missing bid ID in updateBidInDB");

  const allowedFields = (({ amount, duration, note, status }) => ({
    amount,
    duration,
    note,
    status,
  }))(updatedFields);

  const { data, error } = await supabase
    .from("bids")
    .update(allowedFields)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  handleError(error, "updateBidInDB");
  return data;
};

/* 🗑 Delete a bid */
export const deleteBidFromDB = async (id) => {
  if (!id) throw new Error("Missing bid ID in deleteBidFromDB");

  const { error } = await supabase.from("bids").delete().eq("id", id);
  handleError(error, "deleteBidFromDB");
};
