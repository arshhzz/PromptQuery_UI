# PromptQuery UI

Full-stack AI query interface with OpenAI integration.

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT API

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp env.example .env
   # Add your OpenAI API key to .env
   ```

3. **Build and start**
   ```bash
   npm run build
   npm start
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## API Endpoints

- `POST /query` - Submit prompt and get AI response
- `GET /health` - Check server and API status

## Development

```bash
npm run dev:full  # Start both backend and frontend with hot reload
```

## License

MIT 