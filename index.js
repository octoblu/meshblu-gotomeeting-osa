'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var osa = require('osa');
var debug = require('debug')('meshblu-gotomeeting-osa:index');
var StartGoToMeeting = require('./start-gotomeeting');
var EndGoToMeeting = require('./end-gotomeeting');

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
    return;
  }

  if (message.payload.action === 'end-meeting') {
    this.endMeeting();
    return;
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
  if(this.meetingInProgress){
    return;
  }
  this.meetingInProgress = true;

  osa(StartGoToMeeting, {}, function(error) {
    debug('osa script done', error);
  });
};

Plugin.prototype.endMeeting = function() {
  debug('endMeeting')
  if(!this.meetingInProgress){
    return;
  }
  this.meetingInProgress = false;

  osa(EndGoToMeeting, {}, function(error) {
    debug('osa script done', error);
  });
};



module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
