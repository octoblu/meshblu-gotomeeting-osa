module.exports = (function() {
  var GoToMeetingEnder = (function() {
    var self = this;

    self.end = (function() {
      self.SystemEvents = Application('System Events');
      self.GoToMeeting = self.SystemEvents.processes['GoToMeeting'];

      self.closeControlPanel();

      self.waitForConfirmationDialog();
      self.confirmEndingTheMeeting();

      self.waitForConvertRecordingDialog();
      self.convertTheRecording();

      self.waitForConversionToFinish();
      self.closeRecordingDialog();
    });

    self.closeControlPanel = (function(){
      console.log('closeControlPanel');
      self.GoToMeeting.windows[1].buttons[0].click();
    });

    self.waitForConfirmationDialog = (function(){
      console.log('waitForConfirmationDialog');
      while(self.GoToMeeting.windows.length < 3){
        delay(1);
      }
    });

    self.confirmEndingTheMeeting = (function(){
      console.log('confirmEndingTheMeeting');
      self.GoToMeeting.windows[0].buttons[0].click();
    });

    self.waitForConvertRecordingDialog = (function(){
      console.log('waitForConvertRecordingDialog');
      do {
        delay(1);
        self.convertRecording = self.SystemEvents.processes['GoToMeeting Recording Manager'];
      } while (!self.convertRecording.exists());

      while(self.convertRecording.windows.length < 1){
        delay(1);
      }
    });

    self.convertTheRecording = (function(){
      console.log('convertRecording');
      self.convertRecording.windows[0].buttons[3].click();
    });

    self.waitForConversionToFinish = (function(){
      console.log('waitForConversionToFinish');
      var conversionFinished = false;

      while(!conversionFinished) {
        delay(1);

        if(self.convertRecording.windows[0].buttons.length >= 3) {
          var numButts = self.convertRecording.windows[0].buttons.length;
          console.log('numButts: ' + numButts);
          var button = self.convertRecording.windows[0].buttons[numButts - 1];
          conversionFinished = (button.title() === "Open Recordings Folder");
        }
      }
    });

    self.closeRecordingDialog = (function(){
      console.log('closeRecordingDialog');
      self.convertRecording.windows[0].buttons[0].click();
    });

    return self;
  });

  var gotoMeeting = GoToMeetingEnder();
  gotoMeeting.end();

  return {};
});
