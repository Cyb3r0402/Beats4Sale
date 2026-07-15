'use client';

import { useState, useRef, useEffect, useCallback, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';

interface StoredBeat {
  id: string;
  title: string;
  bpm: number;
  key: string;
  tags: string[];
  genre: string;
  duration: string;
  previewUrl: string | null;
  mp3Url: string | null;
  wavUrl: string | null;
  badge: string | null;
  createdAt: string;
}

const KEYS = [
  'A Major','A Minor','A# Major','A# Minor',
  'B Major','B Minor',
  'C Major','C Minor','C# Major','C# Minor',
  'D Major','D Minor','D# Major','D# Minor',
  'E Major','E Minor',
  'F Major','F Minor','F# Major','F# Minor',
  'G Major','G Minor','G# Major','G# Minor',
  'E♭ Major','E♭ Minor','B♭ Major','B♭ Minor',
];

const GENRES = ['Trap','Hip-Hop','Drill','R&B','Pop','Afrobeats','Dancehall','Lo-Fi','Electronic','Other'];

const BADGE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'new', label: '✨ New' },
  { value: 'hot', label: '🔥 Hot' },
  { value: 'exclusive', label: '💎 Exclusive' },
];

function FileDropZone({
  label, accept, icon, file, onChange,
}: {
  label: string; accept: string; icon: string;
  file: File | null; onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
        file
          ? 'border-green-500/50 bg-green-500/8'
          : drag
          ? 'border-[#00b4ff] bg-[#00b4ff]/10 scale-[1.01]'
          : 'border-[#00b4ff]/25 bg-white/3 hover:border-[#00b4ff]/50 hover:bg-[#00b4ff]/5'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      onClick={() => ref.current?.click()}
    >
      <input
        ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div className="text-2xl mb-1">{file ? '✅' : icon}</div>
      <div className={`text-xs font-semibold ${file ? 'text-green-400' : 'text-[#b0b8c8]'}`}>
        {file ? file.name : label}
      </div>
      {file && (
        <button
          type="button"
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] flex items-center justify-center hover:bg-red-500/40 transition-all"
          onClick={(e) => { e.stopPropagation(); onChange(null); }}
        >✕</button>
      )}
    </div>
  );
}

export default function AdminPage() {
  // Form state
  const [title, setTitle]       = useState('');
  const [bpm, setBpm]           = useState('');
  const [key, setKey]           = useState('A Minor');
  const [genre, setGenre]       = useState('Trap');
  const [tags, setTags]         = useState('');
  const [duration, setDuration] = useState('');
  const [badge, setBadge]       = useState('');

  // Files
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [mp3File, setMp3File]         = useState<File | null>(null);
  const [wavFile, setWavFile]         = useState<File | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  // Beats list
  const [beats, setBeats]         = useState<StoredBeat[]>([]);
  const [loadingBeats, setLoadingBeats] = useState(true);
  const [deletingId, setDeletingId]     = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const loadBeats = useCallback(async () => {
    setLoadingBeats(true);
    try {
      const res = await fetch('/api/beats/upload');
      const data = await res.json();
      setBeats(data.beats || []);
    } catch { setBeats([]); }
    finally { setLoadingBeats(false); }
  }, []);

  useEffect(() => { loadBeats(); }, [loadBeats]);

  const resetForm = () => {
    setTitle(''); setBpm(''); setKey('A Minor'); setGenre('Trap');
    setTags(''); setDuration(''); setBadge('');
    setPreviewFile(null); setMp3File(null); setWavFile(null);
    setUploadProgress('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !bpm) { showToast('Title and BPM are required', false); return; }
    if (!previewFile && !mp3File && !wavFile) { showToast('Drop at least one audio file', false); return; }

    setUploading(true);
    setUploadProgress('Uploading audio files…');

    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('bpm', bpm);
    fd.append('key', key);
    fd.append('genre', genre);
    fd.append('tags', tags || genre);
    fd.append('duration', duration || '3:00');
    fd.append('badge', badge);
    if (previewFile) fd.append('previewFile', previewFile);
    if (mp3File)     fd.append('mp3File', mp3File);
    if (wavFile)     fd.append('wavFile', wavFile);

    try {
      setUploadProgress('Saving to Vercel Blob…');
      const res = await fetch('/api/beats/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      showToast(`🎵 "${data.beat.title}" uploaded & live in the store!`);
      resetForm();
      loadBeats();
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleDelete = async (beat: StoredBeat) => {
    if (!confirm(`Delete "${beat.title}"? This cannot be undone.`)) return;
    setDeletingId(beat.id);
    try {
      const res = await fetch('/api/beats/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ beatId: beat.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(`"${beat.title}" deleted`);
      loadBeats();
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#b0b8c8] font-[family-name:var(--font-space-grotesk)]">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#00b4ff]/15 bg-[#0a0a0f]/95 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={38} height={38} className="drop-shadow-[0_0_10px_rgba(0,180,255,0.5)]" />
          <div>
            <div className="text-white font-black text-base leading-tight">Beat Manager</div>
            <div className="text-[#00b4ff] text-[10px] font-bold uppercase tracking-widest">Admin · Vercel Blob Storage</div>
          </div>
        </div>
        <a
          href="/"
          className="px-4 py-2 rounded-full text-sm font-semibold bg-[#00b4ff]/10 border border-[#00b4ff]/20 text-[#00b4ff] hover:bg-[#00b4ff]/20 transition-all duration-200"
        >
          ← Back to Store
        </a>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10">

        {/* ── LEFT: Upload Form ── */}
        <div>
          <h2 className="text-white font-black text-2xl mb-6">Upload a Beat</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#c0c0c0] mb-2 uppercase tracking-wide">Beat Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Frequency"
                required
                className="w-full bg-[#13131d] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#b0b8c8]/40 text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200"
              />
            </div>

            {/* BPM + Key */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#c0c0c0] mb-2 uppercase tracking-wide">BPM *</label>
                <input
                  type="number" min="60" max="250"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                  placeholder="140"
                  required
                  className="w-full bg-[#13131d] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#b0b8c8]/40 text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#c0c0c0] mb-2 uppercase tracking-wide">Key *</label>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-[#13131d] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200 cursor-pointer"
                >
                  {KEYS.map((k) => <option key={k} value={k} className="bg-[#13131d]">{k}</option>)}
                </select>
              </div>
            </div>

            {/* Genre + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#c0c0c0] mb-2 uppercase tracking-wide">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#13131d] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200 cursor-pointer"
                >
                  {GENRES.map((g) => <option key={g} value={g} className="bg-[#13131d]">{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#c0c0c0] mb-2 uppercase tracking-wide">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="3:00"
                  className="w-full bg-[#13131d] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#b0b8c8]/40 text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200"
                />
              </div>
            </div>

            {/* Tags + Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#c0c0c0] mb-2 uppercase tracking-wide">Tags <span className="font-normal normal-case text-[#b0b8c8]/60">(comma separated)</span></label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Dark, Hard, Trap"
                  className="w-full bg-[#13131d] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#b0b8c8]/40 text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#c0c0c0] mb-2 uppercase tracking-wide">Badge</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-[#13131d] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200 cursor-pointer"
                >
                  {BADGE_OPTIONS.map((b) => <option key={b.value} value={b.value} className="bg-[#13131d]">{b.label}</option>)}
                </select>
              </div>
            </div>

            {/* Audio Files */}
            <div>
              <label className="block text-xs font-bold text-[#c0c0c0] mb-3 uppercase tracking-wide">Audio Files <span className="font-normal normal-case text-[#b0b8c8]/60">(drop at least one)</span></label>
              <div className="grid grid-cols-3 gap-3">
                <FileDropZone label="Preview clip (30-60s)" accept="audio/*" icon="🎧" file={previewFile} onChange={setPreviewFile} />
                <FileDropZone label="Full MP3 master" accept="audio/mpeg,.mp3" icon="🎵" file={mp3File} onChange={setMp3File} />
                <FileDropZone label="Full WAV master" accept="audio/wav,.wav" icon="🎼" file={wavFile} onChange={setWavFile} />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-black text-base shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {uploadProgress}
                </>
              ) : (
                <>☁️ Upload Beat to Store</>
              )}
            </button>

          </form>
        </div>

        {/* ── RIGHT: Uploaded Beats ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-black text-2xl">
              Your Beats
              {beats.length > 0 && (
                <span className="ml-3 text-base font-normal text-[#00b4ff]">({beats.length})</span>
              )}
            </h2>
            <button
              onClick={loadBeats}
              className="text-xs text-[#00b4ff] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#00b4ff]/10"
            >
              🔄 Refresh
            </button>
          </div>

          {loadingBeats ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-[#13131d] border border-[#00b4ff]/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : beats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4 opacity-30">🎵</div>
              <div className="font-bold text-white text-lg mb-2">No beats yet</div>
              <div className="text-sm text-[#b0b8c8]">Upload your first beat using the form →</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
              {[...beats].reverse().map((beat) => (
                <div
                  key={beat.id}
                  className="bg-[#13131d] border border-[#00b4ff]/15 rounded-2xl p-4 flex items-center gap-4 hover:border-[#00b4ff]/30 transition-all duration-200"
                >
                  {/* Waveform icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl bg-gradient-to-br from-[#0d1a2a] to-[#0a0a0f] border border-[#00b4ff]/15">
                    🎵
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-sm truncate">{beat.title}</span>
                      {beat.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${
                          beat.badge === 'hot' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          beat.badge === 'new' ? 'bg-[#00b4ff]/20 text-[#00b4ff] border border-[#00b4ff]/30' :
                          'bg-white/10 text-white border border-white/20'
                        }`}>
                          {beat.badge.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#b0b8c8] mb-2">
                      {beat.bpm} BPM · {beat.key} · {beat.duration}
                    </div>

                    {/* File availability */}
                    <div className="flex gap-1.5 flex-wrap">
                      {[
                        { label: 'Preview', has: !!beat.previewUrl },
                        { label: 'MP3', has: !!beat.mp3Url },
                        { label: 'WAV', has: !!beat.wavUrl },
                      ].map(({ label, has }) => (
                        <span
                          key={label}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            has
                              ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                              : 'bg-white/5 text-[#b0b8c8]/30 border border-white/8'
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {beat.previewUrl && (
                      <a
                        href={beat.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#00b4ff]/10 border border-[#00b4ff]/20 text-[#00b4ff] text-xs hover:bg-[#00b4ff]/20 transition-all"
                        title="Play preview"
                      >
                        ▶
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(beat)}
                      disabled={deletingId === beat.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all disabled:opacity-40"
                      title="Delete beat"
                    >
                      {deletingId === beat.id ? '…' : '🗑'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[200] px-5 py-3.5 rounded-xl border font-semibold text-sm shadow-2xl text-white max-w-sm transition-all duration-300 ${
            toast.ok
              ? 'bg-[#13131d] border-green-500/40'
              : 'bg-[#13131d] border-red-500/40'
          }`}
          style={{ animation: 'scale-in 0.3s ease' }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
