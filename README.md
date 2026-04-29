# Lucid Mail

> An HCI-principled email client built as an end-semester design project.  
> Every feature is justified by a named usability principle. Every Gmail issue has a documented fix.

---

## Overview

Lucid is a fully functional web-based email client that re-examines Gmail's interface through the lens of Human-Computer Interaction theory. The project identifies 14 specific usability failures in Gmail and implements principled solutions for each, with every design decision mapped to a named HCI heuristic.

**Stack:** React · TypeScript · Vite · Zustand · Vanilla CSS

---

## Design Principle System

All features are justified using a named principle from one of four frameworks:

| Code | Framework |
|---|---|
| **N1–N10** | Nielsen's 10 Usability Heuristics |
| **S1–S8** | Shneiderman's 8 Golden Rules |
| **G1–G7** | Gestalt Laws of Perception |
| **D1–D6** | Norman's Design Principles |
| **L1–L10** | Raskin's Laws / Cognitive Load principles |
| **W1–W9** | Web Usability (NNG / Krug) |
| **P1–P6** | Emotional / Aesthetic Design |
| **U1–U7** | Universal Design Principles |
| **V1–V6** | Visual Hierarchy Principles |

---

## Gmail Issues → Lucid Solutions

### Issue 1 — Gmail's Tab System Buries Important Emails
Gmail's Promotions, Social, and Updates tabs silently hide emails users expect to find in their inbox. Lucid uses a single unified inbox with colour-coded label chips — no emails are ever hidden by automatic categorisation.  
**Principles:** N6 (Recognition over Recall), S8 (Reduce STM Load)

---

### Issue 2 — Gmail's Cognitive Load from Feature Density
Gmail's toolbar exposes dozens of actions at once regardless of context. Lucid surfaces only context-relevant actions — bulk actions appear only when emails are selected, email-specific actions appear only in email detail view.  
**Principles:** S8 (Reduce STM Load), N8 (Aesthetic & Minimalist Design), G4 (Figure-Ground)

---

### Issue 3 — Gmail's Lack of Visible Undo for Archive and Delete
Gmail shows a fleeting undo link that disappears in ~5 seconds with no keyboard shortcut. Lucid provides a persistent toast with an explicit **Undo** button on every destructive action, plus `Z` as a global keyboard shortcut for undo.  
**Principles:** S5 (Error Reversibility), N3 (User Control & Freedom), S2 (Shortcuts)

---

### Issue 4 — Gmail's Password Field Always Masked
Gmail always masks the password, increasing typos and login failures on private devices. Lucid shows the password in plaintext by default, citing NNG's password masking research.  
**Principles:** N5 (Error Prevention), W6 (Simplicity)

---

### Issue 5 — Gmail's Non-Resizable Sidebar
Gmail's sidebar cannot be resized. Lucid's sidebar has a drag handle allowing widths from 68px (icon-only compact) to 300px (expanded labels), with snap thresholds to prevent unusable intermediate states.  
**Principles:** S7 (Locus of Control), D4 (Mapping), D6 (Affordance)

---

### Issue 6 — Gmail's Search Has No Persistent Suggestion History
Gmail's search offers no memory of prior queries. Lucid stores the 8 most recent searches per session and surfaces them as one-click suggestions when the search bar is focused.  
**Principles:** S8 (Reduce STM Load), N6 (Recognition over Recall)

---

### Issue 7 — Gmail Keyboard Shortcuts Are Not Customisable
Gmail's shortcuts are fixed. Lucid ships a full keyboard shortcut system (`G+I` inbox, `G+S` sent, `C` compose, `Z` undo, etc.) with a remapping modal so users can override any binding to match prior muscle memory.  
**Principles:** S2 (Shortcuts), N7 (Flexibility & Efficiency), L5 (Prior Learning)

---

### Issue 8 — Gmail's Compose Window Is Not Scalable
Gmail's compose window is a fixed-size overlay. Lucid's compose window is drag-resizable and supports full-screen expansion, with font-size controls inside the toolbar.  
**Principles:** S7 (Locus of Control), N7 (Flexibility), D6 (Affordance)

---

### Issue 9 — Gmail Does Not Show Context When Viewing Archived/Trashed Email
When viewing an archived or deleted email in Gmail, the user receives no indication of where the email is or how to reverse the action. Lucid shows a persistent context banner ("This email is in Trash · Restore | Delete forever") that remains visible throughout the detail view.  
**Principles:** S4 (Closure), S8 (Reduce STM Load), N1 (Visibility of System Status)

---

### Issue 10 — Gmail Has No Interface Zoom Control
Gmail relies entirely on browser zoom, which scales the entire OS viewport. Lucid implements an independent zoom widget in the Top Bar (80%–150%) that scales only the email client using CSS custom properties.  
**Principles:** U7 (Size & Space), U2 (Flexibility in Use)

---

### Issue 11 — Gmail's Empty States Are Generic
Gmail shows a plain "No conversations" message in every empty folder. Lucid shows folder-aware empty states with context-specific descriptions and a primary action CTA where appropriate (e.g. "Compose your first email" in Sent).  
**Principles:** N2 (Match Real World), N9 (Help Users Recognise & Recover)

---

### Issue 12 — Gmail Has No Welcome/Stats Header
Gmail's inbox header shows only the folder name. To see unread count, sent count, or draft count, users must navigate to each folder. Lucid opens the inbox with a Welcome Header showing the user's avatar, name, custom label chips, and three live counters.  
**Principles:** S8 (Reduce STM Load), N1 (Visibility of System Status), V6 (Dominance)

---

### Issue 13 — Gmail's Reload Gives No Feedback or Closure
Gmail's reload button produces no visible loading indicator and no completion signal. Users are left uncertain whether the reload occurred or whether new mail arrived.

**Lucid's three-phase reload:**
1. **Icon spins immediately** — circular-arrow animates at 0.75s/rev on click (S3 Informative Feedback)
2. **Skeleton rows replace the list** — 8 animated placeholder rows maintain layout closure (G1)
3. **Closure toast on done** — *"Inbox up to date · N unread"* or *"All caught up — no new messages"* (S4 Closure)

A 3-second cooldown prevents accidental double-fire (N5 Error Prevention). The button's `aria-label` updates dynamically for screen readers (U1 Equitable Use).  
**Principles:** S3, S4, G1, N1, N5, D6, L3, U1

---

### Issue 14 — Gmail's Stats Header Is Purely Decorative
Gmail provides no at-a-glance account overview, and even if it did, clicking stat counts would do nothing.

**Lucid's actionable stat badges:**
- **Unread** — filters the inbox to unread-only without navigation; badge highlights active state; dismissable *"Unread only ×"* chip reverts the filter (S7, N3, N1)
- **Sent** — shows *today's* sent count (not all-time); clicking navigates to Sent pre-filtered to today; *"Today only ×"* chip clears the filter (N2, L7)
- **Drafts** — one-click navigation to the Drafts folder (S8, N7)

**Principles:** S7, N1, N3, N2, N7, S8, L7

---

## Feature → Principle Mapping (Selected)

| Feature | Design Decision | Principles |
|---|---|---|
| Resizable sidebar | User controls layout via drag handle | S7, D4, D6 |
| Recent search history | System remembers so user doesn't | S8, N6 |
| Welcome header with stats | At-a-glance state without navigation | S8, N1 |
| Skeleton loading rows | Closure replaces blank loading state | G1, P3 |
| Bulk action bar | Context-aware actions, clear selection exit | S7, N3, G2 |
| Toast with Undo | Reversibility for all destructive actions | S5, N3 |
| Keyboard shortcut system | Expert navigation without mouse | S2, N7, L3 |
| Remappable shortcuts | Respect prior muscle memory | L5, S7 |
| Dark mode + density modes | Adapts to user preference and workflow | U2, S7, N7 |
| Password shown by default | Prevent typos without security theatre | N5, W6 |
| Reload button (3-phase) | Spin + skeleton + closure toast | S3, S4, G1, N1 |
| Stat badge — Unread filter | One-click drill-down; chip to revert | S7, N3, N1 |
| Stat badge — Sent today | Badge count = today; filter pre-applied | N2, L7, S8 |
| Stat badge — Drafts nav | One-click jump; count without navigation | S8, N7 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173`. Use the **Guest Demo** button on the landing page to explore without signing up.

---

## Project Structure

```
src/
├── components/
│   ├── email/       # EmailList, EmailRow, EmailDetail
│   ├── ui/          # Icons, Avatar, Toast, Tooltip, Modal
│   └── layout/      # TopBar, Sidebar
├── stores/
│   ├── emailStore.ts   # Zustand email state + undo stack
│   ├── uiStore.ts      # Toast, modals, user preferences
│   └── accountStore.ts # Multi-account management
├── hooks/           # useSearch, useKeyboard
├── pages/           # LandingPage, SettingsPage
└── types.ts         # Email, Label, Account, UserPreferences
```

---

## HCI Report

The full design documentation is in [`lucid_hci_report.tex`](./lucid_hci_report.tex), covering:
- Universal Design & Accessibility audit
- Raskin's Laws applied to email interaction
- Gestalt principles in layout design
- 14 Gmail usability issues with principled solutions
- Master feature-to-principle mapping table
