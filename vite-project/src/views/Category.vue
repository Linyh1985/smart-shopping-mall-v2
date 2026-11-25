<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 这里的分类名称，必须和你们后端 data.js 里的 category 字段一模一样！
const categoryList = [
  { name: '数码', icon: 'phone-o' },
  { name: '服饰', icon: 'bag-o' },
  { name: '食品', icon: 'shop-o' },
  { name: '家居', icon: 'wap-home-o' },
  { name: '美妆', icon: 'flower-o' }
]

// 点击分类跳转到详情页，并带上分类参数
const goCategory = (categoryName) => {
  router.push({
    path: '/detail',
    query: { category: categoryName }
  })
}
</script>

<template>
  <div class="page">
    <van-nav-bar title="全部分类" />
    
    <div class="category-box">
      <van-cell-group>
        <van-cell 
          v-for="item in categoryList" 
          :key="item.name"
          :title="item.name" 
          :icon="item.icon"
          is-link 
          @click="goCategory(item.name)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<style scoped>
.page {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 50px;
}
.category-box {
  margin-top: 12px;
}
</style>