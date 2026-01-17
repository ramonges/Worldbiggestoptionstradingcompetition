import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

const assetsByCategory = {
  Indices: [
    { symbol: "SPY", name: "S&P 500", price: 450.23, change: 0.5 },
    { symbol: "QQQ", name: "NASDAQ", price: 380.45, change: 0.8 },
    { symbol: "DIA", name: "Dow Jones", price: 340.12, change: 0.3 },
  ],
  Tech: [
    { symbol: "AAPL", name: "Apple", price: 189.12, change: 1.2 },
    { symbol: "NVDA", name: "NVIDIA", price: 862.15, change: 2.1 },
    { symbol: "META", name: "Meta", price: 456.88, change: -0.4 },
  ],
  Commodities: [
    { symbol: "USO", name: "Energy", price: 72.51, change: 0.7 },
    { symbol: "GLD", name: "Gold", price: 184.03, change: -0.2 },
    { symbol: "WEAT", name: "Wheat", price: 6.35, change: 0.1 },
  ],
  Industrial: [
    { symbol: "BA", name: "Boeing", price: 208.75, change: 0.4 },
    { symbol: "CAT", name: "Caterpillar", price: 301.44, change: 0.6 },
    { symbol: "GE", name: "GE", price: 128.2, change: -0.1 },
  ],
  Health: [
    { symbol: "PFE", name: "Pfizer", price: 28.45, change: -0.6 },
    { symbol: "JNJ", name: "Johnson & Johnson", price: 162.5, change: 0.2 },
    { symbol: "MRK", name: "Merck", price: 115.7, change: 0.4 },
  ],
  Consumption: [
    { symbol: "AMZN", name: "Amazon", price: 168.12, change: 1.1 },
    { symbol: "TSLA", name: "Tesla", price: 239.85, change: -0.9 },
    { symbol: "NKE", name: "Nike", price: 103.45, change: 0.3 },
  ],
};

const universities = [
  "Columbia University",
  "Harvard University",
  "MIT",
  "LSE",
  "HEC Paris",
  "Stanford University",
  "Princeton University",
  "University of Chicago",
  "Oxford University",
  "Cambridge University",
  "Other",
];

const majors = [
  "Finance",
  "Economics",
  "Engineering",
  "Mathematics",
  "Computer Science",
  "Business",
  "Physics",
  "Other",
];

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatPct = (value) =>
  `${value > 0 ? "+" : ""}${Number(value).toFixed(2)}%`;

const formatNumber = (value) =>
  value === null || value === undefined ? "-" : Number(value).toFixed(2);

const getMarketStatus = () => {
  const now = new Date();
  const et = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const day = et.getDay();
  const hour = et.getHours();
  const minute = et.getMinutes();
  const open = day >= 1 && day <= 5 && (hour > 9 || (hour === 9 && minute >= 30)) && hour < 16;
  return { open, time: et.toLocaleTimeString("en-US") };
};

const HeaderLogo = () => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-columbia text-white">
      C
    </div>
    <div className="text-sm font-semibold text-slate-900">
      World&apos;s Biggest Options Trading Competition
      <div className="text-xs font-medium text-slate-500">
        by Columbia Options Trading Club
      </div>
    </div>
  </div>
);

const Landing = ({ onLogin, onSignup, participants }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <HeaderLogo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
            <a href="#competition" className="hover:text-columbia">
              The Competition
            </a>
            <a href="#partnership" className="hover:text-columbia">
              Partnership Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-columbia/30 px-4 py-2 text-xs font-semibold text-columbia hover:bg-columbia/10"
              onClick={onLogin}
            >
              Log In
            </button>
            <button
              className="rounded-full bg-columbia px-4 py-2 text-xs font-semibold text-white shadow-soft"
              onClick={onSignup}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-columbia-light/50">
          <div className="absolute inset-0 opacity-30">
            <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-columbia-light blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-32 h-72 w-72 rounded-full bg-columbia/30 blur-3xl" />
            <svg
              className="absolute right-0 top-10 h-64 w-64 text-columbia/40"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path
                d="M10 150 C40 80, 80 160, 110 100 C140 40, 170 90, 190 30"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-24">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-columbia shadow">
              March 1st - May 1st, 2025
            </div>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              The World&apos;s Biggest Options Trading Competition
            </h1>
            <p className="max-w-2xl text-base text-slate-600">
              Compete with the best students worldwide. Build sophisticated strategies,
              learn from the market, and get recognized by top-tier partners.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="rounded-full bg-gradient-to-r from-columbia to-columbia-dark px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                onClick={onSignup}
              >
                Sign Up for the Competition
              </button>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-xs text-slate-600 shadow">
                {participants} students already registered
              </div>
            </div>
          </div>
        </section>

        <section id="competition" className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-2xl font-semibold text-slate-900">
              The Competition
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-5 text-sm text-slate-600">
                <p>
                  <strong>Dates &amp; Duration:</strong> March 1st, 2025 to May 1st,
                  2025. Two months of intense trading and learning.
                </p>
                <p>
                  <strong>Concept:</strong> Build sophisticated options strategies
                  across technology giants, major indices, commodities, healthcare, and
                  industrial sectors.
                </p>
                <p>
                  <strong>Starting Capital:</strong> $100,000 virtual capital for every
                  participant with optional margin according to competition rules.
                </p>
                <p>
                  <strong>Strategies Allowed:</strong> Single-leg trades, spreads,
                  straddles, strangles, and advanced multi-leg strategies.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
                <h3 className="text-sm font-semibold text-slate-900">Prizes</h3>
                <ul className="mt-4 space-y-2">
                  <li>🥇 1st Place: €1,000</li>
                  <li>🥈 2nd Place: €600</li>
                  <li>🥉 3rd Place: €400</li>
                  <li>Top 4-10: €50 - €200</li>
                </ul>
                <div className="mt-4 rounded-2xl bg-white p-4 text-xs text-slate-600">
                  Special awards for best risk-adjusted return, most creative strategy,
                  and best volatility trader.
                </div>
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                "100% free for all students worldwide",
                "Student status verification required",
                "Live data across 30+ assets",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="partnership" className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Become a Partner &amp; Sponsor
                </h2>
                <p className="mt-4 text-sm text-slate-600">
                  Connect with tomorrow&apos;s financial leaders. Gain premium visibility
                  with top-tier universities and engage directly with students passionate
                  about markets.
                </p>
              </div>
              <button className="rounded-full bg-columbia px-6 py-3 text-xs font-semibold text-white shadow-soft">
                Contact Us for Partnership
              </button>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Premium Visibility",
                  text:
                    "Logo on all communications, emails, and platform leaderboard placements.",
                },
                {
                  title: "Access to Talent",
                  text:
                    "Reach students from Columbia, Harvard, MIT, LSE, HEC, and more.",
                },
                {
                  title: "Direct Engagement",
                  text:
                    "Host a webinar, Q&A, and showcase your services to participants.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600"
                >
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "PLATINUM - $10,000",
                  items: ["Premium logo placement", "2 webinars", "Top 50 CVs"],
                },
                {
                  title: "GOLD - $5,000",
                  items: ["Standard logo placement", "1 webinar", "Top 20 CVs"],
                },
                {
                  title: "SILVER - $2,500",
                  items: ["Logo on website", "Mentions", "Brand visibility"],
                },
              ].map((pkg) => (
                <div
                  key={pkg.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600"
                >
                  <h4 className="text-sm font-semibold text-slate-900">{pkg.title}</h4>
                  <ul className="mt-3 space-y-1">
                    {pkg.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-xs">
                <h4 className="text-sm font-semibold text-slate-900">
                  Partnership contact form
                </h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Company name"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Contact name"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Email"
                    type="email"
                  />
                  <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs">
                    <option>Package of interest</option>
                    <option>Platinum</option>
                    <option>Gold</option>
                    <option>Silver</option>
                  </select>
                </div>
                <textarea
                  className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  rows="4"
                  placeholder="Message"
                />
                <button className="mt-4 rounded-full bg-columbia px-5 py-2 text-xs font-semibold text-white">
                  Send Partnership Request
                </button>
              </div>
              <div className="rounded-2xl border border-columbia/30 bg-columbia-light/50 p-6 text-xs text-slate-700">
                <h4 className="text-sm font-semibold text-slate-900">
                  Long-term partnership
                </h4>
                <p className="mt-3">
                  Official partnership status for 1 year, inclusion in all club
                  communications, and access to Columbia Options Trading Club events.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-500">
        <div className="space-y-3">
          <div className="font-semibold text-slate-900">
            Columbia Options Trading Club
          </div>
          <div>The World&apos;s Biggest Options Trading Competition</div>
          <div>© 2025 Columbia Options Trading Club. All rights reserved.</div>
          <div>contact@columbiaoptionsclub.com</div>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="#terms">Terms &amp; Conditions</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AuthModal = ({ open, mode, onClose, onModeChange, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setMessage("");
  }, [open, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("Processing...");
    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      if (mode === "signup") {
        if (password !== formData.get("confirm_password")) {
          throw new Error("Passwords do not match.");
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: formData.get("first_name"),
              last_name: formData.get("last_name"),
              university: formData.get("university"),
              major: formData.get("major"),
              graduation_year: formData.get("graduation_year"),
              phone: formData.get("phone") || "",
              accept_terms: formData.get("accept_terms") === "on",
              accept_rules: formData.get("accept_rules") === "on",
              accept_updates: formData.get("accept_updates") === "on",
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          const profile = {
            id: data.user.id,
            first_name: formData.get("first_name"),
            last_name: formData.get("last_name"),
            university: formData.get("university"),
            major: formData.get("major"),
            graduation_year: Number(formData.get("graduation_year")),
            phone: formData.get("phone") || null,
            accept_terms: formData.get("accept_terms") === "on",
            accept_rules: formData.get("accept_rules") === "on",
            accept_updates: formData.get("accept_updates") === "on",
            updated_at: new Date().toISOString(),
          };
          await supabase.from("profiles").upsert(profile);
          onSuccess();
        } else {
          setMessage("Account created. You can now log in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onSuccess();
      }
    } catch (error) {
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        setMessage(
          "Your account was created before email confirmation was disabled. Please confirm it once in Supabase → Auth → Users, then log in again."
        );
      } else {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {mode === "signup" ? "Create Account & Join Competition" : "Log In"}
          </h3>
          <button className="text-lg text-slate-400" onClick={onClose}>
            x
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 rounded-full bg-slate-100 p-1 text-xs font-semibold text-slate-500">
          {["signup", "login"].map((item) => (
            <button
              key={item}
              className={`rounded-full px-3 py-2 ${
                mode === item ? "bg-white text-columbia-dark shadow" : ""
              }`}
              onClick={() => onModeChange(item)}
              type="button"
            >
              {item === "signup" ? "Sign Up" : "Log In"}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600">
              First Name *
              <input
                name="first_name"
                required={mode === "signup"}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Last Name *
              <input
                name="last_name"
                required={mode === "signup"}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600">
              Email *
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Password *
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </label>
          </div>

          {mode === "signup" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  Confirm Password *
                  <input
                    name="confirm_password"
                    type="password"
                    required
                    minLength={8}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  University *
                  <select
                    name="university"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  >
                    {universities.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Major / Field *
                  <select
                    name="major"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  >
                    {majors.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Graduation Year *
                  <input
                    name="graduation_year"
                    type="number"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  Phone Number (optional)
                  <input
                    name="phone"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Student ID Upload
                  <input
                    name="student_id"
                    type="file"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </label>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-center gap-2">
                  <input name="accept_terms" type="checkbox" required />
                  I accept the Terms &amp; Conditions *
                </label>
                <label className="flex items-center gap-2">
                  <input name="accept_rules" type="checkbox" required />
                  I accept the Competition Rules *
                </label>
                <label className="flex items-center gap-2">
                  <input name="accept_updates" type="checkbox" />
                  I want to receive updates about the competition
                </label>
              </div>
            </>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className="text-columbia">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            className="w-full rounded-full bg-columbia px-4 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {mode === "signup" ? "Create Account & Join Competition" : "Log In"}
          </button>
          {message && <p className="text-xs text-columbia">{message}</p>}
        </form>
      </div>
    </div>
  );
};

const Platform = ({ onLogout }) => {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [account, setAccount] = useState(null);
  const [positions, setPositions] = useState([]);
  const [category, setCategory] = useState("Indices");
  const [selectedSymbol, setSelectedSymbol] = useState("SPY");
  const [maturities, setMaturities] = useState([]);
  const [maturity, setMaturity] = useState("");
  const [options, setOptions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [orderModal, setOrderModal] = useState(null);
  const [marketClock, setMarketClock] = useState(getMarketStatus());

  const calls = useMemo(
    () => options.filter((row) => row.option_type === "call"),
    [options]
  );
  const puts = useMemo(
    () => options.filter((row) => row.option_type === "put"),
    [options]
  );

  const atmStrike = useMemo(() => {
    if (!options.length) return null;
    const strikes = options.map((row) => row.strike);
    const target = 450.23;
    return strikes.reduce((prev, curr) =>
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
  }, [options]);

  const loadAccount = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    setAccount(data);
  };

  const loadPositions = async () => {
    const { data } = await supabase.from("option_positions").select("*");
    setPositions(data || []);
  };

  const loadMaturities = async (symbol) => {
    const { data } = await supabase
      .from("options_chain")
      .select("expiration_date")
      .eq("symbol", symbol)
      .order("expiration_date", { ascending: true });
    const dates = [...new Set((data || []).map((row) => row.expiration_date))];
    setMaturities(dates);
    setMaturity(dates[0] || "");
  };

  const loadOptions = async (symbol, date) => {
    if (!symbol || !date) return;
    const { data } = await supabase
      .from("options_chain")
      .select("*")
      .eq("symbol", symbol)
      .eq("expiration_date", date)
      .order("strike", { ascending: true });
    setOptions(data || []);
  };

  const loadProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .maybeSingle();
    setProfile(data);
  };

  const placeOrder = async (contractId, quantity) => {
    const { error } = await supabase.rpc("place_option_order", {
      contract_id_input: contractId,
      quantity_input: quantity,
      side_input: "buy",
    });
    if (error) {
      alert(error.message);
      return;
    }
    await loadAccount();
    await loadPositions();
  };

  useEffect(() => {
    loadAccount();
    loadPositions();
    loadProfile();
    loadMaturities(selectedSymbol);
  }, []);

  useEffect(() => {
    loadMaturities(selectedSymbol);
  }, [selectedSymbol]);

  useEffect(() => {
    if (maturity) loadOptions(selectedSymbol, maturity);
  }, [selectedSymbol, maturity]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketClock(getMarketStatus());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#1a1a1a] dark:text-white">
        <aside
          className={`flex flex-col gap-3 bg-slate-900 px-3 py-6 text-white transition-all duration-200 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <button
            className="rounded-lg px-3 py-2 text-xs text-white/70 hover:text-white"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? "Collapse" : "Menu"}
          </button>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "market", label: "📈 Market" },
            { id: "positions", label: "💼 My Positions" },
            { id: "payoff", label: "📉 Option Payoff Graphs" },
            { id: "montecarlo", label: "🎲 Monte Carlo Pricer" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`rounded-xl px-3 py-2 text-left text-xs font-semibold ${
                active === item.id ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-auto space-y-2">
            <button
              onClick={() => setActive("profile")}
              className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-white/10"
            >
              👤 My Profile
            </button>
            <button
              onClick={onLogout}
              className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-white/10"
            >
              🚪 Log Out
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-5 dark:border-slate-800 dark:bg-[#111]">
            <HeaderLogo />
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>
                Market:{" "}
                <span className={marketClock.open ? "text-emerald-500" : "text-rose-500"}>
                  {marketClock.open ? "OPEN" : "CLOSED"}
                </span>
              </span>
              <span>{marketClock.time} ET</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <select
                value={dark ? "dark" : "light"}
                onChange={(event) => setDark(event.target.value === "dark")}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-columbia text-white">
                  {profile?.first_name?.[0] || "S"}
                </div>
                <span>{profile?.first_name || "Student"}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-8 p-8">
            {active === "overview" && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold">Overview</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      label: "Total Account Value",
                      value: formatMoney(account?.cash + account?.invested),
                      change: "+5.23%",
                    },
                    {
                      label: "Cash Available",
                      value: formatMoney(account?.cash),
                    },
                    {
                      label: "Amount Invested",
                      value: formatMoney(account?.invested),
                    },
                    {
                      label: "Margin Used",
                      value: formatMoney(account?.margin_used),
                      change: "15% of total",
                    },
                    { label: "P&L (Today)", value: "$1,234.56", change: "+1.18%" },
                    { label: "P&L (Total)", value: "$5,234.56", change: "+5.23%" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-[#111]"
                    >
                      <div className="text-slate-500">{item.label}</div>
                      <div className="mt-2 text-base font-semibold">{item.value}</div>
                      {item.change && (
                        <div className="mt-1 text-xs text-emerald-500">
                          {item.change}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-xs dark:border-slate-800 dark:bg-[#111]">
                    <h3 className="text-sm font-semibold">Performance Chart</h3>
                    <div className="mt-4 h-40 rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
                      <svg viewBox="0 0 300 120" className="h-full w-full text-columbia">
                        <polyline
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          points="0,100 40,90 70,95 110,60 150,72 190,30 230,40 260,20 300,30"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-xs dark:border-slate-800 dark:bg-[#111]">
                    <h3 className="text-sm font-semibold">Leaderboard Preview</h3>
                    <p className="mt-3 text-xs text-slate-500">
                      Your Current Rank: #42 / 523 participants
                    </p>
                    <ul className="mt-3 space-y-2">
                      <li>1. John Doe (Harvard) - $125,456 (+25.46%)</li>
                      <li>2. Jane Smith (MIT) - $122,340 (+22.34%)</li>
                      <li>3. Alice Lee (LSE) - $118,880 (+18.9%)</li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-xs dark:border-slate-800 dark:bg-[#111]">
                  <h3 className="text-sm font-semibold">Recent Activity</h3>
                  <ul className="mt-4 space-y-3 text-xs text-slate-500">
                    <li>Bought 2x SPY CALL 450 (Feb 16) at $2.82</li>
                    <li>Sold 1x NVDA PUT 800 (Mar 18) at $12.80</li>
                    <li>Added Iron Condor strategy on SPY</li>
                    <li>Cash deposit +$0 (virtual)</li>
                  </ul>
                </div>
              </section>
            )}

            {active === "market" && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold">Market</h2>
                <div className="flex flex-wrap gap-3 text-xs">
                  {Object.keys(assetsByCategory).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setSelectedSymbol(assetsByCategory[cat][0].symbol);
                      }}
                      className={`rounded-full px-4 py-2 ${
                        category === cat
                          ? "bg-columbia text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {assetsByCategory[category].map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => setSelectedSymbol(asset.symbol)}
                      className={`rounded-2xl border p-4 text-left text-xs ${
                        selectedSymbol === asset.symbol
                          ? "border-columbia bg-columbia/10"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="text-sm font-semibold">{asset.symbol}</div>
                      <div className="text-xs text-slate-500">{asset.name}</div>
                      <div className="mt-2 text-base font-semibold">
                        ${asset.price}
                      </div>
                      <div className="text-xs text-emerald-500">
                        {formatPct(asset.change)}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-[#111]">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-sm font-semibold">{selectedSymbol}</div>
                    <div className="text-xs text-slate-500">
                      Current Price: $450.23 | Change: +0.48%
                    </div>
                    <div className="text-xs text-slate-500">
                      Bid: $450.20 | Ask: $450.25 | Volume: 45.2M
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 overflow-auto rounded-2xl bg-white p-3 text-xs">
                  {maturities.map((date) => (
                    <button
                      key={date}
                      onClick={() => setMaturity(date)}
                      className={`rounded-xl px-4 py-2 ${
                        maturity === date
                          ? "bg-columbia text-white"
                          : "border border-slate-200 text-slate-600"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
                  <OptionsTable
                    title="CALLS"
                    rows={calls}
                    onBuy={(row) => setOrderModal(row)}
                    atmStrike={atmStrike}
                  />
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs">
                    <div className="mb-2 text-xs font-semibold text-slate-500">
                      STRIKE
                    </div>
                    <ul className="space-y-2 text-center text-xs text-slate-500">
                      {options.map((row) => (
                        <li
                          key={`${row.contract_id}-strike`}
                          className={`rounded-full px-2 py-1 ${
                            row.strike === atmStrike
                              ? "bg-columbia/20 text-columbia-dark"
                              : ""
                          }`}
                        >
                          {row.strike}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <OptionsTable
                    title="PUTS"
                    rows={puts}
                    onBuy={(row) => setOrderModal(row)}
                    atmStrike={atmStrike}
                  />
                </div>
              </section>
            )}

            {active === "positions" && (
              <section className="space-y-6">
                <h2 className="text-lg font-semibold">My Positions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <SummaryCard label="Cash Available" value={formatMoney(account?.cash)} />
                  <SummaryCard
                    label="Amount Invested"
                    value={formatMoney(account?.invested)}
                  />
                  <SummaryCard label="Total P&L" value="$5,234.56" />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[11px] text-slate-400">
                      <tr>
                        <th className="py-2">Symbol</th>
                        <th>Type</th>
                        <th>Strike</th>
                        <th>Exp Date</th>
                        <th>Qty</th>
                        <th>Entry</th>
                        <th>Current</th>
                        <th>P&L</th>
                        <th>Greeks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos) => (
                        <tr key={pos.contract_id} className="border-t border-slate-100">
                          <td className="py-2">{pos.symbol}</td>
                          <td>{pos.option_type}</td>
                          <td>{pos.strike}</td>
                          <td>{pos.expiration_date}</td>
                          <td>{pos.quantity}</td>
                          <td>{formatNumber(pos.avg_price)}</td>
                          <td>{formatNumber(pos.mark)}</td>
                          <td>+25.0%</td>
                          <td>Δ:{pos.delta ?? "-"} Γ:{pos.gamma ?? "-"}</td>
                          <td>
                            <button className="rounded-full border border-slate-200 px-3 py-1 text-xs">
                              SELL
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {active === "payoff" && (
              <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-xs">
                  <h3 className="text-sm font-semibold">Strategy Builder</h3>
                  <div className="mt-4 space-y-4">
                    <input
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                      placeholder="Strategy Name"
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Underlying Spot"
                      />
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Expiration"
                        type="date"
                      />
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Risk-Free Rate"
                      />
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <div className="text-xs font-semibold">Leg 1</div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs">
                          <option>BUY</option>
                          <option>SELL</option>
                        </select>
                        <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs">
                          <option>CALL</option>
                          <option>PUT</option>
                        </select>
                        <input
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          placeholder="Strike"
                        />
                        <input
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                          placeholder="Premium"
                        />
                      </div>
                    </div>
                    <button className="rounded-full border border-columbia/30 px-4 py-2 text-xs text-columbia">
                      + Add Leg
                    </button>
                    <button className="w-full rounded-full bg-columbia px-4 py-2 text-xs font-semibold text-white">
                      Calculate Payoff
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-xs">
                  <h3 className="text-sm font-semibold">Payoff Diagram</h3>
                  <div className="mt-4 h-56 rounded-xl bg-slate-100" />
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3 text-xs">
                      Max Profit: $420.00
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-xs">
                      Max Loss: -$580.00
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-xs">
                      Breakeven: $440.58 / $459.42
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-xs">
                      Probability of Profit: 68.5%
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">
                    Overall Greeks: Δ 0.02 | Γ -0.01 | Θ 0.15 | ν -0.25 | ρ 0.03
                  </div>
                </div>
              </section>
            )}

            {active === "montecarlo" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 text-xs">
                <h2 className="text-lg font-semibold">Monte Carlo Options Pricer</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Current Spot Price"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Strike Price"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Time to Maturity (years)"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Risk-Free Rate"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Implied Volatility"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="Dividend Yield"
                  />
                </div>
                <button className="mt-4 rounded-full bg-columbia px-4 py-2 text-xs font-semibold text-white">
                  Run Simulation
                </button>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 text-xs">
                    Monte Carlo Price: $3.45
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 text-xs">
                    Black-Scholes Price: $3.47
                  </div>
                </div>
              </section>
            )}

            {active === "profile" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 text-xs">
                <h2 className="text-lg font-semibold">My Profile</h2>
                <div className="mt-6 grid gap-6 md:grid-cols-[1fr_2fr]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-24 w-24 rounded-full bg-slate-200" />
                    <button className="rounded-full border border-columbia/30 px-4 py-2 text-xs text-columbia">
                      Change Photo
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="First Name"
                      />
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Last Name"
                      />
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Email"
                      />
                      <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs">
                        {universities.map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                      <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs">
                        {majors.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Graduation"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Current Password"
                        type="password"
                      />
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="New Password"
                        type="password"
                      />
                      <input
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Confirm New Password"
                        type="password"
                      />
                    </div>
                    <button className="rounded-full bg-columbia px-4 py-2 text-xs font-semibold text-white">
                      Change Password
                    </button>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      {orderModal && (
        <OrderModal
          data={orderModal}
          account={account}
          onClose={() => setOrderModal(null)}
          onConfirm={async (quantity) => {
            await placeOrder(orderModal.contract_id, quantity);
            setOrderModal(null);
          }}
        />
      )}
    </div>
  );
};

const OptionsTable = ({ title, rows, onBuy, atmStrike }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs">
    <div className="mb-2 text-xs font-semibold text-slate-500">{title}</div>
    <table className="w-full text-left">
      <thead className="text-[11px] text-slate-400">
        <tr>
          <th className="py-2">Bid</th>
          <th>Ask</th>
          <th>Last</th>
          <th>Vol</th>
          <th>OI</th>
          <th>IV</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.contract_id}
            className={`border-t border-slate-100 ${
              row.strike === atmStrike ? "bg-columbia/5" : ""
            }`}
          >
            <td className="py-2">{row.bid ?? "-"}</td>
            <td>{row.ask ?? "-"}</td>
            <td>{row.last ?? "-"}</td>
            <td>{row.volume ?? "-"}</td>
            <td>{row.open_interest ?? "-"}</td>
            <td>{row.implied_vol ?? "-"}</td>
            <td>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                onClick={() => onBuy(row)}
              >
                BUY
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SummaryCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs">
    <div className="text-slate-500">{label}</div>
    <div className="mt-2 text-base font-semibold">{value}</div>
  </div>
);

const OrderModal = ({ data, account, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("Market");
  const [limitPrice, setLimitPrice] = useState("");
  const price = data.ask ?? data.last ?? data.mark ?? 0;
  const total = price * quantity * 100;
  const after = (account?.cash || 0) - total;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Order Details</h3>
          <button className="text-slate-400" onClick={onClose}>
            x
          </button>
        </div>
        <div className="mt-4 space-y-3 text-xs text-slate-600">
          <div>Symbol: {data.symbol}</div>
          <div>
            Type: {data.option_type?.toUpperCase()} | Strike: {data.strike}
          </div>
          <div>Expiration: {data.expiration_date}</div>
          <div>
            Last: {formatNumber(data.last)} | Bid: {formatNumber(data.bid)} | Ask:{" "}
            {formatNumber(data.ask)}
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600">
            Quantity
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Order Type
            <select
              value={orderType}
              onChange={(event) => setOrderType(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
            >
              <option>Market</option>
              <option>Limit</option>
            </select>
          </label>
          {orderType === "Limit" && (
            <label className="text-xs font-semibold text-slate-600">
              Limit Price
              <input
                value={limitPrice}
                onChange={(event) => setLimitPrice(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </label>
          )}
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          <div>Total Cost: {formatMoney(total)}</div>
          <div>Available Cash: {formatMoney(account?.cash)}</div>
          <div>After Trade: {formatMoney(after)}</div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-xs"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-full bg-columbia px-4 py-2 text-xs font-semibold text-white"
            onClick={() => onConfirm(quantity)}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase
      .from("participant_stats")
      .select("total_participants")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setParticipants(data?.total_participants || 0));

    const channel = supabase
      .channel("participant-stats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participant_stats" },
        (payload) => {
          setParticipants(payload.new.total_participants);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!session) {
    return (
      <>
        <Landing
          onLogin={() => {
            setAuthMode("login");
            setAuthOpen(true);
          }}
          onSignup={() => {
            setAuthMode("signup");
            setAuthOpen(true);
          }}
          participants={participants}
        />
        <AuthModal
          open={authOpen}
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onModeChange={setAuthMode}
          onSuccess={() => setAuthOpen(false)}
        />
      </>
    );
  }

  return (
    <Platform
      onLogout={async () => {
        await supabase.auth.signOut();
      }}
    />
  );
}
