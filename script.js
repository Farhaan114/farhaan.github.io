const recorder = document.getElementById('recorder');
const output = document.getElementById('output');

let recognition;

recorder.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    output.innerText = 'Your browser does not support speech recognition';
    return;
  }

  if (!recognition) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      output.innerText = transcript;
    };

    recognition.onend = () => {
      recognition = null;
      recorder.style.backgroundColor = 'red';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      recognition = null;
      recorder.style.backgroundColor = 'red';
    };
  }

  if (recognition) {
    recognition.start();
    recorder.style.backgroundColor = 'green';
  }
});