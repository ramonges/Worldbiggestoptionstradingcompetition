# World's Biggest Options Trading Competition (React + Tailwind)

Landing page + trading platform UI with Supabase auth and data storage.

## Setup

1. Create the Supabase tables and functions by running `supabase/schema.sql` in the SQL editor.
2. Configure auth email confirmations in Supabase if you want sign-up verification.
3. Install frontend dependencies and run the app:

```
npm install
npm run dev
```

4. Provide environment variables for the data ingestion script:

```
SUPABASE_URL=https://muhubssjyqzjvmilehzw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALPHA_VANTAGE_API_KEY=your-alphavantage-key
```

5. Run the options fetch script (server-side):

```
npm install
npm run fetch-options
```

## Notes

- The Alpha Vantage key is used only by `scripts/fetch-options.js` to keep it off the client.
- The platform page reads options data from `options_chain` and writes trades through the
  `place_option_order` RPC.
