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

// Add or remove the "Pinned" label on a card using pre-fetched card/token info
function updateLabel(cardId, boardId, token, apiKey, shouldPin) {
  return ensurePinnedLabel(null, token, apiKey, boardId)
    .then(function(label) {
      return fetch('https://api.trello.com/1/cards/' + cardId + '?fields=idLabels&key=' + apiKey + '&token=' + token)
        .then(function(res) { return res.json(); })
        .then(function(cardData) {
          var hasLabel = (cardData.idLabels || []).indexOf(label.id) !== -1;
          if (shouldPin && !hasLabel) {
            return fetch('https://api.trello.com/1/cards/' + cardId + '/idLabels?value=' + label.id +
              '&key=' + apiKey + '&token=' + token, { method: 'POST' });
          } else if (!shouldPin && hasLabel) {
            return fetch('https://api.trello.com/1/cards/' + cardId + '/idLabels/' + label.id +
              '?key=' + apiKey + '&token=' + token, { method: 'DELETE' });
          }
        });
    });
}

// Initialize the Power-Up
var APP_KEY = 'd700a75532f7a75fa31df0f8b9433749';
var APP_NAME = 'Pin Cards';

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
    return Promise.all([
      t.get('card', 'shared', PINNED_CARD_KEY),
      t.getRestApi().isAuthorized().catch(function() { return false; })
    ]).then(function(results) {
      var isPinned = results[0];
      var isAuthorized = results[1];
      var buttons = [{
        text: isPinned ? '📌 Unpin Card' : '📌 Pin Card',
        callback: function(t) {
          var newState = !isPinned;
          var ctx = t.getContext();
          var cardId = ctx.card;
          var boardId = ctx.board;
          var apiKey = t.getRestApi().appKey;
          var token;
          return t.getRestApi().getToken()
            .then(function(tok) { token = tok; })
            .then(function() {
              return t.set('card', 'shared', PINNED_CARD_KEY, newState);
            })
            .then(function() {
              return t.closePopup();
            })
            .then(function() {
              if (token && cardId && boardId) {
                updateLabel(cardId, boardId, token, apiKey, newState)
                  .catch(function(err) { console.error('Label update failed:', err); });
              } else {
                console.warn('Missing data for label update:', { token: !!token, cardId: cardId, boardId: boardId });
              }
            });
        }
      }];
      if (!isAuthorized) {
        buttons.push({
          text: '🔑 Authorize Pin Cards',
          callback: function(t) {
            return t.popup({
              title: 'Authorize Pin Cards',
              url: './authorize.html',
              height: 140
            });
          }
        });
      }
      return buttons;
    }).catch(function() { return []; });
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

  // Tells Trello if the user has authorized the Power-Up
  'authorization-status': function(t, options) {
    return t.getRestApi().isAuthorized()
      .then(function(isAuthorized) {
        return { authorized: isAuthorized };
      });
  },

  // Shown when user clicks "Authorize Account" in the Power-Up menu
  'show-authorization': function(t, options) {
    return t.popup({
      title: 'Authorize Pin Cards',
      url: './authorize.html',
      height: 140
    });
  }
}, {
  appKey: APP_KEY,
  appName: APP_NAME
});

console.log('Pin Cards Power-Up loaded');
