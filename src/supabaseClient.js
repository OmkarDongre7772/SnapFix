// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ckzllqjsnvbppljaitvl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremxscWpzbnZicHBsamFpdHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzM0NzQsImV4cCI6MjA3NzU0OTQ3NH0.k8CO1GMEZDxA9VhMyNK0pU1VFcgc5uaazno9gLx2t_Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
