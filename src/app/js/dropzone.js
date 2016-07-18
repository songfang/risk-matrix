$(function() {

  Dropzone.autoDiscover = false;
  $('#xlsx-dropzone').dropzone({
    method: 'POST',
    url: '/api/upload',
    paramName: 'xlsx',
    success: function(file, response) {
      calculateDiagram(response);
    },
    complete: function(file) {
      this.removeFile(file);
    }
  });
});

