const express = require('express');
const cors = require('cors');

require('dotenv').config()

const needle = require('needle');
const app = new express();
const PORT = process.env.PORT || 8000;

const LLM_API_URL = process.env.LLM_API_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;

const GOOGLE_SEARCH_API_URL = process.env.GOOGLE_SEARCH_API_URL;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Route to handle requests to /api/llm/prompt
app.post('/api/llm/prompt', (req, res) => {
    console.log('[+] Received request to /api/llm/prompt');

    const body = {
        "model": req.body.model, // Use the 'model' parameter from the request
        "prompt": req.body.prompt // Use the 'prompt' parameter from the request
    }

    console.log('Sending request to the API:', LLM_API_URL);
    needle(
        'post',
        LLM_API_URL,
        body, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LLM_API_KEY}`
        }
    })
        .then(response => {
            console.log('Response received')
            console.log(response.body);
            res.json(response.body); // Send response to client
        })
        .catch(error => {
            console.log('Error occurred');
            console.error(error); // Send error to client
            res.status(500).send('An error occurred while making the request to the LLM API');
        });
});

app.get('/api/search', (req, res) => {
    const query = req.query.q //  search query parameter
    const url = `${GOOGLE_SEARCH_API_URL}?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${query}&format=json`;
    needle('get', url)
        .then(response => {
            console.log('[+] Google Search Response received');
            console.log(url);
            res.json(response.body) // Send response to client
        })
        .catch(error => {
            console.log('Error occurred');
            console.error(error); // Send error to client
            res.status(500).send('An error occurred while making the request to the Google Search API');
        });
});

app.listen(PORT, () => console.log('SERVER RUNNING ON 8000'));

