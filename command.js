'use strict';
var Plugin = require('./index').Plugin;
var skynet = require('skynet');
var config = require('./meshblu.json');
var debug  = require('debug')('meshblu-gotomeeting-osa:index');

var conx = skynet.createConnection({
  server : config.server,
  port   : config.port,
  uuid   : config.uuid,
  token  : config.token
});

conx.on('notReady', function(){
  debug('notReady');
  console.error.apply(this, arguments);
});

conx.on('error', function(){
  debug('error');
  console.error.apply(this, arguments);
});

var plugin = new Plugin();

conx.on('ready', function(){
  debug('ready');
  conx.whoami({uuid: config.uuid}, function(device){
    plugin.setOptions(device.options || {});
    conx.update({
      uuid: config.uuid,
      token: config.token,
      messageSchema: plugin.messageSchema,
      optionsSchema: plugin.optionsSchema,
      options:       plugin.options
    });
  });
});

conx.on('message', function(){
  try {
    plugin.onMessage.apply(plugin, arguments);
  } catch (error){
    console.error(error.message);
    console.error(error.stack);
  }
});

conx.on('config', function(){
  try {
    plugin.onConfig.apply(plugin, arguments);
  } catch (error){
    console.error(error.message);
    console.error(error.stack);
  }
});

plugin.on('message', function(message){
  conx.message(message);
});

plugin.on('error', console.error);
