const express = require('express');
const cors = require('cors');
const setRateLimit = require('express-rate-limit');

require('dotenv').config()

const needle = require('needle');
const app = new express();
const PORT = process.env.PORT || 8000;

const LLM_API_PROMPT_URL = process.env.LLM_API_PROMPT_URL;
const LLM_API_CHAT_URL = process.env.LLM_API_CHAT_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;

const GOOGLE_SEARCH_API_URL = process.env.GOOGLE_SEARCH_API_URL;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

const rateLimitPerMinuteLLM = setRateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: "Too many request for LLM API, please try again in 1 minute.",
    headers: true,
});

const rateLimitPerDayLLM = setRateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1000,
    message: "Too many requests for LLM API, please try again tomorrow.",
    headers: true,
});

const rateLimitPerDayGoogle = setRateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 100,
    message: "Too many request for Google API, please try again tomorrow",
    headers: true,
});

// Route to handle requests to /api/llm/prompt
app.post('/api/llm/prompt', rateLimitPerMinuteLLM, rateLimitPerDayLLM, (req, res) => {
    console.log('[+] Received request to /api/llm/prompt');

    const body = {
        "model": req.body.model, // Use the 'model' parameter from the request
        "prompt": req.body.prompt, // Use the 'prompt' parameter from the request
    }

    console.log('[+] Sending request to the API:', LLM_API_PROMPT_URL);
    console.log('    With data:', body);
    needle(
        'post',
        LLM_API_PROMPT_URL,
        body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LLM_API_KEY}`
            }
        })
        .then(response => {
            console.log('[+] Response received from API ', LLM_API_PROMPT_URL)
            console.log(response.body);
            res.json(response.body); // Send response to client
        })
        .catch(error => {
            console.log('Error occurred');
            console.error(error); // Send error to client
            res.status(500).send('An error occurred while making the request to the LLM API');
        });
});

app.post('/api/llm/chat', rateLimitPerMinuteLLM, rateLimitPerDayLLM, (req, res) => {
    console.log('[+] Received request to /api/llm/chat');

    const body = {
        "model": req.body.model, // Use the 'model' parameter from the request
        "messages": req.body.messages, // Use the 'role' parameter from the request
    }

    console.log('[+] Sending request to the API:', LLM_API_CHAT_URL);
    console.log('    With data:', body);

    needle(
        'post',
        LLM_API_CHAT_URL,
        body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LLM_API_KEY}`
            }
        })
        .then(response => {
            console.log('[+] Response received from the API ', LLM_API_CHAT_URL)
            console.log(response.body);
            console.log(response.body.choices[0].message);
            res.json(response.body); // Send response to client
        })
        .catch(error => {
            console.log('Error occurred');
            console.error(error); // Send error to client
            res.status(500).send('An error occurred while making the request to the LLM API');
        });
});

app.get('/api/search', rateLimitPerDayGoogle, (req, res) => {
    const query = req.query.q //  search query parameter
    const url = `${GOOGLE_SEARCH_API_URL}?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${query}&format=json`;
    needle('get', url)
        .then(response => {
            console.log('[+] Google Search Response received');
            console.log('    from: ', url);
            console.log(response.body);
            res.json(response.body) // Send response to client
        })
        .catch(error => {
            console.log('Error occurred');
            console.error(error); // Send error to client
            res.status(500).send('An error occurred while making the request to the Google Search API');
        });
});

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));

