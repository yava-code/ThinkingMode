# ThinkMode: The Power of Reasoning

<div align="center">
  <img src="https://kurokonobasuke.fandom.com/pl/wiki/Tetsuya_Kuroko" alt="ThinkMode Banner" width="100%" />
</div>

<div align="center">
  <h3>Built with ❤️ by <a href="https://github.com/yava-code/">yava-code</a></h3>
</div>

<br />

## 👋 Intro

**ThinkMode** isn't just another AI wrapper. It's a dedicated workspace for thinking, reasoning, and building.

I built this because I needed a tool that didn't just give answers, but helped me **find** them. Use it to debug complex code, outline features, or just think clearer.

---

## 🚀 Quick Start

### 1. Requirements

- **Node.js** (v18+)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Run Locally

Clone and install dependencies:

```bash
git clone https://github.com/yava-code/ThinkingMode.git
cd ThinkingMode
npm install
```

Set up your environment:

Create a `.env.local` file:

```env
VITE_GEMINI_API_KEY=your_key_here
```

Start the dev server:

```bash
npm run dev
```

---

## 🐳 Run with Docker

Prefer containers? I've got you covered.

**Build the image:**

```bash
docker build -t thinkmode .
```

**Run the container:**

```bash
docker run -p 8080:80 thinkmode
```

_Open `http://localhost:8080` to see your app._

---

## 🛠️ Tech Stack

- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **AI:** Google Gemini API
- **Testing:** Vitest

---

## 🧪 Testing

Run the test suite to ensure everything is stable:

```bash
npm test
```

---

## 📦 CI/CD

Deployment is automated via **GitHub Actions**. Commits to `main` trigger:

- Dependency installation
- Linting & Testing
- Production Build

---

_Created by [yava-code](https://github.com/yava-code/). Questions? Open a PR._
