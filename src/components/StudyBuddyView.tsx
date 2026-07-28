import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, NoteItem } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
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
  MessageSquare,
  HelpCircle,
  Copy
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
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    profile.subjects && profile.subjects[0] ? profile.subjects[0].subjectId : 'math'
  );

  const selectedSubDef = MATRIC_SUBJECTS.find((m) => m.id === selectedSubjectId);
  const [selectedTopic, setSelectedTopic] = useState<string>(
    selectedSubDef?.defaultTopics[0] || 'Core Concepts'
  );

  const [inputQuestion, setInputQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [savedNoteIds, setSavedNoteIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      title: `${selectedSubDef?.name || 'Matric'}: ${selectedTopic}`,
      subjectId: selectedSubjectId,
      topic: selectedTopic,
      content: msg.text,
      keyTakeaways: msg.keyTakeaway ? [msg.keyTakeaway] : undefined,
    });
    setSavedNoteIds([...savedNoteIds, msg.id]);
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
      {/* LEFT DRAWER (1 col): Subject & Topic Selector + Past Conversations Search */}
      <div className="space-y-4">
        <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm">
            <Bot className="w-5 h-5" />
            <h3>AI Study Buddy Setup</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                const sub = MATRIC_SUBJECTS.find((m) => m.id === e.target.value);
                if (sub) setSelectedTopic(sub.defaultTopics[0] || 'General');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
            >
              {profile.subjects.map((s) => {
                const subDef = MATRIC_SUBJECTS.find((m) => m.id === s.subjectId);
                return (
                  <option key={s.subjectId} value={s.subjectId}>
                    {subDef?.name || s.subjectId}
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
              {selectedSubDef?.defaultTopics.map((top) => (
                <option key={top} value={top}>
                  {top}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversation Search Bar */}
        <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
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
      <div className="lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-3xl h-[650px] overflow-hidden shadow-sm">
        {/* Chat Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">{selectedSubDef?.name} AI Tutor</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                  {selectedTopic}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Ask any question or request step-by-step examples</p>
            </div>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Bot className="w-12 h-12 text-indigo-600 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-900">Ask your AI Study Buddy!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a subject & topic on the left, then type your question below or click a quick prompt chip.
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSaved = savedNoteIds.includes(msg.id);

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-indigo-700 border border-slate-200'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-2 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none space-y-3'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Key Takeaway Box for AI responses */}
                      {msg.keyTakeaway && !isUser && (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-amber-900 text-xs">
                          <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                          <div>
                            <strong className="font-bold block">💡 Key Takeaway:</strong>
                            <span>{msg.keyTakeaway}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Response Action Buttons */}
                    {!isUser && (
                      <div className="flex items-center gap-2 pl-1">
                        <button
                          onClick={() => handleSaveNote(msg)}
                          disabled={isSaved}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all ${
                            isSaved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {isSaved ? <Check className="w-3 h-3 text-emerald-600" /> : <BookMarked className="w-3 h-3 text-indigo-600" />}
                          <span>{isSaved ? 'Saved to Notes' : 'Save to Notes'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex items-center gap-3 text-xs text-indigo-700 p-3 bg-indigo-50 rounded-2xl border border-indigo-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AI Study Buddy is crafting a simplified step-by-step response...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Bar & Input Box */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => setInputQuestion(promptText)}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-medium whitespace-nowrap transition-colors shadow-2xs"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Text Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask a question about ${selectedTopic}...`}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
            <button
              id="send-buddy-query-btn"
              onClick={handleSend}
              disabled={!inputQuestion.trim() || isSending}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
