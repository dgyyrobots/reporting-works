<template>
  <div class="neon-card">
    <div v-if="title" class="card-title-bar">
      <span class="card-title">{{ title }}</span>
    </div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
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
  padding-left: 16px;
  z-index: 3;
  box-shadow: 0 0 8px 0 #1ecfff88;
}
.card-content {
  padding: 10px 16px 8px 16px;
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
</style>
