
$(function() {

  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  var settings = {
    sheet: 'risk-matrix',
    position: 'A',
    costs: 'B',
    propability: 'C',
    row: 2
  }

  var $inputSettings = $('input.settings');

  function setDefaults(load) {
    $inputSettings.each(function() {
      $field = $(this);
      $field.val(settings[$field.attr('id')]);
      if (!!load) {
        delay(function() {
          loadSettings();  
        }, 500);
      }
    });
  }
  setDefaults(true);

  $inputSettings.keyup(function(e) {
    var $el = $(e.target);
    settings[$el.attr('id')] = $el.val();
    delay(function() {
      sendSettings(settings);
    }, 300);
  });

  function sendSettings(data) {
    var promise = $.ajax('/api/settings', {
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      sync: false,
      processData: false,
      type: 'POST'
    });
    promise.then(function(data) {
      calculateDiagram(data);
    })
  }

  function loadSettings() {
    var promise = $.ajax('/api/settings', {
      contentType: 'application/json; charset=utf-8',
      sync: false,
      processData: false,
      type: 'GET'
    });
    promise.then(function(data) {
      settings = data;
      setDefaults();
      sendSettings(settings);
    });
  }
});