'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var osa = require('osa');
var debug = require('debug')('meshblu-gotomeeting-osa:index');

var GoToMeeting = (function() {
  var GoToMeetingStarter = (function() {
    var self = this;

    self.go = (function() {
      var GoToMeetingApp = Application('/Applications/GoToMeeting.app');
      GoToMeetingApp.activate();

      var SystemEvents = Application('System Events');
      self.GoToMeeting = SystemEvents.processes['GoToMeeting'];

      self.waitForFirstWindow();
      GoToMeeting.windows[0].groups[3].buttons[0].click();

      self.waitForSecondWindow();
      self.waitForRecordButton();
      self.startRecording();
    });

    self.startRecording = (function() {
      console.log('startRecording');
      var index = self.GoToMeeting.windows[1].groups.length - 1;
      GoToMeeting.windows[1].groups[index].checkboxes[0].click();
    });

    self.waitForRecordButton = (function() {
      console.log('waitForRecordButton');
      var index = self.GoToMeeting.windows[1].groups.length - 1;
      while (self.GoToMeeting.windows[1].groups.length < 5) {
        delay(1);
      }
      while (!self.GoToMeeting.windows[1].groups[4].checkboxes[0].enabled()) {
        delay(1);
      }
    });

    self.waitForFirstWindow = (function() {
      console.log('waitForFirstWindow');
      while (self.GoToMeeting.windows.length < 1) {
        delay(1);
      }
    });

    self.waitForSecondWindow = (function(callback) {
      console.log('waitForSecondWindow');
      while (self.GoToMeeting.windows.length < 2) {
        delay(1);
      }
    });

    return self;
  });

  var gotoMeeting = GoToMeetingStarter();
  gotoMeeting.go();

  return {};
});

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