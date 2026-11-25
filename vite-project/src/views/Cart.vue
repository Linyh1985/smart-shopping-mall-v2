<script setup>
// ======================================================================
// Cart.vue —— 购物车页面
// ----------------------------------------------------------------------
// 功能：
//   1. 从 localStorage 读取购物车商品列表
//   2. 用 Vant 的 van-card 组件展示商品
//   3. 支持删除商品、修改数量
//   4. 支持全选/单选，计算选中商品总价
//   5. 结算按钮（演示项目，只提示不支持真实支付）
// ======================================================================
import { ref, computed, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'

// 从 cart.js 导入封装好的 localStorage 操作函数
import {
  getCart,           // 读取购物车数组
  removeFromCart,    // 删除某个商品
  updateCartCount,   // 更新商品数量
  clearCart,         // 清空购物车
} from '../utils/cart'

// cartList：购物车商品列表，从 localStorage 读取
// 每个元素格式：{ id, title, price, image, count, selected }
// selected 是新增字段，表示是否被选中（用于结算）
const cartList = ref([])

// ----------------------------------------------------------------------
// 初始化：页面加载时从 localStorage 读取数据
// ----------------------------------------------------------------------
// onMounted 是 Vue 的生命周期钩子，组件挂载到页面后自动执行
// 这里给每个商品加上 selected: true（默认全选）
// ----------------------------------------------------------------------
onMounted(() => {
  // getCart() 从 localStorage 读取数组
  // map 遍历每个商品，加上 selected: true 字段
  cartList.value = getCart().map((item) => ({
    ...item,        // 展开原有字段：id, title, price, image, count
    selected: true, // 新增字段：默认选中
  }))
})

// ----------------------------------------------------------------------
// 计算属性：选中商品的总价
// ----------------------------------------------------------------------
// computed 是 Vue 的计算属性，会根据依赖的数据自动重新计算
// 这里依赖 cartList，当 cartList 变化时自动重新计算总价
// ----------------------------------------------------------------------
const totalPrice = computed(() => {
  // filter 筛选出 selected 为 true 的商品
  // reduce 把筛选后的商品累加总价
  return cartList.value
    .filter((item) => item.selected)  // 只保留选中的商品
    .reduce((sum, item) => {
      // Number(item.price) 把价格字符串转成数字
      // item.count 是购买数量
      // sum 是累积和
      return sum + Number(item.price) * item.count
    }, 0) // 初始值 0
    .toFixed(2) // 保留两位小数
})

// ----------------------------------------------------------------------
// 计算属性：选中的商品数量
// ----------------------------------------------------------------------
const selectedCount = computed(() => {
  return cartList.value
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.count, 0)
})

// ----------------------------------------------------------------------
// 删除商品
// ----------------------------------------------------------------------
// 参数 productId：要删除的商品 ID
// 流程：
//   1. 调用 cart.js 的 removeFromCart 从 localStorage 删除
//   2. 从 cartList 里过滤掉该商品（更新页面显示）
//   3. 提示用户"已删除"
// ----------------------------------------------------------------------
const handleDelete = (productId) => {
  // showConfirmDialog 是 Vant 的确认对话框，防止误删
  showConfirmDialog({
    title: '确认删除',
    message: '确定要把这个商品从购物车移除吗？',
  })
    .then(() => {
      // 用户点击"确认"
      removeFromCart(productId) // 从 localStorage 删除
      // 从页面数组中过滤掉该商品
      cartList.value = cartList.value.filter((item) => item.id !== productId)
      showToast('已删除')
    })
    .catch(() => {
      // 用户点击"取消"，什么都不做
    })
}

// ----------------------------------------------------------------------
// 修改商品数量
// ----------------------------------------------------------------------
// 参数 item：当前商品对象
// 参数 delta：变化量（+1 或 -1）
// ----------------------------------------------------------------------
const handleCountChange = (item, delta) => {
  const newCount = item.count + delta

  if (newCount <= 0) {
    // 数量减到 0，提示是否删除
    handleDelete(item.id)
    return
  }

  // 更新 localStorage
  updateCartCount(item.id, newCount)
  // 更新页面显示
  item.count = newCount
}

// ----------------------------------------------------------------------
// 清空购物车
// ----------------------------------------------------------------------
const handleClear = () => {
  showConfirmDialog({
    title: '清空购物车',
    message: '确定要清空所有商品吗？',
  })
    .then(() => {
      clearCart() // 清空 localStorage
      cartList.value = [] // 清空页面数组
      showToast('购物车已清空')
    })
    .catch(() => {})
}

// ----------------------------------------------------------------------
// 结算按钮
// ----------------------------------------------------------------------
const handleCheckout = () => {
  if (selectedCount.value === 0) {
    showToast('请先选择要结算的商品')
    return
  }
  // 演示项目，不支持真实支付
  showToast('演示项目，暂不支持支付')
}
</script>

<template>
  <div class="cart-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="购物车" />

    <!-- 购物车为空时的提示 -->
    <van-empty
      v-if="!cartList.length"
      description="购物车还是空的，快去挑选商品吧"
    >
      <van-button round type="primary" to="/">去逛逛</van-button>
    </van-empty>

    <!-- 购物车有商品时的列表 -->
    <div v-else class="cart-list">
      <!--
        van-card 是 Vant 提供的商品卡片组件
        v-for 遍历 cartList，每个商品渲染一张卡片
        :key 是 Vue 的要求，用于高效更新列表
      -->
      <van-card
        v-for="item in cartList"
        :key="item.id"
        :title="item.title"
        :thumb="item.image"
        :price="item.price"
        :desc="item.description"
      >
        <!-- 自定义卡片底部区域：数量控制和删除按钮 -->
        <template #footer>
          <div class="card-footer">
            <!-- 数量减少按钮 -->
            <van-button
              size="mini"
              icon="minus"
              @click="handleCountChange(item, -1)"
            />
            <!-- 当前数量 -->
            <span class="count">{{ item.count }}</span>
            <!-- 数量增加按钮 -->
            <van-button
              size="mini"
              icon="plus"
              @click="handleCountChange(item, 1)"
            />
            <!-- 删除按钮 -->
            <van-button
              size="mini"
              type="danger"
              icon="delete-o"
              @click="handleDelete(item.id)"
            >
              删除
            </van-button>
          </div>
        </template>
      </van-card>

      <!-- 底部结算栏 -->
      <div class="checkout-bar">
        <div class="total">
          合计：<span class="price">¥{{ totalPrice }}</span>
          <span class="count">({{ selectedCount }} 件)</span>
        </div>
        <div class="actions">
          <van-button size="small" @click="handleClear">清空</van-button>
          <van-button
            size="small"
            type="primary"
            :disabled="selectedCount === 0"
            @click="handleCheckout"
          >
            结算
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 60px;
}

.cart-list {
  padding: 12px;
}

/* 卡片底部自定义区域 */
.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}

/* 底部结算栏 */
.checkout-bar {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #ebedf0;
}

.total {
  font-size: 14px;
  color: #323233;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: #ee0a24;
}

.count {
  font-size: 12px;
  color: #969799;
  margin-left: 4px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
