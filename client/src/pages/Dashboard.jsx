import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("API_URL =", API_URL);
const fieldConfig = [
  {
    key: "workedOn",
    label: "Worked on",
    placeholder: "Shipped features, fixed issues, reviewed PRs...",
  },
  {
    key: "learned",
    label: "Learned",
    placeholder: "New patterns, tools, technical takeaways...",
  },
  {
    key: "blockers",
    label: "Blockers",
    placeholder: "Dependencies, unknowns, anything slowing progress...",
  },
];

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    workedOn: "",
    learned: "",
    blockers: "",
  });
  const [savedMsg, setSavedMsg] = useState("");

  async function load() {
const res = await fetch(`${API_URL}/entries`);
    setEntries(await res.json());
  }

  async function submit(e) {
    e.preventDefault();
    await fetch(`${API_URL}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSavedMsg("Saved");
    setTimeout(() => setSavedMsg(""), 1500);

    setForm({ ...form, workedOn: "", learned: "", blockers: "" });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Daily engineering journal</span>
          <h1>DevFlow</h1>
          <p className="hero-copy">
            Capture progress, learning, and blockers in one clean workspace.
          </p>
        </div>

        <div className="hero-panel">
          <span className="hero-stat-label">Entries tracked</span>
          <strong className="hero-stat-value">{entries.length}</strong>
          <p className="hero-stat-copy">
            A focused snapshot of what moved forward today.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel panel-form">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">New entry</span>
              <h2>Log today&apos;s work</h2>
            </div>
            <div className="date-chip">{form.date}</div>
          </div>

          <form onSubmit={submit} className="entry-form">
            <label className="field-group">
              <span className="field-label">Date</span>
              <input
                className="field-input"
                value={form.date}
                type="date"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>

            {fieldConfig.map((field) => (
              <label className="field-group" key={field.key}>
                <span className="field-label">{field.label}</span>
                <textarea
                  className="field-input field-textarea"
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                />
              </label>
            ))}

            <div className="form-footer">
              <button className="primary-button" type="submit">
                Save Entry
              </button>
              <span className={`status-message${savedMsg ? " visible" : ""}`}>
                {savedMsg || "Saved"}
              </span>
            </div>
          </form>
        </article>

        <article className="panel panel-table">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">History</span>
              <h2>Saved entries</h2>
            </div>
          </div>

          <div className="table-wrap">
            <table className="entries-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Worked On</th>
                  <th>Learned</th>
                  <th>Blockers</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan={4}>
                      No entries yet.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry._id}>
                      <td className="date-cell">{entry.date}</td>
                      <td>{entry.workedOn || "-"}</td>
                      <td>{entry.learned || "-"}</td>
                      <td>{entry.blockers || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
