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

    recognition.lang = "zh-yue";
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
  var order_re = /\u{6211}\u{8981}\s(.+)/i;  // creating a regular expression
  var order_parse_array = user_said.match(order_re) // parsing the input string with the regular expression
  
  console.log(order_parse_array) // let's print the array content to the console log so we understand 
                                // what's inside the array.

  if (order_parse_array && state === "initial") {
    response = "\u{6211}\u{8981}, " + order_parse_array[1];
  } else if (user_said.toLowerCase().includes("order") && state === "initial") {
    response = "\u{4F60}\u{4EF2}\u{6709}\u{54A9}\u{9700}\u{8981}";
    state = "order"
  } else if (user_said.toLowerCase().includes("\u{5B8C}\u{6210}")) {
    response = "\u{6B61}\u{8FCE}\u{4F60}\u{4E0B}\u{6B21}\u{5149}\u{81E8}";
    state = "initial"
  } else if (state === "order") {
    response = "\u{660E}\u{767D}, " + user_said;
    state = "initial"
  } else {
    response = "\u{5514}\u{597D}\u{610F}\u{601D}\u{6211}\u{5514}\u{660E}\u{767D}";
  }
  return response;
}

/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'zh-yue';
  u.volume = 0.5 //between 0.1
  u.pitch = 2.0 //between 0 and 2
  u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google \u{7CB5}\u{8A9E} (\u{9999}\u{6E2F})"; })[0]; //pick a voice

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
