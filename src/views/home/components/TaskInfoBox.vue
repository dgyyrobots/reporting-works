<template>
  <div class="task-info-box">
    <div class="header">任务单信息</div>
    <div class="info-list">
      <div class="row">
        <span class="label">生产工单：</span>
        <span class="value">2311274B</span>
        <span class="highlight">[202312070009]</span>
        <span class="normal">[正常工单]</span>
      </div>
      <div class="row">
        <span class="label">工&nbsp;&nbsp;&nbsp;&nbsp;序：</span>
        <span class="value">模切/模凸</span>
      </div>
      <div class="row">
        <span class="label">产&nbsp;&nbsp;&nbsp;&nbsp;品：</span>
        <span class="value">好猫(招财猫1600)条盒-JY [2001090017]</span>
      </div>
      <div class="row">
        <span class="label">计划时间：</span>
        <span class="value">2023-12-07 23:06:15 —— 2023-12-07 23:06:...</span>
      </div>
      <div class="row">
        <span class="label">实际开始：</span>
        <span class="value">2023-12-07 23:06:15 [计划数量：231400大张]</span>
      </div>
      <div class="row">
        <span class="label">超&nbsp;&nbsp;&nbsp;&nbsp;时：</span>
        <span class="value">0.00 (小时)</span>
      </div>
    </div>
    <div class="progress-row">
      <div class="progress-bar-bg">
        <div class="progress-bar" :style="{ width: '14.08%' }"></div>
      </div>
      <span class="progress-percent">14.08%</span>
    </div>
    <div class="footer">
      <span class="done">
        已完成：
        <span class="done-num">32591</span>
        大张
      </span>
      <span class="remain">
        未完成：
        <span class="remain-num">198809</span>
        大张
      </span>
    </div>
  </div>
</template>

<script setup>
// 这里可以接收props或后续做数据对接
</script>

<style scoped>
.task-info-box {
  width: 100%;
  height: 100%;
  background: rgba(10, 30, 60, 0.85);
  border-radius: 4px;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 10px 16px 8px 16px;
}
.header {
  color: #ffe600;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #1ecfff;
  padding-bottom: 2px;
}
.info-list {
  flex: 1;
  font-size: 14px;
}
.row {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.label {
  color: #b6eaff;
  min-width: 80px;
  display: inline-block;
}
.value {
  color: #fff;
  margin-right: 6px;
}
.highlight {
  color: #ffe600;
  margin: 0 4px;
}
.normal {
  color: #b6eaff;
  margin-left: 4px;
}
.progress-row {
  display: flex;
  align-items: center;
  margin: 6px 0 2px 0;
}
.progress-bar-bg {
  flex: 1;
  height: 6px;
  background: #1ecfff33;
  border-radius: 3px;
  margin-right: 8px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1ecfff 0%, #00eaff 100%);
  border-radius: 3px;
}
.progress-percent {
  color: #1ecfff;
  font-size: 13px;
  min-width: 48px;
  text-align: right;
}
.footer {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-top: 2px;
}
.done {
  color: #1ecfff;
}
.done-num {
  color: #3fd0ff;
  font-weight: bold;
}
.remain {
  color: #ffe600;
}
.remain-num {
  color: #ffe600;
  font-weight: bold;
}
</style>
