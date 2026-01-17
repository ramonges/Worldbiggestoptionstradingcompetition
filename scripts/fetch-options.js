import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ALPHA_VANTAGE_API_KEY) {
  throw new Error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ALPHA_VANTAGE_API_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const symbols = [
  "SPY",
  "QQQ",
  "DIA",
  "USO",
  "BNO",
  "UNG",
  "GLD",
  "SLV",
  "WEAT",
  "CORN",
  "MSFT",
  "ORCL",
  "CRM",
  "NVDA",
  "AMD",
  "AAPL",
  "GOOGL",
  "META",
  "BA",
  "LMT",
  "CAT",
  "GE",
  "PFE",
  "JNJ",
  "MRK",
  "WMT",
  "AMZN",
  "TSLA",
  "NKE",
  "LULU",
];

const normalizeOption = (symbol, raw) => {
  return {
    contract_id: raw.contract || raw.contract_id,
    symbol,
    option_type: raw.type?.toLowerCase() === "put" ? "put" : "call",
    strike: Number(raw.strike || 0),
    expiration_date: raw.expiration || raw.expiration_date,
    bid: raw.bid ? Number(raw.bid) : null,
    ask: raw.ask ? Number(raw.ask) : null,
    last: raw.last ? Number(raw.last) : null,
    mark: raw.mark ? Number(raw.mark) : null,
    volume: raw.volume ? Number(raw.volume) : null,
    open_interest: raw.open_interest ? Number(raw.open_interest) : null,
    implied_vol: raw.implied_volatility ? Number(raw.implied_volatility) : null,
    delta: raw.delta ? Number(raw.delta) : null,
    gamma: raw.gamma ? Number(raw.gamma) : null,
    theta: raw.theta ? Number(raw.theta) : null,
    vega: raw.vega ? Number(raw.vega) : null,
    rho: raw.rho ? Number(raw.rho) : null,
    updated_at: new Date().toISOString(),
  };
};

const fetchChain = async (symbol) => {
  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "REALTIME_OPTIONS");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("require_greeks", "true");
  url.searchParams.set("apikey", ALPHA_VANTAGE_API_KEY);

  const response = await fetch(url);
  const payload = await response.json();

  const chain = payload.data || payload.options || [];
  if (!Array.isArray(chain)) {
    console.warn("No chain data for", symbol, payload);
    return [];
  }

  return chain.map((item) => normalizeOption(symbol, item)).filter((row) => row.contract_id);
};

const upsertChain = async (rows) => {
  if (rows.length === 0) return;
  const { error } = await supabase.from("options_chain").upsert(rows, {
    onConflict: "contract_id",
  });
  if (error) {
    console.error("Upsert error:", error.message);
  }
};

const run = async () => {
  for (const symbol of symbols) {
    console.log(`Fetching ${symbol}`);
    const rows = await fetchChain(symbol);
    await upsertChain(rows);
  }
};

run();
