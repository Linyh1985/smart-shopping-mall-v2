import axios from 'axios'
// 创建一个独立的 axios 实例，方便统一配置
const aiRequest = axios.create({
  baseURL: '/api', // 直接写 /api，Vite 会自动帮你代理到 3000 端口
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})
/**
 * 与 AI 购物助手进行对话
 * @param {Array} history 聊天历史记录数组，包含 role 和 content
 * @returns {Promise<Object>} 返回包含回复文字和推荐商品的对象
 */
export const chatWithAI = async (history) => {
  // 1. 数据校验：如果没有历史记录，直接返回
  if (!history || history.length === 0) {
    throw new Error('对话内容不能为空')
  }
  // 2. 提取最后一次用户发送的消息
  const lastMessage = history[history.length - 1].content
  try {
    // 3. 发送 POST 请求给后端
    const res = await aiRequest.post('/chat', {
      message: lastMessage,
      // 真实项目中，如果你想让 AI 记住上下文，通常会把 history 一起传给后端
      // history: history 
    })
    // 4. 防御性编程：检查后端返回的数据格式是否符合预期
    if (res.data && typeof res.data.reply === 'string') {
      return {
        content: res.data.reply,
        products: res.data.products || [] // 如果后端带了商品，就取出来；没有就返回空数组
      }
    } else {
      throw new Error('后端返回的数据格式异常')
    }
  } catch (error) {
    // 5. 全局错误拦截与处理
    console.error('AI 接口请求失败：', error)
    // 可以根据不同的错误类型给出不同的提示
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络')
    } else if (error.response) {
      throw new Error(`服务器错误：${error.response.status}`)
    } else {
      throw new Error('无法连接到 AI 服务器')
    }
  }
}