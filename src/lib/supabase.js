import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://muhubssjyqzjvmilehzw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aHVic3NqeXF6anZtaWxlaHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzI5MDksImV4cCI6MjA4NDI0ODkwOX0.8yN_crGVHfsUpKM-vl9AsoS9r03xFTw5bRpsAqhvwUA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
