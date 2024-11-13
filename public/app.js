const recordButton = document.getElementById('record');
let mediaRecorder;
let audioChunks = [];

recordButton.addEventListener('click', async () => {
    try{
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            try{
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
                mediaRecorder = new MediaRecorder(stream);
    
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
    
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, {type: 'audio/webm'});
                    audioChunks = [];
                    console.log('Recording Successfully:', audioBlob);
                    await uploadAudio(audioBlob);
                };
    
                mediaRecorder.start();
                recordButton.innerText = 'Stop Recording';
            } catch (error){
                console.error('Recording Failed:', error);
            }
        } else {
            mediaRecorder.stop();
            recordButton.innerText = 'Start Recording';
        }
    } catch (error) {
        console.error('Recording Failed:', error.message);
    } 
});

const languageSelect = document.getElementById('language');

async function uploadAudio(audioBlob){
    console.log('Start uploading...');
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('languageCode', languageSelect.value);

    try{
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if(response.ok){
            const result = await response.json();
            transcription.innerText = result.transcription || 'Transcription failed.';
            console.log('Transcription result: ', result.transcription);
        }else{
            console.error('Server Error: ', response.statusText);
            transcription.innerText = 'Server error, please try again later.';
        }
    } catch (error) {
        console.error('Upload failed: ', error);
        transcription.innerText = 'Failed to upload audtio.';
    }
}