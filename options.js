// Saves options to chrome.storage
function save_options() {
  var list = document.getElementById('documentation_list').value;
  chrome.storage.sync.set({
    list: list
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Opciones guardadas.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    list: 'Docs'
  }, function(items) {
    document.getElementById('documentation_list').value = items.list;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

