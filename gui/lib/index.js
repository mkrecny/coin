//argv = typeof argv === 'undefined' ? {} : argv;
require('datejs');
var fs = require('fs')
, path = require('path')
, cache = {};

var current_file = __filename.split('/')
current_file.pop();
current_file.pop();
global.app_root = current_file.join('/'); 

module.exports = function(fn){

  var fn_path = app_root+'/lib/'+fn+'.js';

  if (!cache[fn]){
    cache[fn] = require(fn_path);
  }

  return cache[fn];

};
