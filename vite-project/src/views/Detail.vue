<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
// 1. 引入 axios 请求后端（原来的本地导入 products 已经不需要了）
import axios from 'axios'
// 购物车工具
import { addToCart } from '../utils/cart'
const route = useRoute()
const router = useRouter()
// 路由参数对象
const routeQuery = reactive({
  category: '',
  budget: 0,
  count: 0,
  productId: '',
})
const productList = ref([])
const loading = ref(false)
const mode = ref('all')
const goBack = () => {
  router.back()
}
// 加入购物车逻辑
const handleAddToCart = (product) => {
  addToCart(product)
  showToast({ message: '已加入购物车', duration: 2000 })
  window.dispatchEvent(new CustomEvent('cart-updated'))
}
// 2. 过滤函数（接收后端传过来的数据，进行筛选）
const filterRecommend = (allProducts) => {
  const { category, budget, count } = routeQuery
  // 按分类筛选
  let list = allProducts.filter((p) => {
    if (!category) return true
    return p.category === category
  })
  // 按预算筛选
  if (budget > 0) {
    list = list.filter((p) => {
      return Number(p.price) <= budget
    })
  }
  // 按数量截取
  if (count > 0) {
    list = list.slice(0, count)
  }
  return list
}
// 3. 挂载时，向后端发起真实请求！
onMounted(async () => {
  // 获取 URL 参数
  const { category = '', budget = 0, count = 0, id = '' } = route.query
  routeQuery.category = category
  routeQuery.budget = Number(budget) || 0
  routeQuery.count = Number(count) || 0
  routeQuery.productId = id
  // 开启骨架屏加载动画
  loading.value = true
  try {
    // 【核心！】请求你手写的后端 Node.js 接口
    const res = await axios.get('/api/products')
    const allProducts = res.data // 拿到后端返回的 25 个商品数据

    // 根据不同模式处理数据
    if (id) {
      // 单品模式：从所有数据里找到对应 ID 的那一个
      mode.value = 'single'
      productList.value = allProducts.filter((p) => p.id === Number(id))
    } else if (category) {
      // 推荐模式：把后端的全量数据丢进过滤函数里
      mode.value = 'recommend'
      productList.value = filterRecommend(allProducts)
    } else {
      // 全量模式：直接展示后端的所有数据
      mode.value = 'all'
      productList.value = allProducts
    }
  } catch (error) {
    console.error('获取数据失败', error)
    showToast('服务器连接失败，请检查后端是否启动')
  } finally {
    // 请求结束（无论成功还是失败），关闭加载动画
    loading.value = false
  }
})
</script>

<template>
  <div class="detail">
    <!-- 顶部导航栏，返回按钮 -->
    <van-nav-bar title="商品推荐结果" left-arrow @click-left="goBack" />

    <!-- ==============================================================
         参数概览卡片
         v-if / v-else-if 是 Vue 的条件渲染指令：
           v-if="条件为 true" 才渲染这个元素，为 false 就完全不渲染到 DOM 里
           v-else-if 是"否则如果"，上一个 v-if 为 false 时才判断这个
           v-else 是"否则"（这里没用到）
         它们是"互斥"的——同一时刻只会有一个分支生效
         ============================================================== -->
    <div v-if="mode === 'recommend'" class="query-card">
      <!-- 推荐模式：显示分类、预算、数量 -->
      <span class="query-item">分类：{{ routeQuery.category }}</span>
      <span class="query-item">预算：¥{{ routeQuery.budget }}</span>
      <span class="query-item">数量：{{ routeQuery.count }} 件</span>
    </div>
    <div v-else-if="mode === 'single'" class="query-card">
      <!-- 单品模式：只显示商品 ID -->
      <span class="query-item">商品 ID：{{ routeQuery.productId }}</span>
    </div>
    <!-- 注意：mode === 'all'（全部商品模式）不显示参数卡片，所以没有 v-else -->

    <!-- ==============================================================
         加载状态 / 商品列表 / 空状态 —— 三者也是互斥的
         逻辑是：loading 时显示 loading；否则如果列表为空显示 empty；否则显示商品
         ============================================================== -->

    <!-- ==============================================================
         骨架屏加载状态
         van-skeleton 是 Vant 的骨架屏组件，在数据加载前显示占位轮廓
         比 van-loading 的转圈动画更像真正的 App 加载体验
         ============================================================== -->
    <template v-if="loading">
      <div v-for="n in 3" :key="n" class="skeleton-item">
        <van-skeleton title avatar :row="2" />
      </div>
    </template>

    <!-- 加载完成：显示商品列表或空状态 -->
    <div v-else class="product-list">
      <!-- 商品列表：v-for 遍历 productList，每个商品渲染一张卡片 -->
      <div v-for="p in productList" :key="p.id" class="product-card">
        <img
          :src="p.image"
          class="product-thumb"
          alt="商品图片"
        />
        <div class="product-info">
          <div class="product-title">{{ p.title }}</div>
          <div class="product-desc">{{ p.description }}</div>
          <div class="product-bottom">
            <span class="product-price">¥{{ p.price }}</span>
            <!-- 已售数量：用普通 span 显示灰色文字 -->
            <span class="product-sales">已售 {{ p.sales }}</span>
          </div>
          <!-- 加入购物车按钮：点击后把商品存入 localStorage 并提示 -->
          <div class="cart-btn-wrap">
            <van-button
              size="small"
              type="primary"
              round
              icon="shopping-cart-o"
              @click="handleAddToCart(p)"
            >
              加入购物车
            </van-button>
          </div>
        </div>
      </div>

      <!-- 空状态：v-if 在这里嵌套使用——当 productList 为空时显示空状态 -->
      <van-empty v-if="!productList.length" description="没有找到合适的商品" />
    </div>
  </div>
</template>

<style scoped>
.detail {
  background: #f7f8fa;
  min-height: 100vh;
  text-align: left;
}

/* 参数概览 */
.query-card {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
}

.query-item {
  padding: 4px 10px;
  font-size: 13px;
  color: #1989fa;
  background: #e8f3ff;
  border-radius: 12px;
}

/* 骨架屏样式 */
.skeleton-item {
  margin: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 商品列表 */
.product-list {
  padding: 0 12px 16px;
}

.product-card {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease;
}

.product-card:active {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.product-thumb {
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
}

.product-desc {
  margin-top: 6px;
  font-size: 12px;
  color: #969799;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: #ee0a24;
}

/* 销量文字：灰色小字号，不抢眼 */
.product-sales {
  font-size: 12px;
  color: #969799;
}

/* 加入购物车按钮区域 */
.cart-btn-wrap {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f2f3f5;
}

.cart-btn-wrap :deep(.van-button) {
  width: 100%;
}
</style>
