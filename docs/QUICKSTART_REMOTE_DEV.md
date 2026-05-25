# Quick Start: Remote Dev

The Remote Dev feature lets you write and test your tenant code against a hosted development environment — no local platform setup required. Changes you save locally sync to the dev server in seconds.

---

## What you need

- A dev URL and a developer token (provided by your platform admin)
- [Node.js 18+](https://nodejs.org/) on your machine
- Your tenant code repository cloned locally

---

## Step 1 — Install the CLI

```bash
npm install -g @groundworkjs/dev-cli
```

Verify the install:

```bash
gwjs-dev --version
```

---

## Step 2 — Save your credentials

Your admin will give you:
- A **dev URL** — looks like `https://dev.yoursite.example.com`
- A **developer token** — starts with `gwjs_`

Store them once:

```bash
gwjs-dev init https://dev.yoursite.example.com gwjs_<your-token>
```

Credentials are saved to `~/.config/gwjs-dev/config.json` on your machine and never transmitted except to authenticate with the dev server.

---

## Step 3 — Connect

From the root of your local tenant repository:

```bash
gwjs-dev connect .
```

This will:
1. Upload your current code to your private dev slot
2. Start a live sandbox with your code running on the server
3. Print a **browser URL** — open it to activate your dev session

Example output:

```
✓ Slot ready
✓ Files synced
✓ Sandbox running

Open this URL in your browser to activate your dev session:
https://dev.yoursite.example.com/gateway/slots/handshake?t=...

Watching for changes…  Press Ctrl+C to stop.
```

---

## Step 4 — Open the browser URL

Paste the printed URL into your browser. It sets a session cookie that routes your API requests through your personal sandbox. You can now browse the dev site — your custom pages and API routes reflect your local code.

From this point on, any file you save locally will sync automatically. The sandbox hot-reloads on changes — usually within a couple of seconds.

---

## Step 5 — Stop when done

Press `Ctrl+C` in the terminal running `gwjs-dev connect`. This stops the file watcher and disconnects your dev slot on the server.

Or disconnect from a separate terminal:

```bash
gwjs-dev disconnect
```

---

## Database commands

Your tenant code gets a dedicated dev database. Use these commands to manage it:

```bash
# Run pending migrations
gwjs-dev migrate

# Run seed files
gwjs-dev db:seed

# Roll back the last migration batch
gwjs-dev db:rollback

# Drop all tables and re-run migrations from scratch
gwjs-dev db:reset
```

> **Note**: These commands only affect **your dev database** — nothing in production is ever touched.

---

## Check your slot status

```bash
gwjs-dev status
```

Example output:

```
● Connected
  Status:   running
  Port:     4201
  Started:  5/24/2026, 2:30:00 PM
```

---

## Tips

**Multiple browser windows**  
The session cookie applies to your entire browser session. All tabs on the dev site use your personal sandbox.

**Sharing the dev site with someone else**  
Other people visiting the dev URL without your session cookie see the unmodified baseline platform, not your in-progress changes.

**File changes that don't appear**  
If a change doesn't appear after a few seconds, check the terminal running `gwjs-dev connect` for any sync errors. Re-running `gwjs-dev connect .` performs a fresh full sync.

**Session expires**  
Dev slots automatically stop after a period of inactivity (your admin sets this limit). When that happens, run `gwjs-dev connect .` again to start a fresh session.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `No credentials found` | Run `gwjs-dev init <url> <token>` |
| `Invalid or expired developer token` | Contact your admin to check your token and developer role |
| `Failed to start slot: All developer slots are in use` | Ask your admin to stop idle slots or increase the slot limit |
| `Checksum mismatch` in sync output | Re-run `gwjs-dev connect .` to do a clean full sync |
| Browser shows old content after file change | Hard-refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) to clear the browser cache |
