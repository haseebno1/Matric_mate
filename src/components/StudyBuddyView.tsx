import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, NoteItem } from '../types';
import { getSubjectById } from '../data/curriculumData';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { FormattedAIMessage } from './FormattedAIMessage';
import { 
  Bot, 
  Send, 
  User, 
  BookMarked, 
  Sparkles, 
  Loader2, 
  Search, 
  Check, 
  Lightbulb, 
  Copy,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface StudyBuddyViewProps {
  messages: ChatMessage[];
  profile: UserProfile;
  onSendMessage: (question: string, subjectId: string, topic: string) => Promise<void>;
  onSaveToNotes: (note: Omit<NoteItem, 'id' | 'createdAt'>) => void;
}

export const StudyBuddyView: React.FC<StudyBuddyViewProps> = ({
  messages,
  profile,
  onSendMessage,
  onSaveToNotes,
}) => {
  const initialSubId = profile.subjects && profile.subjects[0] ? profile.subjects[0].subjectId : 'PHY-10';
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubId);

  const selectedSubDef = getSubjectById(selectedSubjectId);
  const initialTopic = selectedSubDef && selectedSubDef.chapters.length > 0
    ? `Ch ${selectedSubDef.chapters[0].chapter_number}: ${selectedSubDef.chapters[0].chapter_title}`
    : 'Core Concepts';

  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [savedNoteIds, setSavedNoteIds] = useState<string[]>([]);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSetup, setShowMobileSetup] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async () => {
    if (!inputQuestion.trim() || isSending) return;
    const question = inputQuestion.trim();
    setInputQuestion('');
    setIsSending(true);

    try {
      await onSendMessage(question, selectedSubjectId, selectedTopic);
    } catch (e) {
      console.error('Error sending buddy query', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveNote = (msg: ChatMessage) => {
    onSaveToNotes({
      title: `${selectedSubDef?.subject_name || 'Matric'}: ${selectedTopic}`,
      subjectId: selectedSubjectId,
      topic: selectedTopic,
      content: msg.text,
      keyTakeaways: msg.keyTakeaway ? [msg.keyTakeaway] : undefined,
    });
    setSavedNoteIds((prev) => [...prev, msg.id]);
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const quickPrompts = [
    'Explain this concept in simple 3-step terms',
    'What is a real-world example of this?',
    'What are common exam mistakes students make here?',
    'Give me a step-by-step formula or method breakdown',
  ];

  const filteredMessages = messages.filter((m) => {
    if (!searchTerm) return true;
    return (
      m.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.topic && m.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 pb-12">
      {/* MOBILE SETUP TOGGLE BAR */}
      <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
        <button
          onClick={() => setShowMobileSetup(!showMobileSetup)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Subject &amp; Topic Filter:</span>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] border border-indigo-100">
              {selectedSubDef?.subject_name} • {selectedTopic}
            </span>
          </div>
          {showMobileSetup ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMobileSetup && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  const newSubId = e.target.value;
                  setSelectedSubjectId(newSubId);
                  const sDef = getSubjectById(newSubId);
                  if (sDef && sDef.chapters.length > 0) {
                    setSelectedTopic(`Ch ${sDef.chapters[0].chapter_number}: ${sDef.chapters[0].chapter_title}`);
                  }
                }}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              >
                {profile.subjects.map((s) => {
                  const sDef = getSubjectById(s.subjectId);
                  return (
                    <option key={s.subjectId} value={s.subjectId}>
                      {sDef ? sDef.subject_name : s.subjectId}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              >
                {getSubjectById(selectedSubjectId)?.chapters.map((ch) => {
                  const titleStr = `Ch ${ch.chapter_number}: ${ch.chapter_title}`;
                  return (
                    <option key={ch.chapter_number} value={titleStr}>
                      {titleStr}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* LEFT DESKTOP DRAWER (1 col): Subject & Topic Selector + Past Conversations Search */}
      <div className="hidden lg:block space-y-4">
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm">
            <Bot className="w-5 h-5" />
            <h3>AI Study Buddy Setup</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                const newSubId = e.target.value;
                setSelectedSubjectId(newSubId);
                const sDef = getSubjectById(newSubId);
                if (sDef && sDef.chapters.length > 0) {
                  setSelectedTopic(`Ch ${sDef.chapters[0].chapter_number}: ${sDef.chapters[0].chapter_title}`);
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
            >
              {profile.subjects.map((s) => {
                const sDef = getSubjectById(s.subjectId);
                return (
                  <option key={s.subjectId} value={s.subjectId}>
                    {sDef ? sDef.subject_name : s.subjectId}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
            >
              {getSubjectById(selectedSubjectId)?.chapters.map((ch) => {
                const titleStr = `Ch ${ch.chapter_number}: ${ch.chapter_title}`;
                return (
                  <option key={ch.chapter_number} value={titleStr}>
                    {titleStr}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Conversation Search Bar */}
        <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span>Search Past Discussions</span>
          </h4>
          <input
            type="text"
            placeholder="Search keywords or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* RIGHT CHAT CONTAINER (3 cols) */}
      <div className="lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-2xl sm:rounded-3xl h-[560px] sm:h-[640px] lg:h-[680px] overflow-hidden shadow-xs">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{selectedSubDef?.subject_name} AI Tutor</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                  {selectedTopic}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Clear step-by-step exam explanations &amp; formula guides</p>
            </div>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {filteredMessages.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Ask your AI Study Buddy!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto px-4">
                Select a topic, then type your question below or tap a quick prompt button to get instant step-by-step help.
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSaved = savedNoteIds.includes(msg.id);
              const isCopied = copiedMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-2 max-w-[88%] sm:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-3 shadow-xs'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-line font-medium">{msg.text}</p>
                      ) : (
                        <FormattedAIMessage content={msg.text} />
                      )}

                      {/* Key Takeaway Box for AI responses */}
                      {msg.keyTakeaway && !isUser && (
                        <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-2 text-amber-900 text-xs mt-3">
                          <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                          <div>
                            <strong className="font-bold block text-amber-950">💡 Key Exam Takeaway:</strong>
                            <span className="text-amber-900">{msg.keyTakeaway}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Response Action Buttons */}
                    {!isUser && (
                      <div className="flex items-center gap-2 pl-1 flex-wrap">
                        <button
                          onClick={() => handleSaveNote(msg)}
                          disabled={isSaved}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                            isSaved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                          }`}
                        >
                          {isSaved ? <Check className="w-3 h-3 text-emerald-600" /> : <BookMarked className="w-3 h-3 text-indigo-600" />}
                          <span>{isSaved ? 'Saved to Notes' : 'Save to Notes'}</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-all"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex items-center gap-3 text-xs text-indigo-800 p-3.5 bg-indigo-50/90 rounded-2xl border border-indigo-200 w-fit shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
              <span className="font-medium">AI Study Buddy is formulating a clear step-by-step solution...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Bar & Responsive Mobile Input Box */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2.5">
          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => setInputQuestion(promptText)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/90 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Text Form (Guaranteed Mobile Submit Button Visibility) */}
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask about ${selectedTopic}...`}
              className="flex-1 min-w-0 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
            />
            <button
              id="send-buddy-query-btn"
              onClick={handleSend}
              disabled={!inputQuestion.trim() || isSending}
              className="shrink-0 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-all min-w-[44px]"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

