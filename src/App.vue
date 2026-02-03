<template>
  <div class="glass-provider">
    <div class="animated-bg"></div>

    <div class="portfolio-content">
      <header class="hero-section">
        <h1 class="glow-text">🚀 张杰作品集</h1>
        <p class="highlight-p">基于 Vue 3 + DeepSeek-V3 驱动的 AI 数字分身</p>
      </header>

      <div class="project-grid">
        <div v-for="p in projects" :key="p.name" class="glass-card">
          <div class="card-icon">{{ p.icon }}</div>
          <h3>{{ p.name }}</h3>
          <p class="project-desc">{{ p.desc }}</p>
          <a :href="'https://' + p.url" target="_blank" class="visit-link">
            <span>立即访问</span>
            <svg viewBox="0 0 13 10"><path d="M1,5 L11,5 M8,1 L12,5 L8,9"></path></svg>
          </a>
        </div>
      </div>

      <div class="ai-chat-widget" :class="{ 'is-active': isOpen }">
        <div class="chat-toggle" @click="isOpen = !isOpen">
          <div class="avatar-glow">🤖</div>
          <span v-if="!isOpen">和我的 AI 分身聊聊</span>
          <span v-else>收起对话</span>
        </div>

        <transition name="fade-slide">
          <div v-if="isOpen" class="chat-window">
            <div class="messages" ref="msgBox">
              <div v-for="(m, i) in messages" :key="i" :class="['msg-bubble', m.role]">
                <div class="msg-content">{{ m.content }}</div>
              </div>
              <div v-if="loading" class="msg-bubble assistant typing">AI 正在思考中...</div>
            </div>
            <div class="input-container">
              <input v-model="userInput" @keyup.enter="sendChat" placeholder="问问关于项目的事..." :disabled="loading" />
              <button @click="sendChat" :disabled="loading" class="send-btn">
                <i class="icon-send">➤</i>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

const isOpen = ref(false);
const loading = ref(false);
const userInput = ref('');
const msgBox = ref(null);

const projects = [
  { name: '宠物喂食互助', url: 'pet-feeding-mvp.vercel.app', desc: '解决邻里间节假日喂猫遛狗的刚需，基于LBS位置撮合。', icon: '🐶' },
  { name: '职场嘴替工具', url: 'workplace-eq-tool.vercel.app', desc: 'AI 辅助生成高情商沟通文案，化解职场沟通尴尬。', icon: '💬' },
  { name: 'AI 图像向量化', url: 'image-vectorizer-alpha.vercel.app', desc: '一键完成 AI 实时抠图并生成 SVG 向量路径。', icon: '🖼️' },
  { name: '小鱼吃大鱼', url: 'fish-game-omega.vercel.app', desc: '经典 Canvas 游戏逻辑实现，探索高帧率物理交互。', icon: '🐟' },
  { name: '二次元主页', url: 'tsukasa-fanpage.vercel.app', desc: '针对特定角色的视觉风格展示，深度打磨动效。', icon: '🎨' }
];

const messages = ref([{ role: 'assistant', content: '嘿！我是作者的 AI 数字分身，想了解我的哪个项目？' }]);

const sendChat = async () => {
  if (!userInput.value || loading.value) return;
  const content = userInput.value;
  messages.value.push({ role: 'user', content });
  userInput.value = '';
  loading.value = true;

  try {
    const res = await axios.post('/api/chat', {
      messages: messages.value.map(m => ({ role: m.role, content: m.content }))
    });
    messages.value.push({ role: 'assistant', content: res.data.choices[0].message.content });
  } catch (err) {
    messages.value.push({ role: 'assistant', content: '由于不可抗力，我的神经网络暂时掉线了...' });
  } finally {
    loading.value = false;
    nextTick(() => { if(msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight; });
  }
};
</script>

<style scoped>
/* 核心配色：深邃背景 + 亮色对比 */
:root {
  --primary: #ff8e72;
  --secondary: #ff7654;
  --bg-dark: #1a1a1a;
  --glass: rgba(255, 255, 255, 0.1);
}

.glass-provider {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  color: #fff;
  background: #121212;
}

/* 华丽流光背景 */
.animated-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(45deg, #1a1a1a, #2c3e50, #1a1a1a);
  z-index: -1;
}

.portfolio-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 20px;
}

.hero-section { text-align: center; margin-bottom: 80px; }
.glow-text {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #ff8e72, #ffcc33);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(255,142,114,0.3));
}
.highlight-p { color: #aaa; font-size: 1.2rem; margin-top: 10px; }

/* 磨砂玻璃卡片 */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.glass-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.1);
  border-color: #ff8e72;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.card-icon { font-size: 50px; margin-bottom: 20px; }
.glass-card h3 { font-size: 1.6rem; color: #fff; margin-bottom: 15px; }
.project-desc { color: #ccc; line-height: 1.6; margin-bottom: 25px; font-size: 0.95rem; }

.visit-link {
  display: flex; align-items: center; color: #ff8e72; text-decoration: none; font-weight: 700;
}
.visit-link svg { width: 18px; fill: none; stroke: currentColor; stroke-width: 2; margin-left: 8px; transition: 0.3s; }
.visit-link:hover svg { transform: translateX(5px); }

/* AI 浮动挂件 */
.ai-chat-widget {
  position: fixed; bottom: 30px; right: 30px; z-index: 100;
}
.chat-toggle {
  background: #ff8e72; padding: 12px 25px; border-radius: 50px; cursor: pointer;
  display: flex; align-items: center; gap: 12px; font-weight: bold;
  box-shadow: 0 10px 30px rgba(255,142,114,0.4);
}
.avatar-glow { font-size: 20px; }

.chat-window {
  position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px;
  background: #1e1e1e; border: 1px solid #333; border-radius: 20px;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
}

.messages { flex: 1; padding: 20px; overflow-y: auto; background: #161616; }
.msg-bubble { margin-bottom: 15px; display: flex; }
.msg-bubble.user { justify-content: flex-end; }
.msg-content {
  padding: 12px 18px; border-radius: 15px; max-width: 80%; line-height: 1.5; font-size: 14px;
}
.user .msg-content { background: #ff8e72; color: white; }
.assistant .msg-content { background: #2a2a2a; color: #eee; }

.input-container { padding: 15px; display: flex; gap: 10px; background: #1e1e1e; border-top: 1px solid #333; }
.input-container input {
  flex: 1; background: #121212; border: 1px solid #444; color: white;
  padding: 10px 15px; border-radius: 10px; outline: none;
}
.send-btn { background: #ff8e72; color: white; border: none; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; }

/* 动画效果 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(20px); }
</style>