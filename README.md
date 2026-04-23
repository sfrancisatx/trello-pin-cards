# Pin Cards Power-Up

A Trello Power-Up that marks cards as "pinned" and automatically syncs a **Pinned** label so you can use Trello's native filter to keep those cards visible.

## What It Does

- **Pin/Unpin button on cards** - Adds a 📌 Pin Card / Unpin Card button in the card's Power-Ups menu (🚀 rocket icon at the bottom of the card)
- **Visual badge** - Pinned cards display a 📌 Pinned badge on the board view
- **Board overview** - A 📌 Pinned Cards button at the top of the board opens a popup listing all pinned cards (ignores filters)
- **Automatic "Pinned" label sync** - When you pin a card, a red "Pinned" label is added via the Trello REST API. Unpinning removes it. The label is created on the board automatically the first time it's needed.
- **Per-user authorization** - Each user authorizes the Power-Up once via the 🔑 Authorize Pin Cards button. Authorization never expires unless manually revoked.

## What It Does NOT Do

> **Important**: This Power-Up **cannot** force pinned cards to stay visible when Trello's board filter is active. The Trello Power-Up API does not expose any way to override filter behavior.

**Workaround**: Use Trello's filter with the **Pinned** label included. Trello filters use OR logic across labels, so:

- Filter by `Due this week` only → shows cards due this week (pinned cards still hidden if they don't match)
- Filter by `Due this week` **AND** `Pinned` label → shows cards due this week **OR** any pinned card

So in practice: check the **Pinned** label in your filter alongside whatever else you're filtering by, and pinned cards will stay visible.

## Usage

### New Trello UI note
Power-Up buttons live behind the 🚀 rocket icon:
- **Card buttons** - 🚀 rocket icon at the bottom of an open card
- **Board buttons** - 🚀 rocket icon at the top right of the board

### First-time setup (per user)

1. Open any card → click 🚀 → click **🔑 Authorize Pin Cards**
2. Click **Authorize** in the popup → approve in the Trello auth dialog
3. Done. The authorize button will no longer appear.

### Pin a card

1. Open a card → click 🚀 → click **📌 Pin Card**
2. The card gets a 📌 Pinned badge and a red "Pinned" label

### Unpin a card

1. Open a pinned card → click 🚀 → click **📌 Unpin Card**
2. Badge and label are removed

### View all pinned cards

1. Click 🚀 at the top right of the board → click **📌 Pinned Cards**
2. Popup lists all currently-pinned cards, regardless of any active filter
3. Click a card in the list to open it

### Filter to include pinned cards

1. Open Trello's **Filter** panel
2. In the Labels section, check **Pinned**
3. Combine with any other filter criteria — pinned cards will remain visible alongside matching cards

## How It Works

- Pin state is stored per-card via Trello's Power-Up plugin data (shared scope)
- Labels are managed via the Trello REST API using a per-user OAuth token obtained through `t.getRestApi().authorize()`
- The "Pinned" label is auto-created on the board (red, name "Pinned") the first time it's needed

## Required Capabilities

Enabled in the Trello Power-Up admin:
- `card-buttons`
- `card-badges`
- `board-buttons`
- `show-settings`
- `authorization-status`
- `show-authorization`

API Key is configured in the admin with `https://sfrancisatx.github.io` as an allowed origin.

## Files

- `manifest.json` - Power-Up configuration
- `index.html` - Main entry point (loads client.js)
- `client.js` - Power-Up capability handlers and REST API logic
- `authorize.html` - Authorization popup
- `pinned-cards.html` - Board-button popup listing pinned cards
- `settings.html` - Settings/help page

## Deployment

Hosted on GitHub Pages at `https://sfrancisatx.github.io/trello-pin-cards/`. Pushing to `main` auto-deploys via `.github/workflows/pages.yml`.

Manifest URL: `https://sfrancisatx.github.io/trello-pin-cards/manifest.json`

## Known Limitations

- Cannot override Trello's native filter (API limitation). Use the "Pinned" label filter as a workaround.
- Each user must authorize the Power-Up once to enable label sync. Users who haven't authorized can still pin cards (badge works) but the label won't be added for them.
- If the API key in the admin is regenerated, all users must re-authorize.
