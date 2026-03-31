# Invisible Addiction 🧠

A Chrome extension that detects and surfaces unnoticed doom-scrolling habits.

## Problem Statement
Users develop unhealthy digital habits without realizing it. There's no clear feedback loop to detect gradual behavioral dependency.

## Solution
Track behavioral signals — not pixels — to identify compulsive patterns and intervene in real time.

## How It Works
- **Session tracking** — counts every visit to doom-scroll apps
- **Compulsive return detection** — flags when you return within 5 minutes
- **Nudge banner** — appears on-site asking "Is this intentional?"
- **Page blocker** — kicks in when daily time limit is exceeded
- **Addiction score** — calculated from session count, total time, compulsive returns & late-night usage

## Detection Logic
Score = Total time (30pts) + Session count (25pts) + Compulsive returns (30pts) + Late night usage (15pts)

## Supported Sites
YouTube, Instagram, Twitter/X, Reddit, TikTok, Facebook, Netflix, Twitch, Pinterest, Tumblr, Snapchat

## Setup
1. Clone the repo
2. Open `chrome://extensions`
3. Enable Developer Mode
4. Click "Load unpacked" → select the `extension/` folder