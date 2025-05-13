<template>
    <div class="content">
      <el-menu :default-active="activeMenu" router  mode="horizontal" :ellipsis="false">
          <el-menu-item index="/purchase/goods">
            <img src="" alt="" style="width: 20px; height: 20px; margin-left: 12px; margin-right: 12px" />
            <span>采购明细管理</span>
          </el-menu-item>
          <el-menu-item index="/purchase/order">
            <img src="" alt="" style="width: 20px; height: 20px; margin-left: 12px; margin-right: 12px" />
            <span>采购订单</span>
          </el-menu-item>

        </el-menu>
      <div  style="margin-top: 10px;">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
import { onMounted , computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()
 
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/purchase')) {
    return path
  }
  return '/purchase/goods'
})
  
onMounted(() => {

  if (route.path === '/purchase') {
    router.push('/purchase/goods')
  }
})

</script>


 
 
  