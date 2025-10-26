import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc, addDoc, serverTimestamp, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../init-firebase';

// Home page section showing tutorial videos with views and ratings
const SAMPLE_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

export default function TutorialVideosSection() {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const viewedRef = useRef(new Set());
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [seeding, setSeeding] = useState(false);
  const [deletingSamples, setDeletingSamples] = useState(false);

  useEffect(() => {
    let unsub = () => {};
    const attach = (withOrder) => {
      const base = [collection(db, 'videos')];
      const qRef = withOrder ? query(...base, orderBy('createdAt', 'desc'), limit(12)) : query(...base, limit(12));
      unsub = onSnapshot(
        qRef,
        (snap) => {
          let rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (!withOrder) {
            rows.sort((a, b) => {
              const at = a.createdAt?.toMillis?.() || 0;
              const bt = b.createdAt?.toMillis?.() || 0;
              return bt - at;
            });
          }
          setVideos(rows);
        },
        (err) => {
          console.warn('Videos ordered query failed, falling back without orderBy', err?.message);
          unsub();
          attach(false);
        }
      );
    };
    attach(true);
    return () => unsub();
  }, []);

  const handlePlay = async (v) => {
    if (!currentUser) {
      console.log('View not counted: user not signed in');
      return; // count views only for signed-in users
    }
    if (viewedRef.current.has(v.id)) {
      console.log('View not counted: already viewed this session');
      return;
    }
    viewedRef.current.add(v.id);
    try {
      console.log(`Recording view for video ${v.id} by user ${currentUser.uid}`);
      await updateDoc(doc(db, 'videos', v.id), { [`viewers.${currentUser.uid}`]: true });
      console.log('View recorded successfully');
    } catch (e) {
      console.error('Failed to record view', e);
    }
  };

  const handleRate = async (v, rating) => {
    setError('');
    if (!currentUser) {
      setError('Please sign in to rate.');
      return;
    }
    try {
      // Record both rating AND view when someone rates (they must have watched to rate)
      await updateDoc(doc(db, 'videos', v.id), { 
        [`ratings.${currentUser.uid}`]: rating,
        [`viewers.${currentUser.uid}`]: true
      });
      viewedRef.current.add(v.id); // mark as viewed in this session
    } catch (e) {
      console.error('Rating failed', e);
      setError('Could not submit rating.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    if (!currentUser) {
      setError('Please sign in to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    // Require a small video file for Base64 inline storage
    if (!file) {
      setError('Please pick a video file.');
      return;
    }
    if (!(file?.type || '').startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }
    // Early size guard to avoid trying to load huge files into memory
    const MAX_BYTES = 900 * 1024; // ~900KB safety limit
    if (typeof file.size === 'number' && file.size > MAX_BYTES) {
      setError('File too large for Firestore Base64 storage (limit ~900KB). Use a smaller clip or an external host.');
      setUploadPct(0);
      return;
    }
    try {
      setUploadPct(5);
      // Read file as Base64 data URL
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onload = (ev) => {
          const result = ev?.target?.result;
          resolve(typeof result === 'string' ? result : '');
        };
        reader.readAsDataURL(file);
      });
      if (!dataUrl || typeof dataUrl !== 'string') {
        setError('Could not read the selected file. It may be too large or unsupported. Try a smaller MP4/WebM under ~900KB.');
        setUploadPct(0);
        return;
      }
      if (!String(dataUrl).startsWith('data:video/')) {
        setError('Unsupported file type. Please choose a video.');
        setUploadPct(0);
        return;
      }
      // Estimate size and enforce Firestore 1MiB limit (leave headroom for other fields)
      const base64Part = String(dataUrl).split(',')[1] || '';
      const approxBytes = Math.floor(base64Part.length * 0.75); // base64 -> bytes
      if (approxBytes > MAX_BYTES) {
        setError('File too large for Firestore Base64 storage (limit ~900KB). Use a smaller clip or an external host.');
        setUploadPct(0);
        return;
      }
      setUploadPct(60);
      await addDoc(collection(db, 'videos'), {
        title: title.trim(),
        description: description.trim(),
        url: dataUrl, // store as data URL (Base64)
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        viewers: {},
        ratings: {},
      });
      setUploadPct(100);
      setTitle('');
      setDescription('');
      setFile(null);
      setTimeout(() => setUploadPct(0), 500);
    } catch (e) {
      console.error('Upload failed', e);
      setError(`Upload failed: ${e?.message || e?.code || 'Please try again.'}`);
      setUploadPct(0);
    }
  };

  const handleDelete = async (v) => {
    setError('');
    if (!currentUser) {
      setError('Please sign in to delete your video.');
      return;
    }
    if (v.userId !== currentUser.uid) {
      setError('You can only delete your own videos.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'videos', v.id));
    } catch (e) {
      console.error('Delete failed', e);
      setError(`Could not delete video: ${e?.message || e?.code || ''}`);
    }
  };

  const seedSamples = async () => {
    setError('');
    if (!currentUser) {
      setError('Please sign in to add sample videos.');
      return;
    }
    try {
      setSeeding(true);
      const samples = [
        { title: 'Big Buck Bunny', description: 'Open movie short film', url: SAMPLE_URLS[0] },
        { title: 'Sintel Trailer', description: 'Blender Foundation trailer', url: SAMPLE_URLS[1] },
        { title: 'Tears of Steel', description: 'Open movie excerpt', url: SAMPLE_URLS[2] },
      ];
      for (const s of samples) {
        await addDoc(collection(db, 'videos'), {
          title: s.title,
          description: s.description,
          url: s.url,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
          viewers: {},
          ratings: {},
        });
      }
    } catch (e) {
      console.error('Seeding failed', e);
      setError(`Could not add sample videos: ${e?.message || e?.code || ''}`);
    } finally {
      setSeeding(false);
    }
  };

  const removeSamples = async () => {
    setError('');
    if (!currentUser) {
      setError('Please sign in to remove sample videos.');
      return;
    }
    try {
      setDeletingSamples(true);
      // Query videos owned by current user AND with url in samples
      const q1 = query(
        collection(db, 'videos'),
        where('userId', '==', currentUser.uid),
        where('url', 'in', SAMPLE_URLS)
      );
      const snap = await getDocs(q1);
      const ops = snap.docs.map((d) => deleteDoc(doc(db, 'videos', d.id)));
      await Promise.all(ops);
    } catch (e) {
      console.error('Remove samples failed', e);
      setError(`Could not remove sample videos: ${e?.message || e?.code || ''}`);
    } finally {
      setDeletingSamples(false);
    }
  };

  const normalizedVideos = useMemo(() => {
    // Normalize common field name differences
    return videos.map((v) => ({
      ...v,
      url: v.url || v.videoUrl || v.sourceUrl || '',
      title: v.title || v.name || 'Untitled video',
      description: v.description || v.desc || '',
      viewers: v.viewers || {},
      ratings: v.ratings || {},
    }));
  }, [videos]);

  const visibleVideos = useMemo(() => {
    // If signed in, you can see all (including your own) to avoid confusion about "no videos"
    // If signed out, show all public videos
    return normalizedVideos;
  }, [normalizedVideos]);

  return (
    <section className="section">
      <div className="container">
        <h2 className="center mb-16">Tutorial Videos</h2>
    {/* Upload form (avoid horizontal scrollbar; adapt to space, wrap on small screens) */}
  <form onSubmit={handleUpload} style={{ display:'flex', gap:8, alignItems:'flex-end', flexWrap:'wrap', marginBottom:12, width:'100%' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', position:'relative', height:36, overflow:'visible' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display:'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 12px',
                border: '1px solid #9ca3af',
                background: '#f3f4f6',
                color: '#111827',
                borderRadius: 0,
                height: 36,
                width: 160,
                minWidth: 120,
                textAlign: 'left'
              }}
            >
              Choose File
            </button>
            <span
              className="muted"
              style={{ position:'absolute', top:40, left:0, fontSize:12, maxWidth:260, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}
              title={file ? file.name : 'No file chosen'}
            >
              {file ? file.name : 'No file chosen'}
            </span>
          </div>
          {/* URL upload removed per request; only file upload supported */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding:8, flex:'0 1 160px', minWidth:120, height:36, border:'1px solid #9ca3af', background:'#f9fafb', borderRadius:0 }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding:8, flex:'2 1 220px', minWidth:160, height:36, border:'1px solid #9ca3af', background:'#f9fafb', borderRadius:0 }}
          />
          <button type="submit" style={{ padding:'8px 12px', height:36, border:'1px solid #9ca3af', background:'#f3f4f6', color:'#111827', borderRadius:0 }} disabled={!currentUser}>
            {uploadPct > 0 && uploadPct < 100 ? `Processing ${uploadPct}%…` : 'Upload video'}
          </button>
          <button type="button" onClick={seedSamples} style={{ padding:'8px 12px', height:36, border:'1px solid #9ca3af', background:'#f3f4f6', color:'#111827', borderRadius:0 }} disabled={!currentUser || seeding}>
            {seeding ? 'Adding samples…' : 'Add sample videos'}
          </button>
          {currentUser && visibleVideos.some((v) => SAMPLE_URLS.includes(v.url) && v.userId === currentUser.uid) && (
            <button type="button" onClick={removeSamples} style={{ padding:'8px 12px', height:36, border:'1px solid #9ca3af', background:'#f3f4f6', color:'#111827', borderRadius:0 }} disabled={deletingSamples}>
              {deletingSamples ? 'Removing…' : 'Remove sample videos'}
            </button>
          )}
          {!currentUser && <span className="muted" style={{ fontSize:12 }}>Sign in to upload or add samples</span>}
        </form>
        {error && <div style={{ color:'#b00020', marginBottom: 10 }}>{error}</div>}
        {visibleVideos.length === 0 && (
          <div className="center" style={{ color:'#6b7280' }}>No videos yet.</div>
        )}
        <div style={{ display:'flex', flexWrap:'wrap', gap:20, justifyContent:'center' }}>
          {visibleVideos.map((v) => {
            const viewers = v.viewers || {};
            const viewerKeys = Object.keys(viewers);
            const views = viewerKeys.filter(key => viewers[key] === true).length;
            console.log(`Video "${v.title}":`, {
              rawViewers: viewers,
              viewerKeys: viewerKeys,
              trueViewers: viewerKeys.filter(key => viewers[key] === true),
              calculatedCount: views
            });
            const ratings = v.ratings || {};
            const values = Object.values(ratings).filter((n) => typeof n === 'number');
            const avg = values.length ? (values.reduce((a, b) => a + b, 0) / values.length) : 0;
            const myRating = currentUser ? ratings[currentUser.uid] || 0 : 0;
            return (
              <div key={v.id} className="card" style={{ width: 320 }}>
                <div style={{ width:'100%', height: 180, background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, overflow:'hidden' }}>
                  {v.url ? (
                    <video
                      src={v.url}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      controls
                      onPlay={() => handlePlay(v)}
                    />
                  ) : (
                    <div className="muted" style={{ padding: 12 }}>No video URL</div>
                  )}
                </div>
                <h4 style={{ marginTop: 10 }}>{v.title}</h4>
                <div className="muted" style={{ fontSize: 13 }}>{v.description}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 8 }}>
                  <div title="Average rating" style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span>⭐ {avg.toFixed(1)}</span>
                    <span className="muted" style={{ fontSize:12 }}>({values.length})</span>
                  </div>
                  <div className="muted" title="Unique signed-in viewers">
                    👀 {views}
                  </div>
                </div>
                <div style={{ marginTop: 8, display:'flex', gap:6 }}>
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleRate(v, n)}
                      style={{
                        border:'1px solid #e5e7eb',
                        borderRadius:6,
                        padding:'4px 8px',
                        background: currentUser && n <= myRating ? '#fde68a' : '#fff',
                        cursor: currentUser ? 'pointer' : 'not-allowed',
                        opacity: currentUser ? 1 : 0.6,
                      }}
                      title={currentUser ? `Rate ${n}` : 'Sign in to rate'}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {currentUser && v.userId === currentUser.uid && (
                  <div style={{ marginTop: 6 }}>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this video? This cannot be undone.')) {
                          handleDelete(v);
                        }
                      }}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        background: '#fff',
                        borderRadius: 6,
                      }}
                      title="Delete this video"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}