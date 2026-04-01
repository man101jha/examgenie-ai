<div align="center">
  <img src="public/logo.png" alt="ExamGenie Logo" width="120" />
</div>

<h1 align="center">ExamGenie 🧞</h1>
<p align="center">
  <strong>Turn any PDF into a smart, interactive exam using AI.</strong>
</p>

---

## 🚀 Live Demo
**Play with it here:** [https://examgenie-ai.vercel.app/](https://examgenie-ai.vercel.app/)

## 📖 About The Project
ExamGenie is an AI-powered educational application built with **Angular 18**. It takes any uploaded document (like question papers, study notes, or textbook chapters) and uses the **Google Gemini Pro AI API** to instantly extract and generate a fully functional, interactive multiple-choice test.

### ✨ Key Features
- **Smart PDF Extraction:** Upload a PDF and ExamGenie parses its contents.
- **Syllabus-Based Question Generator:** Pick from popular competitive exams (JEE, NEET, UPSC, SSC, RRB, etc.), select specific subjects and topics, and let AI generate a perfectly tailored practice test.
- **Dynamic Question Generation:** If a document doesn't have explicit questions, ExamGenie generates a custom test based on the text. You can select the **Difficulty** (Easy, Medium, Hard) and the **Number of Questions** (10-25).
- **Interactive Exam Environment:** A fully responsive multi-step test interface featuring fixed navigation bars, a question palette, and "Mark for Review" status tracking.
- **Detailed Performance Analytics:** Split result views including a quick circular scorecard and a dedicated high-fidelity report page with time-tracking per question and correctness plotting.
- **AI Explanations & Solutions:** After submitting, instantly view a color-coded scorecard. ExamGenie generates step-by-step explanations on-demand for every single question.
- **Serverless Automation:** Built securely with dynamic environment variables mapped to Vercel.

## 🛠️ Technology Stack
- **Frontend Framework:** Angular 18 (Standalone Components)
- **Styling:** Vanilla CSS3 + Flexbox/Grid (Glassmorphism UI)
- **AI Integration:** `@google/generative-ai` (Gemini 2.5 Flash)
- **Icons:** `lucide-angular`
- **Deployment:** Vercel 

## 💻 Running Locally

To run this project on your own machine:

**1. Clone the repository**
```bash
git clone https://github.com/man101jha/examgenie-ai.git
cd examgenie-ai
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up your Gemini API Key**
Open `src/environments/environment.ts` and replace `'REPLACE_ME_AT_BUILD_TIME'` with your personal Gemini API key. *(Note: Do not commit this key to version control!)*

**4. Run the development server**
```bash
ng serve
```
Navigate to `http://localhost:4200/`.

---

<p align="center">
  Built with ❤️ by <strong>Mangesh Jha</strong>
</p>
