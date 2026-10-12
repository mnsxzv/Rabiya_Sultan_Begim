import React, { useState } from 'react';
import {
  SCIENTIFIC_PROJECT_DATA,
  QUIZ_QUESTIONS,
  HISTORICAL_POINTS,
  HistoricalPoint,
} from '../data/historicalData';
import rabiyaPortrait from '../assets/images/rabiya_sultan_begim_1791832334407.jpg';
import rabiyaMausoleum from '../assets/images/rabiya_mausoleum_1791832364560.jpg';
import {
  ChevronUp,
  ChevronDown,
  BookOpen,
  Award,
  Crown,
  Landmark,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  X,
  ExternalLink,
  Send,
  Loader2,
  CheckCircle2,
  Share2,
  RotateCcw,
  Scroll,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BottomSheetProps {
  sheetState: 'collapsed' | 'half' | 'expanded';
  setSheetState: (state: 'collapsed' | 'half' | 'expanded') => void;
  selectedPoint: HistoricalPoint | null;
  onSelectPoint: (point: HistoricalPoint) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  sheetState,
  setSheetState,
  selectedPoint,
  onSelectPoint,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'project' | 'biography' | 'mausoleum' | 'statehood' | 'quiz' | 'ai'
  >('overview');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // AI Consultant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiConversation, setAiConversation] = useState<
    { sender: 'user' | 'assistant'; text: string; thinking?: string }[]
  >([
    {
      sender: 'assistant',
      text: 'Сәлеметсіз бе! Мен — Рабия Сұлтан Бегімнің тарихи тұлғасы, Түркістандағы кесенесі және ортағасырлық Дешті Қыпшақ пен Мауереннахр дипломатиясы бойынша ғылыми AI-кеңесшімін (Gemini 3.1 Pro High Thinking). Қандай тарихи мәселені терең талқылағыңыз келеді?',
    },
  ]);

  const pData = SCIENTIFIC_PROJECT_DATA;

  const toggleExpand = () => {
    if (sheetState === 'collapsed') setSheetState('half');
    else if (sheetState === 'half') setSheetState('expanded');
    else setSheetState('collapsed');
  };

  const handleQuizSelect = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score += 1;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 4) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleAskAi = async (customPrompt?: string) => {
    const query = customPrompt || aiQuestion;
    if (!query.trim() || aiLoading) return;

    const userMsg = query;
    setAiConversation((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setAiQuestion('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/historical-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          topic: activeTab,
        }),
      });

      const data = await response.json();
      if (data.answer) {
        setAiConversation((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            thinking: data.thinkingLevelUsed,
          },
        ]);
      } else {
        throw new Error(data.error || 'Жауап алынбады');
      }
    } catch (err: any) {
      setAiConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Қате орын алды немесе желіде іркіліс болды: ${err.message || 'Серверге қосылу мүмкін болмады'}. Дегенмен, жобадағы дайын ғылыми анықтамаларды тиісті бөлімдерден толық оқи аласыз.`,
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Height styles based on sheetState
  const heightClass = {
    collapsed: 'h-16 md:h-20',
    half: 'h-[55vh] md:h-[65vh]',
    expanded: 'h-[92vh]',
  }[sheetState];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[500] bg-stone-900/98 text-stone-100 border-t border-amber-500/40 shadow-2xl transition-all duration-300 ease-out flex flex-col rounded-t-3xl backdrop-blur-2xl ${heightClass}`}
    >
      {/* Drag & Header Bar */}
      <div
        className="w-full flex flex-col items-center pt-2 pb-2 px-4 cursor-pointer select-none bg-stone-950/80 rounded-t-3xl border-b border-stone-800/80"
        onClick={toggleExpand}
      >
        <div className="w-12 h-1.5 bg-amber-500/40 rounded-full mb-1 hover:bg-amber-400 transition" />
        
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 text-sm font-bold shrink-0">
              👑
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold tracking-tight text-amber-300 truncate">
                Рабия Сұлтан Бегім: Ұлы даланың ықпалды ханшайымы
              </h2>
              <p className="text-[11px] text-stone-400 truncate hidden xs:block">
                Ғылыми-жобалық платформа • Түркістан кесенесі & Leaflet картасы
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (sheetState === 'collapsed') setSheetState('half');
                else if (sheetState === 'half') setSheetState('expanded');
                else setSheetState('half');
              }}
              className="p-1.5 text-stone-300 hover:text-amber-400 hover:bg-stone-800/80 rounded-lg transition"
              title={sheetState === 'expanded' ? 'Кішірейту' : 'Үлкейту'}
            >
              {sheetState === 'expanded' ? (
                <ChevronDown className="w-5 h-5 text-amber-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-amber-400" />
              )}
            </button>
            {sheetState !== 'collapsed' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSheetState('collapsed');
                }}
                className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 rounded-lg transition"
                title="Панельді жинау"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Body (visible when half or expanded) */}
      {sheetState !== 'collapsed' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-stone-800 overflow-x-auto no-scrollbar shrink-0 bg-stone-900/90 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-amber-200'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>Шолу</span>
            </button>

            <button
              onClick={() => setActiveTab('project')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'project'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-amber-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ғылыми негіздеме</span>
            </button>

            <button
              onClick={() => setActiveTab('biography')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'biography'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-amber-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Тұлға тарихы</span>
            </button>

            <button
              onClick={() => setActiveTab('mausoleum')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'mausoleum'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-amber-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Кесене сәулеті</span>
            </button>

            <button
              onClick={() => setActiveTab('statehood')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'statehood'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-amber-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Мемлекеттік үлес</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-amber-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Викторина (Тест)</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-amber-500 to-teal-400 text-stone-950 shadow-md font-bold'
                  : 'text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI-Сараптама</span>
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Hero Showcase Card */}
                <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-stone-950 shadow-2xl group">
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                    <img
                      src={rabiyaPortrait}
                      alt="Рабия Сұлтан Бегім портреті"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/90 text-stone-950 text-xs font-bold uppercase tracking-wider mb-2">
                        XV ғасыр • Тарихи дала ханшайымы
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">
                        Рабия Сұлтан Бегім
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-200/90 mt-1 max-w-2xl line-clamp-2 sm:line-clamp-none">
                        Ұлықбектің қызы, Әбілқайыр ханның жары, Дешті Қыпшақ пен Мауереннахр арасындағы дипломатиялық және мәдени байланысты нығайтқан тарихи тұлға.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-stone-950/95 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-t border-stone-800">
                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-xs text-stone-400 block">Өмір сүрген дәуірі</span>
                      <span className="text-sm font-bold text-amber-300">~1430 – 1485 жж.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-xs text-stone-400 block">Әкесі</span>
                      <span className="text-sm font-bold text-amber-300">Мұхаммед Ұлықбек</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-xs text-stone-400 block">Жұбайы</span>
                      <span className="text-sm font-bold text-amber-300">Әбілқайыр хан</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-xs text-stone-400 block">Кесенесі орны</span>
                      <span className="text-sm font-bold text-amber-300">Түркістан қаласы</span>
                    </div>
                  </div>
                </div>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Ғылыми өзектілік */}
                  <div
                    onClick={() => setActiveTab('project')}
                    className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 transition">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-100 text-base">Зерттеудің өзектілігі</h4>
                    </div>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                      {pData.sections.ozektilik.shortSummary}
                    </p>
                    <span className="text-xs text-amber-400 font-semibold mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
                      Толық танысу →
                    </span>
                  </div>

                  {/* Card 2: Кесене сәулеті */}
                  <div
                    onClick={() => setActiveTab('mausoleum')}
                    className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-stone-950 transition">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-stone-100 text-base">Түркістандағы кесенесі</h4>
                    </div>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                      Қожа Ахмет Ясауи кешеніндегі сегіз қырлы көгілдір күмбезді монумент. 1895 жылғы оқиға және 1978–1980 жылдардағы реставрация.
                    </p>
                    <span className="text-xs text-teal-400 font-semibold mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition">
                      Сәулетін зерттеу →
                    </span>
                  </div>
                </div>

                {/* Selected Point Alert (if marker picked) */}
                {selectedPoint && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0">
                      📍
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-amber-300 text-sm">{selectedPoint.titleKz}</h4>
                        <span className="text-[11px] bg-stone-800 px-2 py-0.5 rounded text-amber-200">
                          {selectedPoint.era}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-1">{selectedPoint.description}</p>
                      <p className="text-[11px] text-amber-400/90 mt-1 font-medium">
                        Тарихи мәні: {selectedPoint.significance}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SCIENTIFIC PROJECT FOUNDATION */}
            {activeTab === 'project' && (
              <div className="space-y-6">
                <div className="border-b border-stone-800 pb-3">
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    Ғылыми жоба құрылымы
                  </span>
                  <h3 className="text-xl font-bold text-stone-100 mt-1">
                    {pData.sections.ozektilik.title}
                  </h3>
                </div>

                {/* Өзектілік тармақтары */}
                <div className="grid grid-cols-1 gap-3">
                  {pData.sections.ozektilik.points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>

                {/* Мақсаты */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-stone-900 border border-amber-500/40">
                  <h4 className="text-base font-bold text-amber-300 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{pData.sections.magsaty.title}</span>
                  </h4>
                  <p className="text-stone-200 text-xs sm:text-sm leading-relaxed">
                    {pData.sections.magsaty.statement}
                  </p>

                  <div className="mt-4 pt-4 border-t border-amber-500/20">
                    <h5 className="text-xs font-bold text-amber-200 mb-2">Күтілетін ғылыми нәтижелер:</h5>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {pData.sections.magsaty.expectedResults.map((res, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Міндеттері */}
                <div>
                  <h4 className="text-base font-bold text-stone-100 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <span>{pData.sections.mindetteri.title}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pData.sections.mindetteri.items.map((item) => (
                      <div
                        key={item.num}
                        className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-amber-500 font-extrabold text-xs">{item.num}</span>
                          <h5 className="font-bold text-stone-200 text-sm mt-1 mb-1.5">
                            {item.title}
                          </h5>
                          <p className="text-stone-400 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BIOGRAPHY & ROYAL LINEAGE */}
            {activeTab === 'biography' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-full sm:w-1/3 shrink-0">
                    <div className="rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl bg-stone-950">
                      <img
                        src={rabiyaPortrait}
                        alt="Рабия Сұлтан Бегім"
                        className="w-full h-64 sm:h-72 object-cover object-top"
                      />
                      <div className="p-3 bg-stone-950 text-center">
                        <span className="text-xs font-bold text-amber-300 block">
                          Рабия Сұлтан Бегім
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Әмір Темірдің шөбересі, Ұлықбектің қызы
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-2/3 space-y-4">
                    <div>
                      <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                        Тарихи портрет
                      </span>
                      <h3 className="text-xl font-bold text-stone-100 mt-1">
                        {pData.sections.tulga.title}
                      </h3>
                      <p className="text-stone-400 text-xs mt-0.5">
                        {pData.sections.tulga.subtitle}
                      </p>
                    </div>

                    {/* Genealogy Tree Card */}
                    <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30">
                      <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block mb-2">
                        Шежірелік құрылымы (Әулет тармағы):
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-200">
                        <span className="px-2 py-1 bg-stone-900 rounded border border-stone-700 font-medium">
                          Әмір Темір
                        </span>
                        <span className="text-amber-400">→</span>
                        <span className="px-2 py-1 bg-stone-900 rounded border border-stone-700 font-medium">
                          Шахрух сұлтан
                        </span>
                        <span className="text-amber-400">→</span>
                        <span className="px-2 py-1 bg-amber-950/80 rounded border border-amber-600 font-bold text-amber-300">
                          Ұлықбек (Мұхаммед Тарағай)
                        </span>
                        <span className="text-amber-400">→</span>
                        <span className="px-2.5 py-1 bg-amber-500 rounded font-bold text-stone-950">
                          👑 Рабия Сұлтан Бегім
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-stone-800">
                        <span className="text-stone-400">Жұбайы:</span>
                        <span className="text-stone-200 font-medium">{pData.sections.tulga.husband}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-800">
                        <span className="text-stone-400">Ұрпақтары:</span>
                        <span className="text-stone-200 font-medium text-right max-w-xs">{pData.sections.tulga.children}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-400">Тарихи құжаттар:</span>
                        <span className="text-amber-300 font-medium">«Тарих-и Рашиди», «Михман-наме-йи Бухара»</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Толық мәтіні */}
                <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
                  <h4 className="text-base font-bold text-amber-300 mb-3">Өмір жолы мен саяси рөлі</h4>
                  <div className="text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {pData.sections.tulga.detailedBio}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MAUSOLEUM ARCHITECTURE */}
            {activeTab === 'mausoleum' && (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-teal-500/40 bg-stone-950 shadow-2xl">
                  <div className="relative h-60 sm:h-72 w-full">
                    <img
                      src={rabiyaMausoleum}
                      alt="Рабия Сұлтан Бегім кесенесі"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-teal-500 text-stone-950 text-xs font-bold uppercase tracking-wider mb-1">
                        XV ғасыр сәулет жауһары
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {pData.sections.kesene.title}
                      </h3>
                      <p className="text-xs text-teal-200 mt-0.5">
                        {pData.sections.kesene.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Сәулеттік құрылымы */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-xs text-teal-400 font-semibold block mb-1">Пішіні мен композициясы</span>
                    <h5 className="font-bold text-stone-100 text-sm mb-1">{pData.sections.kesene.shape}</h5>
                    <p className="text-stone-400 text-xs">
                      Ортағасырлық Орталық Азия сәулетінде сирек кездесетін сегіз бұрышты композициялық шешім.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-xs text-teal-400 font-semibold block mb-1">Күмбез ерекшелігі</span>
                    <h5 className="font-bold text-stone-100 text-sm mb-1">Биік цилиндр барабан & көгілдір жылтыр плиталар</h5>
                    <p className="text-stone-400 text-xs">
                      Қос қабатты күмбез, қырлы қабырғалар мен мозаикалық өрнектер Самарқанд шеберлерінің қолтаңбасын танытады.
                    </p>
                  </div>
                </div>

                {/* Сәулеттік сипаттамалар тізімі */}
                <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2">
                  <h4 className="text-sm font-bold text-amber-300 mb-2">Негізгі сәулеттік параметрлер:</h4>
                  {pData.sections.kesene.archFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Құлпытастағы жазу */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-stone-950 border border-amber-500/40 relative">
                  <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Scroll className="w-4 h-4 text-amber-400" />
                    <span>Табылған мәрмәр құлпытастағы жазу (1954 ж. ғылыми зерттеу):</span>
                  </div>
                  <blockquote className="text-amber-100 italic text-xs sm:text-sm leading-relaxed border-l-2 border-amber-400 pl-4 py-1">
                    {pData.sections.kesene.inscription}
                  </blockquote>
                </div>

                {/* 1895 жылғы трагедия және 1978-80 жж. қалпына келтіру */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                  <h4 className="text-sm font-bold text-stone-100 mb-2">
                    Тарихи тағдыры: Қиратылуы мен қайта түлеуі
                  </h4>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {pData.sections.kesene.tragedyAndRestoration}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: STATEHOOD & DIPLOMACY */}
            {activeTab === 'statehood' && (
              <div className="space-y-6">
                <div className="border-b border-stone-800 pb-3">
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                    Геосаяси маңызы
                  </span>
                  <h3 className="text-xl font-bold text-stone-100 mt-1">
                    {pData.sections.ulesi.title}
                  </h3>
                  <p className="text-stone-400 text-xs mt-1">
                    XV ғасырда Ұлы Дала мен Мауереннахр арасындағы дипломатиялық бейбітшілік тепе-теңдігі.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pData.sections.ulesi.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs mb-3">
                          0{idx + 1}
                        </div>
                        <h4 className="font-bold text-stone-100 text-sm sm:text-base mb-2">
                          {item.title}
                        </h4>
                        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Дипломатиялық дәліз қалалары */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-amber-500/30">
                  <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Картадағы басты тарихи нүктелер мен байланыстар:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {HISTORICAL_POINTS.map((pt) => (
                      <div
                        key={pt.id}
                        onClick={() => onSelectPoint(pt)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                          selectedPoint?.id === pt.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="font-bold truncate">{pt.name}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{pt.badge}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: QUIZ & KNOWLEDGE VERIFICATION */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                      Интерактивті тест
                    </span>
                    <h3 className="text-xl font-bold text-stone-100 mt-1">
                      Рабия Сұлтан Бегім бойынша біліміңізді тексеріңіз
                    </h3>
                  </div>
                  {quizSubmitted && (
                    <button
                      onClick={resetQuiz}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Қайта тапсыру</span>
                    </button>
                  )}
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {QUIZ_QUESTIONS.map((q, index) => {
                    const isAnswered = quizAnswers[q.id] !== undefined;
                    const selectedOpt = quizAnswers[q.id];
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition ${
                          quizSubmitted
                            ? isCorrect
                              ? 'bg-emerald-950/30 border-emerald-500/50'
                              : 'bg-rose-950/30 border-rose-500/50'
                            : 'bg-stone-900/90 border-stone-800'
                        }`}
                      >
                        <h4 className="font-bold text-stone-100 text-sm mb-3">
                          {index + 1}. {q.question}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            let btnStyle = 'bg-stone-950/80 border-stone-800 hover:bg-stone-800 text-stone-300';

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                              } else if (isChosen && !isCorrect) {
                                btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-300 line-through';
                              } else {
                                btnStyle = 'bg-stone-950/50 border-stone-800 text-stone-500';
                              }
                            } else if (isChosen) {
                              btnStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleQuizSelect(q.id, optIdx)}
                                className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === q.correctIndex && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <p className="mt-3 text-xs text-stone-300 pt-2 border-t border-stone-800/80 italic">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Bar / Score Display */}
                {!quizSubmitted ? (
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Нәтижені тексеру ({Object.keys(quizAnswers).length}/{QUIZ_QUESTIONS.length})
                  </button>
                ) : (
                  <div className="p-6 rounded-2xl bg-stone-950 border border-amber-500/40 text-center space-y-3">
                    <span className="text-3xl">
                      {quizScore === 5 ? '🏆' : quizScore >= 3 ? '🎉' : '📚'}
                    </span>
                    <h4 className="text-lg font-bold text-amber-300">
                      Сіздің нәтижеңіз: {quizScore} / {QUIZ_QUESTIONS.length} балл
                    </h4>
                    <p className="text-xs text-stone-300 max-w-md mx-auto">
                      {quizScore === 5
                        ? 'Керемет! Сіз Рабия Сұлтан Бегімнің тарихын, кесене сәулетін және мемлекеттік үлесін жоғары деңгейде меңгердіңіз!'
                        : quizScore >= 3
                        ? 'Жақсы нәтиже! Зерттеу бөлімдерін қайта шолып, біліміңізді 100%-ға жеткізе аласыз.'
                        : 'Мағлұматтарды бекіту үшін «Тұлға тарихы» мен «Кесене сәулеті» бөлімдерін оқып шығуды ұсынамыз.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: GEMINI 3.1 PRO HIGH THINKING AI HISTORICAL CONSULTANT */}
            {activeTab === 'ai' && (
              <div className="space-y-4 flex flex-col h-full">
                <div className="border-b border-stone-800 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-teal-400 flex items-center justify-center text-stone-950 font-bold text-xs">
                        AI
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-100 text-sm">
                          Тарихшы-ғалыммен сараптама (AI Consultant)
                        </h4>
                        <span className="text-[11px] text-amber-400">
                          Gemini 3.1 Pro • Жоғары логикалық пайымдау (Thinking Mode: HIGH)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Рабия Сұлтан Бегімнің Дешті Қыпшаққа келуінің саяси салдары қандай болды?',
                    'Кесененің 1895 жылғы қиратылуы туралы архивтік деректер не дейді?',
                    'Ұлықбек астрономиялық мектебінің осы кесене сәулетіне әсері бар ма?',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskAi(preset)}
                      disabled={aiLoading}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-amber-950/80 border border-stone-800 text-stone-300 hover:text-amber-200 transition text-left"
                    >
                      «{preset}»
                    </button>
                  ))}
                </div>

                {/* Chat Message Feed */}
                <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
                  {aiConversation.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] sm:max-w-[80%] ${
                          msg.sender === 'user'
                            ? 'bg-amber-500 text-stone-950 font-medium rounded-br-none'
                            : 'bg-stone-950/90 text-stone-200 border border-stone-800 rounded-bl-none shadow-md'
                        }`}
                      >
                        {msg.thinking && (
                          <div className="text-[10px] text-amber-400 font-semibold mb-1 uppercase tracking-wide">
                            Ғылыми сараптама тереңдігі: {msg.thinking}
                          </div>
                        )}
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex items-center gap-2 p-3 bg-stone-950 border border-stone-800 rounded-2xl max-w-xs text-xs text-amber-300">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Тарихи дереккөздер мен пайымдар сарапталуда (High Thinking)...</span>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskAi();
                  }}
                  className="flex items-center gap-2 pt-2 border-t border-stone-800"
                >
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Рабия Сұлтан Бегім, кесене сәулеті немесе дипломатия жайлы сұраңыз..."
                    className="flex-1 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none placeholder:text-stone-500"
                  />
                  <button
                    type="submit"
                    disabled={!aiQuestion.trim() || aiLoading}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    title="Сұрақты жіберу"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
