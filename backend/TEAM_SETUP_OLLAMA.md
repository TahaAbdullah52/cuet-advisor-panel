# Team Setup Instructions - Ollama Models

## 🎯 Quick Answer for Your Team

**Question**: "Do I need your GGUF file to run this project?"

**Answer**: **NO!** Here's what you need to know:

---

## 📦 What You Actually Need

Instead of the GGUF file, team members need:

1. **Ollama installed** (https://ollama.com/download)
2. **ANY Ollama model** (they can choose their own!)
3. **Configuration change** (update one line in `.env` file)

---

## 👥 Different Scenarios

### Scenario 1: Team Member Has Their Own Model

They already have a model like `llama3` or `mistral`:

1. Check what they have:
   ```bash
   ollama list
   ```

2. Tell them to create `backend/.env` from `backend/.env.example`

3. Update this ONE line:
   ```env
   OLLAMA_MODEL=their-model-name-here
   ```

**That's it!** They're ready to go.

---

### Scenario 2: Team Member Has NO Models

They need to download one first:

```bash
# Pick any ONE of these:
ollama pull llama3        # 4.7GB, good quality
ollama pull mistral       # 4.1GB, fast
ollama pull qwen2.5:7b    # 4.4GB, multilingual
```

Then update `.env`:
```env
OLLAMA_MODEL=llama3:latest  # or whatever they downloaded
```

---

### Scenario 3: Team Wants Same Experience As You

If you want everyone to use the exact same model as yours:

**Share your model NAME**, not the file:

1. You tell them: `"I'm using qwen2.5-7b-flirty:latest"`

2. They can:
   - **Option A**: Import the same GGUF file if they have it
     ```bash
     echo 'FROM /path/to/model.gguf' > Modelfile
     ollama create qwen2.5-7b-flirty -f Modelfile
     ```
   
   - **Option B**: Use a similar model instead
     ```bash
     ollama pull qwen2.5:7b
     ```
     Then set: `OLLAMA_MODEL=qwen2.5:7b`

---

## 🔄 Model Compatibility

**Good News**: The application works with ANY Ollama model!

All models can:
- ✅ Generate approval emails
- ✅ Handle student data
- ✅ Create professional content
- ✅ Follow the same prompts

**Quality differences**:
- Larger models (7B+) = Better quality
- Smaller models (3B) = Faster response
- All work for the use case!

---

## 📝 Setup Checklist for Team Members

Share this checklist:

- [ ] Install Ollama from https://ollama.com/download
- [ ] Run `ollama list` to see available models
- [ ] If empty, run `ollama pull llama3` (or any model)
- [ ] Clone the project repository
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Edit `.env` and set `OLLAMA_MODEL=your-model-name`
- [ ] Run `npm install` in backend directory
- [ ] Run `npm run dev` to start backend
- [ ] Test: Should work without errors!

---

## 🚨 Common Questions from Team

### Q: "Which model should I use?"
**A:** Any model works! Recommended: `llama3:latest` (good balance)

### Q: "Do models need to match?"
**A:** No! Everyone can use different models. The app adapts.

### Q: "Where do I find model names?"
**A:** Run `ollama list` - copy from the NAME column

### Q: "Can I use the same GGUF file you used?"
**A:** You can, but it's optional. Any model works!

### Q: "What if I don't want to use Ollama?"
**A:** Use Gemini API instead:
```env
AI_SERVICE=gemini
GEMINI_API_KEY=your-api-key
```

---

## 📍 Important Files

Tell team members about these files:

| File | Purpose |
|------|---------|
| `backend/.env.example` | Template configuration with all options |
| `backend/.env` | Their personal configuration (create from .env.example) |
| `backend/OLLAMA_SETUP.md` | Detailed setup guide |
| `backend/OLLAMA_QUICKSTART.md` | Quick 3-step guide |
| `README.md` | Main project documentation |

---

## 🎓 For Project Documentation

Add this to your project README or setup guide:

```markdown
## AI Model Setup

This project uses Ollama for AI-powered email generation. 
Each team member can use their own Ollama model.

**Setup Steps**:
1. Install Ollama: https://ollama.com/download
2. Download a model: `ollama pull llama3`
3. Configure: Set `OLLAMA_MODEL` in `backend/.env`

See [backend/OLLAMA_SETUP.md](backend/OLLAMA_SETUP.md) for details.
```

---

## 🔧 Technical Details (Optional)

**How it works**:
- Code references model by NAME, not file path
- Ollama manages models in its own library
- Environment variable controls which model to use
- No hardcoded paths, fully configurable

**Code location**: 
- `backend/src/services/ollama.service.ts` (line 5)
- Reads `OLLAMA_MODEL` from environment variables
- Falls back to default if not set

---

## ✅ Summary

**What to share with team**:
1. 📄 Link to `backend/OLLAMA_SETUP.md`
2. 📋 The setup checklist above
3. 💡 "You can use any Ollama model you want!"

**What NOT to share**:
- ❌ Your GGUF file (unless they specifically ask)
- ❌ Exact model requirement (they can choose their own)

**Bottom line**: Make it EASY for them - they just need to:
1. Install Ollama
2. Download any model  
3. Update one line in `.env`
4. Done!

---

## 📞 Support

If team members need help:
- Point them to: `backend/OLLAMA_SETUP.md`
- Quick start: `backend/OLLAMA_QUICKSTART.md`
- Troubleshooting section in OLLAMA_SETUP.md
- Your support: Confirm their model name is correct
