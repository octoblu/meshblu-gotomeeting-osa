module.exports = (function() {
  var GoToMeetingStarter = (function() {
    var self = this;

    self.go = (function() {
      var GoToMeetingApp = Application('/Applications/GoToMeeting.app');
      GoToMeetingApp.activate();

      var SystemEvents = Application('System Events');
      self.GoToMeeting = SystemEvents.processes['GoToMeeting'];

      self.waitForFirstWindow();
      self.clickMeetNow();

      self.waitForSecondWindow();
      self.openRecordWindow();
      self.waitForRecordButton();
      self.startRecording();
    });

    self.clickMeetNow = (function(){
      var numGroups = self.GoToMeeting.windows[0].groups.length;
      for(var i=0; i < numGroups; i++) {
        var button = self.GoToMeeting.windows[0].groups[3].buttons[i];
        if(button.title() === "Meet Now") {
          button.click();
          return;
        }
      }
    });

    self.startRecording = (function() {
      console.log('startRecording');
      var index = self.GoToMeeting.windows[1].groups.length - 1;
      GoToMeeting.windows[1].groups[index].checkboxes[0].click();
    });

    self.waitForRecordButton = (function() {
      console.log('waitForRecordButton');
      var connectingToAudioText = self.GoToMeeting.windows[1].uiElements.whose({_and: [{role : 'AxStaticText'}, {value : {_contains : 'Connecting to Audio'}}]});
      while (connectingToAudioText.length > 0){
        delay(1);
      }
    });

    self.openRecordWindow = (function(){
      var screenSharingDescriptors = self.GoToMeeting.windows[1].uiElements.whose({_and: [{role : 'AxDisclosureTriangle'}, {description : {_contains : 'Screen Sharing'}}]}); 
      if(screenSharingDescriptors){
        if(screenSharingDescriptors[0].value() === 0){
          console.log('openRecordWindow');
          screenSharingDescriptors[0].click(); 
        }
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
