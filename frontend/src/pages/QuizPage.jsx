import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import NeonButton from '../components/common/NeonButton';
import { quizData } from '../data/quizData';
import { HiAcademicCap, HiCheck, HiXMark, HiArrowRight, HiTrophy } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const question = quizData[current];
  const score = Object.entries(answers).filter(([k, v]) => quizData[parseInt(k)]?.answer === v).length;

  const selectAnswer = (idx) => { if (!confirmed) setSelected(idx); };

  const confirm = () => {
    if (selected === null) return;
    setAnswers({ ...answers, [current]: selected });
    setConfirmed(true);
  };

  const next = () => {
    if (current < quizData.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setStarted(false); setCurrent(0); setAnswers({}); setShowResult(false); setSelected(null); setConfirmed(false);
  };

  const pct = Math.round((score / quizData.length) * 100);

  if (!started) return (
    <MainLayout>
      <div className="max-w-2xl mx-auto text-center py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-7xl mb-6">🎓</div>
          <h1 className="text-4xl font-black text-white mb-4">OS <span className="gradient-text">Knowledge Quiz</span></h1>
          <p className="text-white/40 mb-8 text-lg">Test your understanding of Operating System concepts with {quizData.length} questions</p>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {['Process Scheduling', 'Memory Management', 'Deadlock', 'Disk Scheduling'].map(cat => (
              <span key={cat} className="px-3 py-1.5 rounded-full glass text-xs text-neon-cyan border border-neon-cyan/20">{cat}</span>
            ))}
          </div>
          <NeonButton onClick={() => setStarted(true)} variant="fill" className="!py-4 !px-10 text-lg">Start Quiz <HiArrowRight className="inline ml-2" /></NeonButton>
        </motion.div>
      </div>
    </MainLayout>
  );

  if (showResult) return (
    <MainLayout>
      <div className="max-w-2xl mx-auto text-center py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-7xl mb-6">{pct >= 80 ? '🏆' : pct >= 50 ? '👏' : '📚'}</div>
          <h1 className="text-4xl font-black text-white mb-2">Quiz Complete!</h1>
          <div className="my-8">
            <div className="text-6xl font-black gradient-text">{pct}%</div>
            <p className="text-white/40 mt-2">{score} / {quizData.length} correct</p>
          </div>
          <div className="glass rounded-2xl p-6 mb-8 text-left space-y-3 max-h-80 overflow-y-auto">
            {quizData.map((q, i) => {
              const correct = q.answer === answers[i];
              return (
                <div key={i} className={`p-3 rounded-xl border ${correct ? 'bg-neon-green/5 border-neon-green/20' : 'bg-neon-pink/5 border-neon-pink/20'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {correct ? <HiCheck className="text-neon-green" /> : <HiXMark className="text-neon-pink" />}
                    <span className="text-sm text-white">{q.question}</span>
                  </div>
                  {!correct && <p className="text-xs text-white/40 ml-6">Correct: {q.options[q.answer]} — {q.explanation}</p>}
                </div>
              );
            })}
          </div>
          <NeonButton onClick={restart} variant="fill">Try Again</NeonButton>
        </motion.div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Question {current + 1} of {quizData.length}</span>
            <span className="text-neon-cyan">{question.category}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5">
            <motion.div animate={{ width: `${((current + 1) / quizData.length) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
          </div>
        </div>

        <GlassCard hover={false}>
          <h2 className="text-xl font-bold text-white mb-6">{question.question}</h2>
          <div className="space-y-3 mb-6">
            {question.options.map((opt, i) => {
              let style = 'bg-white/3 border-white/10 text-white/70 hover:border-white/30';
              if (confirmed) {
                if (i === question.answer) style = 'bg-neon-green/10 border-neon-green/40 text-neon-green';
                else if (i === selected && i !== question.answer) style = 'bg-neon-pink/10 border-neon-pink/40 text-neon-pink';
              } else if (i === selected) {
                style = 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan';
              }
              return (
                <motion.button key={i} whileHover={!confirmed ? { scale: 1.01 } : {}} onClick={() => selectAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${style}`}>
                  <span className="font-bold mr-3">{String.fromCharCode(65 + i)}.</span>{opt}
                </motion.button>
              );
            })}
          </div>
          {confirmed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-sm text-white/70 mb-4">
              💡 {question.explanation}
            </motion.div>
          )}
          <div className="flex justify-end gap-3">
            {!confirmed && <NeonButton onClick={confirm} disabled={selected === null} variant="fill">Confirm</NeonButton>}
            {confirmed && <NeonButton onClick={next} variant="fill">{current < quizData.length - 1 ? 'Next →' : 'See Results'}</NeonButton>}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
