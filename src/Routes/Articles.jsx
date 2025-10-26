import React, { useMemo, useState } from 'react';
import NavBar from './NavBar';
import Footer from '../main_files/footer';
import SearchBar from '../main_files/searchbar';
// Inline sample data (removed shared content.js)
const articles = [
  { title: "React vs Vue: 2025 Guide", desc: "Frontend Frameworks", rating: 4.9, author: "John Doe", img: "https://picsum.photos/seed/a1/320/180" },
  { title: "Node.js Performance", desc: "Backend runtime", rating: 4.8, author: "Jane Smith", img: "https://picsum.photos/seed/a2/320/180" },
  { title: "React Hooks Deep Dive", desc: "State & Lifecycle", rating: 5.0, author: "Mark Lee", img: "https://picsum.photos/seed/a3/320/180" },
  { title: "TypeScript for React", desc: "Type safety patterns", rating: 4.7, author: "Priya K.", img: "https://picsum.photos/seed/a4/320/180" },
  { title: "CSS Grid Mastery", desc: "Modern layout", rating: 4.6, author: "Alex Wu", img: "https://picsum.photos/seed/a5/320/180" },
  { title: "Accessibility 101", desc: "Inclusive web", rating: 4.9, author: "Sarah P.", img: "https://picsum.photos/seed/a6/320/180" },
  { title: "Testing React Apps", desc: "Jest & RTL", rating: 4.7, author: "Diego M.", img: "https://picsum.photos/seed/a7/320/180" },
  { title: "Next.js Routing", desc: "App Router basics", rating: 4.8, author: "Nina V.", img: "https://picsum.photos/seed/a8/320/180" },
  { title: "GraphQL vs REST", desc: "API design", rating: 4.6, author: "Tom R.", img: "https://picsum.photos/seed/a9/320/180" },
  { title: "Docker for Devs", desc: "Container fundamentals", rating: 4.5, author: "Isha K.", img: "https://picsum.photos/seed/a10/320/180" },
  { title: "CI/CD Essentials", desc: "Automate your pipeline", rating: 4.6, author: "Omar S.", img: "https://picsum.photos/seed/a11/320/180" },
  { title: "Design Systems", desc: "Consistent UI", rating: 4.7, author: "Lena H.", img: "https://picsum.photos/seed/a12/320/180" },
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

export default function ArticlesPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query) return articles;
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.author.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <NavBar />
      <section className="section">
        <div className="container">
          <h2 className="center mb-16">All Articles</h2>
          <div className="center mb-16">
            <SearchBar value={query} onChange={setQuery} placeholder="Search all articles" />
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:20, justifyContent:'center' }}>
            {filtered.map((article, i) => (
              <div key={i} className="card" style={{ width:260 }}>
                <img src={article.img} alt={article.title} style={{ width:'100%', height:150, objectFit:'cover', borderRadius:8 }} />
                <h4 style={{ marginTop: 12 }}>{highlight(article.title, query)}</h4>
                <p className="muted" style={{ marginTop: 6 }}>{highlight(article.desc, query)}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 10 }}>
                  <span title="Rating">⭐ {article.rating}</span>
                  <span className="muted">by {highlight(article.author, query)}</span>
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
