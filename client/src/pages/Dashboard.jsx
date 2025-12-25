import { useEffect, useState } from "react";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    workedOn: "",
    learned: "",
    blockers: "",
  });

  async function load() {
    const res = await fetch("http://localhost:5000/entries");
    setEntries(await res.json());
  }

  async function submit(e) {
    e.preventDefault();
    await fetch("http://localhost:5000/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Entry saved!");

    setForm({ ...form, workedOn: "", learned: "", blockers: "" });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>DevFlow – Daily Log</h2>

      <form onSubmit={submit}>
        <input value={form.date} type="date"
          onChange={e => setForm({ ...form, date: e.target.value })} />

        <textarea placeholder="Worked on"
          value={form.workedOn}
          onChange={e => setForm({ ...form, workedOn: e.target.value })} />

        <textarea placeholder="Learned"
          value={form.learned}
          onChange={e => setForm({ ...form, learned: e.target.value })} />

        <textarea placeholder="Blockers"
          value={form.blockers}
          onChange={e => setForm({ ...form, blockers: e.target.value })} />

        <button>Save Entry</button>
      </form>

      <hr />

      {entries.map(e => (
        <div key={e._id}>
          <h4>{e.date}</h4>
          <p><b>Worked:</b> {e.workedOn}</p>
          <p><b>Learned:</b> {e.learned}</p>
          <p><b>Blockers:</b> {e.blockers}</p>
        </div>
      ))}
    </div>
  );
}
