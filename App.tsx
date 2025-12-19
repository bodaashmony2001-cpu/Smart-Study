
import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';
import MindMap from './components/MindMap';
import Flashcards from './components/Flashcards';
import SpacedRepetition from './components/SpacedRepetition';
import VisualForge from './components/VisualForge';
import { StudySession, User, ChatMessage, AcademicAsset, Flashcard } from './types';
import { generateAcademicAsset, chatWithMaterial } from './services/geminiService';

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<StudySession | null>(null);
  const [savedVault, setSavedVault] = useState<StudySession[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'mindmap' | 'schedule' | 'chat' | 'forge'>('summary');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const loadDemoLesson = () => {
    setIsProcessing(true);
    setProcessingStatus(language === 'ar' ? "جارٍ تحميل العرض التوضيحي..." : "Loading Demo Lesson...");
    
    setTimeout(() => {
      // English Assets
      const demoAssetEn: AcademicAsset = {
        meta: { topic_title: "Quantum Mechanics", reading_time: "15 min", difficulty_level: "Hard" },
        summary: {
          content: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. Unlike classical physics, energy, momentum, angular momentum, and other quantities of a bound system are restricted to discrete values (quantization).\n\nCentral to the theory are the concepts of wave–particle duality, the uncertainty principle, and the observer effect. The mathematical formulation involves the wave function, which provides information about the probability amplitude of position, momentum, and other physical properties of a particle.",
          english_keywords: ["Quantum Mechanics", "Wave Function", "Uncertainty", "Physics"]
        },
        flashcards: [
          { id: 1, front_text: "What is the Wave Function (Ψ)?", back_text: "A mathematical description of the quantum state of an isolated quantum system, whose square magnitude gives probability density.", type: "definition" },
          { id: 2, front_text: "Heisenberg Uncertainty Principle", back_text: "States that the position and momentum of a particle cannot both be measured exactly, at the same time (Δx · Δp ≥ ℏ/2).", type: "formula" },
          { id: 3, front_text: "What is Spin?", back_text: "An intrinsic form of angular momentum carried by elementary particles.", type: "definition" },
          { id: 4, front_text: "Schrödinger Equation", back_text: "A linear partial differential equation that governs the wave function of a quantum-mechanical system.", type: "definition" },
          { id: 5, front_text: "Wave-Particle Duality", back_text: "The concept that every quantum entity exhibits both particle and wave-like properties.", type: "process" }
        ],
        mind_map_data: {
          root_node: "Quantum Mechanics",
          branches: [
            { title: "Wave Function", icon: "🌊", color_code: "#3b82f6", key_points: ["Psi (ψ)", "Probability", "State"] },
            { title: "Uncertainty", icon: "🌫️", color_code: "#a855f7", key_points: ["Heisenberg", "Position/Momentum", "Limits"] },
            { title: "Quantum Spin", icon: "🔄", color_code: "#ec4899", key_points: ["Intrinsic Momentum", "Fermions", "Stern-Gerlach"] },
            { title: "Schrödinger Eq", icon: "📐", color_code: "#10b981", key_points: ["Time Evolution", "Hamiltonian", "Dynamics"] }
          ]
        },
        visual_forge: {
          concepts: [
            { id: 0, label: "Superposition", description: "State overlap", shape: "hexagon", importance: 9, color: "#22d3ee" },
            { id: 1, label: "Entanglement", description: "Spooky action", shape: "star", importance: 10, color: "#f472b6" },
            { id: 2, label: "Tunneling", description: "Barrier pass", shape: "circle", importance: 7, color: "#fbbf24" },
            { id: 3, label: "Duality", description: "Wave vs Particle", shape: "rect", importance: 8, color: "#a855f7" },
            { id: 4, label: "Operator", description: "Math rule", shape: "circle", importance: 5, color: "#9ca3af" },
            { id: 5, label: "Planck", description: "Quantum constant", shape: "star", importance: 8, color: "#34d399" }
          ],
          connections: [{ from: 0, to: 1 }, { from: 3, to: 0 }, { from: 5, to: 3 }, { from: 1, to: 2 }]
        },
        spaced_repetition_schedule: [
          { day_offset: 1, notification_title: "Review: Spins", activity_type: "Review", question: "Explain the Stern-Gerlach experiment results." },
          { day_offset: 3, notification_title: "Quiz: Constants", activity_type: "MCQ", question: "Which constant is central to Quantum Mechanics?", quiz_data: { question: "Which constant is central?", options: ["Planck Constant", "Gravitational Constant", "Speed of Light"], correct_option: "Planck Constant" } }
        ],
        chatbot_persona_context: "You are Werner Heisenberg. Explain concepts with a focus on uncertainty and matrix mechanics."
      };

      // Arabic Assets
      const demoAssetAr: AcademicAsset = {
        meta: { topic_title: "ميكانيكا الكم", reading_time: "١٥ دقيقة", difficulty_level: "Hard" },
        summary: {
          content: "ميكانيكا الكم هي نظرية أساسية في الفيزياء توفر وصفًا للخصائص الفيزيائية للطبيعة على مستوى الذرات والجسيمات دون الذرية. على عكس الفيزياء الكلاسيكية، فإن الطاقة والزخم والزخم الزاوي والكميات الأخرى لنظام مقيد تقتصر على قيم منفصلة (تكميم).\n\nمن المفاهيم المركزية للنظرية ازدواجية الموجة والجسيم، ومبدأ عدم اليقين، وتأثير المراقب. تتضمن الصياغة الرياضية الدالة الموجية، التي توفر معلومات حول سعة الاحتمال للموضع والزخم والخصائص الفيزيائية الأخرى للجسيم.",
          english_keywords: ["Quantum Mechanics", "Wave Function", "Uncertainty", "Physics"]
        },
        flashcards: [
          { id: 1, front_text: "ما هي الدالة الموجية (Ψ)؟", back_text: "وصف رياضي للحالة الكمية لنظام كمي معزول، ويعطي مربع مقدارها كثافة الاحتمال.", type: "definition" },
          { id: 2, front_text: "مبدأ عدم اليقين لهيزنبرغ", back_text: "ينص على أنه لا يمكن تحديد موضع وزخم جسيم بدقة تامة في نفس الوقت (Δx · Δp ≥ ℏ/2).", type: "formula" },
          { id: 3, front_text: "ما هو اللف المغزلي (Spin)؟", back_text: "شكل جوهري من الزخم الزاوي تحمله الجسيمات الأولية.", type: "definition" },
          { id: 4, front_text: "معادلة شرودنغر", back_text: "معادلة تفاضلية جزئية خطية تحكم الدالة الموجية لنظام ميكانيكي كمي.", type: "definition" },
          { id: 5, front_text: "ازدواجية الموجة والجسيم", back_text: "مفهوم أن كل كيان كمي يظهر خصائص تشبه الجسيمات وخصائص تشبه الموجات.", type: "process" }
        ],
        mind_map_data: {
          root_node: "ميكانيكا الكم",
          branches: [
            { title: "الدالة الموجية", icon: "🌊", color_code: "#3b82f6", key_points: ["Psi (ψ)", "الاحتمالية", "الحالة"] },
            { title: "عدم اليقين", icon: "🌫️", color_code: "#a855f7", key_points: ["هيزنبرغ", "الموقع/الزخم", "الحدود"] },
            { title: "اللف المغزلي", icon: "🔄", color_code: "#ec4899", key_points: ["الزخم الجوهري", "الفرميونات", "شتيرن-غيرلاخ"] },
            { title: "معادلة شرودنغر", icon: "📐", color_code: "#10b981", key_points: ["التطور الزمني", "الهاملتوني", "الديناميكا"] }
          ]
        },
        visual_forge: {
          concepts: [
            { id: 0, label: "التراكب", description: "تداخل الحالات", shape: "hexagon", importance: 9, color: "#22d3ee" },
            { id: 1, label: "التشابك", description: "تأثير عن بعد", shape: "star", importance: 10, color: "#f472b6" },
            { id: 2, label: "النفق الكمي", description: "اختراق الحاجز", shape: "circle", importance: 7, color: "#fbbf24" },
            { id: 3, label: "الازدواجية", description: "موجة ضد جسيم", shape: "rect", importance: 8, color: "#a855f7" },
            { id: 4, label: "المؤثر", description: "قاعدة رياضية", shape: "circle", importance: 5, color: "#9ca3af" },
            { id: 5, label: "بلانك", description: "الثابت الكمي", shape: "star", importance: 8, color: "#34d399" }
          ],
          connections: [{ from: 0, to: 1 }, { from: 3, to: 0 }, { from: 5, to: 3 }, { from: 1, to: 2 }]
        },
        spaced_repetition_schedule: [
          { day_offset: 1, notification_title: "مراجعة: اللف المغزلي", activity_type: "Review", question: "اشرح نتائج تجربة شتيرن-غيرلاخ." },
          { day_offset: 3, notification_title: "اختبار: الثوابت", activity_type: "MCQ", question: "أي ثابت هو مركزي لميكانيكا الكم؟", quiz_data: { question: "أي ثابت هو مركزي؟", options: ["ثابت بلانك", "ثابت الجاذبية", "سرعة الضوء"], correct_option: "ثابت بلانك" } }
        ],
        chatbot_persona_context: "أنت فيرنر هيزنبرغ. اشرح المفاهيم مع التركيز على عدم اليقين وميكانيكا المصفوفات."
      };

      const demoSession: StudySession = {
        id: "demo-quantum",
        fileName: language === 'ar' ? "مقدمة_ميكانيكا_الكم.pdf" : "Quantum_Mechanics_Intro.pdf",
        pageRange: "Demo",
        asset: language === 'ar' ? demoAssetAr : demoAssetEn,
        illustrations: [],
        chatHistory: [],
        timestamp: Date.now()
      };
      
      setSession(demoSession);
      setSavedVault(prev => [demoSession, ...prev]);
      setActiveTab('mindmap');
      setIsProcessing(false);
    }, 1500);
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    setProcessingStatus(`Scanning ${ext?.toUpperCase()} Matrix...`);

    try {
      if (ext === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        const limit = Math.min(pdf.numPages, 50);
        for (let i = 1; i <= limit; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        return text;
      } 
      
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        return result.value;
      }

      if (ext === 'xlsx' || ext === 'xls') {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const workbook = window.XLSX.read(arrayBuffer);
        return workbook.SheetNames.map(name => 
          // @ts-ignore
          window.XLSX.utils.sheet_to_txt(workbook.Sheets[name])
        ).join('\n');
      }

      if (ext === 'pptx') {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const zip = await window.JSZip.loadAsync(arrayBuffer);
        let text = '';
        const slideEntries = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide'));
        for (const slideName of slideEntries) {
          const xml = await zip.file(slideName).async('text');
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xml, 'application/xml');
          const texts = xmlDoc.getElementsByTagName('a:t');
          for (let j = 0; j < texts.length; j++) {
            text += (texts[j].textContent || '') + ' ';
          }
          text += '\n';
        }
        return text;
      }

      return await file.text();
    } catch (e) {
      console.error("Extraction error:", e);
      throw new Error("Neural Scan failed. File may be corrupted or encrypted.");
    }
  };

  const processLesson = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    
    try {
      const extractedText = await extractTextFromFile(selectedFile);
      if (!extractedText.trim() || extractedText.length < 50) {
        throw new Error("Insufficient material for meaningful synthesis.");
      }
      
      setProcessingStatus('Calibrating Neural Forge...');
      const asset = await generateAcademicAsset(extractedText, language);
      
      const newSession: StudySession = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        pageRange: 'Full Content',
        asset,
        illustrations: [],
        chatHistory: [],
        timestamp: Date.now(),
      };
      setSession(newSession);
      setSavedVault(prev => [newSession, ...prev]);
      setActiveTab('summary');
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Synthesis engine encountered a logic error. Try another segment.");
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleExplainCard = async (card: Flashcard) => {
    if (!session) return;
    setActiveTab('chat');
    const prompt = language === 'ar' 
      ? `اشرح لي هذا المفهوم بذكاء واختصار: "${card.front_text}" - "${card.back_text}"`
      : `Explain this concept with high efficiency: "${card.front_text}" - "${card.back_text}"`;
    
    const userMsg: ChatMessage = { role: 'user', text: prompt };
    updateChat(userMsg);
    
    try {
      const response = await chatWithMaterial(prompt, session.asset.chatbot_persona_context, session.chatHistory, language);
      updateChat({ role: 'model', text: response });
    } catch (e) {
      updateChat({ role: 'model', text: "Explanation link lost." });
    }
  };

  const updateChat = (newMsg: ChatMessage) => {
    if (!session) return;
    const updatedSession = { ...session, chatHistory: [...session.chatHistory, newMsg] };
    setSession(updatedSession);
    setSavedVault(prev => prev.map(s => s.id === session.id ? updatedSession : s));
  };

  // Auth Handlers
  const handleGoogleLogin = () => {
    setUser({ name: 'Google Scholar', email: 'scholar@gmail.com' });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      setUser({ name: authEmail.split('@')[0], email: authEmail });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080414] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-violet-900/10 blur-[200px] rounded-full animate-neural"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-cyan-900/10 blur-[200px] rounded-full animate-pulse"></div>
        
        <div className="glass p-12 lg:p-16 rounded-[4rem] w-full max-w-lg text-center border-white/5 relative z-10 shadow-2xl animate-fade-in">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 inline-flex p-6 rounded-[2.5rem] mb-10 shadow-[0_20px_50px_rgba(109,40,217,0.4)] animate-float">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          
          <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">Smart Study <span className="text-cyan-400">Pro</span></h1>
          <p className="text-violet-300/40 mb-12 font-medium text-xl leading-snug">{t('tagline')}</p>
          
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all font-medium" 
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all font-medium" 
              required
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-violet-600 text-white py-5 rounded-3xl font-black text-2xl hover:bg-violet-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(109,40,217,0.3)]">
              Login to Neural Forge
            </button>
          </form>

          <div className="flex items-center gap-4 mb-8 opacity-40">
            <div className="h-[1px] flex-1 bg-white"></div>
            <span className="text-white text-sm font-black">OR</span>
            <div className="h-[1px] flex-1 bg-white"></div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full bg-white text-slate-900 py-4 rounded-3xl font-black text-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={() => {setUser(null); setSession(null);}}>
      {!session ? (
        <div className="max-w-6xl mx-auto space-y-20 py-16 animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-6xl font-black text-white tracking-tighter glow-cyan">Academic Synthesis Lab</h2>
            <p className="text-violet-300/40 font-black text-2xl uppercase tracking-[0.3em]">Precision Learning for Professionals</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="glass p-12 rounded-[4rem] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.4)] space-y-10 hover:border-violet-500/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
                <h3 className="font-black text-4xl text-violet-100 uppercase tracking-tighter">Forge Knowledge</h3>
              </div>
              <div className="space-y-6">
                <div className="relative h-64 border-2 border-dashed border-violet-500/20 rounded-[3.5rem] flex flex-col items-center justify-center hover:bg-violet-900/10 transition-all cursor-pointer group-hover:border-violet-500/60">
                  <input type="file" accept=".pdf,.docx,.xlsx,.xls,.pptx,.txt" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="flex gap-6 mb-6 opacity-30 group-hover:opacity-100 transition-all group-hover:scale-110">
                    <span className="text-5xl">📄</span><span className="text-5xl">📊</span><span className="text-5xl">🖥️</span>
                  </div>
                  <p className="text-xl font-black text-violet-100/30 px-10 text-center truncate w-full">
                    {selectedFile ? selectedFile.name : 'Drop Academic Data Here'}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button onClick={processLesson} disabled={!selectedFile || isProcessing} className="flex-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white py-6 rounded-[2.5rem] font-black text-xl disabled:opacity-50 shadow-2xl hover:shadow-violet-600/40 transition-all active:scale-[0.97]">
                    Ignite Synthesis
                  </button>
                  <button onClick={loadDemoLesson} disabled={isProcessing} className="w-20 bg-white/5 text-violet-200 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center" title="Load Demo Lesson">
                    🧪
                  </button>
                </div>
              </div>
            </div>
            
            <div className="glass p-12 rounded-[4rem] border-white/5 space-y-10 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl">📂</div>
                <h3 className="font-black text-4xl text-violet-100 uppercase tracking-tighter">Neural Archive</h3>
              </div>
              <div className="space-y-6 overflow-y-auto max-h-[420px] pr-4 no-scrollbar">
                {savedVault.length === 0 ? (
                  <div className="text-center py-20 space-y-6 opacity-30">
                    <div className="w-24 h-24 bg-violet-900/20 rounded-full mx-auto flex items-center justify-center border border-white/5">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <p className="text-2xl font-black uppercase tracking-widest">Neural Vault Empty</p>
                  </div>
                ) : (
                  savedVault.map(v => (
                    <button key={v.id} onClick={() => setSession(v)} className={`w-full text-left p-8 bg-white/5 hover:bg-white/10 rounded-[2.5rem] border border-white/5 hover:border-violet-500/50 transition-all flex justify-between items-center group ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className={`truncate flex-1 ${language === 'ar' ? 'text-right' : ''}`}>
                        <p className="font-black text-violet-100 truncate text-2xl tracking-tight leading-none">{v.asset.meta.topic_title}</p>
                        <p className="text-sm text-violet-400/40 uppercase tracking-[0.3em] font-black mt-3">{v.fileName}</p>
                      </div>
                      <span className="text-xs font-black text-white bg-violet-600 px-6 py-2 rounded-full uppercase ml-8 shadow-xl ring-2 ring-violet-500/20">{v.asset.meta.difficulty_level}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-16 animate-fade-in py-10">
          <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-10 ${language === 'ar' ? 'xl:flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-10 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
              <button onClick={() => setSession(null)} className="p-5 bg-white/5 hover:bg-violet-600 rounded-[2rem] transition-all shadow-2xl text-violet-100 group border border-white/5">
                <svg className={`w-10 h-10 transition-transform group-hover:scale-110 ${language === 'ar' ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-white tracking-tighter glow-cyan leading-none">{session.asset.meta.topic_title}</h2>
                <div className={`flex items-center gap-6 mt-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-black bg-indigo-600/20 text-indigo-200 px-6 py-2 rounded-full border border-indigo-500/20 tracking-widest uppercase">⏱ {session.asset.meta.reading_time}</span>
                  <span className="text-sm font-black bg-pink-600/20 text-pink-200 px-6 py-2 rounded-full border border-pink-500/20 uppercase tracking-widest ring-2 ring-pink-500/10">Level: {session.asset.meta.difficulty_level}</span>
                </div>
              </div>
            </div>
            <div className={`flex glass p-2.5 rounded-[3rem] flex-wrap gap-2.5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              {[
                {id: 'summary', label: 'Synthesis', icon: '📝'},
                {id: 'flashcards', label: 'Neural Cards', icon: '🃏'},
                {id: 'mindmap', label: 'Mental Model', icon: '🕸'},
                {id: 'schedule', label: 'Spaced Rep', icon: '📅'},
                {id: 'forge', label: 'Visual Forge', icon: '🌋'},
                {id: 'chat', label: 'Neural Tutor', icon: '🤖'}
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-8 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-4 uppercase tracking-[0.2em] ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-[0_15px_30px_rgba(109,40,217,0.5)] ring-2 ring-violet-400/50' : 'text-violet-300/30 hover:text-white hover:bg-white/5'}`}>
                  <span className="text-xl">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[800px] relative">
            {activeTab === 'summary' && (
              <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
                <div className={`glass p-20 rounded-[5rem] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] ${language === 'ar' ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-6 mb-12 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-24 h-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)]"></div>
                    <h3 className="text-4xl font-black text-violet-100 uppercase tracking-tighter">Core Synthesis</h3>
                  </div>
                  <div className="text-3xl text-violet-100/90 leading-[1.6] font-medium whitespace-pre-line tracking-tight drop-shadow-md">
                    {session.asset.summary.content}
                  </div>
                </div>
                <div className={`flex flex-wrap gap-5 ${language === 'ar' ? 'justify-end' : ''}`}>
                  {session.asset.summary.english_keywords.map((kw, i) => (
                    <span key={i} className="glass border-white/10 px-10 py-4 rounded-full text-lg font-black text-cyan-400 shadow-2xl hover:border-cyan-500/50 transition-all cursor-default ring-1 ring-cyan-500/10">#{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'flashcards' && <Flashcards cards={session.asset.flashcards} onExplain={handleExplainCard} />}
            {activeTab === 'mindmap' && <MindMap data={session.asset.mind_map_data} />}
            {activeTab === 'schedule' && <SpacedRepetition schedule={session.asset.spaced_repetition_schedule} />}
            {activeTab === 'forge' && <VisualForge data={session.asset.visual_forge} onGenerate={() => setActiveTab('forge')} />}
            {activeTab === 'chat' && <ChatBot context={session.asset.chatbot_persona_context} history={session.chatHistory} onUpdateHistory={updateChat} />}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-[#080414]/95 backdrop-blur-[40px] z-[9999] flex flex-col items-center justify-center p-16 text-center animate-fade-in">
          <div className="relative mb-16">
            <div className="w-40 h-40 border-[6px] border-violet-600 border-t-transparent rounded-full animate-spin shadow-[0_0_100px_rgba(109,40,217,0.4)]"></div>
            <div className="absolute inset-0 w-40 h-40 border-[6px] border-cyan-400 border-b-transparent rounded-full animate-spin [animation-direction:reverse] opacity-50 scale-75"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl animate-pulse">🧠</span>
            </div>
          </div>
          <h3 className="text-7xl font-black text-white mb-8 tracking-tighter glow-cyan">Aligning Neural Synapses</h3>
          <p className="text-violet-300/40 font-black text-3xl uppercase tracking-[0.4em] max-w-2xl">{processingStatus || 'Compiling high-resolution brain map...'}</p>
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
