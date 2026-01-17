# Ollama Setup Guide

## Understanding Ollama Models

### Do I Need the Same GGUF File?

**NO!** Other users **do NOT need your specific GGUF file**. Here's why:

1. **Ollama manages models centrally** - When you import a GGUF file into Ollama, it becomes a named model in Ollama's model library
2. **Models are referenced by name** - The application uses the model name (e.g., `qwen2.5-7b-flirty:latest`), not the file path
3. **Each user can use different models** - Different users can use different models as long as they configure the model name

## For Different Users

### Option 1: Same Model (Recommended for Team)
If your team wants consistency:

1. **Share the model name** (e.g., `qwen2.5-7b-flirty:latest`)
2. Each person downloads/imports the same model into their Ollama
3. Everyone uses the same `.env` configuration

### Option 2: Different Models (For Individual Setup)
Each person can use their own model:

1. **Check available models**:
   ```bash
   ollama list
   ```
   Output example:
   ```
   NAME                        ID              SIZE    MODIFIED
   llama3:latest              a6990ed9be41    4.7GB   2 weeks ago
   mistral:latest             f974a74358d6    4.1GB   3 weeks ago
   qwen2.5-7b-flirty:latest   custom123456    4.4GB   1 day ago
   ```

2. **Update `.env` file** with YOUR model name:
   ```env
   OLLAMA_MODEL=llama3:latest
   # OR
   OLLAMA_MODEL=mistral:latest
   # OR
   OLLAMA_MODEL=your-custom-model-name
   ```

## Setting Up Ollama

### Step 1: Install Ollama
Download from: https://ollama.com/download

### Step 2: Choose Your Model Option

#### Option A: Use Pre-built Models (Easiest)
```bash
# Download popular models
ollama pull llama3
ollama pull mistral
ollama pull qwen2.5:7b

# Verify installation
ollama list
```

#### Option B: Import Your GGUF File
```bash
# Create a Modelfile
echo 'FROM /path/to/your/model.gguf' > Modelfile

# Create named model
ollama create my-custom-model -f Modelfile

# Verify
ollama list
```

#### Option C: Use Existing Model
If you already have models installed:
```bash
# List your models
ollama list

# Copy the model name from the NAME column
# Update .env with that name
```

### Step 3: Configure Your Application

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and set your model**:
   ```env
   # Change this line to match YOUR installed model
   OLLAMA_MODEL=your-model-name-here
   ```

3. **Optionally change Ollama server URL** (if running remotely):
   ```env
   OLLAMA_BASE_URL=http://your-server:11434
   ```

### Step 4: Test Your Setup

1. **Start Ollama** (if not running):
   ```bash
   # On Windows/Mac/Linux
   ollama serve
   ```

2. **Test the model directly**:
   ```bash
   ollama run your-model-name
   ```

3. **Start your backend** and test:
   ```bash
   npm run dev
   ```

## Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_SERVICE` | No | `ollama` | Choose `ollama` or `gemini` |
| `OLLAMA_BASE_URL` | No | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | No | `qwen2.5-7b-flirty:latest` | Your model name from `ollama list` |

### Where to Change Model Name

**File**: `.env`
**Line**: `OLLAMA_MODEL=your-model-name`

Example configurations:
```env
# For LLaMA 3
OLLAMA_MODEL=llama3:latest

# For Mistral
OLLAMA_MODEL=mistral:latest

# For Qwen 2.5
OLLAMA_MODEL=qwen2.5:7b

# For custom imported model
OLLAMA_MODEL=my-custom-model
```

## Common Questions

### Q: Do I need to share my GGUF file?
**A:** No! Share the model name instead. Others can:
- Download the same official model, OR
- Use their own model by changing `OLLAMA_MODEL`

### Q: What if someone doesn't have my model?
**A:** They can:
1. Download a different model with `ollama pull model-name`
2. Update their `.env` with `OLLAMA_MODEL=their-model-name`
3. The app will work the same way!

### Q: Where is the model name used in code?
**A:** Check `backend/src/services/ollama.service.ts` line 5:
```typescript
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-7b-flirty:latest';
```

### Q: Can I use Gemini instead of Ollama?
**A:** Yes! Set in `.env`:
```env
AI_SERVICE=gemini
GEMINI_API_KEY=your-api-key
```

### Q: How to see which model I'm using?
**A:** Check your `.env` file or run:
```bash
grep OLLAMA_MODEL .env
```

## Troubleshooting

### Model Not Found
```
Error: model 'xyz' not found
```
**Solution**:
1. Check installed models: `ollama list`
2. Update `.env` with correct name
3. Or install missing model: `ollama pull model-name`

### Ollama Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:11434
```
**Solution**:
```bash
ollama serve
```

### Wrong Model Name
```
Error: model name mismatch
```
**Solution**:
1. Run `ollama list` to see exact names
2. Copy the NAME exactly (including `:tag`)
3. Update `.env` file

## Recommended Models

| Model | Size | Best For | Command |
|-------|------|----------|---------|
| **llama3** | 4.7GB | General purpose, good quality | `ollama pull llama3` |
| **mistral** | 4.1GB | Fast, efficient | `ollama pull mistral` |
| **qwen2.5** | 4.4GB | Multilingual, instruction-following | `ollama pull qwen2.5:7b` |
| **phi3** | 2.3GB | Lightweight, fast | `ollama pull phi3` |

## Deployment Notes

When deploying to production:

1. **Document the model requirement** in README
2. **Provide model alternatives** for team members
3. **Set default model** that's publicly available
4. **Consider using Gemini** for cloud deployment (no local model needed)

## Summary

✅ **You do NOT need to share GGUF files**
✅ **Share model name instead** (from `ollama list`)
✅ **Everyone can use different models**
✅ **Change model name in `.env` file**
✅ **Model name is in `OLLAMA_MODEL` variable**

**Key File to Change**: `.env` → `OLLAMA_MODEL=your-model-name`
