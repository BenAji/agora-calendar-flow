# ✅ DEVELOPMENT PLAN — AgoraCalendar Outlook Add-in

This document defines the **strict development plan** for the AgoraCalendar project.  
All developers and AI coding agents (including Cursor AI) **must follow this plan exactly**.

---

## 💡 Purpose:
AgoraCalendar is a Microsoft Outlook Add-in for **Investor Relations (IR) Teams** and **Investors** (Analyst Managers & Investment Analysts).  
It provides advanced calendar views, event workflows, RSVP management, and analytics, based on our approved high-fidelity desktop mockup (Bloomberg dark theme).

---

## ✅ STACK (Strict — No Substitutions):
- React (Vite or Create React App)
- TailwindCSS (Dark Bloomberg-style theme)
- Office.js (Outlook Add-in Integration)
- MSAL (Microsoft Authentication — Azure AD or Gmail sign-in)
- Microsoft Graph API (Calendar Access & Conflict Detection)
- Papaparse (CSV Upload/Export)
- Recharts or Chart.js (Analytics Dashboards)
- React Router (Role-Based Routing)

---

## ✅ CORE DEVELOPMENT TASKS (Follow These Exactly):

### 1. Authentication & Role Management
- Login / Logout flow.
- Role-based access:
  - IR Admin
  - Analyst Manager
  - Investment Analyst
- MSAL integration for Azure AD or Gmail.

---

### 2. Navigation & Layout (Based on Approved Mockup)
**Sidebar Menus:**
- Analyst Managers & Investment Analysts: Dashboard, Calendar, Events, Analytics, Settings (You may generate feature ideas for Settings).
- IR Admins: Dashboard, Events, Analytics, Settings (Settings may be generated).
- Show logged-in user info in the top navbar.
- No Calendar for IR Admin.
- Must follow Bloomberg dark theme.
- Dark/Light theme toggle required.

---

### 3. Calendar Module (Analyst Managers & Analysts Only)
- Must match mockup structure (no modifications).
- Filter events by:
  - Company Name
  - Market Size (Market Cap).
- Hover to show event details.
- Toggle between Quarter / Month / Week views.
- Clickable event blocks showing:
  - Title, Time, Location, Color-coded Event Type (with legend).
- RSVP Pop-up Dialog:
  - Analyst Managers: RSVP + Event Assignment (only to Analysts in their hierarchy via dropdown).
  - Investment Analysts: RSVP only (Accept / Decline / Tentative).

---

### 4. Event Management Module:
**IR Admin:**
- Create, Edit, Delete Events (Form with auto-complete + dropdowns where needed).
- Import Events (CSV, Papaparse).
- Export RSVP Lists (CSV / PDF).
- View RSVP List per Event.
- Must include advanced event search using:
  - Search Bar
  - Filters
  - Dropdowns.

**Analyst Managers & Analysts:**
- View & search assigned events (Company, Status, Type, Date, Time).

---

### 5. Analytics Dashboard:
**Analyst Managers & Analysts:**
- Show:
  - Total Meetings
  - RSVP Breakdown
  - Event Conflicts
  - Companies Subscribed.
- Use Recharts or Chart.js.

**IR Admin:**
- Show:
  - Total Events
  - RSVP Breakdown (Total RSVPs, Accepted RSVPs, Engagement Rate — Follow Mockup Layout).
- Use Recharts or Chart.js.

---

### 6. CSV Processor:
- CSV Import/Export for IR Admins with data validation.

---

### 7. Conflict Detection:
- Use Microsoft Graph API to detect scheduling conflicts (Managers & Analysts).
- Display clear conflict alerts on Calendar & Event Detail Screens.

---

## ✅ Visual Theme:
- Strict Bloomberg dark mode:
  - Background: `#101113`
  - High-contrast white/gray fonts
  - Dense, minimalist, data-driven design.
- Dark/Light theme toggle required across app.

---

## ✅ DEVELOPMENT RULE:
> **Every implementation must follow this document and the approved mockup exactly. No deviations, substitutions, or redesigns are allowed unless explicitly approved by the product owner.**

---

## ✅ FIRST DEVELOPMENT STEP:
1. Scaffold project with React, TailwindCSS, Office.js, MSAL, React Router.
2. Implement:
   - Authentication
   - Role-Based Routing with Protected Pages
   - Sidebar Navigation (with placeholders for screens)
   - Dark/Light Theme Toggle

---

## ✅ Note:
Keep this file (`DEVELOPMENT_PLAN.md`) in the project root.  
AI agents (such as Cursor) must follow this document as the **source of truth** for all development work.
