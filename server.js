const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// 使用内存存储排行榜数据（实际项目中应该使用数据库）
const leaderboards = {
    snake: [],
    tetris: [],
    link: []
};

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 服务静态文件

// 获取排行榜数据
app.get('/api/leaderboard/:game', (req, res) => {
    const game = req.params.game;
    if (!leaderboards[game]) {
        return res.status(404).json({ error: '游戏类型不存在' });
    }

    const top10 = leaderboards[game]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    res.json(top10);
});

// 添加新的得分记录
app.post('/api/leaderboard', (req, res) => {
    const { name, score, game } = req.body;
    
    if (!name || !score || !game) {
        return res.status(400).json({ error: '需要提供名字、分数和游戏类型' });
    }

    if (!leaderboards[game]) {
        return res.status(404).json({ error: '游戏类型不存在' });
    }

    leaderboards[game].push({ name, score, timestamp: Date.now() });
    
    // 只保留前20名
    leaderboards[game] = leaderboards[game]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 