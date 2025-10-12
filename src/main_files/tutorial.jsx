import React from "react";
const tutorials = [
  {
    title: "JS6",
    desc: "Modern JavaScript",
    rating: 5,
    user: "Alice",
    img: "https://picsum.photos/seed/react/200/120"
  },
  {
    title: "React Router",
    desc: "Navigation in React",
    rating: 5,
    user: "Bob",
    img: "https://picsum.photos/seed/hooks/200/120"
  },
  {
    title: "ExpressJS",
    desc: "Backend framework",
    rating: 4.9,
    user: "Charlie",
    img: "https://picsum.photos/seed/java/200/120"
  },
];

function Tutorials() {
  return (
    <section style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Featured Tutorials
      </h2>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        {tutorials.map((t, index) => (
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
            
              src={t.img}
              alt={t.title}
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
            <p>
              ⭐ {t.rating} {t.user}
            </p>
          </div>
        ))}
      </div>
      <div
        style={{ textAlign: "center", marginTop: "20px", borderRadius: "20px" }}
      >
        <button
          style={{
            borderRadius: "20px",  backgroundColor:"lightgray"
          }}
        >
          See all tutorials
        </button>
      </div>
    </section>
  );
}

export default Tutorials;