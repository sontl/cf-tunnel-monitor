# Tunnel Monitor

A web application for monitoring and managing Cloudflare tunnels.

## Features

- Monitor the status of Cloudflare tunnels
- Automatically detect when tunnels go offline
- Trigger recovery by opening the tunnel's enable URL in a browser
- Track tunnel uptime and last updated time

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Tunnel Recovery

When a tunnel goes offline, the application will attempt to recover it by:

1. Opening the tunnel's enable URL in a new browser tab
2. Waiting for the tunnel to recover
3. Checking if the tunnel is back online
4. Retrying up to 3 times if the tunnel is still offline

## Technologies Used

- React
- TypeScript
- Vite
- Supabase
- Tailwind CSS

## License

MIT