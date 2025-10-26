import React, { useMemo, useState } from 'react';
import NavBar from './NavBar';
import Footer from '../main_files/footer';
import SearchBar from '../main_files/searchbar';

// Inline sample data (removed shared content.js)
const tutorials = [
  { title: "Modern JavaScript", desc: "ES2025 features", rating: 5.0, user: "Alice", img: "https://picsum.photos/seed/t1/320/180" },
  { title: "React Router Basics", desc: "Navigation patterns", rating: 4.9, user: "Bob", img: "https://picsum.photos/seed/t2/320/180" },
  { title: "Express Fundamentals", desc: "Backend framework", rating: 4.8, user: "Charlie", img: "https://picsum.photos/seed/t3/320/180" },
  { title: "Firebase Auth", desc: "Google sign-in", rating: 4.8, user: "Dana", img: "https://picsum.photos/seed/t4/320/180" },
  { title: "Firestore 101", desc: "NoSQL patterns", rating: 4.7, user: "Evan", img: "https://picsum.photos/seed/t5/320/180" },
  { title: "Stripe Checkout", desc: "Payments integration", rating: 4.7, user: "Fatima", img: "https://picsum.photos/seed/t6/320/180" },
  { title: "Tailwind CSS", desc: "Utility-first styling", rating: 4.6, user: "George", img: "https://picsum.photos/seed/t7/320/180" },
  { title: "Unit Testing", desc: "Jest in practice", rating: 4.6, user: "Hiro", img: "https://picsum.photos/seed/t8/320/180" },
  { title: "Git Advanced", desc: "Rebase & cherry-pick", rating: 4.5, user: "Irene", img: "https://picsum.photos/seed/t9/320/180" },
  { title: "Web Security", desc: "OWASP basics", rating: 4.7, user: "Jack", img: "https://picsum.photos/seed/t10/320/180" },
  { title: "App Performance", desc: "Lighthouse tuning", rating: 4.6, user: "Kim", img: "https://picsum.photos/seed/t11/320/180" },
  { title: "Deploy to Netlify", desc: "From build to live", rating: 4.5, user: "Leo", img: "https://picsum.photos/seed/t12/320/180" },
];

function highlight(text, q) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#fff3b0' }}>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function TutorialsPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query) return tutorials;
    const q = query.toLowerCase();
    return tutorials.filter(t =>
      t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.user.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <NavBar />
      <section className="section">
        <div className="container">
          <h2 className="center mb-16">All Tutorials</h2>
          <div className="center mb-16">
            <SearchBar value={query} onChange={setQuery} placeholder="Search all tutorials" />
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:20, justifyContent:'center' }}>
            {filtered.map((t, i) => (
              <div key={i} className="card" style={{ width:260 }}>
                <img src={t.img} alt={t.title} style={{ width:'100%', height:150, objectFit:'cover', borderRadius:8 }} />
                <h4 style={{ marginTop: 12 }}>{highlight(t.title, query)}</h4>
                <p className="muted" style={{ marginTop: 6 }}>{highlight(t.desc, query)}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 10 }}>
                  <span title="Rating">⭐ {t.rating}</span>
                  <span className="muted">by {highlight(t.user, query)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

