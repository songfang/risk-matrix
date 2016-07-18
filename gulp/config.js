
module.exports = {

  app: {
    folder: './src/app',
    index: 'index.html',
    scss: {
      src: '**/*.scss',
      dest: 'app.css',
    },
    js: {
      src: '**/*.js',
      dest: 'app.js',
    },
  },

  dest: {
    folder: './dest',
  },

};
