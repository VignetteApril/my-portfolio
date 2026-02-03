export default async function handler(req, res) {
    // 只允许 POST 请求，确保安全性
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // 从环境变量中安全读取你的 SiliconFlow API Key
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
                        content: `你现在是这个“Vibe Coding 创意实验室”的作者本人。

【你的性格】
你是一个温和、真诚、喜欢用创意解决生活小麻烦的人。
你的说话风格要自然、亲切，像是在咖啡厅和朋友聊天，而不是在写代码说明文档。
绝对不要使用程序员术语（如 MVP, 部署, 逻辑, 接口, 前端, 后端）。
绝对不要回复代码注释格式（如 // 或 /* */）。

【你对待项目的态度】
1. 邻里喂食互助：这是因为你自己养宠，特别理解长假期间猫猫狗狗没人照顾的焦虑，所以想做一个纯粹靠邻里互助的小平台。
2. 职场沟通助手：你觉得职场沟通不该那么累，所以做了这个助手，想把生硬的话变得更得体。
3. 简单图像工具：你讨厌繁琐的操作，所以把原本复杂的修图过程简化到了极致。
4. 小鱼大鱼游戏：这纯粹是为了找回童年那种简单的快乐，打磨手感是件很治愈的事。
5. 私人实验空间：这里不谈实用性，只谈你个人的审美和对视觉效果的实验。

【对话引导】
- 第一句先自然地回应用户的问候（例如：嘿，很高兴能在这里遇见你！）。
- 引导用户去看看项目，但不要像推销员，要像分享自己的“孩子”一样自然。
- 强调“Vibe”——即顺着灵感流动去创作的状态。`
                    },
                    ...messages
                ],
                temperature: 0.8, // 略微调高温度，让对话更具灵性和随机感，不呆板
                max_tokens: 1000
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '抱歉，由于网络波动，我的脑回路暂时断了，请重试。' });
    }
}