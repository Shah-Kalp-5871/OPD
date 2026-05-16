# MedFlow Enterprise Scrollbar System — Documentation Package
**Version:** 1.0.0 | **Date:** 2026-05-15

---

# Document 1: SCROLLBAR_SYSTEM_REPORT.md

## Executive Summary

The default browser scrollbar was inconsistent across Chrome, Firefox, Edge, and Safari — visually misaligned with MedFlow's premium enterprise design system. This document details the implementation of a **centralized, token-driven scrollbar system** that delivers a consistent, minimal, and professional experience across all clinical modules.

## Design Token Architecture

All scrollbar values are defined as CSS custom properties in `app/globals.css`:

| Token | Value | Description |
|---|---|---|
| `--scrollbar-width` | `6px` | Standard scrollbar width |
| `--scrollbar-width-thin` | `4px` | Ultra-thin variant for sidebars |
| `--scrollbar-track` | `transparent` | Invisible track for clean look |
| `--scrollbar-thumb` | `#cbd5e1` (slate-300) | Default thumb color |
| `--scrollbar-thumb-hover` | `#94a3b8` (slate-400) | Hover state |
| `--scrollbar-thumb-active` | `#64748b` (slate-500) | Active/pressed state |
| `--scrollbar-radius` | `999px` | Pill-shaped rounded thumb |

## Utility Class Reference

| Class | Use Case | Width | Behavior |
|---|---|---|---|
| `custom-scrollbar` | Tables, modals, main panels | 6px | Visible, styled, hover effect |
| `scrollbar-thin` | Sidebar order panels | 4px | Ultra-thin, hover highlight |
| `scrollbar-hide` | Tab strips, chip rows | — | Hidden, scroll still works |
| `no-scrollbar` | Legacy alias | — | Hidden, scroll still works |
| `scrollbar-stable` | Dynamic-content layouts | — | Prevents layout shift |
| `clinical-sidebar` | Doctor left panel | — | Hidden, smooth touch |
| `clinical-tab-content` | Doctor main body | 6px | Single scroll context |
| `h-scroll-strip` | Tab strips, filter chips | — | Horizontal only, hidden |
| `table-scroll-container` | Data tables | 4px | Horizontal+vertical, sticky header |
| `modal-body-scroll` | Modal content | 4px | Max-height 80vh |

## Cross-Browser Compatibility

| Browser | Mechanism | Coverage |
|---|---|---|
| Chrome / Edge | `::-webkit-scrollbar` | Full custom styling |
| Safari | `::-webkit-scrollbar` | Full custom styling |
| Firefox | `scrollbar-width` + `scrollbar-color` | Width + color only |
| IE 10+ | `-ms-overflow-style: none` | Hide only |

> **Note:** Firefox does not support full custom scrollbar tracks. This is an accepted browser limitation.

## Print Media

All scrollbars are hidden during print (`@media print`) for clean clinical document output.

---

# Document 2: SCROLL_CONTAINER_AUDIT.md

## Overview

A complete audit of all scrollable containers across the MedFlow frontend, categorized by module and component type.

## Layout-Level Scroll Containers

| Layout | File | Container | Class Applied |
|---|---|---|---|
| Admin | `AdminLayout.tsx` | `<main>` | `custom-scrollbar scrollbar-stable` |
| Nursing | `NursingLayout.tsx` | `<main>` | `custom-scrollbar scrollbar-stable` |
| Doctor | `DoctorLayout.tsx` | `<main>` | Standard global (flows naturally) |
| Pharmacy | `PharmacyLayout.tsx` | `<div>` | `custom-scrollbar scrollbar-stable` |
| Laboratory | `LaboratoryLayout.tsx` | `<div>` | `custom-scrollbar scrollbar-stable` |

## Sidebar Scroll Containers

| Sidebar | File | Class Applied | Rationale |
|---|---|---|---|
| Admin Sidebar | `AdminSidebar.tsx` | `custom-scrollbar` | Admin nav shows scrollbar for discoverability |
| Doctor Sidebar | `DoctorSidebar.tsx` | `scrollbar-hide` | Clean, minimal sidebar |
| Nursing Sidebar | `NursingSidebar.tsx` | `scrollbar-hide` | Clean, minimal sidebar |
| Reception Sidebar | `ReceptionSidebar.tsx` | `scrollbar-hide` | Clean, minimal sidebar |
| Medical Sidebar | `MedicalSidebar.tsx` | `scrollbar-hide` | Clean, minimal sidebar |

## Consultation Workspace (Critical Path)

| Zone | Element | Class | Notes |
|---|---|---|---|
| Full Page | `div.clinical-workspace` | `overflow: hidden` | Prevents page scroll leak |
| Side Panel | `aside.clinical-sidebar` | `overflow: hidden scrollbar` | No visible scrollbar |
| Main Area | `main.clinical-main-area` | `overflow: hidden` | Contains scroll within |
| Tab Strip | `div.h-scroll-strip` | Horizontal only, hidden | Chip-row pattern |
| **Tab Content** | `div.clinical-tab-content` | `overflow-y: auto` | **THE ONLY scroll zone** |
| Order Cart (Inv.) | `div.scrollbar-thin` | `overflow-y: auto max-h-650px` | Controlled inner panel |
| Rx Hub | `div.scrollbar-thin` | `overflow-y: auto max-h-650px` | Controlled inner panel |

## Modal Containers

| Modal | File | Class Applied |
|---|---|---|
| Edit Patient Modal | `EditPatientModal.tsx` | `custom-scrollbar` |
| Time Slots Grid | `book/page.tsx` | `custom-scrollbar` (no max-h) |

## Nursing Module

| Component | File | Class Applied |
|---|---|---|
| Investigation List | `lab-reports/page.tsx` | `custom-scrollbar` |
| Waiting Display | `waiting-display/page.tsx` | `scrollbar-hide` |

## Public Pages

| Component | File | Class Applied |
|---|---|---|
| Waiting Screen Patient List | `waiting-screen/page.tsx` | `custom-scrollbar` |

## Horizontal Scroll Strips

| Component | File | Class Applied |
|---|---|---|
| Follow-up Filter Tabs | `followup-call-list/page.tsx` | `scrollbar-hide` |
| Consultation Tab Bar | `consultation/page.tsx` | `h-scroll-strip` |

---

# Document 3: CONSULTATION_SCROLL_REFACTOR.md

## Problem Statement

The doctor consultation workspace (`/opd/doctor/consultation/[caseId]`) exhibited multiple scroll-related issues:

1. **Nested scrollbars**: `consultation/page.tsx` had `overflow-y-auto` at the page level AND tab components had `max-h-[550px] overflow-y-auto` inside — creating double scrollbars
2. **Layout jitter**: Fixed heights like `h-[750px]` on sticky panels didn't adapt to viewport, causing overflow clipping
3. **Performance issues**: Multiple independent scroll containers triggered separate paint layers
4. **UX regression**: The tab bar had `sticky top-24` which conflicted with a scrolling parent

## Scroll Architecture (Before)

```
┌─ DoctorLayout.tsx (min-h-screen, no overflow) ──────────────┐
│  ┌─ consultation/page.tsx (flex-1 overflow-y-auto) ─────┐   │
│  │  ┌─ PatientSidePanel (overflow-y-auto) ────────────┐ │   │
│  │  │  ... scrollbar 1                                 │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │  ┌─ Tab Content Area ──────────────────────────────┐ │   │
│  │  │  ┌─ InvestigationsTab ─────────────────────────┐│ │   │
│  │  │  │  Drug List (max-h-550 overflow-y-auto) ←─── │││ │  │
│  │  │  │  Order Cart (h-750px overflow-y-auto)  ←─── │││ │  │
│  │  │  └─────────────────────────────────────────────┘│ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
PROBLEM: 3+ nested scroll containers, jitter, double scrollbars
```

## Scroll Architecture (After)

```
┌─ DoctorLayout.tsx ──────────────────────────────────────────┐
│  ┌─ clinical-workspace (h-screen, overflow:hidden) ──────┐  │
│  │                                                        │  │
│  │  ┌─ SessionTopBar (flex-shrink-0) ───────────────────┐│  │
│  │  └────────────────────────────────────────────────────┘│  │
│  │                                                        │  │
│  │  ┌─ clinical-workspace-body (flex, overflow:hidden) ─┐│  │
│  │  │  ┌─ clinical-sidebar ──────────────────────────┐  ││  │
│  │  │  │  PatientSidePanel (scrollbar hidden)         │  ││  │
│  │  │  └──────────────────────────────────────────────┘  ││  │
│  │  │  ┌─ clinical-main-area (flex col, overflow:hidden)┐││  │
│  │  │  │  ┌─ Tab Strip (h-scroll-strip) ──────────────┐│││  │
│  │  │  │  └──────────────────────────────────────────┘│││  │
│  │  │  │  ┌─ clinical-tab-content ← ONLY SCROLL ZONE ┐│││  │
│  │  │  │  │  Tab component content flows naturally    ││││  │
│  │  │  │  │  Order/Rx panels: max-h-650px scrollbar-thin│││  │
│  │  │  │  └──────────────────────────────────────────┘│││  │
│  │  │  └────────────────────────────────────────────────┘││  │
│  │  └──────────────────────────────────────────────────────┘│  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
RESULT: Single scroll context, no jitter, no nested scrollbars
```

## CSS Classes Added to globals.css

```css
.clinical-workspace      { height: 100vh; overflow: hidden; }
.clinical-workspace-body { flex: 1; overflow: hidden; min-height: 0; }
.clinical-main-area      { flex: 1; overflow: hidden; min-height: 0; }
.clinical-tab-content    { flex: 1; overflow-y: auto; min-height: 0; }
.clinical-sidebar        { overflow-y: auto; scrollbar-width: none; }
```

## Components Modified

| Component | Change |
|---|---|
| `consultation/page.tsx` | Full rewrite with `clinical-workspace` architecture |
| `PatientSidePanel.tsx` | `no-scrollbar` → `clinical-sidebar` |
| `InvestigationsTab.tsx` | Removed `max-h-[550px]` list cap; cart `h-750px` → `max-h-650px` |
| `PrescriptionTab.tsx` | Removed `max-h-[600px]` list cap; hub `h-750px` → `max-h-650px` |
| `ProceduresTab.tsx` | Removed `max-h-[550px]` list cap; panel `h-750px` → `max-h-650px` |
| `ImagesTab.tsx` | Removed `flex-1 overflow-y-auto` inner wrapper |

## Performance Impact

- **Before**: 4-6 independent scroll containers per page → multiple browser paint layers
- **After**: 1 scroll container + 2 capped sub-panels → minimal paint overhead
- **Sticky positioning**: Tab strip now works correctly in a non-scrolling flex parent
- **Touch scrolling**: `overscroll-behavior: contain` prevents body scroll bleed on iOS
