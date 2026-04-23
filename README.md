# Pin Cards Power-Up

A Trello Power-Up that allows you to pin cards so they remain visible even when board filters are applied.

## Features

- **Pin/Unpin Cards**: Add a button to each card to toggle pin status
- **Visual Badge**: Pinned cards display a 📌 badge
- **Board Overview**: Board button to view all pinned cards at once
- **Persistent**: Pin state is saved and persists across sessions

## Installation

### For Development/Testing

1. Start a local web server in this directory:
   ```bash
   python3 -m http.server 8080
   ```

2. In Trello, go to your board and click "Power-Ups"

3. Click "Custom Power-Ups" (you may need to enable this in your Trello settings)

4. Click "New Power-Up"

5. Enter the manifest URL:
   ```
   http://localhost:8080/manifest.json
   ```

6. Enable the Power-Up on your board

### For Production

1. Host these files on a public web server (GitHub Pages, Netlify, etc.)

2. Update the manifest URL to point to your hosted location

3. Follow the same steps as above, using your production URL

## Usage

### Pin a Card

1. Open any card
2. Click the "Pin Card" button in the card buttons section
3. The card will now show a 📌 badge

### Unpin a Card

1. Open a pinned card
2. Click the "Unpin Card" button
3. The pin badge will be removed

### View All Pinned Cards

1. Click the 📌 "Show Pinned Cards" button in the board header
2. A popup will show all pinned cards
3. Click any card in the list to open it

## How It Works

The Power-Up uses Trello's plugin data storage to save the pin state for each card. This data is:
- Stored per-card
- Shared across all board members
- Persistent across sessions

**Note**: While this Power-Up marks cards as "pinned", Trello's native filtering system will still hide cards based on filter criteria. The pin badge and board button help you quickly identify and access pinned cards, but they won't override Trello's built-in filters.

## Files

- `manifest.json` - Power-Up configuration
- `index.html` - Main entry point
- `client.js` - Power-Up logic
- `pinned-cards.html` - Popup to show all pinned cards
- `settings.html` - Settings/help page

## Limitations

- Trello's native filter will still hide cards even if they're pinned
- The Power-Up cannot override Trello's built-in filtering behavior
- Use the "Show Pinned Cards" board button to quickly access pinned cards when filters are active
