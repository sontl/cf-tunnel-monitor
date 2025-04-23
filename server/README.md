# Tunnel Monitor Server

This server provides automation capabilities for the Tunnel Monitor application, allowing it to automatically recover offline tunnels.

## Features

- REST API for opening URLs in a browser
- Automated tunnel health checking and recovery
- Integration with Supabase for tunnel data

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=3001
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Automation

The server includes an automation script that can be run as a scheduled task to check and recover offline tunnels.

### Running the Automation Script

```bash
npm run automation
```

### Setting Up as a Scheduled Task

#### On Linux/macOS (using cron)

1. Open your crontab:
   ```bash
   crontab -e
   ```

2. Add a line to run the script every 5 minutes:
   ```
   */5 * * * * cd /path/to/server && /usr/bin/node automation.js >> /path/to/logs/automation.log 2>&1
   ```

#### On Windows (using Task Scheduler)

1. Open Task Scheduler
2. Create a new task
3. Set the trigger to run every 5 minutes
4. Set the action to run the script:
   ```
   node C:\path\to\server\automation.js
   ```

## API Endpoints

### POST /open-url

Opens a URL in a browser.

Request body:
```json
{
  "url": "https://example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "URL opened successfully"
}
```

### GET /health

Health check endpoint.

Response:
```json
{
  "status": "ok"
}
``` 