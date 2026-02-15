# Earnings Insight

Upload your portfolio → get a personalized upcoming earnings calendar + historical reactions + deep AI transcript breakdowns.  

Built for retail investors and traders who want context before earnings hits — without drowning in noise or pretending to predict the move.

Live: https://earningsinsight.vercel.app/ (beta — still wiring real data)

> This is a sensemaking tool — not a trading signal engine and definitely not financial advice.

## Core Philosophy

Earnings are high-signal events, but most tools just show dates + estimates.  
Earnings Insight goes deeper:  
- Shows **your** portfolio's upcoming events (no dummy data clutter).  
- Gives historical context (avg moves, surprise %, beat rates).  
- Runs structured AI analysis on transcripts (4 pillars: Delta, State of Play, Signaling, Q&A Truth) to compress what management is really saying.  

Clarity over certainty. Exploration over signals.

## Features

- 📁 Portfolio upload (CSV or XLSX) — client-side, private, no storage  
- 📅 Personalized upcoming earnings calendar (only your tickers, BMO/AMC timing)  
- 📊 Historical reactions (last few quarters: EPS surprise, 1D/1W moves, charts)  
- 🧠 Auto-loaded 4-pillar AI transcript analysis 
  - Delta: What changed vs last quarter?  
  - State of Play: Where is the business now?  
  - Signaling: What does management want you to believe?  
  - Q&A Truth: Where are they evading or hedging?    
  

## How It Works

1. Land on clean explanation + big upload zone.  
2. Drag/drop your portfolio file → parses tickers client-side.  
3. Matches to upcoming earnings → shows calendar + details for your holdings.  
4. Select a ticker/event → auto-pulls transcript + runs 4-pillar analysis.  
5. Everything cached where possible for speed.

## Tech Stack

- Vite + React + TypeScript + Tailwind + shadcn/ui  
- Supabase for caching/analysis persistence  
- FMP API for earnings dates/estimates/transcripts (add your key in env)  
- Deployed on Vercel  

## Quick Start (Local)

If you want to run locally:  
```bash
git clone https://github.com/Archiehehe/Earnings-Insight.git
cd Earnings-Insight
npm install
npm run dev
