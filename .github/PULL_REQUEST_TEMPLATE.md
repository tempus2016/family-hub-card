<!--
Thanks for contributing to the Family Hub card! Please fill in the sections below.
Keep PRs focused — one logical change per PR is easier to review and release.
-->

## Summary

<!-- What does this PR do, and why? One or two sentences is fine. -->

## Related issue

<!-- Link the issue this closes so it auto-closes on merge, e.g. "Closes #123".
     If there's no issue, say "N/A" and explain the motivation above. -->

Closes #

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (a config option changed name, default or meaning)
- [ ] Documentation only
- [ ] CI / tooling / chore

## How has this been tested?

<!-- Describe how you verified the change. Unit tests are the floor, not the
     ceiling: anything that changes what the card renders must also be looked
     at on a real Home Assistant instance. -->

- [ ] `npm run lint` passes locally
- [ ] `npm test` passes locally
- [ ] `npm run build` run, and `dist/family-hub-card.js` committed if `src/` changed
- [ ] Exercised on a live Home Assistant instance (hard-refreshed, console clean)
- [ ] Checked at both tablet and phone width (the layout switches at 640px)

## Checklist

- [ ] My code follows the existing patterns in the codebase
- [ ] New behaviour has a test in `test/` — data-layer logic is covered by pure
      unit tests, not left to manual checking
- [ ] Config changes are reflected in the README table **and** the wiki
- [ ] Any non-obvious decision is explained in a comment saying *why*, not *what*
- [ ] I bumped `package.json` `version` if this is a release-bound change
- [ ] I did **not** add Claude / AI co-author attribution to commits or files

## Screenshots / recordings

<!-- For anything visual, drag in before/after screenshots. A photo of the
     actual wall tablet beats a desktop screenshot for layout changes. -->
