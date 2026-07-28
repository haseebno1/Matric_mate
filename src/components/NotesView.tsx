import React, { useState } from 'react';
import { NoteItem, UserProfile } from '../types';
import { MATRIC_SUBJECTS } from '../data/subjectsData';
import { 
  BookMarked, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  Lightbulb, 
  Calendar,
  FileText
} from 'lucide-react';

interface NotesViewProps {
  notes: NoteItem[];
  profile: UserProfile;
  onSaveNote: (note: Omit<NoteItem, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  profile,
  onSaveNote,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // New Note Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(profile.subjects[0]?.subjectId || 'math');
  const [newTopic, setNewTopic] = useState('Core Formula');
  const [newContent, setNewContent] = useState('');

  const filteredNotes = notes.filter((n) => {
    if (selectedSubjectFilter !== 'all' && n.subjectId !== selectedSubjectFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.topic.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (note: NoteItem) => {
    const textToCopy = `${note.title}\nSubject: ${note.subjectId} (${note.topic})\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleCreateNewNote = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    onSaveNote({
      title: newTitle.trim(),
      subjectId: newSubjectId,
      topic: newTopic.trim(),
      content: newContent.trim(),
    });
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & New Note Trigger */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Saved Notes & AI Explanations</h2>
            <p className="text-xs text-slate-500 font-medium">Review saved answers, formula breakdowns, and revision cards.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Note</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search notes by keyword, formula, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Subjects</option>
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

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Notes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ask questions in AI Study Buddy and tap "Save to Notes", or create custom study cards above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const subDef = MATRIC_SUBJECTS.find((m) => m.id === note.subjectId);

            return (
              <div
                key={note.id}
                className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-bold border"
                      style={{
                        backgroundColor: `${subDef?.color || '#3b82f6'}15`,
                        color: subDef?.color || '#2563eb',
                        borderColor: `${subDef?.color || '#3b82f6'}30`,
                      }}
                    >
                      {subDef?.name || note.subjectId}
                    </span>

                    <span className="text-[10px] text-slate-400 font-medium">{note.createdAt}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{note.title}</h3>
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-mono">
                    {note.content}
                  </p>

                  {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-600" /> Key Takeaways
                      </span>
                      {note.keyTakeaways.map((k, idx) => (
                        <p key={idx} className="text-[11px] text-amber-900/90 font-medium">• {k}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-semibold">Topic: {note.topic}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(note)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
                      title="Copy note text"
                    >
                      {copiedNoteId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-900">
            <h3 className="text-lg font-bold text-slate-900">Create Custom Study Note</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Quadratic Formula & Discriminant Rules"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Algebra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note Content</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write formulas, definitions, key steps..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewNote}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
