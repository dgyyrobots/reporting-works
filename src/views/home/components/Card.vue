<template>
  <div class="neon-card">
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
    <slot />
  </div>
</template>

<style scoped>
.neon-card {
  width: 100%;
  height: 100%;
  background: rgba(10, 20, 40, 0.85);
  position: relative;
  box-shadow: 0 0 8px 1px #00cfff88;
  border: 0.5px solid #00cfff;
  padding: 16px;
  box-sizing: border-box;
  overflow: visible;
}

/* 四角折角 */
.neon-card .corner {
  position: absolute;
  width: 16px;
  height: 16px;
  z-index: 2;
}

.neon-card .corner.top-left {
  top: -2px;
  left: -2px;
  border-top: 3px solid #00eaff;
  border-left: 3px solid #00eaff;
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
