$(function() {

  Dropzone.autoDiscover = false;
  $('xlsx-dropzone').dropzone({
    url: '/api/upload',
    success: function(file, response) {

    }
  });
});

