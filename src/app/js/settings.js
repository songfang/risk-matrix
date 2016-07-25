
var settings = {
  matrix: {
    sheet: 'risk-matrix',
    position: 'A',
    costs: 'B',
    propability: 'C',
    row: 2
  },
  grid: {
    xAxis: [
      .3,
      .7
    ],
    yAxis: [
      .2,
      .6
    ]
  }
}


$(function() {

  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  var $inputSettings = $('input.settings');

  function setDefaults(load) {
    $inputSettings.each(function() {
      $field = $(this);
      $field.val(settings['matrix'][$field.attr('id')]);
      showAxisConfig('#xAxis', settings.grid.xAxis);
      showAxisConfig('#yAxis', settings.grid.yAxis);
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
    settings['matrix'][$el.attr('id')] = $el.val();
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
      showAxisConfig('#xAxis', settings.grid.xAxis);
      showAxisConfig('#yAxis', settings.grid.yAxis);
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

  function showAxisConfig(selector, array) {

    var $el = $(selector),
        line = '<div class="form-group"><div class="input-group"><span class="glyphicon glyphicon-plus input-group-addon"></span><input class="form-control" type="text"/><span class="input-group-addon">%</span><span class="glyphicon glyphicon-remove input-group-addon"></span></div></div>';
    $el.children().remove();

    function onClick(el, value) {
      var $row = $(line);
      var append = !!value;
      if (append) {
        $row.appendTo($(el));
        $row.find('input').val(value);
      }
      else {
        $row.insertBefore($(el));
      }
      $row.find('.glyphicon-plus').on('click', function() {
        onClick($(this).parent());
      });
      $row.find('.glyphicon-remove').on('click', function() {
        $row.remove();
      });
    }
    _.forEach(array, function(item) {
      var value = item * 100;
      onClick($el, value);
    });

    var $nl = $('<div><span class="glyphicon glyphicon-plus input-group-addon add"></span></div>').on('click', function() {
      onClick(this);
    });
    $el.append($nl);
    $('<button class="btn btn-default">Submit</button>').appendTo($el).on('click', function() {
      var out = [];
      $(selector).find('input').each(function() {
        var value = parseInt($(this).val(), 10);
        if (value > 0 && value < 99) {
          out.push(value / 100);
        }
      });
      out = _.sortedUniq(_.sortBy(out));
      settings.grid[selector.replace('#', '')] = out;
      sendSettings(settings);
    })
  }

  $('#toggle .glyphicon').click(function() {
    $('#toggle .glyphicon').toggleClass('hidden');
    $('#configurator').toggleClass('hidden');
  })

});