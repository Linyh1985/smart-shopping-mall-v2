<script setup>
// ======================================================================
// Profile.vue —— 我的页面（个人中心）
// ----------------------------------------------------------------------
// 功能：
//   1. 顶部用户信息卡片（登录/未登录两种状态）
//   2. 假登录弹窗（账号+密码，不校验，直接存 localStorage）
//   3. 功能列表（点击有 Toast 反馈）
//   4. 退出登录按钮（清除登录状态）
//
// localStorage 存取说明：
//   - 登录状态 key: 'isLogin'，值为 'true' 或不存在
//   - 用户名 key: 'username'，值为用户输入的账号
//   - 用户头像 key: 'avatar'，值为图片 URL（这里用默认头像）
// ======================================================================
import { ref, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'

// ----------------------------------------------------------------------
// 登录状态管理
// ----------------------------------------------------------------------
// isLogin：是否已登录（true/false）
// username：当前登录的用户名
// avatar：当前用户头像 URL
// ----------------------------------------------------------------------
const isLogin = ref(false)
const username = ref('')
const avatar = ref('')

// 默认头像：未登录时显示的灰色头像图标
const DEFAULT_AVATAR = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'

// ----------------------------------------------------------------------
// 登录弹窗控制
// ----------------------------------------------------------------------
// showLoginPopup：控制 van-popup 弹窗的显示/隐藏
// loginForm：登录表单数据（账号、密码）
// ----------------------------------------------------------------------
const showLoginPopup = ref(false)
const loginForm = ref({
  account: '',
  password: '',
})

// ----------------------------------------------------------------------
// 初始化：页面加载时从 localStorage 读取登录状态
// ----------------------------------------------------------------------
// localStorage.getItem('isLogin') 返回字符串 'true' 或 null
// 所以要用 === 'true' 来判断是否已登录
// ----------------------------------------------------------------------
onMounted(() => {
  // 读取登录状态
  isLogin.value = localStorage.getItem('isLogin') === 'true'

  // 读取用户名和头像（如果已登录）
  if (isLogin.value) {
    username.value = localStorage.getItem('username') || '尊贵的VIP用户'
    avatar.value = localStorage.getItem('avatar') || DEFAULT_AVATAR
  }
})

// ----------------------------------------------------------------------
// 点击顶部用户卡片：未登录时弹出登录框
// ----------------------------------------------------------------------
const showLoginDialog = () => {
  // 如果已登录，点击卡片不做任何操作（或可以跳转到个人资料页）
  if (isLogin.value) {
    showToast('欢迎回来，' + username.value)
    return
  }

  // 未登录时，打开登录弹窗
  showLoginPopup.value = true
}

// ----------------------------------------------------------------------
// 执行登录
// ----------------------------------------------------------------------
// 流程：
//   1. 校验账号不能为空
//   2. 不校验密码，直接登录成功
//   3. 把登录状态、用户名、头像存入 localStorage
//   4. 更新页面响应式数据
//   5. 关闭弹窗并提示"登录成功"
// ----------------------------------------------------------------------
const handleLogin = () => {
  // 校验账号不能为空
  if (!loginForm.value.account.trim()) {
    showToast('请输入账号')
    return
  }

  // 不校验密码，直接登录成功
  // 把登录状态、用户名、头像存入 localStorage
  localStorage.setItem('isLogin', 'true')
  localStorage.setItem('username', loginForm.value.account.trim())
  localStorage.setItem('avatar', DEFAULT_AVATAR)

  // 更新页面响应式数据
  isLogin.value = true
  username.value = loginForm.value.account.trim()
  avatar.value = DEFAULT_AVATAR

  // 关闭弹窗
  showLoginPopup.value = false

  // 清空表单
  loginForm.value.account = ''
  loginForm.value.password = ''

  showToast('登录成功')
}

// ----------------------------------------------------------------------
// 功能列表点击事件
// ----------------------------------------------------------------------
// 参数 title：列表项的名称（如"我的订单"）
// 点击后弹出 Toast 提示，告诉用户这是演示功能
// ----------------------------------------------------------------------
const handleFeatureClick = (title) => {
  showToast(`【${title}】功能演示中，敬请期待`)
}

// ----------------------------------------------------------------------
// 退出登录
// ----------------------------------------------------------------------
// 流程：
//   1. 弹出确认对话框，防止误触
//   2. 用户确认后，清除 localStorage 里的登录状态
//   3. 重置页面数据为未登录状态
//   4. 提示"已退出登录"
// ----------------------------------------------------------------------
const handleLogout = () => {
  showDialog({
    title: '确认退出',
    message: '确定要退出当前账号吗？',
    showCancelButton: true,
    confirmButtonText: '退出',
    confirmButtonColor: '#ee0a24', // 红色按钮，表示危险操作
  })
    .then(() => {
      // 用户点击"退出"
      // 清除 localStorage 里的登录相关数据
      localStorage.removeItem('isLogin')
      localStorage.removeItem('username')
      localStorage.removeItem('avatar')

      // 重置页面数据
      isLogin.value = false
      username.value = ''
      avatar.value = ''

      showToast('已退出登录')
    })
    .catch(() => {
      // 用户点击"取消"，什么都不做
    })
}
</script>

<template>
  <div class="profile-page">
    <!-- ==============================================================
         顶部用户信息卡片
         未登录：显示默认头像 + "点击登录"
         已登录：显示用户头像 + 用户名
         点击卡片：未登录时弹出登录框
         ============================================================== -->
    <div class="user-card" @click="showLoginDialog">
      <div class="user-info">
        <!-- 头像区域 -->
        <div class="avatar-wrap">
          <!-- 已登录：显示用户头像 -->
          <van-image
            v-if="isLogin"
            round
            width="64"
            height="64"
            :src="avatar"
          />
          <!-- 未登录：显示默认图标 -->
          <div v-else class="default-avatar">
            <van-icon name="user-o" size="32" color="#fff" />
          </div>
        </div>

        <!-- 用户信息区域 -->
        <div class="user-text">
          <!-- 昵称：已登录显示用户名，未登录显示"点击登录" -->
          <div class="nickname">{{ isLogin ? username : '点击登录' }}</div>
          <!-- 副标题：已登录显示欢迎语，未登录显示提示 -->
          <div class="sub-title">{{ isLogin ? '欢迎回来，开启购物之旅' : '登录后享受更多服务' }}</div>
        </div>

        <!-- 右侧箭头：提示可点击 -->
        <van-icon name="arrow" color="#969799" />
      </div>
    </div>

    <!-- ==============================================================
         功能列表区域
         van-cell-group 是 Vant 的分组容器，把多个 van-cell 包在一起
         van-cell 是单元格组件，is-link 显示右侧箭头，表示可点击
         ============================================================== -->
    <van-cell-group class="feature-list">
      <van-cell
        title="个人中心"
        is-link
        icon="user-o"
        @click="handleFeatureClick('个人中心')"
      />
      <van-cell
        title="我的订单"
        is-link
        icon="orders-o"
        @click="handleFeatureClick('我的订单')"
      />
      <van-cell
        title="收货地址"
        is-link
        icon="location-o"
        @click="handleFeatureClick('收货地址')"
      />
      <van-cell
        title="设置"
        is-link
        icon="setting-o"
        @click="handleFeatureClick('设置')"
      />
    </van-cell-group>

    <!-- ==============================================================
         退出登录按钮
         只有已登录时才显示
         type="danger" 是红色，表示危险操作
         ============================================================== -->
    <div v-if="isLogin" class="logout-wrap">
      <van-button
        block
        type="danger"
        round
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>

    <!-- ==============================================================
         登录弹窗
         van-popup 是 Vant 的弹出层组件，从屏幕中央弹出
         round 属性让弹窗有圆角
         ============================================================== -->
    <van-popup
      v-model:show="showLoginPopup"
      round
      position="center"
      :style="{ width: '80%', maxWidth: '320px' }"
    >
      <div class="login-popup">
        <!-- 弹窗标题 -->
        <div class="login-title">用户登录</div>

        <!-- 账号输入框 -->
        <van-field
          v-model="loginForm.account"
          label="账号"
          placeholder="请输入账号"
          clearable
        />

        <!-- 密码输入框 -->
        <van-field
          v-model="loginForm.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          clearable
        />

        <!-- 登录按钮 -->
        <div class="login-btn-wrap">
          <van-button
            block
            type="primary"
            round
            @click="handleLogin"
          >
            登录
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
/* 页面整体样式 */
.profile-page {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 60px;
}

/* 顶部用户卡片：蓝色渐变背景 */
.user-card {
  margin: 12px;
  padding: 24px 16px;
  background: linear-gradient(135deg, #1989fa 0%, #5cadff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.15);
}

/* 用户信息区域：横向布局 */
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 头像容器 */
.avatar-wrap {
  flex-shrink: 0;
}

/* 默认头像：圆形灰色背景，居中显示图标 */
.default-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 用户文字区域 */
.user-text {
  flex: 1;
  min-width: 0;
}

/* 昵称：白色大字号 */
.nickname {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

/* 副标题：半透明白色小字 */
.sub-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* 功能列表区域 */
.feature-list {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
}

/* 退出登录按钮区域 */
.logout-wrap {
  margin: 24px 12px;
}

.logout-wrap :deep(.van-button) {
  border-radius: 8px;
}

/* 登录弹窗样式 */
.login-popup {
  padding: 24px 16px;
}

.login-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #323233;
}

.login-btn-wrap {
  margin-top: 20px;
}
</style>
