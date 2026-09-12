# Product Catalog App

A small product catalog app built with **Expo (React Native) + TypeScript**, using the [DummyJSON](https://dummyjson.com/) API. Built as a technical assessment for Neurogine's Junior Mobile Developer role.

## How to run

```bash
npm install
npx expo start
```

Then scan the QR code with **Expo Go** (iOS/Android), or press `i` / `a` for a simulator/emulator, or `w` for web.

## Stack

- **Expo SDK 57** + **expo-router** (file-based routing)
- **React Native** + **TypeScript**
- **expo-image** for image loading, placeholders, and caching
- No external state management library — plain React hooks were enough for this scope

## Architecture

Code is split into two layers:

```
src/
  data/products/       # data layer — knows nothing about UI
    types.ts           # Product / ProductListResponse shapes
    api.ts             # fetch calls to DummyJSON, throws on non-OK responses
    use-products.ts     # list state: pagination, loading, error, refresh
    use-product.ts       # single product state: loading, error, retry
    use-product-search-index.ts  # background fetch of the full catalog for search

  app/                  # UI layer (screens, expo-router routes)
    index.tsx           # product list screen
    product/[id].tsx     # product detail screen

  components/
    product-list-item.tsx  # single row in the list
    themed-*.tsx            # existing template components, reused for consistent styling
```

The rule of thumb: `data/` files only talk to `fetch` and React state — they don't import any UI component or render anything. `app/` and `components/` files only consume hooks from `data/` and decide how to render loading/error/empty/success — they never call `fetch` directly. This keeps the API/data logic testable and swappable independent of the UI.

## Key decisions

- **Search: client-side filtering, not the `/search` endpoint.** Reasoning: no per-keystroke network round-trip, faster and simpler for a dataset this size. Debounced at 300ms (see `use-debounced-value.ts`) so filtering doesn't run on every keystroke.
  - Caveat discovered during testing: DummyJSON's first page (`skip=0`) is mostly beauty/furniture/groceries, so filtering only against the *loaded* list missed obvious searches like "phone". Fixed by adding `use-product-search-index.ts`, which fetches the full 194-product catalog once in the background (`limit=0`) specifically for search, while the paginated list (`use-products.ts`) stays untouched. If that background fetch hasn't completed yet (or fails), search falls back to filtering only the currently loaded products.
- **Two loading states, not one.** `isLoading` (full-screen spinner, first load) is kept separate from `isLoadingMore` (small footer spinner, pagination) and `isRefreshing` (pull-to-refresh) — so the list doesn't flash blank when the user is just loading more or refreshing.
- **Errors are thrown from the data layer, caught in the UI layer.** `api.ts` throws when `response.ok` is false; the screens decide what to show (retry button) and how. This keeps `api.ts` UI-agnostic.
- **Stack navigation only** (no tabs) — the assessment only needed a List → Detail flow, so the default Expo tab template was removed to keep the app focused.

## Bonus features implemented

- Pull-to-refresh on the product list
- Image loading placeholder (blurhash) and a fallback box on image load error (list thumbnails)

## Known limitations / TODO

- [ ] Detail screen's product images don't have the same placeholder/error-fallback treatment as list thumbnails (list item has it, detail gallery doesn't yet).
- [ ] Search only covers the `title` field, not `description`/`category`/`brand`.
- [ ] No offline caching — every screen refetches on mount.

## A note on AI usage

I used Claude Code as a pair-programming/mentor tool while building this, since I'm still new to Expo/React Native. For each feature, it explained the relevant concept (hooks, expo-router conventions, debouncing, etc.) and gave me a reference snippet, which I typed into the project myself and tested. I made the calls on the architecture (2-layer split, client-side search) and the scope decisions above; I found and understood the bugs that came up along the way (e.g. `Link asChild` not forwarding `onPress` to a plain `View`, the search-index staleness issue) with its help debugging, rather than it silently fixing things without me seeing why.
