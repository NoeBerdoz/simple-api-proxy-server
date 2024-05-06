# Simple API Proxy Server

This is a simple API proxy server that allows you to interact with a LLM API and Google Search API.

## Features

- CORS enabled
- JSON request body parsing
- Rate limiting for both APIs
- Basic error handling

## Environment Variables

The server uses the following environment variables:

- `LLM_API_URL`: The URL of the LLM API endpoint
- `LLM_API_KEY`: The API key for the LLM API
- `LLM_CHAT_API_URL`: The URL of the LLM Chat API endpoint
- `GOOGLE_SEARCH_API_URL`: The URL of the Google Search API
- `GOOGLE_SEARCH_API_KEY`: The API key for the Google Search API
- `GOOGLE_SEARCH_CX`: The CX for the Google Search API

## Routes

- `POST /api/llm/prompt`: This route accepts a JSON body with `model` and `prompt` parameters and forwards the request to the LLM API. It is rate limited to 10 requests per minute and 1000 requests per day.
- `GET /api/search`: This route accepts a `q` query parameter and forwards the request to the Google Search API. It is rate limited to 100 requests per day.

## Setup

1. Clone the repository
2. Install the dependencies with `npm install`
3. Set the environment variables in a `.env` file like in `.env.exemple`
4. Start the server with `npm start`

## Usage

You can use any HTTP client to send requests to the server. Here's an example using `curl`:

```bash
# LLM API
curl http://localhost:8000/api/llm/prompt -H "Content-Type: application/json" -d '{"model": "Meta-Llama-3-8B-Instruct", "prompt": "How to save the world?"}'
  
# Google Search API
curl "http://localhost:8000/api/search?q=How%20to%20make%20a%20webserver%20in%20Rust?"