/*
** Trello Redminer- https://....
** Trello and Redmine Integration
** Snappler - http://www.snappler.com
*/

var REDMINE_URL = 'http://redmine.snappler.com';
var board_id = document.location.href.match(/b\/([A-Za-z0-9]{8})\//)[1];

TrelloRedminer = (function() {

  // Constructor
  function TrelloRedminer() {
    new TrelloRedminerBoardOptions(this);

    observer = new TrelloRedminerObserver(this);
    observer.start();
  }

  TrelloRedminer.prototype.onCardOpened = function() {
    if($('[data-behavior="trelloRedminerToggler"]').length !== 0) {
      return false;
    }

    var card_title = $('.js-title-helper').html();

    $('.other-actions > .u-clearfix').prepend(
      '<a data-behavior="trelloRedminerToggler" class="button-link" href="#">' +
        '<span class="icon-sm icon-clock"></span>&nbsp;Redmine'+
      '</a>'
    );

    $('[data-behavior="trelloRedminerToggler"]').click(function() {
      if($('.trello-redminer').length == 0) {
        chrome.runtime.sendMessage(
          {cmd: 'time_entry_form'},
          function(html) {
            $('.other-actions > .u-clearfix').prepend(html);
            $('#js-time-entry-comments').val(card_title);

            $('[data-behavior="submitTimeEntry"]').click((function(_this) {
              return function() {
                var hours = $('#js-time-entry-hours').val();
                var comments = $('#js-time-entry-comments').val();
                chrome.runtime.sendMessage(
                  {cmd: 'send_time_entry', hours: hours, comments: comments, board_id: board_id},
                  function(response) {
                    if(response.time_entry) {
                      $('.trello-redminer').hide();
                    } else {
                      alert('Se rotió! Y si...las cosas se rompen.');
                      console.log(response);
                    }
                  }
                );
              };
            })(this));
          }
        );
      } else {
        $('.trello-redminer').toggle();
      }
    });

  };

  return TrelloRedminer;
})();


// ----------- OBSERVER ------------------

TrelloRedminerObserver = (function() {
  function TrelloRedminerObserver(caller) {
    this.observer = new window.MutationObserver(function(mutations) {
      $.each(mutations, function(index, mutation) {
        var $target = $(mutation.target);
        if($target.hasClass('js-tab-parent')) {
          caller.onCardOpened()
        }
      });
    });
  }

  TrelloRedminerObserver.prototype.start = function() {
    this.observer.observe(document.body, { childList: true, characterData: true, attributes: false, subtree: true });
  };

  return TrelloRedminerObserver;
})();

// ----------- BOARD OPTIONS -------------
TrelloRedminerBoardOptions = (function() {
  function TrelloRedminerBoardOptions(caller) {
    $('.board-header-btns.mod-left').append(
      '<a data-behavior="board-options" class="board-header-btn" href="#">' +
        '<span class="board-header-btn-icon icon-sm icon-clock"></span>' +
        '<span class="board-header-btn-text">Redmine</span>' +
      '</a>'
    );
    $('[data-behavior=board-options]').click(this.openBoardOptions)
  }

  TrelloRedminerBoardOptions.prototype.openBoardOptions = function() {
    chrome.runtime.sendMessage(
      {cmd: 'board_options'},
      function(html) {
        $('body').append(html);
        var stored = {};
        stored[board_id] = { api_key: '', project_id: '', redmine_url: REDMINE_URL };
        chrome.storage.sync.get(stored, function(items) {
          $('.trello-redminer-board-options .js-redmine-url').val(items[board_id].redmine_url);
          $('.trello-redminer-board-options .js-api-key').val(items[board_id].api_key);
          $('.trello-redminer-board-options .js-project-id').val(items[board_id].project_id);
        });

        $('[data-behavior=submitBoardOptions]').click(function() {
          var api_key = $('.trello-redminer-board-options .js-api-key').val();
          var project_id = $('.trello-redminer-board-options .js-project-id').val();
          var redmine_url = $('.trello-redminer-board-options .js-redmine-url').val();
          var store = {};
          store[board_id] = { api_key: api_key, project_id: project_id, redmine_url: redmine_url };

          chrome.storage.sync.set(store, function() {
            var status = $('.trello-redminer-board-options .status');
            status.html('Opciones guardadas.');
            setTimeout(function() {
              status.html('');
            }, 1000);
          });

        });
      }
    );
  };

  return TrelloRedminerBoardOptions;
})();


// -------------------
new TrelloRedminer();
