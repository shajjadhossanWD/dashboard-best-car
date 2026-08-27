# BestCar - Admin Dashboard

Store admin dashboard built with **React 18, Vite, Tailwind CSS and Redux Toolkit**,
backed by a mock API layer.

The charts, world map, dropdowns, date-range picker, table and pagination are all
built in this repo - no charting library, UI kit or date-picker package. Total bundle
is roughly 114 kB gzipped.

**Author:** shajjadhossanWD &lt;shajjadhossan111@gmail.com&gt;

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

Optional: set `VITE_API_FAILURE_RATE=0.3` in a `.env` file to make the mock API fail
randomly and exercise the error/retry states. See `.env.example`.

## Screens

| Route | Screen |
|---|---|
| `/` | Dashboard - KPIs, best sellers, recent transactions, sales analytics, sales by country |
| `/inventory/products` | Products - full catalogue table (Best Seller "View All") |
| `/sales` | Sales - full order table (Recent Transactions "View All") |

Every other sidebar link routes to a placeholder page, so navigation can be walked
end to end.

## Features

**Dashboard**

- Date range filter (presets + custom range) driving the earnings card, best sellers
  and the transaction table. The earnings card retitles itself Weekly / Monthly /
  Quarterly from the range length, and its delta compares against the equally long
  preceding range.
- Transaction status filter, analytics year picker, sales-by-country period picker.
- Area chart with hover crosshair and tooltip; arrow keys step through months.
- World map choropleth with hover/focus tooltips and a ramp legend.
- Collapsible sidebar (icon rail on desktop, drawer under `lg`). Collapse state and
  open nav groups persist to `localStorage`.

**Products / Sales tables**

- Debounced search, dimension filters, sortable columns and pagination - all handled
  in the API layer, not in the component.
- Summary tiles that reflect the active filters.
- The dashboard passes its date range through the URL on "View All", so the figures
  match what was clicked. Filtered views are shareable links.
- Stacked cards instead of a table below `sm`.

Every widget owns its own loading, error and retry state, so one failed request never
blanks the page.

## Project structure

```
src/
├── api/                   # transport + endpoints
│   ├── client.js          # latency, abort handling, injectable failure rate
│   ├── query.js           # shared search / sort / paginate pipeline
│   ├── dashboardApi.js
│   ├── productsApi.js
│   └── salesApi.js
├── mocks/                 # deterministic data generators
│   ├── seed.js            # hash + mulberry32 PRNG
│   └── db.js              # catalogue, daily metrics, monthly series, regions
├── store/
│   ├── index.js           # store + localStorage persistence
│   ├── createResource.js  # shared async-resource convention
│   ├── createListSlice.js # factory for the list screens
│   ├── useListPage.js     # wires a list slice to a screen
│   └── slices/            # ui, session, dashboard, products, sales
├── components/
│   ├── ui/                # Card, Button, Badge, DataTable, Dropdown, Pagination, ...
│   ├── charts/            # AreaChart, WorldMap, ChartTooltip, scale, geometry
│   ├── layout/            # AppLayout, Sidebar, Topbar, SearchBar, Footer
│   └── illustrations/
├── features/
│   ├── dashboard/
│   ├── products/
│   └── sales/
├── hooks/                 # useClickOutside, useMediaQuery, useElementSize, useDebouncedValue
├── lib/                   # cn, format, date
├── constants/             # navigation model, brand
├── pages/                 # placeholder, 404
└── routes/
```

## Notes on the approach

**No hard-coded content.** Names, prices, greetings, store list, statuses and every
figure come from the API layer. Moving to a real backend means rewriting the function
bodies in `api/` - components, slices and hooks are untouched.

**Deterministic mock data.** `mocks/db.js` derives each day's metrics from the date
via a seeded PRNG, so any range produces consistent figures and a refetch never makes
numbers jump. Filters therefore actually filter: the transaction list walks backwards
day by day and stops once it has enough rows, so a one-year range costs no more than
a one-week range.

**One resource convention.** `store/createResource.js` gives every remote value the
same `{ data, status, error, receivedAt }` shape and the same pending/fulfilled/rejected
handling. Stale data stays on screen while refreshing so the layout does not jump, and
superseded requests are aborted rather than allowed to overwrite newer ones.

**One list-screen factory.** Products and Sales share `store/createListSlice.js` and
`store/useListPage.js` for filter state, page resets, search debouncing, request
aborting and the URL range hand-off. Each screen supplies only its columns, filters
and endpoint.

**Server-shaped list contract.** List endpoints take `{ search, sortBy, sortDir, page,
pageSize }` and return one page plus `{ total, pageCount, from, to }`.

**Design tokens in `tailwind.config.js`.** Components use semantic names - `brand-500`,
`ink-muted`, `line`, `surface-sunken` - rather than raw hex values.

## Charts

Plain SVG against a measured container:

- A single series carries no legend; the card title names it. Grid and axes are
  recessive, the line is 2 px, and resting dots mark each period without labelling
  every point.
- The map uses a sequential single-hue ramp because it encodes magnitude, with a
  legend since the lighter steps fall under 3:1 contrast.
- Tooltips measure themselves so a wide label near a card edge is nudged back inside
  instead of being clipped.

## Responsive

- `< 640px` - single column, sidebar becomes a drawer, tables become stacked card
  lists, chart height and tick density drop, summary tiles go 2-up and drop their icons.
- `640–1279px` - two-column KPI row, full-width widgets, real tables.
- `≥ 1280px` - three-column layout.

Dropdown panels measure themselves on open and shift back inside the viewport, so a
card-header filter opens correctly at any width rather than only where its fixed
alignment happens to fit.
