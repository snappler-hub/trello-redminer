/*
** Trello Redminer- https://....
** Trello and Redmine Integration
** Snappler - http://www.snappler.com
*/

var REDMINE_URL = 'https://www.google.com/search?q=%http://redmine.snappler.com';
var API_KEY = 'e407baf7a930b2fb3b1f4256d9d6243fcc933254';
var REDMINE_PROJECT_ID = 'aero-api-operador-prestardor';

TrelloRedminer = (function() {
  function TrelloRedminer() {
    _this = this;
    observer = new TrelloRedminerObserver(this);
    observer.start();

    chrome.storage.sync.get({
      api_url: REDMINE_URL,
      api_key: API_KEY
    }, function(items) {
      _this.api_url = items.api_url
      _this.api_key = items.api_key
      // _this.buildUI();
      // _this.bindEvents();
    });
  }

  TrelloRedminer.prototype.buildUI2 = function() {
    $('.board-header-btns.mod-left').append(
      '<a data-behavior="trelloRedminerToggler" class="board-header-btn" href="#" title="Grabar tiempo en redmine">' +
        '<span class="icon-sm icon-clock board-header-btn-icon"></span>' +
        '<span class="board-header-btn-text">Redmine</span>' +
      '</a>' +
      '<div class="trello-redminer">' +
        '<input type="text" placeholder="Horas" id="js-time-entry-hours" class="hours" value="1">' +
        '<input type="text" placeholder="Comentario" id="js-time-entry-comments" class="comments">' +
        '<button data-behavior="submitTimeEntry" class="btn-link primary" > ' +
          '<span class="icon-sm icon-check"></span> ' +
        '</button>' +
      '</div>'
    );
  };

  TrelloRedminer.prototype.bindEvents = function() {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.success) {
          $('.trello-redminer').hide();
        } else {
          alert('Se rotió! Y si...las cosas se rompen.');
          console.log(request);
        }
      }
    );

    $('[data-behavior="trelloRedminerToggler"]').click(function() {
        $('.trello-redminer').toggle();
    });

    $('[data-behavior="submitTimeEntry"]').click((function(_this) {
      return function() {
        var hours = $('#js-time-entry-hours').val();
        var comments = $('#js-time-entry-comments').val();
        chrome.runtime.sendMessage(
          {hours: hours, comments: comments, key: API_KEY},
          function(response) {

          }
        );
      };
    })(this));
  };

  TrelloRedminer.prototype.buildUI = function() {
    if($('[data-behavior="trelloRedminerToggler"]').length !== 0) {
      return false;
    }

    var card_title = $('.js-title-helper').html();
    $('.other-actions > .u-clearfix').prepend(
      '<a data-behavior="trelloRedminerToggler" class="button-link" href="#">' +
        '<span class="icon-sm icon-clock"></span>&nbsp;Redmine'+
      '</a>' +
      '<div class="trello-redminer pop-over">' +
        '<div class="pop-over-header">' +
          '<span class="pop-over-header-title"> Horas Redmine </span>' +
          '<a href="#" data-behavior="trelloRedminerToggler" class="pop-over-header-close-btn icon-sm icon-close"></a>' +
        '</div>'+
        '<div class="pop-over-content">'+
          '<label for="js-time-entry-hours"> Horas </label>'+
          '<input type="text" placeholder="Horas" id="js-time-entry-hours" class="hours" value="1">' +

          '<label for="js-time-entry-comments"> Comentarios </label>'+
          '<input type="text" placeholder="Comentario" id="js-time-entry-comments" class="comments" value="'+card_title+'">' +

          '<button data-behavior="submitTimeEntry" class="primary wide" > ' +
            'Enviar' +
          '</button>' +
        '</div>' +
      '</div>'
    );
    $('[data-behavior="trelloRedminerToggler"]').click(function() {
        $('.trello-redminer').toggle();
    });

    $('[data-behavior="submitTimeEntry"]').click((function(_this) {
      return function() {
        var hours = $('#js-time-entry-hours').val();
        var comments = $('#js-time-entry-comments').val();
        chrome.runtime.sendMessage(
          {hours: hours, comments: comments, key: API_KEY},
          function(response) {

          }
        );
      };
    })(this));
  };

  return TrelloRedminer;
})();


TrelloRedminerObserver = (function() {
  function TrelloRedminerObserver(caller) {
    this.observer = new window.MutationObserver(function(mutations) {
      $.each(mutations, function(index, mutation) {
        var $target = $(mutation.target);
        if($target.hasClass('js-tab-parent')) {
          console.log('Modal abierto');
          caller.buildUI()
        }
      });
    });
  }

  TrelloRedminerObserver.prototype.start = function() {
    this.observer.observe(document.body, { childList: true, characterData: true, attributes: false, subtree: true });
  };

  return TrelloRedminerObserver;
})();

// -------------------
new TrelloRedminer();
