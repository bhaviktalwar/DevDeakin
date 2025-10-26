import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../init-firebase';
import '../styles/messages.css';

// Minimal secure messaging page using Firestore
// Data model:
//  - conversations/{conversationId}
//      members: [uid1, uid2]
//      membersKey: "uid1_uid2" (sorted)
//      lastMessage: { text, senderId, createdAt }
//      updatedAt: serverTimestamp
//  - conversations/{conversationId}/messages/{messageId}
//      text, senderId, createdAt

export default function Messages() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const AI_SESSION_ID = '__ai__';
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeMeta, setActiveMeta] = useState(null);
  const [messages, setMessages] = useState([]);
  const [aiMessages, setAiMessages] = useState([]); // local-only AI chat transcript (not persisted)
  const [newEmail, setNewEmail] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [userCache, setUserCache] = useState({}); // uid -> {name, email}
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const PAGE_SIZE = 50;
  const [aiThinking, setAiThinking] = useState(false);
  const [menu, setMenu] = useState(null); // {x, y, conv} for context menu
  const [deletingId, setDeletingId] = useState(null);

  const userId = currentUser?.uid;

  // Redirect unauthenticated users to login (with return destination)
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [loading, currentUser, navigate, location.pathname]);

  // Subscribe to user's conversations with graceful fallback (avoids missing Firestore index)
  useEffect(() => {
    if (!userId) return;

    let unsubscribe = () => {};

    const attach = (ordered) => {
      const base = [collection(db, 'conversations'), where('members', 'array-contains', userId)];
      const qRef = ordered
        ? query(...base, orderBy('updatedAt', 'desc'), limit(25))
        : query(...base, limit(25));

      unsubscribe = onSnapshot(
        qRef,
        (snap) => {
          let rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          // Hide any AI conversations from history
          rows = rows.filter((c) => !((c.members || []).includes('ai') || c.ai === true));
          if (!ordered) {
            // Sort client-side if we couldn't order in Firestore
            rows.sort((a, b) => {
              const at = a.updatedAt?.toMillis?.() || 0;
              const bt = b.updatedAt?.toMillis?.() || 0;
              return bt - at;
            });
          }
          setConversations(rows);
          if (!activeId && rows.length > 0) {
            setActiveId(rows[0].id);
            setActiveMeta(rows[0]);
          }

          // Prefetch user profiles for other participants to show friendly names
          const needs = new Set();
          rows.forEach((c) => {
            (c.members || []).forEach((m) => {
              if (m !== userId && !userCache[m]) needs.add(m);
            });
          });
          if (needs.size) {
            (async () => {
              const updates = {};
              for (const uid of needs) {
                try {
                  const uref = doc(db, 'users', uid);
                  const usnap = await getDoc(uref);
                  if (usnap.exists()) {
                    const data = usnap.data();
                    updates[uid] = {
                      name:
                        data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email || uid,
                      email: data.email || '',
                    };
                  } else {
                    updates[uid] = { name: uid, email: '' };
                  }
                } catch (e) {
                  updates[uid] = { name: uid, email: '' };
                }
              }
              if (Object.keys(updates).length) {
                setUserCache((prev) => ({ ...prev, ...updates }));
              }
            })();
          }
        },
        (err) => {
          console.warn('Conversations ordered query failed, falling back without orderBy', err?.message);
          // Retry without orderBy (no composite index needed)
          unsubscribe();
          attach(false);
        }
      );
    };

    attach(true);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Subscribe to messages for active conversation
  useEffect(() => {
    // When in AI session, do not subscribe to Firestore; use local state
    if (activeId === AI_SESSION_ID || activeMeta?.members?.includes?.('ai') || activeMeta?.ai) {
      setMessages(aiMessages);
      return () => {};
    }
    if (!activeId) {
      setMessages([]);
      return;
    }
    // Real-time listener for the most recent PAGE_SIZE messages
    const q = query(
      collection(db, 'conversations', activeId, 'messages'),
      orderBy('createdAt', 'asc'),
      limitToLast(PAGE_SIZE)
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });
    return unsub;
  }, [activeId, activeMeta, aiMessages]);

  // Older history pagination
  const [olderMsgs, setOlderMsgs] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset pagination when switching conversations
    setOlderMsgs([]);
    setHasMore(true);
    setLoadingMore(false);
  }, [activeId]);

  const loadOlder = async () => {
    if (!activeId || loadingMore || !hasMore) return;
    // No pagination for AI session (local-only)
    if (activeId === AI_SESSION_ID || activeMeta?.members?.includes?.('ai') || activeMeta?.ai) return;
    // Find the oldest loaded createdAt among olderMsgs first then messages
    const firstLoaded = (olderMsgs[0] || messages[0]);
    const oldestTs = firstLoaded?.createdAt;
    if (!oldestTs) {
      setHasMore(false);
      return;
    }
    setLoadingMore(true);
    const container = scrollRef.current;
    const prevHeight = container ? container.scrollHeight : 0;
    try {
      const q = query(
        collection(db, 'conversations', activeId, 'messages'),
        where('createdAt', '<', oldestTs),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const batch = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((m) => !!m.createdAt);
      batch.reverse(); // oldest first when prepending
      setOlderMsgs((prev) => [...batch, ...prev]);
      if (batch.length < PAGE_SIZE) setHasMore(false);
      // Maintain scroll position after prepending
      setTimeout(() => {
        if (container) {
          const newHeight = container.scrollHeight;
          const delta = newHeight - prevHeight;
          container.scrollTop = (container.scrollTop || 0) + delta;
        }
      }, 0);
    } catch (e) {
      console.error('Failed loading older messages', e);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const startConversation = async (email) => {
    setError('');
    const normalized = (email || newEmail || '').trim().toLowerCase();
    if (!userId) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }
    if (!normalized) {
      setError('Enter an email to chat with.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
      setError('Please enter a valid email.');
      return;
    }
    if (currentUser?.email && normalized === currentUser.email.toLowerCase()) {
      setError('Enter the other person\'s email, not yours.');
      return;
    }

    // Look up user by email
    const usersQ = query(collection(db, 'users'), where('email', '==', normalized), limit(1));
    const snap = await getDocs(usersQ);
    if (snap.empty) {
      setError('No user found with that email.');
      return;
    }
    const other = { id: snap.docs[0].id, ...snap.docs[0].data() };
    if (other.id === userId) {
      setError('You cannot start a chat with yourself.');
      return;
    }

    // Compute deterministic membersKey
    const [a, b] = [userId, other.id].sort();
    const membersKey = `${a}_${b}`;

    // Try to find an existing conversation by membersKey
    const convQ = query(collection(db, 'conversations'), where('membersKey', '==', membersKey), limit(1));
    const existing = await getDocs(convQ);
    if (!existing.empty) {
      const docRef = existing.docs[0];
      setActiveId(docRef.id);
      setActiveMeta({ id: docRef.id, ...docRef.data() });
      setNewEmail('');
      return;
    }

    // Create new conversation
    const payload = {
      members: [userId, other.id],
      membersKey,
      lastMessage: null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    const created = await addDoc(collection(db, 'conversations'), payload);
    setActiveId(created.id);
    setActiveMeta({ id: created.id, ...payload });
    setNewEmail('');
  };

  const startAiConversation = async () => {
    setError('');
    if (!userId) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }
    // Switch to local-only AI session; do not create or use Firestore conversations
    setActiveId(AI_SESSION_ID);
    setActiveMeta({ id: AI_SESSION_ID, members: [userId, 'ai'], ai: true, title: 'AI Assistant' });
    setAiMessages([]);
  };

  const sendMessage = async () => {
    setError('');
    const trimmed = text.trim();
    if (!userId || !activeId || !trimmed) return;

    // AI session: handle locally and do not persist
    const isAi = activeId === AI_SESSION_ID || activeMeta?.members?.includes?.('ai') || activeMeta?.ai;
    if (isAi) {
      try {
        // push user message locally
        const userLocal = { id: `u-${Date.now()}`, text: trimmed, senderId: userId, createdAt: new Date() };
        setAiMessages((prev) => [...prev, userLocal]);
        setText('');
        setAiThinking(true);
        const system = {
          role: 'system',
          content:
            'You are a helpful developer assistant inside a developer marketplace. Provide concise, accurate help with code, bugs, and best practices. If you are unsure, ask clarifying questions.',
        };
        const resp = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [system, { role: 'user', content: trimmed }] }),
        });
        if (!resp.ok) {
          const raw = await resp.text();
          console.error('AI HTTP error', resp.status, raw);
          throw new Error(`AI HTTP ${resp.status}`);
        }
        let data;
        try {
          data = await resp.json();
        } catch (parseErr) {
          console.error('AI JSON parse error', parseErr);
          throw parseErr;
        }
        const replyText = data?.reply || 'Sorry, I could not generate a response.';
        const aiLocal = { id: `ai-${Date.now()}`, text: replyText, senderId: 'ai', createdAt: new Date() };
        setAiMessages((prev) => [...prev, aiLocal]);
      } catch (e) {
        console.error('AI reply failed', e);
        setError('AI is unavailable right now.');
      } finally {
        setAiThinking(false);
      }
      return;
    }

    const msg = {
      text: trimmed,
      senderId: userId,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'conversations', activeId, 'messages'), msg);
    await setDoc(
      doc(db, 'conversations', activeId),
      {
        lastMessage: { text: trimmed, senderId: userId, createdAt: serverTimestamp() },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setText('');
  };

  const activeTitle = useMemo(() => {
    if (!activeMeta?.members || !userId) return 'Conversation';
    const otherId = activeMeta.members.find((m) => m !== userId);
    if (otherId === 'ai') return 'AI Assistant';
    const other = otherId ? userCache[otherId] : null;
    return other?.name || other?.email || 'Conversation';
  }, [activeMeta, userId, userCache]);

  return (
    <div className="messages">
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="sidebar-title">Messages</h3>
        <div className="start-row">
          <input
            type="email"
            placeholder="Start chat by email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="start-input"
          />
          <button onClick={() => startConversation()} className="btn">Start</button>
        </div>
        <div className="ai-row">
          <button onClick={startAiConversation} className="btn btn-secondary">Ask AI</button>
          {aiThinking && <span className="muted small">AI is thinking…</span>}
        </div>
        {currentUser?.email && (
          <div className="muted xsmall mb-10">
            You are logged in as <strong>{currentUser.email}</strong>
          </div>
        )}
        {error && <div className="error mb-8">{error}</div>}

        <div className="conversations">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => { setActiveId(c.id); setActiveMeta(c); setMenu(null); }}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu({ x: e.clientX, y: e.clientY, conv: c });
              }}
              className={`conv-item ${c.id === activeId ? 'active' : ''}`}
            >
              <div className="conv-title">
                {(() => {
                  const otherId = (c.members || []).find((m) => m !== userId);
                  const other = otherId ? userCache[otherId] : null;
                  return other?.name || other?.email || 'Conversation';
                })()}
              </div>
              <div className="conv-last">
                {c?.lastMessage?.text || 'No messages yet'}
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="muted small">No conversations yet.</div>
          )}
        </div>

        {/* Context menu and backdrop */}
        {menu && (
          <>
            <div onClick={() => setMenu(null)} className="menu-backdrop" />
            <div
              role="menu"
              style={{ position:'fixed', top: menu.y, left: menu.x }}
              className="context-menu"
            >
              <div
                onClick={async () => {
                  const c = menu.conv;
                  setMenu(null);
                  if (!c?.id) return;
                  const confirmDelete = window.confirm('Delete this conversation for you? This cannot be undone.');
                  if (!confirmDelete) return;
                  try {
                    setDeletingId(c.id);
                    await deleteDoc(doc(db, 'conversations', c.id));
                    if (activeId === c.id) {
                      setActiveId(null);
                      setActiveMeta(null);
                      setMessages([]);
                      setOlderMsgs([]);
                      setHasMore(true);
                    }
                  } catch (e) {
                    console.error('Delete conversation failed', e);
                    setError('Could not delete conversation.');
                  } finally {
                    setDeletingId(null);
                  }
                }}
                className={`menu-item ${deletingId === menu?.conv?.id ? 'disabled' : 'danger'}`}
              >
                Delete conversation
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chat window */}
      <div className="chat">
        <div className="titlebar">
          <strong>{activeTitle}</strong>
        </div>
        <div ref={scrollRef} onScroll={(e) => { const el = e.currentTarget; if (el.scrollTop <= 40) { loadOlder(); } }} className="scroll">

          {olderMsgs.map((m) => (
            <div key={`old-${m.id}`} className={`row ${m.senderId === userId ? 'me' : (m.senderId === 'ai' ? 'ai' : 'other')}`}>
              <div className={`bubble ${m.senderId === userId ? 'me' : (m.senderId === 'ai' ? 'ai' : 'other')}`}>{m.text}</div>
            </div>
          ))}

          {messages.map((m) => (
            <div key={m.id} className={`row ${m.senderId === userId ? 'me' : (m.senderId === 'ai' ? 'ai' : 'other')}`}>
              <div className={`bubble ${m.senderId === userId ? 'me' : (m.senderId === 'ai' ? 'ai' : 'other')}`}>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="input-bar">
          <input
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            className="message-input"
          />
          <button onClick={sendMessage} className="btn">Send</button>
        </div>
      </div>
    </div>
  );
}
