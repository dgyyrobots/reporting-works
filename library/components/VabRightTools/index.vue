<template>
  <div class="vab-right-tools">
    <!-- <vab-search v-show="!isHorizontal" class="hidden-xs-only" /> -->
    <!-- <vab-dark v-show="theme.showDark" :style="!isHorizontal ? '' : { marginLeft: 'var(--el-margin)' }" /> -->
    <!-- <vab-color-picker v-show="theme.showColorPicker" /> -->
    <!-- <vab-theme v-show="theme.showTheme && routeName !== 'SeparateLayout'" /> -->
    <!-- <vab-error-log class="hidden-xs-only" /> -->
    <!-- <vab-lock v-show="theme.showLock" /> -->
    <!-- <vab-notice v-show="theme.showNotice" /> -->
    <!-- <vab-language v-show="theme.showLanguage" /> -->
    <!-- <vab-fullscreen v-show="theme.showFullScreen" /> -->
    <!-- <vab-refresh v-show="theme.showRefresh" /> -->
     <!-- 在此处加头部右上角内容 -->
     <!-- <vab-color-picker v-show="theme.showColorPicker" /> -->
     <vab-dark v-show="theme.showDark" />
     <vab-font-size style="marginLeft:16px" />
    <vab-avatar />
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabRightTools',
})

defineProps({
  isHorizontal: {
    type: Boolean,
    default: false,
  },
})
const route = useRoute()
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const routeName = ref<any>(route.name)
watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.vab-right-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
