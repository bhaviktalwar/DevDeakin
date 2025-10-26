import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../init-firebase';
import '../styles/journey.css';

// Simple personal journey timeline: user adds milestones with date, title, description
export default function PersonalJourney() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const uid = currentUser?.uid || null;
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  // form state
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!uid) return;

    let unsub = () => {};
    const attach = (ordered) => {
      const base = [collection(db, 'journeys'), where('userId', '==', uid)];
      const qRef = ordered
        ? query(...base, orderBy('date', 'desc'))
        : query(...base);
      unsub = onSnapshot(
        qRef,
        (snap) => {
          let rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (!ordered) {
            // client-side sort by date desc if we couldn't order in Firestore (e.g., missing index)
            rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
          }
          setItems(rows);
          setError('');
        },
        (err) => {
          console.warn('Journeys ordered query failed, falling back without orderBy', err?.message);
          setError('Loading without index; order may be approximate.');
          unsub();
          attach(false);
        }
      );
    };
    attach(true);
    return () => unsub();
  }, [uid]);

  const canSave = useMemo(() => title.trim() && date, [title, date]);

  const addMilestone = async (e) => {
    e.preventDefault();
    setError('');
    if (!uid) {
      setError('Please sign in to add your journey.');
      navigate('/login', { replace: false, state: { from: location.pathname } });
      return;
    }
    if (!canSave) { setError('Title and date are required.'); return; }
    try {
      setSaving(true);
      await addDoc(collection(db, 'journeys'), {
        userId: uid,
        title: title.trim(),
        description: description.trim(),
        date, // YYYY-MM-DD string for ordering
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setDescription('');
      // keep selected date so they can add multiple for same term
    } catch (e) {
      console.error('Add milestone failed', e);
      setError('Could not add milestone.');
    } finally {
      setSaving(false);
    }
  };

  const removeMilestone = async (id) => {
    setError('');
    if (!uid) { setError('Please sign in.'); return; }
    try {
      await deleteDoc(doc(db, 'journeys', id));
    } catch (e) {
      console.error('Delete milestone failed', e);
      setError('Could not delete item.');
    }
  };

  return (
    <section className="journey">
      <div className="container">
        <h2 className="title">Personal Journey</h2>
        <p className="muted">Track your milestones over time: courses, projects, internships, certifications, and more.</p>

        <form className="journey-form" onSubmit={addMilestone}>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          <input type="text" placeholder="Title (e.g., Started SIT313)" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input type="text" placeholder="Description (optional)" value={description} onChange={(e)=>setDescription(e.target.value)} />
          <button
            type="submit"
            disabled={!canSave || saving}
            title={!currentUser ? 'Sign in to save your journey' : (!canSave ? 'Enter title and pick a date' : '')}
          >
            {saving? 'Saving…' : 'Add milestone'}
          </button>
          {!currentUser && <span className="muted small">Sign in to save your journey</span>}
        </form>

        {error && <div className="error">{error}</div>}

        {items.length === 0 ? (
          <div className="muted">No milestones yet.</div>
        ) : (
          <ul className="timeline">
            {items.map((it) => (
              <li key={it.id} className="entry">
                <div className="dot" />
                <div className="content">
                  <div className="row">
                    <h4 className="entry-title">{it.title}</h4>
                    <span className="entry-date">{it.date}</span>
                  </div>
                  {it.description && <div className="desc">{it.description}</div>}
                  {uid === it.userId && (
                    <div className="actions">
                      <button className="btn danger" onClick={()=>removeMilestone(it.id)}>Delete</button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
