const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// SQLite DB 초기화
const db = new sqlite3.Database('codes.db');
db.run(`CREATE TABLE IF NOT EXISTS codes (code TEXT, user_id TEXT, script_content TEXT)`);

client.once('ready', () => {
    console.log(`Bot is ready: ${client.user.tag}`);
});

// Express 엔드포인트: Roblox에서 코드 검증
app.post('/verify', (req, res) => {
    const { code } = req.body;
    db.get(`SELECT script_content FROM codes WHERE code = ?`, [code], (err, row) => {
        if (err || !row) {
            return res.json({ valid: false });
        }
        res.json({ valid: true, script: row.script_content });
    });
});

// 서버 시작 (포트 5000)
app.listen(5000, () => {
    console.log('Express server running on port 5000');
});


client.login('TOKEN');  // 토큰 교체
