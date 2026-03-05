
Goal: stop the error loop and restore trust by forcing production parity first, then re-adding depth safely.

What I found
1) The app is not one coherent responsive system yet.  
- Home/Index/News/Intel are mostly mobile-first.  
- Supplier/Admin/RFQ/Orders still contain desktop-heavy patterns (large paddings, dense tables, min-width table layouts, weak mobile overflow handling).  
This makes “some screens look fine” while others feel broken on real devices.

2) You likely have stability gaps, not just styling gaps.  
- Many async handlers across auth/dashboards/flows do not consistently guard errors with a single UI-safe pattern.  
- No global error boundary/unhandled rejection fallback to prevent “one failing request = broken screen feel”.

3) Production parity needs one source of truth for layout tokens and breakpoints across all views (not page-by-page fixes).

Do I know what the issue is?
Yes. The core issue is architectural inconsistency + missing runtime safety nets, not one isolated CSS bug.

Recommended path (Parity first, both mobile + desktop, keep in Lovable)
Phase 1 — Stabilization baseline (must do first)
- Add app-wide error boundary + unhandled promise rejection handler (non-fatal UX).
- Standardize viewport/safe-area and fixed layer stacking (ticker, sidebar, bottom nav, AI panel).
- Create shared responsive layout primitives:
  - PageShell
  - SectionHeader
  - CardGrid (mobile snap / desktop grid)
  - TableToCards adapter for mobile
- Freeze one spacing/type scale token set and apply everywhere.

Phase 2 — Rewrite broken views into shared primitives
Priority order:
1. Orders
2. RFQ Manager
3. Supplier Dashboard
4. Admin Console
Then quick polish pass on Marketplace/Details/News/Intel to align spacing and interaction density.

Key rewrite rules
- No desktop-only table without mobile card fallback.
- No horizontal overflow unless intentionally snap-scroll.
- All charts get explicit height wrappers.
- Every long list has min-w-0 and truncation strategy.
- No page-specific magic offsets; use shared shell only.

Phase 3 — Production parity hardening
- Build and test with production build constraints (not dev assumptions).
- Verify route-by-route at mobile + desktop breakpoints:
  - 390x844, 768x1024, 1366x768, 1920x1080
- Add acceptance checklist before marking done.

Files to target first
- App.tsx (global shell, error handling mount)
- index.css (layout tokens + layer rules only)
- views/Orders.tsx
- views/RFQManager.tsx
- views/SupplierDashboard.tsx
- views/AdminConsole.tsx
- components/Sidebar.tsx, components/BottomNav.tsx, components/GrainAI.tsx (stacking and safe-area consistency)

Acceptance criteria (definition of “fixed”)
- No horizontal overflow on any primary route.
- No clipped hero/content under ticker/sidebar/nav.
- Dashboards usable on phone without pinch/side-scroll hacks.
- No white-screen/broken-feel from async failures.
- Visual parity between dev preview and production build behavior.

Execution strategy to avoid another failure loop
- Deliver in small checkpoints, not “rewrite everything at once”:
  1) Global shell + error safety
  2) Orders + RFQ mobile rewrite
  3) Supplier + Admin mobile rewrite
  4) Final parity polish + regression pass
- After each checkpoint, test end-to-end on both mobile and desktop before moving on.

If you still want Claude Code later
You can use it, but the exact same phased plan above is what you should give it; the issue is process/architecture, not model choice.
