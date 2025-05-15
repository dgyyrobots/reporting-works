<template>
  <div class="neon-card">
    <div v-if="title || $slots.titleRight" class="card-title-bar">
      <div class="card-title-left">
        <span v-if="title" class="card-title">{{ title }}</span>
      </div>
      <div class="card-title-right">
        <slot name="titleRight"></slot>
      </div>
    </div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    <div class="card-content" :style="contentPaddingStyle">
      <div v-if="showEmpty" class="no-data">
        <Icon icon="svg-icon:empty-box" />
        暂无数据
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '/@/components/Icon'
import { computed } from 'vue'

const props = defineProps({
  title: String,
  showEmpty: {
    type: Boolean,
    default: false,
  },
  contentPadding: {
    type: String,
    default: '10px 16px 8px 16px',
  },
})

const contentPaddingStyle = computed(() => {
  return {
    padding: props.contentPadding,
  }
})
</script>

<style lang="scss" scoped>
.neon-card {
  width: 100%;
  height: 100%;
  background: rgba(10, 20, 40, 0.85);
  position: relative;
  box-shadow: 0 0 8px 1px #00cfff88;
  border: 0.5px solid #00cfff;
  box-sizing: border-box;
  overflow: visible;
}

.card-title-bar {
  height: 32px;
  width: 100%;
  background: linear-gradient(90deg, #1ecfff 40%, #1ecfff00 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 3;
  box-shadow: 0 0 8px 0 #1ecfff88;
}

.card-title-left {
  display: flex;
  align-items: center;
}

.card-title-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-content {
  height: calc(100% - 32px); /* 减去标题栏高度 */
  box-sizing: border-box;
}

.card-title {
  color: #eef1f2;
  font-size: 16px;
  letter-spacing: 2px;
  text-shadow: 0 0 6px #1ecfff88;
  line-height: 32px;
}

/* 四角折角 */
.neon-card .corner {
  position: absolute;
  width: 16px;
  height: 16px;
  z-index: 2;
}

.neon-card .corner.top-left {
  top: -4px;
  left: -3px;
  border-top: 2px solid #00eaff;
  border-left: 2px solid #00eaff;
}
.neon-card .corner.top-right {
  top: -2px;
  right: -2px;
  border-top: 3px solid #00eaff;
  border-right: 3px solid #00eaff;
}
.neon-card .corner.bottom-left {
  bottom: -2px;
  left: -2px;
  border-bottom: 3px solid #00eaff;
  border-left: 3px solid #00eaff;
}
.neon-card .corner.bottom-right {
  bottom: -2px;
  right: -2px;
  border-bottom: 3px solid #00eaff;
  border-right: 3px solid #00eaff;
}

.no-data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #999;
  gap: 10px;
}
</style>
