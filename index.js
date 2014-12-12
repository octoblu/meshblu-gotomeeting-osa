'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var osa = require('osa');
var debug = require('debug')('meshblu-gotomeeting-osa:index');
var GoToMeeting = require('./start-gotomeeting');

osa(GoToMeeting, {}, function(error) {
  console.log('osa complete', error);
});

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    action: {
      type: 'string',
      required: true
    }
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    firstExampleOption: {
      type: 'string',
      required: true
    }
  }
};

function Plugin() {
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message) {
  debug('onMessage');
  if (message.payload.action === 'start-meeting') {
    this.startMeeting();
  }
};

Plugin.prototype.onConfig = function(device) {
  this.setOptions(device.options || {});
};

Plugin.prototype.setOptions = function(options) {
  this.options = options;
};

Plugin.prototype.startMeeting = function() {
  debug('startMeeting')

  osa(GoToMeeting, {}, function() {
    debug('osa script done');
    process.exit(0);
  });
};



module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
