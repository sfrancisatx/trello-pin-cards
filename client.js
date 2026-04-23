/* global TrelloPowerUp */

var PINNED_CARD_KEY = 'pinned';
var PINNED_LABEL_NAME = 'Pinned';
var PINNED_LABEL_COLOR = 'red';

// Get or create the "Pinned" label on the board
function ensurePinnedLabel(t, token, apiKey, boardId) {
  return fetch('https://api.trello.com/1/boards/' + boardId + '/labels?key=' + apiKey + '&token=' + token)
    .then(function(res) { return res.json(); })
    .then(function(labels) {
      var pinnedLabel = labels.find(function(l) { return l.name === PINNED_LABEL_NAME; });
      if (pinnedLabel) return pinnedLabel;
      // Create the label if it doesn't exist
      return fetch('https://api.trello.com/1/labels?name=' + encodeURIComponent(PINNED_LABEL_NAME) +
        '&color=' + PINNED_LABEL_COLOR + '&idBoard=' + boardId +
        '&key=' + apiKey + '&token=' + token, { method: 'POST' })
        .then(function(res) { return res.json(); });
    });
}

// Ensure the Power-Up is authorized, prompt if not
function ensureAuthorized(t) {
  return t.getRestApi().isAuthorized()
    .then(function(isAuthorized) {
      if (isAuthorized) return true;
      console.log('Not authorized, prompting user...');
      return t.getRestApi().authorize({
        scope: 'read,write',
        expiration: 'never'
      }).then(function() { return true; })
        .catch(function(err) {
          console.error('Authorization failed:', err);
          return false;
        });
    });
}

// Add or remove the "Pinned" label on a card
function togglePinnedLabel(t, shouldPin) {
  return ensureAuthorized(t)
    .then(function(authorized) {
      if (!authorized) {
        console.warn('User did not authorize - skipping label update');
        return;
      }
      return t.getRestApi().getToken();
    })
    .then(function(token) {
      if (!token) {
        console.warn('No token available');
        return;
      }
      var apiKey = t.getRestApi().appKey;
      console.log('Managing label, apiKey:', apiKey, 'shouldPin:', shouldPin);
      return t.card('id', 'idBoard', 'idLabels')
        .then(function(card) {
          return ensurePinnedLabel(t, token, apiKey, card.idBoard)
            .then(function(label) {
              var hasLabel = card.idLabels.indexOf(label.id) !== -1;
              if (shouldPin && !hasLabel) {
                return fetch('https://api.trello.com/1/cards/' + card.id + '/idLabels?value=' + label.id +
                  '&key=' + apiKey + '&token=' + token, { method: 'POST' });
              } else if (!shouldPin && hasLabel) {
                return fetch('https://api.trello.com/1/cards/' + card.id + '/idLabels/' + label.id +
                  '?key=' + apiKey + '&token=' + token, { method: 'DELETE' });
              }
            });
        });
    })
    .catch(function(err) {
      console.error('Failed to toggle pinned label:', err);
    });
}

// Initialize the Power-Up
TrelloPowerUp.initialize({
  // Add badge to pinned cards
  'card-badges': function(t, options) {
    return t.get('card', 'shared', PINNED_CARD_KEY)
      .then(function(isPinned) {
        if (isPinned) {
          return [{
            text: '📌 Pinned',
            color: 'red'
          }];
        }
        return [];
      })
      .catch(function() { return []; });
  },

  // Add pin/unpin button to cards
  'card-buttons': function(t, options) {
    return t.get('card', 'shared', PINNED_CARD_KEY)
      .then(function(isPinned) {
        return [{
          text: isPinned ? '📌 Unpin Card' : '📌 Pin Card',
          callback: function(t) {
            var newState = !isPinned;
            return t.set('card', 'shared', PINNED_CARD_KEY, newState)
              .then(function() {
                return togglePinnedLabel(t, newState);
              })
              .then(function() {
                return t.closePopup();
              });
          }
        }];
      })
      .catch(function() { return []; });
  },

  // Add board button to show all pinned cards
  'board-buttons': function(t, options) {
    return [{
      text: '📌 Pinned Cards',
      callback: function(context) {
        return context.popup({
          title: 'Pinned Cards',
          url: './pinned-cards.html',
          height: 300
        });
      }
    }];
  },

  // Settings
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Pin Cards Settings',
      url: './settings.html',
      height: 184
    });
  },

  // Authorization status for REST API
  'authorization-status': function(t, options) {
    return t.getRestApi().isAuthorized()
      .then(function(isAuthorized) {
        return { authorized: isAuthorized };
      });
  },

  // Show authorization popup
  'show-authorization': function(t, options) {
    return t.popup({
      title: 'Authorize Pin Cards',
      url: './authorize.html',
      height: 140
    });
  }
});

console.log('Pin Cards Power-Up loaded');
