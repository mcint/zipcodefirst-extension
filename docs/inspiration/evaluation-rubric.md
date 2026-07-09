# Evaluation rubric

Score each implementation from 0–5 on each axis.

## User value

- Keystrokes saved.
- Time saved to valid street-entry focus.
- Mobile keyboard correctness.
- Reduced dropdown interaction.
- Low surprise: user can see and edit what changed.

## Correctness

- Correct postal-code parsing.
- Handles ZIP+4.
- Handles unknown ZIP.
- Handles multiple city names.
- Does not claim deliverability validation.
- Does not claim legal/jurisdiction inference.

## Form compatibility

- Works with semantic HTML.
- Works with weakly labeled fields.
- Works with native selects.
- Works with controlled inputs.
- Does not overwrite wrong fields.
- Handles shipping/billing distinction.

## Web-platform citizenship

- Adds/uses correct `autocomplete` tokens.
- Adds/uses correct `inputmode` hints.
- Cooperates with browser autofill.
- Does not degrade accessibility.
- Does not persist user address data unless explicitly requested.

## Privacy/security

- Sends only the postal code for lookup in v0.
- Does not scrape full page contents.
- Does not auto-run on every page.
- Uses least-privilege extension permissions.
- Documents provider and data-flow tradeoffs.

## Maintainability

- Small codebase.
- Provider interface exists.
- Country profiles are data-driven.
- Test fixtures exist.
- Edge cases are documented.
- Failures are visible and reversible.
