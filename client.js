/* global TrelloPowerUp */

// Pin icon as data URL (📌 emoji as SVG)
const PIN_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48dGV4dCB4PSIwIiB5PSIyMCIgZm9udC1zaXplPSIyMCI+8J+TjDwvdGV4dD48L3N2Zz4=';

var PINNED_CARD_KEY = 'pinned';

// Initialize the Power-Up
TrelloPowerUp.initialize({
  // Add badge to pinned cards
  'card-badges': function(t, options) {
    return t.get('card', 'shared', PINNED_CARD_KEY)
      .then(function(isPinned) {
        if (isPinned) {
          return [{
            icon: PIN_ICON,
            text: 'Pinned',
            color: 'red'
          }];
        }
        return [];
      })
      .catch(function() {
        // Silently fail if session not available
        return [];
      });
  },

  // Add pin/unpin button to cards
  'card-buttons': function(t, options) {
    return t.get('card', 'shared', PINNED_CARD_KEY)
      .then(function(isPinned) {
        return [{
          icon: PIN_ICON,
          text: isPinned ? 'Unpin Card' : 'Pin Card',
          callback: function(t) {
            return t.set('card', 'shared', PINNED_CARD_KEY, !isPinned)
              .then(function() {
                return t.closePopup();
              });
          }
        }];
      })
      .catch(function() {
        // Silently fail if session not available
        return [];
      });
  },

  // Add board button to show all pinned cards
  'board-buttons': function(t, options) {
    return [{
      icon: PIN_ICON,
      text: 'Show Pinned Cards',
      callback: function(t) {
        return t.popup({
          title: 'Pinned Cards',
          url: './pinned-cards.html',
          height: 300
        });
      }
    }];
  },

  // Settings to manage the power-up
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Pin Cards Settings',
      url: './settings.html',
      height: 184
    });
  }
});

console.log('Pin Cards Power-Up loaded');
