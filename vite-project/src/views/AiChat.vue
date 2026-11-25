<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { chatWithAI } from '../utils/ai'
import { addToCart } from '../utils/cart'
// 【修改】：新增引入 showConfirmDialog
import { showToast, showConfirmDialog } from 'vant' 
const router = useRouter()
// 【新增】从本地读取聊天记录，如果没有，就给个空数组
const savedMessages = localStorage.getItem('ai_chat_history')
const messages = ref(savedMessages ? JSON.parse(savedMessages) : [])
const inputText = ref('')
const sending = ref(false)
const messageList = ref(null)
// 【新增】监听聊天记录的变化，自动存入本地
watch(messages, (newVal) => {
  localStorage.setItem('ai_chat_history', JSON.stringify(newVal))
}, { deep: true })
// 生成消息 id
let msgId = 0
const genId = () => ++msgId
// 添加消息
const addMessage = (role, content, products = []) => {
  messages.value.push({ id: genId(), role, content, products })
  nextTick(scrollToBottom)
}
// 滚动到底部
const scrollToBottom = () => {
  const el = messageList.value
  if (el) el.scrollTop = el.scrollHeight
}
// 发送消息
const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || sending.value) return
  addMessage('user', text)
  inputText.value = ''
  sending.value = true
  messages.value.push({ id: genId(), role: 'ai', content: '正在思考中...', loading: true, products: [] })
  nextTick(scrollToBottom)
  try {
    const history = messages.value
      .filter((m) => !m.loading)
      .map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
    const res = await chatWithAI(history)
    messages.value.pop()
    addMessage('ai', res.content, res.products)
  } catch (e) {
    messages.value.pop()
    addMessage('ai', 'AI 服务暂时不可用，请稍后再试~')
  } finally {
    sending.value = false
  }
}

// 跳转商品详情
const goProduct = (id) => {
  router.push({ path: '/detail', query: { id } })
}
// 【新增】直接在聊天气泡里加入购物车
const handleAddToCart = (product) => {
  addToCart(product)
  showToast({ message: '已加入购物车', duration: 2000 })
  window.dispatchEvent(new CustomEvent('cart-updated')) // 通知底部徽标更新
}

// 【新增】清空聊天记录函数
const clearHistory = () => {
  showConfirmDialog({
    title: '清空记录',
    message: '确定要清空所有聊天记录吗？',
  })
    .then(() => {
      messages.value = []
      localStorage.removeItem('ai_chat_history')
      addMessage(
        'ai',
        '你好！我是你的 AI 购物规划助手 🤖\n告诉我你的预算和想买的商品，例如：\n「预算 5000 元，帮我规划买数码产品」\n我会为你制定详细的购物方案~',
      )
      showToast('聊天记录已清空')
    })
    .catch(() => {})
}

onMounted(() => {
  // 【新增】如果本地没有记录，才显示欢迎语
  if (messages.value.length === 0) {
    addMessage(
      'ai',
      '你好！我是你的 AI 购物规划助手 🤖\n告诉我你的预算和想买的商品，例如：\n「预算 5000 元，帮我规划买数码产品」\n我会为你制定详细的购物方案~',
    )
  }
})
</script>

<template>
  <div class="ai-chat">
    <!-- 顶部标题 【修改】 修复了标签闭合，加入了左右布局 -->
    <div class="header">
      <div class="header-left">
        <van-icon name="chat-o" class="header-icon" />
        <span class="header-title">AI 购物规划助手</span>
      </div>
      <!-- 新增：清空记录按钮 -->
      <van-icon name="delete-o" class="clear-icon" @click="clearHistory" />
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageList">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="msg-row"
        :class="msg.role === 'user' ? 'msg-user' : 'msg-ai'"
      >
        <div v-if="msg.role === 'ai'" class="avatar ai-avatar">AI</div>
        <div class="msg-body">
          <div class="bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-ai'">
            <span class="bubble-text">{{ msg.content }}</span>
          </div>

          <!-- 推荐商品卡片 -->
          <div v-if="msg.products && msg.products.length" class="product-cards">
            <div v-for="p in msg.products" :key="p.id" class="product-card">
              <div class="p-click-area" @click="goProduct(p.id)">
                <img :src="p.image" class="p-thumb" alt="" />
                <div class="p-info">
                  <div class="p-title">{{ p.title }}</div>
                  <div class="p-price">¥{{ p.price }}</div>
                </div>
              </div>
              <!-- 快捷加购按钮 -->
              <van-button 
                size="mini" 
                type="primary" 
                round 
                icon="cart-o" 
                class="add-btn"
                @click.stop="handleAddToCart(p)"
              >
              </van-button>
            </div>
          </div>
        </div>
        <div v-if="msg.role === 'user'" class="avatar user-avatar">我</div>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="input-bar">
      <input
        v-model="inputText"
        class="msg-input"
        type="text"
        placeholder="描述你的购物需求..."
        @keyup.enter="sendMessage"
      />
      <van-button type="primary" size="small" :loading="sending" @click="sendMessage">发送</van-button>
    </div>
  </div>
</template>

<style scoped>
.ai-chat {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  background: #f7f8fa;
}

/* 【修改】头部样式增加两端对齐，为了容纳垃圾桶 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  height: 46px;
  padding: 0 16px; 
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
  flex-shrink: 0;
}

/* 【新增】左侧包裹层 */
.header-left {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 20px;
  color: #1989fa;
}

.header-title {
  margin-left: 8px;
  font-size: 16px;
  font-weight: 600;
}

/* 【新增】垃圾桶图标样式 */
.clear-icon {
  font-size: 20px;
  color: #969799;
  cursor: pointer;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.msg-row {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
  gap: 8px;
}

.msg-user {
  flex-direction: row-reverse;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}

.ai-avatar {
  background: linear-gradient(135deg, #1989fa, #5fb8f5);
}

.user-avatar {
  background: linear-gradient(135deg, #07c160, #5ed38a);
}

.msg-body {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg-user .msg-body {
  align-items: flex-end;
}

.bubble {
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
}

.bubble-ai {
  background: #fff;
  color: #323233;
  border-top-left-radius: 2px;
}

.bubble-user {
  background: #1989fa;
  color: #fff;
  border-top-right-radius: 2px;
}

/* 推荐商品卡片 */
.product-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.product-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f2f3f5;
}

.p-click-area {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  cursor: pointer;
  min-width: 0;
}

.p-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.p-info {
  flex: 1;
  min-width: 0;
}

.p-title {
  font-size: 13px;
  color: #323233;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-price {
  font-size: 14px;
  color: #ee0a24;
  font-weight: 600;
  margin-top: 2px;
}

.add-btn {
  flex-shrink: 0;
  margin-left: 8px;
}

/* 输入框 */
.input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-top: 1px solid #f2f3f5;
  flex-shrink: 0;
}

.msg-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #dcdee0;
  border-radius: 18px;
  outline: none;
  font-size: 14px;
  background: #f7f8fa;
}

.msg-input:focus {
  border-color: #1989fa;
  background: #fff;
}
</style>