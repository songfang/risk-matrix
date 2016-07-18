$(function() {

  Dropzone.autoDiscover = false;
  $('#xlsx-dropzone').dropzone({
    method: 'POST',
    url: '/api/upload',
    paramName: 'xlsx',
    success: function(file, response) {
      console.log(response);
    },
    complete: function(file) {
      this.removeFile(file);
    }
  });
});

