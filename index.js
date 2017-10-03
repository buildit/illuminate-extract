'use strict'

var fs = require("fs");
var Moment = require('moment');
var illuminateSystems = require('@buildit/illuminate-systems');
var jira = illuminateSystems.demand.jira;

var DEFAULTSTARTDATE = '2000-01-01';
var DBDATEFORMAT = 'YYYY-MM-DD';

///
/// EXAMPLE
///
///  index.js digitalrig 'D1g!talRig' NETWRKDIAG 'https://digitalrig.atlassian.net/rest/api/latest/'
///

function errorBody(code, description) {
  var errorBody = {error: { statusCode: code, message: description}};
  return (errorBody);
}

exports.writeThisData = function (fileName, ignoreThis, dataToStore) {
  return new Promise(function(resolve, reject) {
      var fullFile = './'+fileName+'.json';
      fs.writeFile(fullFile, dataToStore, function(err) {
          if (err) {
            console.log(`file write error ${err}`);
            reject(err);
          }
          else resolve(data);
      });
  });
}

function processingInfo(repoName, functionName) {
  return ({name: repoName, dbUrl: repoName, storageFunction: functionName});
}

function sectionInfo(repoName, path, user, pass) {
  return ({source: "Jira", url: path, project: repoName, authPolicy: "Basic", userData: new Buffer(user + ':' + pass).toString('base64')});
}

var myArgs = process.argv.slice(2);

console.log(`args length ${myArgs.length}`);
console.log(`args 0 ${myArgs[0]}`);
console.log(`args 1 ${myArgs[1]}`);
console.log(`args 2 ${myArgs[2]}`);
console.log(`args 3 ${myArgs[3]}`);

if (myArgs.length < 4) {
  console.log("commmand line args required");
  exit(0);
}

jira.loadRawData(sectionInfo(myArgs[2], myArgs[3], myArgs[0], myArgs[1]),
   processingInfo(myArgs[2], exports.writeThisData),
   Moment.utc(DEFAULTSTARTDATE).format(DBDATEFORMAT),
   errorBody).then( function(data) {
     console.log('DONE');
   }).catch(function(err) {
     console.log(`ERROR : ${JSON.stringify(err)}`)
   });
