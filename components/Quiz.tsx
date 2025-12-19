
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { QuizData } from '../types';

interface QuizProps {
  questions: QuizData[];
  onFinish?: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Helper to identify the index of the correct answer string within the options array
  const getCorrectIndex = (q: QuizData) => q.options.indexOf(q.correct_option);

  const score = questions.reduce((acc, q, idx) => 
    answers[idx] === getCorrectIndex(q) ? acc + 1 : acc, 0
  );

  const handleFinish = () => {
    setShowResults(true);
    if (onFinish) onFinish(score);
  };

  const handleRetake = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      {questions.map((q, qIdx) => {
        const correctIdx = getCorrectIndex(q);
        return (
          <div key={qIdx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-100">
            <p className="font-bold text-slate-800 mb-4">{qIdx + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  disabled={showResults}
                  onClick={() => setAnswers({ ...answers, [qIdx]: oIdx })}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[qIdx] === oIdx 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  } ${showResults && oIdx === correctIdx ? 'border-green-500 bg-green-50' : ''} ${showResults && answers[qIdx] === oIdx && oIdx !== correctIdx ? 'border-red-500 bg-red-50' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      
      {!showResults ? (
        <button 
          onClick={handleFinish}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {t('quiz')}
        </button>
      ) : (
        <div className="text-center bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-xl">
          <p className="text-4xl font-black text-blue-600 mb-2">{Math.round((score / questions.length) * 100)}%</p>
          <p className="text-slate-500 font-medium">Knowledge Retention Secured!</p>
          <button 
            onClick={handleRetake}
            className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            {t('retake')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
