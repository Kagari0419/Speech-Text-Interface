process.env.GOOGLE_APPLICATION_CREDENTIALS = './speech-to-text-interface-fa7162affa01.json';


const express = require('express');
const multer = require('multer');
const {SpeechClient} = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = express();
const upload = multer({dest: 'uploads/'});
const speechClient = new SpeechClient();

app.use(express.static('public'));

app.post('/upload', upload.single('audio'), async (req, res) => {
    console.log('Received recording: ', req.file);
    const languageCode = req.body.languageCode || 'en-US';
    const audioPath = path.join(__dirname, req.file.path); 
    const audioBytes = fs.readFileSync(audioPath).toString('base64');

    const request = {
        audio: { content: audioBytes },
        config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: languageCode,
        },
    };

    try{
        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        
        res.json({ transcription });
    } catch(error){
        console.error('Server error: ', error.message);
        res.status(500).json({error: error.message});
    } finally {
        fs.unlinkSync(audioPath);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});