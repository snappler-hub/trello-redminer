chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // SEND TIME ENTRY
    if(request.cmd == 'send_time_entry') {
      var stored = {};
      stored[request.board_id] = { api_key: '', project_id: '', redmine_url: '' };
      chrome.storage.sync.get(stored, function(items) {
        $.ajax({
          type: 'POST',
          url: items[request.board_id].redmine_url + '/time_entries.json',
          data: {
            time_entry: {
              hours: request.hours,
              comments: request.comments,
              project_id: items[request.board_id].project_id
            },
            key: items[request.board_id].api_key,
          },
          success: sendResponse,
          error: sendResponse
        });

      });
    }

    // BOARD OPTIONS
    if(request.cmd == 'board_options') {
			$.ajax({
				url: chrome.extension.getURL("board_options.html"),
				dataType: "html",
				success: sendResponse
			});
		}

    // TIME ENTRY FORM
    if(request.cmd == 'time_entry_form') {
			$.ajax({
				url: chrome.extension.getURL("time_entry_form.html"),
				dataType: "html",
				success: sendResponse
			});
		}

    return true;

  });
