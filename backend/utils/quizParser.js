import mammoth from 'mammoth';
import xlsx from 'xlsx';

export const parseQuizFile = async (buffer, mimetype, originalname) => {
  try {
    const ext = originalname.split('.').pop().toLowerCase();
    
    if (ext === 'docx') {
      const result = await mammoth.convertToHtml({ buffer });
      return parseDocxHtml(result.value);
    } else if (ext === 'xlsx' || ext === 'csv') {
      return parseExcel(buffer);
    } else {
      throw new Error("Unsupported file format");
    }
  } catch (error) {
    console.error("Error parsing quiz file:", error);
    throw new Error("Failed to parse file: " + error.message);
  }
};

const parseExcel = (buffer) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  const questions = [];
  
  for (const row of data) {
    // Expected columns: Question, Option A, Option B, Option C, Option D, Correct Answer, Explanation
    const questionText = row['Question'] || row['question'] || '';
    if (!questionText) continue;
    
    const options = [];
    if (row['Option A'] || row['option a']) options.push({ label: 'A', text: String(row['Option A'] || row['option a'] || '') });
    if (row['Option B'] || row['option b']) options.push({ label: 'B', text: String(row['Option B'] || row['option b'] || '') });
    if (row['Option C'] || row['option c']) options.push({ label: 'C', text: String(row['Option C'] || row['option c'] || '') });
    if (row['Option D'] || row['option d']) options.push({ label: 'D', text: String(row['Option D'] || row['option d'] || '') });
    
    const correctAnswerRaw = String(row['Correct Answer'] || row['correct answer'] || '');
    let correctAnswer = '';
    
    // Normalize correct answer
    const cleanedRaw = correctAnswerRaw.toLowerCase().trim();
    if (cleanedRaw.startsWith('a')) correctAnswer = 'A';
    else if (cleanedRaw.startsWith('b')) correctAnswer = 'B';
    else if (cleanedRaw.startsWith('c')) correctAnswer = 'C';
    else if (cleanedRaw.startsWith('d')) correctAnswer = 'D';
    else correctAnswer = correctAnswerRaw; // Fallback

    const explanation = row['Explanation'] || row['explanation'] || '';
    
    questions.push({
      question: questionText,
      options,
      correctAnswer,
      explanation
    });
  }
  
  return questions;
};

const parseDocxHtml = (html) => {
  const questions = [];
  
  // The document structure as analyzed:
  // Questions might have sub-statements. 
  // Then options a), b), c), d).
  // Then "The correct answer is:" or "The incorrect statement is:"
  // Then "Explanation:"
  // Then details.
  
  // A simplistic DOM parser to extract the blocks. Since we are in node, we can use regex or cheerio.
  // The mammoth output uses <p> tags mostly.
  
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  let currentQuestion = null;
  let mode = 'SEARCHING_QUESTION'; // SEARCHING_QUESTION, PARSING_QUESTION, PARSING_EXPLANATION
  
  const pars = [];
  $('p').each((i, el) => {
    pars.push($(el).text().trim());
  });
  
  let tempQuestionText = [];
  let tempOptions = [];
  let tempCorrectAnswer = '';
  let tempExplanation = [];
  
  const optionRegex = /^([a-d]|[A-D]|\d+)\)\s+(.*)$/;
  const answerRegex = /(correct answer|incorrect statement|correct option).*?(a|b|c|d)\)/i;
  
  for (let i = 0; i < pars.length; i++) {
    const text = pars[i];
    if (!text) continue;
    
    // Simplistic heuristic: a question starts with a number (e.g. "1. Which of the...")
    if (/^\d+\.\s/.test(text) && mode !== 'PARSING_EXPLANATION') {
      // Save previous if exists
      if (currentQuestion) {
        questions.push(finalizeQuestion(tempQuestionText, tempOptions, tempCorrectAnswer, tempExplanation));
      }
      currentQuestion = true;
      tempQuestionText = [text.replace(/^\d+\.\s/, '')];
      tempOptions = [];
      tempCorrectAnswer = '';
      tempExplanation = [];
      mode = 'PARSING_QUESTION';
      continue;
    }
    
    if (mode === 'PARSING_QUESTION') {
      if (text.toLowerCase().startsWith('explanation:')) {
        mode = 'PARSING_EXPLANATION';
        continue;
      }
      
      const answerMatch = text.match(answerRegex);
      if (answerMatch) {
        tempCorrectAnswer = answerMatch[2].toUpperCase();
        continue;
      }
      
      const optMatch = text.match(optionRegex);
      if (optMatch && tempOptions.length < 4) {
         let label = optMatch[1].toUpperCase();
         if (label === '1') label = 'A';
         if (label === '2') label = 'B';
         if (label === '3') label = 'C';
         if (label === '4') label = 'D';
         tempOptions.push({ label, text: optMatch[2] });
         continue;
      }
      
      // If none of the above, it might be continuation of question
      tempQuestionText.push(text);
    } else if (mode === 'PARSING_EXPLANATION') {
      if (/^\d+\.\s/.test(text)) {
         // Next question starts!
         if (currentQuestion) {
           questions.push(finalizeQuestion(tempQuestionText, tempOptions, tempCorrectAnswer, tempExplanation));
         }
         currentQuestion = true;
         tempQuestionText = [text.replace(/^\d+\.\s/, '')];
         tempOptions = [];
         tempCorrectAnswer = '';
         tempExplanation = [];
         mode = 'PARSING_QUESTION';
      } else {
         tempExplanation.push(text);
      }
    }
  }
  
  if (currentQuestion) {
    questions.push(finalizeQuestion(tempQuestionText, tempOptions, tempCorrectAnswer, tempExplanation));
  }
  
  return questions;
};

const finalizeQuestion = (qTextArr, optArr, cAns, expArr) => {
  return {
    question: qTextArr.join('\n'),
    options: optArr,
    correctAnswer: cAns || '',
    explanation: expArr.join('<br/>') // convert explanation to basic html for rich text editor
  };
};
