# 🚀 Quick Start - Ollama Model Configuration

## For New Team Members

### ❓ "Do I need the exact GGUF file?"
**NO!** You just need **any Ollama model** installed.

---

## 📋 Setup in 3 Steps

### Step 1: Check What You Have
```bash
ollama list
```

Example output:
```
NAME                    SIZE    
llama3:latest          4.7GB
mistral:latest         4.1GB
qwen2.5:7b            4.4GB
```

### Step 2: Update Your Config
Edit `backend/.env`:
```env
OLLAMA_MODEL=llama3:latest    # ← Use YOUR model name here
```

### Step 3: Done! 
```bash
cd backend
npm run dev
```

---

## 🆕 Don't Have Any Models?

Download one:
```bash
# Option 1: LLaMA 3 (Recommended)
ollama pull llama3

# Option 2: Mistral (Fast)
ollama pull mistral

# Option 3: Qwen 2.5 (Multilingual)
ollama pull qwen2.5:7b
```

Then update `.env` with the model name!

---

## 🔧 Where to Change Settings

| What to Change | Where | Example |
|----------------|-------|---------|
| **Model Name** | `backend/.env` | `OLLAMA_MODEL=llama3:latest` |
| **Server URL** | `backend/.env` | `OLLAMA_BASE_URL=http://localhost:11434` |
| **AI Service** | `backend/.env` | `AI_SERVICE=ollama` or `gemini` |

---

## ⚙️ Configuration File Location

```
backend/
  ├── .env.example         ← Template with comments
  ├── .env                 ← YOUR config (create from .env.example)
  └── OLLAMA_SETUP.md      ← Detailed guide
```

---

## 💡 Key Points

✅ **Everyone can use different models** - No need to match!
✅ **No GGUF file sharing needed** - Models are referenced by name
✅ **Easy switching** - Just change `OLLAMA_MODEL` in `.env`
✅ **Alternative option** - Use Gemini API if you prefer cloud AI

---

## 🆘 Troubleshooting

### "Model not found"
1. Run `ollama list` to see your models
2. Copy the exact NAME
3. Paste into `.env` → `OLLAMA_MODEL=your-model-name`

### "Connection refused"
Start Ollama server:
```bash
ollama serve
```

### "Still confused?"
Read the full guide: [OLLAMA_SETUP.md](OLLAMA_SETUP.md)

---

## 📚 Full Documentation

- **Detailed Setup**: [OLLAMA_SETUP.md](OLLAMA_SETUP.md)
- **Backend README**: [backend/README.md](backend/README.md)
- **Main README**: [../README.md](../README.md)
