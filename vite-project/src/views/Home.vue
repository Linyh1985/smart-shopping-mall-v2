<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
const router = useRouter()
// 筛选表单数据
const formData = reactive({
  category: '',
  budget: '',
  count: '',
})
// 商品分类
const categories = ['数码', '服饰', '食品', '家居', '美妆']
// 分类选择器选项
const pickerColumns = categories.map((item) => ({ text: item, value: item }))
// 分类选择器
const showPicker = ref(false)
const onCategoryConfirm = ({ selectedValues }) => {
  formData.category = selectedValues[0]
  showPicker.value = false
}
// 点击热门分类，回填表单
const selectCategory = (item) => {
  formData.category = item
}
// 通用跳转
const goPage = (path) => {
  router.push(path)
}
// 快捷入口
const quickEntries = [
  { icon: 'shopping-cart-o', text: '全部商品', path: '/detail' },
  { icon: 'chat-o', text: 'AI 咨询', path: '/ai' },
  { icon: 'user-o', text: '我的', path: '/profile' },
]
import axios from 'axios'
// 定义响应式数据
const hotProducts = ref([])
// 页面加载时请求后端接口
onMounted(async () => {
  try {
    // 注意这里是 3000 端口
    const res = await axios.get('/api/products')
    // 把后端返回的数据赋值给前端
    hotProducts.value = res.data
  } catch (error) {
    console.error('获取商品失败', error)
  }
})

// 点击商品卡片，携带商品 ID 跳转详情页
const goProduct = (id) => {
  router.push({ path: '/detail', query: { id } })
}
// ============================================================
// 功能：点击"开始推荐"按钮后的处理函数
// 流程：表单校验 → 通过校验 → 携带参数跳转到 Detail 页面
// ------------------------------------------------------------
// showToast 的作用：Vant UI 提供的轻提示组件，在屏幕中央短暂
// 显示一段文字，告诉用户哪里出错了（类似 Alert 但不阻塞操作）
// ------------------------------------------------------------
// return 的作用：一旦校验失败立即 return，后面的 router.push
// 就不会执行，从而阻止页面跳转。这是前端表单校验的标准写法。
// ============================================================
// ======================================================================
// 封装一个自己的 toast 函数，统一设置 duration（显示时长）
// ----------------------------------------------------------------------
// Vant 默认 showToast 只显示 2000ms（2秒），稍不留神就错过了
// 这里统一设为 3000ms（3秒），给用户足够时间看到错误提示
// ======================================================================
const toast = (msg) => showToast({ message: msg, duration: 3000 })
// ----------------------------------------------------------------------
// 防抖标志位：防止用户狂点"开始推荐"按钮
// ----------------------------------------------------------------------
// 原理：点击后先把 btnLoading 设为 true，按钮进入 loading 状态并禁用
//       等跳转完成后（或超时后）再恢复为 false
//       在 btnLoading 为 true 期间，再次点击会被直接忽略
// ----------------------------------------------------------------------
const btnLoading = ref(false)
const startRecommend = () => {
  // 防抖：如果按钮已经是 loading 状态，直接忽略本次点击
  if (btnLoading.value) return
  // ① 校验商品分类：必须选择
  if (!formData.category) {
    toast('请选择商品分类')
    return // return 终止当前函数，不再往下执行，页面不会跳转
  }
  // ② 校验预算：必须填写，且转换为数字后必须严格大于 0
  //    Number() 把字符串 "1000" 转成数字 1000；空字符串会变成 0
  const budget = Number(formData.budget)
  if (!formData.budget || budget <= 0 || isNaN(budget)) {
    toast('预算必须大于 0 元')
    return
  }
  // ③ 校验数量：必须是 1~50 之间的正整数
  const count = Number(formData.count)
  if (!formData.count || count < 1 || count > 50) {
    toast('数量必须在 1-50 件之间')
    return
  }
  // ④ 所有校验通过，开启 loading 状态，开始跳转
  btnLoading.value = true
  // router.push 是 Vue Router 提供的跳转方法
  // query 对象里的属性会变成 URL 上的查询参数（?category=数码&budget=1000&count=5）
  // Detail 页面可以通过 useRoute().query 拿到这些值
  router.push({
    path: '/detail',          // 要跳转到的路由路径（对应 router/index.js 里的 path）
    query: {                  // 通过 URL query 方式传递参数
      category: formData.category,     // 商品分类（字符串，如 "数码"）
      budget: budget,                  // 预算金额（数字）
      count: count,                    // 数量（数字）
    },
  })
  // 3 秒后恢复按钮状态（防止跳转失败时按钮永远卡住）
  // 实际项目中这里应该是路由跳转完成后恢复，本地演示用 setTimeout 兜底
  setTimeout(() => {
    btnLoading.value = false
  }, 3000)
}
</script>

<template>
  <div class="home">
    <!-- 顶部滚动横幅 -->
    <van-notice-bar
      scrollable
      left-icon="volume-o"
      text="⚠️ 基于AI的智能商品介绍与推荐系统"
      background="#fff7cc"
      color="#e6a23c"
    />

    <!-- 顶部标题区 -->
    <div class="header">
      <div class="header-title">智能购物推荐助手</div>
      <div class="header-sub">基于 AI 的商品推荐与选购规划系统</div>
    </div>

    <!-- 筛选表单区 -->
    <div class="form-card">
      <van-field
        v-model="formData.category"
        label="商品分类"
        placeholder="请选择商品分类"
        readonly
        is-link
        @click="showPicker = true"
      />
      <van-field
        v-model="formData.budget"
        type="number"
        label="预算 (元)"
        placeholder="请输入预算金额"
      />
      <van-field
        v-model="formData.count"
        type="number"
        label="选购数量"
        placeholder="请输入选购件数"
      />

      <div class="hot-category">
        <span class="hot-label">热门分类</span>
        <span
          v-for="item in categories"
          :key="item"
          class="category-tag"
          :class="{ active: formData.category === item }"
          @click="selectCategory(item)"
        >
          {{ item }}
        </span>
      </div>

      <div class="submit-wrap">
        <van-button
          block
          type="primary"
          :loading="btnLoading"
          loading-text="正在跳转..."
          @click="startRecommend"
        >
          开始推荐
        </van-button>
      </div>
    </div>

    <!-- 分类选择弹窗 -->
    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        title="选择商品分类"
        :columns="pickerColumns"
        @confirm="onCategoryConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>

    <!-- 快捷入口区 -->
    <van-grid :column-num="3" :border="false" class="quick-grid">
      <van-grid-item
        v-for="entry in quickEntries"
        :key="entry.text"
        :icon="entry.icon"
        :text="entry.text"
        @click="goPage(entry.path)"
      />
    </van-grid>

    <!-- 热门商品推荐区 -->
    <div class="section-title">
      <span class="title-bar"></span>
      <span class="title-text">热门推荐</span>
      <span class="title-bar"></span>
    </div>

    <van-grid :column-num="2" :gutter="12" :border="false" class="product-grid">
      <van-grid-item v-for="p in hotProducts" :key="p.id" @click="goProduct(p.id)">
        <div class="product-card">
          <img :src="p.image" class="product-thumb" alt="商品图片" />
          <div class="product-name">{{ p.title }}</div>
          <div class="product-bottom">
            <span class="product-price">¥{{ p.price }}</span>
            <span class="product-sales">已售 {{ p.sales }}</span>
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<style scoped>
.home {
  background: #f7f8fa;
  min-height: 100vh;
  text-align: left;
}

/* 顶部标题区 */
.header {
  padding: 24px 16px 20px;
  text-align: center;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #323233;
}

.header-sub {
  margin-top: 6px;
  font-size: 13px;
  color: #969799;
}

/* 筛选表单区 */
.form-card {
  margin: 12px;
  padding-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.form-card :deep(.van-cell) {
  padding: 12px 16px;
}

.hot-category {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 4px 16px 12px;
}

.hot-label {
  font-size: 13px;
  color: #646566;
}

.category-tag {
  padding: 4px 10px;
  font-size: 12px;
  color: #646566;
  background: #f7f8fa;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
}

.category-tag.active {
  color: #1989fa;
  background: #e8f3ff;
  border-color: #1989fa;
}

.submit-wrap {
  padding: 0 16px;
}

.submit-wrap :deep(.van-button) {
  border-radius: 8px;
}

/* 快捷入口区 */
.quick-grid {
  margin: 0 12px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

/* 通用分区标题 */
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 12px;
}

.title-bar {
  width: 40px;
  height: 1px;
  background: #ddd;
}

.title-text {
  margin: 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

/* 热门商品推荐区 */
.product-grid {
  padding-bottom: 16px;
}

.product-grid :deep(.van-grid-item__content) {
  padding: 0;
  background: transparent;
}

.product-card {
  width: 100%;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 核心修复：让图片自适应 */
.product-thumb {
  display: block;
  width: 100%;
  max-width: 100%; /* 绝对不超出屏幕 */
  height: auto; /* 高度自动，跟着宽度等比缩放 */
  aspect-ratio: 1 / 1; /* 强制保持 1:1 正方形 */
  object-fit: cover; /* 保证图片填满正方形且不变形 */
  border-radius: 12px 12px 0 0;
}

.product-name {
  padding: 8px 8px 4px;
  font-size: 13px;
  color: #323233;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 8px;
}

.product-price {
  font-size: 15px;
  font-weight: 600;
  color: #ee0a24;
}

.product-sales {
  font-size: 11px;
  color: #969799;
}
</style>
