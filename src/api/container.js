
'use strict';

const _ = require('lodash'),
      xlsx = require('xlsx'),
      path = require('path'),
      fs = require('fs'),
      mkdirp = require('mkdirp')
      ;

let workbook = null;

let cookieCutter = null;

function parse(path) {
  return new Promise((resolve, reject) => {
    workbook = xlsx.readFile(path);
    calculateData()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      })
      ;
  });
  
}

function settings(settings) {
  return new Promise((resolve, reject) => {
    cookieCutter = settings;
    saveSettings(cookieCutter);
    calculateData()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      })
      ;
  });
  
}

function saveSettings(settings) {
  mkdirp(path.join(process.cwd(), 'data'), function(err) {
    if (err) {
      throw err;
    }

    fs.writeFile(path.join(process.cwd(), 'data', 'settings.json'), 
                  JSON.stringify(settings), 
                  function(err) {
      if (err) {
        throw err;
      }
    });

  });
}

function loadSettings(settings) {
  return new Promise((resolve, reject) => {
    let settingsFile = path.join(process.cwd(), 'data', 'settings.json');
      fs.exists(settingsFile, function(result) {
        if (!result) {
          reject('saved settings doesn\'t exist');
        }

        fs.readFile(settingsFile, function(err, data) {
          if (err) {
            reject(err);
          }

          cookieCutter = JSON.parse(data);

          resolve(cookieCutter);

        });
    });
  });
}

function calculateData() {

  return new Promise((resolve, reject) => {
    if (_.isNull(workbook) || _.isNull(cookieCutter)) {
      reject('input parameter null');
    }

    let worksheet = workbook.Sheets[cookieCutter.matrix.sheet];

    if (!_.isObject(worksheet)) {
      reject('worksheet not available by name');
    }

    let result = [];
    let counter = cookieCutter.matrix.row;

    while (true) {
      let cells = [`${cookieCutter.matrix.position}${counter}`, `${cookieCutter.matrix.costs}${counter}`, `${cookieCutter.matrix.propability}${counter}`];
      cells = _.map(cells, (cell) => {
        return worksheet[cell] ? worksheet[cell].v : undefined;
      });

      let data = {
        position: cells[0],
        costs: cells[1],
        propability: cells[2],
      };

      if (_.isUndefined(data.position) && _.isUndefined(data.costs) && _.isUndefined(data.propability)) {
        break;
      }

      result.push(data);

      counter++;
    }

    resolve(result);
  });

  
}

module.exports = {
  parse,
  settings,
  loadSettings,
}
