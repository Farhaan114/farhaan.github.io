const startRecordingBtn = document.getElementById('startRecording');
const transcriptDiv = document.getElementById('transcript');

let recognition;

let transcript = ''; // Variable to store the transcript

startRecordingBtn.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition');
        return;
    }

    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;

        recognition.onresult = (event) => {
            const interimTranscript = event.results[0][0].transcript;
            transcript += interimTranscript; // Append the transcript
            transcriptDiv.textContent = transcript;
        };

        recognition.onend = () => {
            startRecordingBtn.textContent = 'Start Recording';
            // Send the transcript to the server
            sendTranscriptToServer(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    }

    if (recognition && recognition.state !== 'listening') {
        recognition.start();
        startRecordingBtn.textContent = 'Stop Recording';
    } else if (recognition && recognition.state === 'listening') {
        recognition.stop();
        startRecordingBtn.textContent = 'Start Recording';
    }
});

function sendTranscriptToServer(transcript) {
    fetch('/save_transcript', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Transcript sent to server:', data.message);
        })
        .catch((error) => {
            console.error('Error sending transcript to server:', error);
        });
}
