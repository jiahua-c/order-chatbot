/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);
    setEyeColor("red");
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
    var response;
    if (user_said.toLowerCase().includes("sick") && state === "initial") {
        var randomNumber = Math.floor((Math.random() * 3) + 1);
        if(randomNumber == 1) {
            response = "oh no, i feel sad for you";
        } else if(randomNumber == 2) {
            response = "oh no, what a bad news";
        } else {
            response = "sorry to hear that";
        } state = "sad"
    } else if (user_said.toLowerCase().includes("guess") && user_said.toLowerCase().includes("feel") && state === "initial") {
        var randomNumber = Math.floor((Math.random() * 2) + 1);
        if(randomNumber == 1) {
            response = "Are you happy?";
            state = "happy";
        } else if(randomNumber == 2) {
            response = "Are you sad?";
            state = "sad";
        }
    } else if (user_said.toLowerCase().includes("it's okay") && state === "sad") {
      response = "wish you all the best";
      state = "initial"
    } else if (user_said.toLowerCase().includes("married") && state === "initial") {
        var randomNumber = Math.floor((Math.random() * 2) + 1);
        if(randomNumber == 1) {
            response = "Congratulations";
        } else if(randomNumber == 2) {
            response = "oh, what a great news";
        } else {
            response = "i am so happy to hear that";
        } state = "happy"
    } else if (user_said.toLowerCase().includes("grade")) {
        response = "Are you satisfied?";
        if (user_said.toLowerCase().includes("yes")) {
            state = "happy"
        } else (user_said.toLowerCase().includes("no")) {
            state = "sad"
        }
    } else if (user_said.toLowerCase().includes("admitted to") && user_said.toLowerCase().includes("NYU")&& state === "happy" ||
              user_said.toLowerCase().includes("admitted to") && user_said.toLowerCase().includes("new york university")&& state === "happy") {
        response = "i am so proud that you are admitted to new york university";
        state = "happy"
    } else if (user_said.toLowerCase().includes("thank you") && state === "happy") {
        response = "you're welcome";
        state = "initial"
    } else if (user_said.toLowerCase().includes("bye")) {
      response = "good bye to you!";
      state = "initial"
    } else {
      response = "i don't get it";
    }
    return response;
  }

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
