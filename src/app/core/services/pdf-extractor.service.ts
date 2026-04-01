import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Question } from '../models/exam.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfExtractorService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
  }

  extractQuestionsFromPdf(file: File): Observable<{ questions: Question[], title: string }> {
    const title = file.name.replace(/\.pdf$/i, '');
    return from(this.generateQuestions(file)).pipe(
      map(jsonStr => ({ questions: this.parseJsonToQuestions(jsonStr), title }))
    );
  }

  generateQuestionsFromContent(
    file: File,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number
  ): Observable<{ questions: Question[], title: string }> {
    const title = file.name.replace(/\.pdf$/i, '');
    return from(this.createQuestionsFromPdf(file, difficulty, count)).pipe(
      map(jsonStr => ({ questions: this.parseJsonToQuestions(jsonStr), title }))
    );
  }

  generateFromSyllabus(
    examName: string,
    selectedTopics: { subject: string; topics: string[] }[],
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    customPrompt?: string
  ): Observable<{ questions: Question[], title: string }> {
    const title = `${examName} — ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`;
    return from(this.createQuestionsFromSyllabus(examName, selectedTopics, difficulty, count, customPrompt)).pipe(
      map(jsonStr => ({ questions: this.parseJsonToQuestions(jsonStr), title }))
    );
  }

  generateExplanations(questions: Question[]): Observable<{ [questionId: string]: string }> {
    return from(this.fetchExplanations(questions));
  }

  private async generateQuestions(file: File): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const base64Data = await this.fileToGenerativePart(file);

    const prompt = `
      Extract all the questions and answers from this document. Output them STRICTLY as a JSON array in the following format:
      [
        {
          "question_number": 1,
          "question": "Full question text...",
          "options": {
            "A": "Option A text",
            "B": "Option B text",
            "C": "Option C text",
            "D": "Option D text"
          },
          "answer": "B"
        }
      ]
      CRITICAL RULES:
      - If a question has no options (subjective/fill-in-the-blank), set "options" to null.
      - If the answer is not provided in the document, use your knowledge to determine the correct answer and fill it in.
      - The "answer" field must only contain the option letter (e.g. "A", "B", "C", "D") for MCQ, or the numeric/word answer for subjective.
      - Do not include any markdown formatting, code blocks, or extra text. Output ONLY the raw JSON array.
    `;

    const result = await model.generateContent([prompt, base64Data]);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return text;
  }

  private async createQuestionsFromPdf(
    file: File,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const base64Data = await this.fileToGenerativePart(file);

    const difficultyDesc = {
      easy:   'basic conceptual questions with clear, straightforward answers',
      medium: 'moderately difficult questions that test understanding of key concepts',
      hard:   'challenging analytical questions requiring deep reasoning and multi-step logic'
    }[difficulty];

    const prompt = `
      Based on the content of this document, generate exactly ${count} multiple-choice questions (MCQ) at ${difficulty.toUpperCase()} difficulty level (${difficultyDesc}).
      Each question must have exactly 4 options (A, B, C, D) and a correct answer.
      Output ONLY a raw JSON array in this exact format with no markdown or extra text:
      [
        {
          "question_number": 1,
          "question": "Question text...",
          "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
          "answer": "B"
        }
      ]
      Generate all ${count} questions. Ensure variety in topics covered in the document.
    `;

    const result = await model.generateContent([prompt, base64Data]);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return text;
  }

  private async createQuestionsFromSyllabus(
    examName: string,
    selectedTopics: { subject: string; topics: string[] }[],
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    customPrompt?: string
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const difficultyDesc = {
      easy:   'basic conceptual questions with clear, straightforward answers suitable for beginners',
      medium: 'moderately difficult questions that test understanding of core concepts at standard exam level',
      hard:   'challenging analytical questions requiring deep reasoning, multi-step logic, and advanced problem solving'
    }[difficulty];

    const topicsBlock = selectedTopics.map(s =>
      `Subject: ${s.subject}\nTopics: ${s.topics.join(', ')}`
    ).join('\n\n');

    const extra = customPrompt ? `\n\nAdditional Instructions from user: ${customPrompt}` : '';

    const prompt = `You are an expert question paper setter for the ${examName} examination.

Generate exactly ${count} Multiple Choice Questions (MCQs) at ${difficulty.toUpperCase()} difficulty level (${difficultyDesc}).

Exam: ${examName}
Topics to cover:
${topicsBlock}
${extra}

STRICT RULES:
1. ALL questions MUST be MCQ only — exactly 4 options (A, B, C, D).
2. Questions must be strictly from the provided topics and relevant to the ${examName} exam pattern.
3. Distribute questions proportionally across the provided subjects/topics.
4. Difficulty must be consistently ${difficulty.toUpperCase()} throughout.
5. Each question must have one unambiguously correct answer.
6. Options should be plausible and not trivially obvious.
7. Do NOT repeat questions or make them too similar to each other.

Output ONLY a raw JSON array in this exact format with no markdown or extra text:
[
  {
    "question_number": 1,
    "question": "Full question text here?",
    "options": { "A": "Option A text", "B": "Option B text", "C": "Option C text", "D": "Option D text" },
    "answer": "B"
  }
]

Generate all ${count} questions now.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return text;
  }

  private async fetchExplanations(questions: Question[]): Promise<{ [questionId: string]: string }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const questionsForPrompt = questions.map(q => {
      const optionsStr = q.options.length > 0
        ? q.options.map(o => `${o.id}) ${o.text}`).join(', ')
        : '(Subjective)';
      return `Q${q.questionNumber}: ${q.text} Options: ${optionsStr} | Correct Answer: ${q.correctOptionId}`;
    }).join('\n\n');

    const prompt = `
      You are a math and reasoning tutor. For each question below, provide a concise step-by-step explanation of how to arrive at the correct answer.
      Output ONLY a JSON object where the key is the question number (e.g. "1", "2") and the value is the explanation string.
      Example: { "1": "Step 1: ... Step 2: ... therefore the answer is B.", "2": "..." }

      Questions:
      ${questionsForPrompt}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const parsed: { [key: string]: string } = JSON.parse(text);
      // Map from "1", "2" keys to "q1", "q2" question IDs
      const mapped: { [questionId: string]: string } = {};
      questions.forEach(q => {
        const key = String(q.questionNumber);
        if (parsed[key]) {
          mapped[q.id] = parsed[key];
        }
      });
      return mapped;
    } catch (e) {
      console.error('Failed to parse explanations', e);
      return {};
    }
  }

  private async fileToGenerativePart(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type || 'application/pdf'
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private parseJsonToQuestions(jsonStr: string): Question[] {
    try {
      const parsedCatQuestions = JSON.parse(jsonStr);
      return parsedCatQuestions.map((q: any) => {
        const rawAns = q.answer || '';
        const correctOptionId = rawAns.split(' ')[0];

        const options = q.options ? Object.entries(q.options).map(([key, val]) => {
          const cleanText = (val as string).replace(/\s*\[cite:\s*\d+\]\s*/g, '').trim();
          return { id: key, text: cleanText };
        }) : [];

        const cleanQuestionText = q.question.replace(/\s*\[cite:\s*\d+\]\s*/g, '').trim();

        return {
          id: `q${q.question_number}`,
          questionNumber: q.question_number,
          text: cleanQuestionText,
          options,
          correctOptionId,
          marks: 3,
          negativeMarks: options.length > 0 ? 1 : 0
        };
      });
    } catch (e) {
      console.error('Failed to parse AI response', e);
      throw new Error('Failed to parse the PDF document. The AI response was not valid JSON.');
    }
  }
}
