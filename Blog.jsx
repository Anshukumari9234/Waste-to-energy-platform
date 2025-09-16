import React, { useMemo, useState } from "react";

// ---------- Sample posts data ----------
const postsData = [
  {
    id: "p1",
    title: "Segregate Smartly: Easy Steps to Separate Waste at Home",
    excerpt: "7 practical ways to start waste segregation at home — from kitchen to compost.",
    content: `
The Right Way to Segregate Waste

Put organic waste (food peels, vegetable scraps) into a compost bin.
Keep plastics and e-waste in separate containers.

console.log("Waste → Energy!");

How Biogas is Produced:
1. Organics collected
2. Anaerobic digester
3. Methane captured → electricity or gas

Tip: Keep wet and dry waste separate at source — this makes processing much easier.
    `,
    tags: ["segregation", "home", "compost"],
    likes: 48,
    date: "2025-06-01",
  },
  {
    id: "p2",
    title: "Waste to Energy: Simple Biogas Plant Case Study",
    excerpt: "How a small municipality generated 500 kWh/month from 2 tons/day of organic waste.",
    content: `
This case study shows how a local plant processed organic waste into energy.

Highlights:
- Feedstock: food & market waste
- Process: anaerobic digestion
- Outputs: biogas, digestate (used as fertilizer)

Impact:
- CO2 saved: ~120 kg/month
    `,
    tags: ["case-study", "biogas", "impact"],
    likes: 75,
    date: "2025-04-22",
  },
  {
    id: "p3",
    title: "E-waste: Why and How to Recycle",
    excerpt: "Why separating e-waste is important — simple recycling steps and drop-off points.",
    content: `
E-waste contains precious metals and hazardous materials.

- Do not mix with household waste.
- Locate certified e-waste drop-off.
- Reuse parts when possible.
    `,
    tags: ["e-waste", "recycle"],
    likes: 32,
    date: "2025-07-03",
  },
];

// ---------- Components ----------
function ReadingTime({ content }) {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return <span>{mins} min read</span>;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
}

function PostCard({ post, onOpen }) {
  return (
    <article
      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onOpen(post)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <div className="text-xs text-slate-500">
          {formatDate(post.date)}
          <span className="mx-2">•</span>
          <ReadingTime content={post.content} />
        </div>
      </div>

      <p className="mt-2 text-slate-700 line-clamp-3">{post.excerpt}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {post.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 bg-slate-100 rounded-full">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-500">❤ {post.likes}</button>
        </div>
      </div>
    </article>
  );
}

// ---------- Main Component ----------
export default function App() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState(null);
  const [selected, setSelected] = useState(null);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return postsData
      .filter((p) => !tag || p.tags.includes(tag))
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
  }, [query, tag]);

  const tagCloud = useMemo(() => {
    const map = {};
    postsData.forEach((p) => p.tags.forEach((t) => (map[t] = (map[t] || 0) + 1)));
    return Object.keys(map).sort((a, b) => map[b] - map[a]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-600">Waste→Energy Blog</h1>
            <div className="text-sm text-slate-600">Smarter & Greener Tomorrow — Hackathon</div>
          </div>
        </header>

        <main className="grid md:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="md:col-span-3 space-y-6">
            {/* Featured */}
            <section className="rounded-xl p-6 bg-gradient-to-r from-blue-50 to-green-50 border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-blue-600">Featured: Circular Waste → Clean Energy</h2>
                  <p className="mt-2 text-slate-700">
                    How organic waste becomes biogas and electricity — with a step-by-step guide and real examples.
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  <div>Impact estimate</div>
                  <div className="mt-2 font-semibold">5000 kg → 1200 kWh</div>
                </div>
              </div>
            </section>

            {/* Search + Buttons */}
            <section className="flex flex-col sm:flex-row gap-3 items-start sm:items-center relative z-10">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles or keywords..."
                className="flex-1 input border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setTag(null); setQuery(""); }}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition"
                >
                  Present
                </button>
              </div>
            </section>

            {/* Posts */}
            <section className="grid md:grid-cols-2 gap-4">
              {posts.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No posts found</div>
              ) : posts.map((p) => (
                <PostCard key={p.id} post={p} onOpen={setSelected} />
              ))}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 sticky top-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tagCloud.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t === tag ? null : t)}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer transition ${
                      t === tag ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">Subscribe</h4>
              <p className="text-sm text-slate-600">Get updates for new posts & impact reports.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed! (demo)") }} className="mt-3">
                <input required type="email" placeholder="your@email.com" className="w-full p-2 border rounded-md" />
                <button className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Subscribe</button>
              </form>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">About this blog</h4>
              <p className="text-sm text-slate-600">Short posts focused on waste segregation, conversion to energy, technology, and case studies — perfect for hackathon demos.</p>
            </div>
          </aside>
        </main>

        <footer className="mt-12 text-center text-sm text-slate-500">Built for Hackathon • Demo Version</footer>
      </div>
    </div>
  );
}
