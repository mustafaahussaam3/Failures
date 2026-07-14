# Push Workflow

After every push to `main`, verify that GitHub Pages is serving the same `index.html` that GitHub raw serves.

1. Push changes to `main`.
2. Wait 30â€“90 seconds for GitHub Pages to rebuild.
3. Run:

   ```powershell
   node scripts/check-live-site.mjs
   ```

4. The check must show `OK: live site is serving define-safe-2026-07-14-04`.
5. If the live site is stale, push a tiny rebuild trigger such as touching `.nojekyll`, then run the check again.

The check verifies both:

- the visible build marker is on the live website
- the communication cards contain `SAVE ID / COMMENT`

