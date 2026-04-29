const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

// LIST backups (optional static or from folder)
router.get("/backups", (req, res) => {
  exec("docker exec cloud-food-menu-app-mongo-1 ls /data/db/backup", (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ backups: stdout.split("\n").filter(Boolean) });
  });
});

// RESTORE DB (one click)
router.post("/restore", (req, res) => {
  const { backupFolder } = req.body;

  if (!backupFolder) {
    return res.status(400).json({ error: "backupFolder required" });
  }

  const cmd = `docker exec cloud-food-menu-app-mongo-1 mongorestore --drop /data/db/backup/${backupFolder}`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }
    res.json({ message: "Restore successful", output: stdout });
  });
});

module.exports = router;
<Route path="/admin-restore" element={<AdminRestore />} />