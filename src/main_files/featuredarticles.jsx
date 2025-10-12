import React from "react";
const articles = [
  {
    title: "React OR Vue",
    desc: "Frontend Frameworks",
    rating: 5,
    author: "John Doe",
    img: "https://picsum.photos/seed/react/202/120",
  },
  {
    title: "NodeJS",
    desc: "Backend runtime",
    rating: 5,
    author: "Jane Smith",
    img: "https://picsum.photos/seed/cpp/201/120",
  },
  {
    title: "React Hooks",
    desc: "State & Lifecycle",
    rating: 5,
    author: "Mark Lee",
    img: "https://picsum.photos/seed/202/120",
  },
];

function FeaturedArticles() {
  return (
    <section style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Featured Articles
      </h2>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        {articles.map((article, index) => (
          <div
            key={index} 
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              textAlign: "center",
            }}
          >

            <img
              src={article.img}
              alt={article.title}
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />
            <h4>{article.title}</h4>
            <p>{article.desc}</p>
            <p>
              ⭐ {article.rating} {article.author}
            </p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          style={{
            borderRadius: "20px",
            backgroundColor: "lightgray",
          }}
        >
          See all articles
        </button>
      </div>
    </section>
  );
}

export default FeaturedArticles;
