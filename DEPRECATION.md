# Deprecation & forwarding

This repository is **deprecated**. Its functionality is superseded by the
**Charité Imaging Classification (ChIC)**:

- Live app: <https://halbritter-lab.github.io/ChIC/>
- Repository: <https://github.com/halbritter-lab/ChIC>
- Tracking issue: [halbritter-lab/ChIC#34](https://github.com/halbritter-lab/ChIC/issues/34)

This document is the design record for the deprecation notice and the ordered
checklist for taking it fully live.

## Decisions

- **Tone: "superseded, but still usable."** The banner states the tool is no
  longer maintained and points to ChIC, but the app keeps working. The method
  implemented here is published ([PMID:36246085](https://pubmed.ncbi.nlm.nih.gov/36246085/)),
  so we do not block access to it. ChIC implements the newer Charité Imaging
  Classification (classes A–E).
- **No surprise auto-redirect.** Auto-redirecting users off a working page is a
  known UX anti-pattern; the banner gives a clear, explicit "Open ChIC" link
  instead.
- **The notice is framework-independent.** It lives as static markup + inline
  styles in [`index.html`](./index.html), *outside* `#app`. It therefore paints
  immediately, requires no JavaScript, and remains visible even if the Vue app
  fails to boot. Vue mounts into `#app`, a sibling node it never touches.
- **The banner sits above the disclaimer modal** (`z-index: 2147483000` vs the
  modal's `1001`) so the notice is never hidden behind the first-load gate.

## What this PR changes (safe to merge; auto-deploys on push to `main`)

- `index.html` — deprecation banner, updated `<title>`, and a `<meta name="description">` announcing the move.
- `README.md` — a `> [!WARNING]` deprecation callout at the top; historical content preserved below.
- `DEPRECATION.md` — this file.

No application logic, component, or chart code is touched.

## Activation checklist (repo-admin actions — do in this order)

These cannot live in a code PR and must be done by a maintainer. **Order
matters** because archiving makes the repository read-only.

1. **Confirm timing.** Per [ChIC#34](https://github.com/halbritter-lab/ChIC/issues/34),
   @CBrigl asked to hold off until the new classes are accepted/published.
   Get a maintainer's go-ahead before marking this PR "Ready for review" and merging.
2. **Merge this PR to `main`.** The `github pages` workflow rebuilds and
   publishes to the `gh-pages` branch, so the banner goes live at
   <https://halbritter-lab.github.io/pld-progression-grouper/>.
3. **Verify** the banner and the "Open ChIC" link on the live site.
4. **Update the repository description** to prefix `[DEPRECATED]`:
   ```bash
   gh repo edit halbritter-lab/pld-progression-grouper \
     --description "[DEPRECATED] Superseded by ChIC (https://github.com/halbritter-lab/ChIC). PLD-Progression Grouper — visualize and analyze the progression of Polycystic Liver Disease (PLD)."
   ```
5. **Add deprecation topics:**
   ```bash
   gh repo edit halbritter-lab/pld-progression-grouper --add-topic deprecated --add-topic archived
   ```
6. **Archive the repository last** (makes it read-only; do this *after* the
   README change is merged, since an archived repo's README can no longer be
   edited). Unarchive if further edits are ever needed:
   ```bash
   gh repo archive halbritter-lab/pld-progression-grouper
   ```
7. **Close the loop:** update/close [ChIC#34](https://github.com/halbritter-lab/ChIC/issues/34).

## Notes

- GitHub Pages does not let us set HTTP `Sunset`/`Deprecation` response headers,
  so deprecation is signalled in-page (banner, `<title>`, `<meta>`) and in the
  README rather than via headers.
- The `gh-pages` branch is build output; do not edit it by hand — merging to
  `main` regenerates it.
