<template>
   
  <el-dropdown trigger="click" @command="handleSetSize">
    <div class="size-select-icon">
      <!-- <svg-icon class-name="size-icon" icon-class="size" /> -->
      <vab-icon  icon="fontsize"  is-custom-svg size="16" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="item of sizeOptions" 
          :key="item.value" 
          :disabled="size === item.value" 
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
// import SvgIcon from '/@/components/SvgIcon/index.vue' // 确保引入SvgIcon组件
import { useAppStore } from '/@/store/modules/app'
import { useTagsViewStore } from '/@/store/modules/tagsView'
import { ElementPlusSize } from '/@/types/elementPlus'
import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
// 定义尺寸选项类型
interface SizeOption {
  label: string
  value: string
}
const { wsCache } = useCache()
// 尺寸选项
const sizeOptions: SizeOption[] = [
{ label: '大', value: 'large' },
{ label: '默认', value: 'default' },
{ label: '小', value: 'small' },
{ label: '迷你', value: 'mini' },
]

// 获取store和router
const appStore = useAppStore()


// 计算当前尺寸
const size = computed(() => appStore.currentSize || 'default') // 添加默认值防止undefined

// 处理尺寸变更
const handleSetSize = (sizeVal: string) => {
// 设置Element Plus全局尺寸变量
const root = document.documentElement


// 新增字体相关变量设置 - 扩展更多字体大小变量
  const fontSizeMap: Record<string, { base: string; medium: string; small: string; large: string; extra: string }> = {
    'large': { 
      base: '18px', 
      medium: '20px',
      small: '16px',
      large: '22px',
      extra: '24px'
    },
    'default': { 
      base: '16px', 
      medium: '18px',
      small: '14px',
      large: '20px',
      extra: '22px'
    },
    'small': { 
      base: '14px', 
      medium: '16px',
      small: '12px',
      large: '18px',
      extra: '20px'
    },
    'mini': { 
      base: '12px', 
      medium: '14px',
      small: '10px',
      large: '16px',
      extra: '18px'
    }
  }

const sizeConfig = fontSizeMap[sizeVal] || fontSizeMap.default

// 设置更多的 CSS 变量
root.style.setProperty('--el-font-size-base', sizeConfig.base)
root.style.setProperty('--el-font-size-medium', sizeConfig.medium)
root.style.setProperty('--el-font-size-small', sizeConfig.small)
root.style.setProperty('--el-font-size-large', sizeConfig.large)


// 设置 Element Plus 组件的字体大小
if (sizeVal === 'large') {
  document.body.style.fontSize = sizeConfig.large
} else if (sizeVal === 'small') {
  document.body.style.fontSize = sizeConfig.small
} else if (sizeVal === 'mini') {
  document.body.style.fontSize = sizeConfig.small
} else {
  document.body.style.fontSize = sizeConfig.base
}

// 更新store中的尺寸设置
appStore.setCurrentSize(sizeVal as ElementPlusSize)

wsCache.set(CACHE_KEY.FONT_SIZE, sizeVal)
ElMessage.success('设置成功')

}


</script>

<style scoped>
.size-select-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  padding: 0 8px;
}

.size-icon {
  font-size: 18px;
}
</style>