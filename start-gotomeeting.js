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
      self.waitForRecordButton();
      self.startRecording();
    });

    self.clickMeetNow = (function(){
      var numButts = self.GoToMeeting.windows[0].groups[3].buttons.length;
      for(var i=0; i < numButts; i++) {
        var button = self.GoToMeeting.windows[0].groups[3].buttons[i];
        if(button.title() === "Meet Now") {
          self.GoToMeeting.windows[0].groups[3].buttons[0].click();
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
      var index = self.GoToMeeting.windows[1].groups.length - 1;
      while (self.GoToMeeting.windows[1].groups.length < 5) {
        delay(1);
      }

      var screenSharingDescriptors = self.GoToMeeting.windows[1].uiElements.whose({_and: [{role : 'AxDisclosureTriangle'}, {description : {_contains : 'Screen Sharing'}}]}); 
      if(screenSharingDescriptors){
        if(screenSharingDescriptors[0].value() === 0){
          screenSharingDescriptors[0].click(); 
          delay(1); 
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
