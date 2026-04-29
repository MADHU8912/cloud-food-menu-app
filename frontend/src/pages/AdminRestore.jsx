import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminRestore() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBackups = async () => {
    const res = await axios.get("/api/admin/backups");
    setBackups(res.data.backups);
  };

  const restoreDB = async (folder) => {
    if (!window.confirm(`Restore DB from ${folder}?`)) return;

    setLoading(true);
    try {
      await axios.post("/api/admin/restore", {
        backupFolder: folder,
      });
      alert("Restore successful!");
    } catch (err) {
      alert("Restore failed!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin DB Restore Panel</h2>

      <button onClick={fetchBackups}>Refresh Backups</button>

      <ul>
        {backups.map((b, i) => (
          <li key={i}>
            {b}
            <button
              disabled={loading}
              onClick={() => restoreDB(b)}
              style={{ marginLeft: 10 }}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}