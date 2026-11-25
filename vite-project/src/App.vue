<script setup>
// ======================================================================
// App.vue —— 应用根组件
// ----------------------------------------------------------------------
// 职责：
//   1. 渲染路由页面（router-view）
//   2. 渲染底部 Tabbar 导航
//   3. 在购物车图标上显示 Badge 徽标（商品总数）
// ======================================================================
import { ref, onMounted, onUnmounted } from 'vue'
// 从 cart.js 读取购物车总数
import { getCartTotalCount } from './utils/cart'

// cartCount：购物车商品总数，用于 Badge 显示
// 用 ref 定义，初始为 0，后面从 localStorage 读取真实数量
const cartCount = ref(0)

// ----------------------------------------------------------------------
// 更新购物车数量的函数
// ----------------------------------------------------------------------
// 每次添加/删除商品后，都要调用这个函数刷新 Badge 数字
// 我们通过监听自定义事件 'cart-updated' 来触发更新
// ----------------------------------------------------------------------
const updateCartCount = () => {
  // getCartTotalCount() 会读取 localStorage 并计算总数量
  cartCount.value = getCartTotalCount()
}

// ----------------------------------------------------------------------
// 自定义事件监听：用于跨组件通信
// ----------------------------------------------------------------------
// 问题：Detail.vue 添加商品后，App.vue 怎么知道要更新 Badge？
// 方案：用浏览器的自定义事件（CustomEvent）做简单的"事件总线"
//   - Detail.vue 添加商品后，派发一个 'cart-updated' 事件
//   - App.vue 监听这个事件，收到后重新读取 localStorage 更新数字
// ----------------------------------------------------------------------
const handleCartUpdated = () => {
  updateCartCount()
}

// onMounted：组件挂载完成后执行
// 这里做两件事：
//   1. 初始化时读取一次购物车数量（页面刷新后 Badge 要显示正确数字）
//   2. 监听 'cart-updated' 自定义事件
onMounted(() => {
  updateCartCount() // 初始化读取
  window.addEventListener('cart-updated', handleCartUpdated)
})

// onUnmounted：组件卸载前执行
// 移除事件监听，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('cart-updated', handleCartUpdated)
})
</script>

<template>
  <div class="app-container">
    <router-view />

    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>

      <!--
        购物车 Tab 项：
        badge 属性是 Vant TabbarItem 提供的徽标功能
        :badge="cartCount" 表示绑定 cartCount 变量的值
        当 cartCount 为 0 时，Vant 会自动隐藏徽标（不显示 0）
      -->
      <van-tabbar-item to="/cart" icon="cart-o" :badge="cartCount">
        购物车
      </van-tabbar-item>

      <van-tabbar-item to="/ai" icon="chat-o">AI助手</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  padding-bottom: 50px;
  box-sizing: border-box;
}
</style>
