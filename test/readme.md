```bash
export OLLAMA_HOST="127.0.0.1:11500"
export OLLAMA_ORIGINS="http://127.0.0.1:5500"
ollama serve

ollama list

ollama run deepseek-r1

curl http://localhost:11434/api/generate -d '{
  "model": "llama3.3",
  "prompt": "Why is the sky blue?"
}'
```
