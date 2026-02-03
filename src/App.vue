<template>
  <div class="app-wrapper">
    <div class="ambient-bg"></div>

    <div class="main-container">
      <header class="hero">
        <h1 class="glow-title">✨ 我的 Vibe Coding 创意实验室</h1>
        <p class="subtitle">顺着灵感流动，用 AI 把生活中的小想法变成现实</p>
      </header>

      <section class="project-grid">
        <div v-for="p in projects" :key="p.name" class="glass-card">
          <div class="card-content">
            <div class="card-icon">{{ p.icon }}</div>
            <h3 class="card-title">{{ p.name }}</h3>
            <p class="card-desc">{{ p.desc }}</p>
            <a :href="'https://' + p.url" target="_blank" class="launch-btn">
              <span>去看看</span>
              <svg class="icon-arrow" viewBox="0 0 13 10"><path d="M1,5 L11,5 M8,1 L12,5 L8,9"></path></svg>
            </a>
          </div>
        </div>
      </section>

      <div class="ai-widget" :class="{ 'widget-open': isOpen }">
        <div class="widget-header" @click="isOpen = !isOpen">
          <div class="bot-avatar">✨</div>
          <span class="header-text">{{ isOpen ? '收起对话' : '聊聊这里的 Vibe' }}</span>
          <span class="header-chevron">{{ isOpen ? '▼' : '▲' }}</span>
        </div>

        <transition name="slide-up">
          <div v-if="isOpen" class="chat-body">
            <div class="chat-messages" ref="msgBox">
              <div v-for="(m, i) in messages" :key="i" :class="['bubble', m.role]">
                <div class="bubble-content">{{ m.content }}</div>
              </div>
              <div v-if="loading" class="bubble assistant typing">
                <span>正在组织语言...</span>
              </div>
            </div>
            <div class="chat-input-area">
              <input
                v-model="userInput"
                @keyup.enter="handleSend"
                placeholder="随便聊聊..."
                :disabled="loading"
              />
              <button @click="handleSend" :disabled="loading" class="send-action">发送</button>
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
  { name: '邻里喂食互助', url: 'pet-feeding-mvp.vercel.app', desc: '长假期间猫狗没人照看确实让人头疼。我做了这个，想让邻里间能更简单、放心地互相帮个忙。', icon: '🐶' },
  { name: '职场沟通助手', url: 'workplace-eq-tool.vercel.app', desc: '有些话想说但怕伤感情，这个小工具就是帮大家把话说得更有温度、更得体。', icon: '💬' },
  { name: '简单图像工具', url: 'image-vectorizer-alpha.vercel.app', desc: '把繁琐的抠图和转图过程简化，让创作灵感不再卡在工具操作上。', icon: '🖼️' },
  { name: '小鱼大鱼游戏', url: 'fish-game-omega.vercel.app', desc: '回归那种最简单的快乐。打磨手感的过程中，我也找回了那种纯粹的游戏体验。', icon: '🐟' },
  { name: '私人实验空间', url: 'tsukasa-fanpage.vercel.app', desc: '这里不谈实用性，只谈审美。放了一些我喜欢的动态视觉效果实验。', icon: '🎨' }
];

const messages = ref([{ role: 'assistant', content: '嘿！欢迎来到我的 Vibe Coding 实验室。这里的每一个项目都是我顺着当时的灵感做出来的，你想了解哪个背后的故事？' }]);

const handleSend = async () => {
  if (!userInput.value || loading.value) return;
  const text = userInput.value;
  messages.value.push({ role: 'user', content: text });
  userInput.value = '';
  loading.value = true;

  try {
    const res = await axios.post('/api/chat', {
      messages: messages.value.map(m => ({ role: m.role, content: m.content }))
    });
    messages.value.push({ role: 'assistant', content: res.data.choices[0].message.content });
  } catch (err) {
    messages.value.push({ role: 'assistant', content: '连接好像出了点小问题，我们可以稍后再聊。' });
  } finally {
    loading.value = false;
    nextTick(() => {
      if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight;
    });
  }
};
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  background-color: #0d0d0d;
  color: #fff;
  font-family: -apple-system, 'Noto Sans SC', sans-serif;
}

.ambient-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 15%, #1d1714 0%, #0d0d0d 100%);
  z-index: 0;
}

.main-container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 20px;
}

.hero { text-align: center; margin-bottom: 70px; }
.glow-title {
  font-size: 3rem;
  background: linear-gradient(135deg, #ff8e72 0%, #ffccaa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(255, 142, 114, 0.25));
}
.subtitle { color: #888; margin-top: 15px; font-size: 1.1rem; }

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  padding: 35px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.05);
  border-color: #ff8e72;
}

.card-icon { font-size: 40px; margin-bottom: 15px; }
.card-title { font-size: 1.4rem; margin-bottom: 12px; font-weight: 600; }
.card-desc { color: #999; line-height: 1.7; margin-bottom: 25px; font-size: 0.95rem; }

.launch-btn {
  display: flex; align-items: center; gap: 8px;
  color: #ff8e72; text-decoration: none; font-weight: 600; font-size: 0.9rem;
}
.icon-arrow { width: 16px; stroke: currentColor; fill: none; stroke-width: 2; }

.ai-widget {
  position: fixed; bottom: 30px; right: 30px; width: 340px; z-index: 1000;
}
.widget-header {
  background: #ff8e72; padding: 12px 20px; border-radius: 40px;
  display: flex; align-items: center; cursor: pointer; color: white;
  box-shadow: 0 10px 30px rgba(255, 142, 114, 0.35);
}
.header-text { flex: 1; font-size: 0.9rem; margin-left: 10px; font-weight: 600; }

.chat-body {
  position: absolute; bottom: 70px; right: 0; width: 100%;
  height: 450px; background: #1a1a1a; border-radius: 20px;
  border: 1px solid #333; display: flex; flex-direction: column;
  overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
.bubble { max-width: 85%; padding: 12px 16px; border-radius: 15px; font-size: 0.9rem; line-height: 1.5; }
.assistant { background: #262626; align-self: flex-start; border-bottom-left-radius: 4px; }
.user { background: #ff8e72; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }

.chat-input-area { padding: 15px; display: flex; gap: 8px; background: #1a1a1a; border-top: 1px solid #333; }
.chat-input-area input {
  flex: 1; background: #0a0a0a; border: 1px solid #333; color: white;
  padding: 10px 15px; border-radius: 10px; outline: none;
}
.send-action { background: #ff8e72; color: white; border: none; padding: 8px 18px; border-radius: 10px; cursor: pointer; font-weight: 600; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(30px); }
</style>