var REDMINE_URL = 'http://redmine.snappler.com';
var API_KEY = 'e407baf7a930b2fb3b1f4256d9d6243fcc933254';
var REDMINE_PROJECT_ID = 'aero-api-operador-prestardor';
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    $.ajax({
      type: 'POST',
      url: REDMINE_URL+'/time_entries.json',
      data: {
        time_entry: {
          hours: request.hours,
          comments: request.comments,
          project_id: REDMINE_PROJECT_ID
        },
        key: API_KEY,
      },
      success: function(data) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {success: true, message: 'Guardado'}, function(){});
        });
      },
      error: function(e) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {success: false, message: e}, function(){});
        });
      }
    });

    sendResponse({status: "yeah!", response: request});
  });
