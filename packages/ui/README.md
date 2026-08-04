# @vstack/ui themes

Shared primitives read CSS variables from `styles.css`. **Ledger** is the
default. Set `data-vstack-theme` on `<html>` (or a preview root) to switch looks.

| Theme | Method | Direction |
|---|---|---|
| `ledger` | **Default** | Studio editorial: Bricolage + DM Sans, indigo, soft depth, quiet strip footer |
| `harbor` | Alternate | Cool slate product chrome, steel blue, soft elevation |
| `paper` | Legacy | Cream / terracotta neo-brutalist (opt-in) |
| `atelier` | Alternate | Stone neutrals, teal craft accent, calm spacing |
| `signal` | Anthropic `frontend-design` skill | Syne + IBM Plex, electric blue edge accent |

Theme metadata is exported from `@vstack/ui/themes`
(`VSTACK_DEFAULT_THEME`, `VSTACK_THEMES`). Preview all five at `/design-lab` in
`apps/_template-next-public`.
