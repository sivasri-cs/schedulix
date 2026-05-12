import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChatBubbleLeftRight, HiXMark, HiPaperAirplane, HiSparkles } from 'react-icons/hi2';
import { aiKnowledgeBase } from '../../data/aiKnowledgeBase';

function getAIResponse(message, context) {
  const msg = message.toLowerCase();
  // Scheduling
  if (msg.includes('fcfs') || msg.includes('first come')) return formatAlgo(aiKnowledgeBase.scheduling.fcfs);
  if (msg.includes('sjf') || msg.includes('shortest job')) return formatAlgo(aiKnowledgeBase.scheduling.sjf);
  if (msg.includes('round robin') || msg.includes('rr ')) return formatAlgo(aiKnowledgeBase.scheduling.roundRobin);
  if (msg.includes('priority')) return formatAlgo(aiKnowledgeBase.scheduling.priority);
  // Memory
  if (msg.includes('fifo') && (msg.includes('page') || msg.includes('memory'))) return formatAlgo(aiKnowledgeBase.memory.fifo);
  if (msg.includes('lru')) return formatAlgo(aiKnowledgeBase.memory.lru);
  if (msg.includes('optimal') && msg.includes('page')) return formatAlgo(aiKnowledgeBase.memory.optimal);
  if (msg.includes('belady')) return "🔍 **Belady's Anomaly**: In FIFO page replacement, increasing the number of frames can paradoxically increase page faults. This doesn't occur with stack-based algorithms like LRU or Optimal.";
  // Deadlock
  if (msg.includes('banker')) return `📊 **${aiKnowledgeBase.deadlock.bankersAlgorithm.title}**\n\n${aiKnowledgeBase.deadlock.bankersAlgorithm.description}\n\n**Key Concepts:**\n${aiKnowledgeBase.deadlock.bankersAlgorithm.concepts.map(c => `• ${c}`).join('\n')}\n\n💡 ${aiKnowledgeBase.deadlock.bankersAlgorithm.tip}`;
  if (msg.includes('deadlock') && (msg.includes('condition') || msg.includes('what'))) return `🔒 **${aiKnowledgeBase.deadlock.conditions.title}**\n\n${aiKnowledgeBase.deadlock.conditions.description}\n${aiKnowledgeBase.deadlock.conditions.conditions.map((c, i) => `${i + 1}. ${c}`).join('\n')}`;
  // Disk
  if (msg.includes('disk') || msg.includes('scan') || msg.includes('sstf') || msg.includes('seek')) return `💿 **Disk Scheduling**\n\n${aiKnowledgeBase.disk.overview}\n\n${Object.entries(aiKnowledgeBase.disk.algorithms).map(([k, v]) => `**${k.toUpperCase()}**: ${v}`).join('\n\n')}`;
  // General
  if (msg.includes('best algorithm') || msg.includes('recommend') || msg.includes('suggest')) return suggestAlgorithm(context);
  if (msg.includes('what is') || msg.includes('explain')) {
    const match = aiKnowledgeBase.general.find(g => msg.includes(g.q.toLowerCase().replace('what is ', '').replace('?', '')));
    if (match) return `📚 **${match.q}**\n\n${match.a}`;
  }
  if (msg.includes('help') || msg.includes('hi') || msg.includes('hello')) return "👋 **Hello! I'm OSNova AI Assistant.**\n\nI can help you understand:\n• **Scheduling**: FCFS, SJF, Round Robin, Priority\n• **Memory**: FIFO, LRU, Optimal page replacement\n• **Deadlock**: Banker's Algorithm, deadlock conditions\n• **Disk**: FCFS, SSTF, SCAN, C-SCAN, LOOK\n\nTry asking: *\"Explain Round Robin\"* or *\"What's the best scheduling algorithm?\"*";
  return "🤔 I'm not sure about that. Try asking about specific algorithms like **FCFS, SJF, Round Robin, LRU, Banker's Algorithm**, or **SCAN**. Type **help** to see what I can assist with!";
}

function formatAlgo(algo) {
  let r = `📘 **${algo.title}**\n\n${algo.description}\n`;
  if (algo.pros) r += `\n✅ **Pros:** ${algo.pros.join(', ')}`;
  if (algo.cons) r += `\n❌ **Cons:** ${algo.cons.join(', ')}`;
  if (algo.bestFor) r += `\n🎯 **Best For:** ${algo.bestFor}`;
  if (algo.tip) r += `\n\n💡 **Tip:** ${algo.tip}`;
  return r;
}

function suggestAlgorithm(context) {
  if (context === 'scheduling') return "🎯 **Algorithm Recommendation:**\n\n• **Interactive systems** → Round Robin (fair time-sharing)\n• **Batch with known burst** → SJF (optimal avg waiting)\n• **Real-time/critical** → Priority Scheduling\n• **Simple batch** → FCFS (easy, predictable)\n\n💡 Compare all algorithms using the Comparison Mode!";
  if (context === 'memory') return "🎯 **Page Replacement Recommendation:**\n\n• **Best performance** → LRU (considers locality)\n• **Simple implementation** → FIFO (but watch for Belady's!)\n• **Theoretical baseline** → Optimal (compare others against it)";
  return "🎯 The best algorithm depends on your use case! Ask me about a specific simulator for tailored recommendations.";
}

export default function AIChatPanel({ context = 'general' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: "👋 Hi! I'm your OS learning assistant. Ask me anything about operating system concepts!" }]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      const response = getAIResponse(userMsg, context);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 500);
  };

  return (
    <>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan cursor-pointer">
        <HiSparkles className="w-6 h-6 text-osnova-bg" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-96 z-50 bg-osnova-surface/95 backdrop-blur-xl border-l border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2"><HiSparkles className="text-neon-cyan" /><h3 className="font-bold gradient-text">AI Assistant</h3></div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white"><HiXMark size={20} /></button>
            </div>
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user' ? 'bg-neon-cyan/10 border border-neon-cyan/20 text-white' : 'bg-white/5 border border-white/5 text-white/80'
                  }`}>{msg.text}</div>
                </motion.div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask about OS concepts..." className="input-glow flex-1 text-sm" />
                <button onClick={send} className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan flex items-center justify-center hover:bg-neon-cyan/20 transition-colors">
                  <HiPaperAirplane className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
