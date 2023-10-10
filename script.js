const startRecordingBtn = document.getElementById('startRecording');
const transcriptDiv = document.getElementById('transcript');

let recognition;

startRecordingBtn.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition');
        return;
    }

    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            transcriptDiv.textContent = transcript;
            saveTranscriptToFile(transcript);
        };

        recognition.onend = () => {
            startRecordingBtn.textContent = 'Start Recording';
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

function saveTranscriptToFile(transcript) {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
