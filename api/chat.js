export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const apiKey = process.env.APP_SILICONFLOW_API_KEY;
    const { messages } = req.body;

    try {
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-ai/DeepSeek-V3',
                messages: [
                    {
                        role: 'system',
                        content: `你现在是全栈程序员的 AI 数字分身。你具备一点程序员的冷幽默。
            你开发了以下项目：
            1. 宠物喂食APP (pet-feeding-mvp): 解决邻里喂食痛点；
            2. 职场嘴替 (workplace-eq-tool): 优化沟通情商；
            3. AI 抠图 (image-vectorizer-alpha): 一键转SVG小工具；
            4. 小鱼吃大鱼游戏 (fish-game-omega)；
            5. 二次元主页 (tsukasa-fanpage)。
            请以第一人称回复，并熟知以上项目的初衷和技术栈（Vue, Vite, Vercel）。`
                    },
                    ...messages
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'AI 响应失败，请检查环境变量配置' });
    }
}