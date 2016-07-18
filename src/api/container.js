
'use strict';

const _ = require('lodash'),
      xlsx = require('xlsx')
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
    console.log(cookieCutter);
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

function calculateData() {

  return new Promise((resolve, reject) => {
    if (_.isNull(workbook) || _.isNull(cookieCutter)) {
      reject('input parameter null');
    }

    let worksheet = workbook.Sheets[cookieCutter.sheet];

    if (!_.isObject(worksheet)) {
      reject('worksheet not available by name');
    }

    let result = [];
    let counter = cookieCutter.row;

    while (true) {
      let cells = [`${cookieCutter.position}${counter}`, `${cookieCutter.costs}${counter}`, `${cookieCutter.propability}${counter}`];
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
}
