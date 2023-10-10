const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recorder = document.getElementById('recorder');
const output = document.getElementById('output');

let recognition;

recorder.addEventListener('click', () => {
  if (!SpeechRecognition) {
    output.innerText = 'Your browser does not support speech recognition';
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      output.innerText = transcript;
      if (transcript.trim() !== '') {
        // Save the transcript to a text file
        fs.writeFileSync('transcription.txt', transcript, 'utf-8');
      }
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

    // Convert video audio to WAV format
    ffmpeg('test_audio.mp4')
      .audioChannels(1)
      .audioFrequency(16000)
      .audioCodec('pcm_s16le')
      .toFormat('wav')
      .on('end', function () {
        console.log('Audio conversion finished.');
        recognizeSpeech('audio.wav');
      })
      .on('error', function (err) {
        console.error('Error converting audio:', err);
      })
      .save('audio.wav');

    function recognizeSpeech(audioFile) {
      // Read the audio file
      const audioBuffer = fs.readFileSync(audioFile);

      // Feed the audio data to the recognition engine
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    }
  }
});
