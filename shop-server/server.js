const express = require('express');
const cors = require('cors');

// 1. 引入 25 个真实商品数据
const products = require('./data.js');

const app = express();
app.use(cors()); // 允许前端跨域请求
app.use(express.json()); // 解析 JSON 格式请求体

// 2. 接口：返回完整的商品列表
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 3. 接口：AI 聊天（升级版：支持正则提取预算 + 多分类精准匹配）
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  let reply = "我是智能导购助手，请问有什么可以帮您？";
  let recommendProducts = []; 
  
  if (message) {
    // 1. 看看用户想要什么分类
    let targetCategory = '';
    if (message.includes('衣服') || message.includes('服饰') || message.includes('鞋')) targetCategory = '服饰';
    if (message.includes('数码') || message.includes('手机') || message.includes('电脑')) targetCategory = '数码';
    if (message.includes('美妆') || message.includes('口红') || message.includes('护肤')) targetCategory = '美妆';
    if (message.includes('食品') || message.includes('吃') || message.includes('零食')) targetCategory = '食品';
    if (message.includes('家居') || message.includes('日用')) targetCategory = '家居';

    // 2. 尝试从用户的话里提取数字（比如 “买衣服预算2000” -> 提取出 2000）
    const budgetMatch = message.match(/\d+/); 
    const budget = budgetMatch ? Number(budgetMatch[0]) : 999999;

        // 3. 开始智能推荐逻辑
    if (targetCategory) {
      let filtered = products.filter(p => p.category === targetCategory);
      
      // 如果提取到了数字，就按预算过滤并带上金额提示；否则推荐该分类下的前两个
      if (budgetMatch) {
        filtered = filtered.filter(p => Number(p.price) <= budget);
        if (filtered.length > 0) {
          reply = `为您找到以下符合您 ${budget} 元预算的${targetCategory}类商品：`;
          recommendProducts = filtered.slice(0, 2);
        } else {
          reply = `抱歉，在 ${budget} 元预算内，暂时没有找到合适的${targetCategory}商品。`;
        }
      } else {
        // 没带预算的情况
        reply = `为您找到以下热门的${targetCategory}类商品：`;
        recommendProducts = filtered.slice(0, 2);
      }
    } else if (message.includes('预算')) {
      // 如果只说了预算，没说要买啥，就在预算内随便挑一个
      const filtered = products.filter(p => Number(p.price) <= budget);
      if (filtered.length > 0) {
        reply = `根据您的 ${budget} 元预算，为您推荐这款高性价比商品：`;
        recommendProducts = [filtered[0]];
      } else {
        reply = `您的预算太低了，暂时没有找到合适的商品哦~`;
      }
    } else {
      reply = "您可以告诉我您想买什么类别（比如数码、服饰、美妆），以及您的预算，我来帮您挑选！";
    }
  }

  // 模拟 AI 思考延迟 1 秒
  setTimeout(() => {
    res.json({ 
      reply: reply,
      products: recommendProducts 
    });
  }, 1000);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动：http://localhost:${PORT}`);
});