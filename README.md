# AcuMed Intelligence — Healthcare Data Intelligence & Web Scraping Audit

A modern, responsive Single-Page Application (SPA) built with **React (Vite) + Tailwind CSS** designed for Data Engineering & Healthcare Intelligence teams auditing web-scraped Australian General Practice (GP) directories.

---

## 🌟 Key Features

### 1. Data Ingestion & Pre-Loaded Australian Datasets
- **Pre-Loaded Multi-City Presets**: Realistic GP directory scrape data covering **Sydney (NSW)**, **Melbourne (VIC)**, **Brisbane (QLD)**, and **Perth (WA)**.
- **Fields Captured**: `Clinic Name`, `City`, `State`, `Phone`, `Website`, `Address`, `Postal Code`, `Practice Type`, and `Scrape Source`.
- **Anomalies Included for Testing**:
  - Unsanitized whitespace & newline control characters (`\t`, `\n`)
  - Duplicate listings across directories with subtle case and format variations
  - Incomplete contact cells (`N/A`, `null`, `-`, empty, or `pending`)
- **Custom CSV Ingestion**: Drag-and-drop CSV upload with smart column auto-mapping and downloadable template.

### 2. Data Cleansing & Quality Engine
- **Whitespace Sanitation**: Cleans leading, trailing, and internal consecutive whitespace.
- **Deduplication Engine**: Matches normalized `(Clinic Name + City)` clusters, keeps the most complete record, and logs pruned duplicates.
- **Missing Contact Cell Tracker**: Quantifies missing phone numbers and missing websites.
- **Quality Score & Grade**: Real-time composite health rating (0–100%) and letter grade (A+ to D).

### 3. Interactive UI Controls
- **Global Keyword Search**: Instant, multi-column search.
- **Multi-Select City Filters**: Filter across Sydney, Melbourne, Brisbane, and Perth.
- **Quality Flags**: Filter by `100% Complete`, `Missing Phone`, `Missing Website`, or `Any Incomplete`.
- **View Mode Switcher**: Toggle between Cleaned Dataset and Raw Ingested records.

### 4. Data Visualization
- **City Distribution Breakdown**: Interactive progress bar visualization showing clinic counts, percentage shares, and contact health rates per metropolitan cluster.
- Click any city bar to immediately filter the table.

### 5. Quality Audits & Export
- **Itemized Audit Modal**: Searchable, rule-by-rule log of every transformation and flagged irregularity.
- **Duplicate Cluster Review**: Side-by-side view comparing retained primary records against pruned duplicates.
- **One-Click CSV Export**: Download cleaned and deduplicated dataset as `Australian_Healthcare_Cleaned_Dataset.csv`.
- **One-Click JSON Audit Export**: Export machine-readable quality report for data engineering pipelines.

---

## 🚀 Getting Started

The development server is currently live at:
```
http://127.0.0.1:3000/
```

### Manual Commands
```bash
# Navigate to the project
cd C:\Users\pavan\.gemini\antigravity\scratch\healthcare-audit-app

# Run development server
npm run dev

# Run production build
npm run build
```
