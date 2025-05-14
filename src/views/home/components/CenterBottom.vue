<template>
  <div class="center-bottom-container">
    <!-- 左侧当板信息 -->
    <div class="left-panel">
      <div class="panel-title">当板信息</div>
      <div class="panel-content">
        <div class="info-row">
          <div class="info-label">流程号：</div>
          <div class="info-value">11</div>
          <div class="action-buttons">
            <button class="query-btn">查询</button>
            <button class="action-btn">
              <Icon icon="svg-icon:close" />
            </button>
          </div>
        </div>

        <div class="info-row">
          <div class="info-label">物理板号：</div>
          <div class="info-value">物理板号</div>
          <div class="icon-placeholder"></div>
          <div class="info-label-right">被识别：</div>
          <div class="info-value">0</div>
          <div class="icon-placeholder"></div>
        </div>

        <div class="info-row">
          <div class="info-label">流程类型：</div>
          <div class="info-value">
            <div class="select-box">
              <span>合格品</span>
              <Icon icon="svg-icon:arrow-down" />
            </div>
          </div>
          <div class="icon-placeholder"></div>
          <div class="info-label-right">制程数：</div>
          <div class="info-value">0</div>
          <div class="icon-placeholder"></div>
        </div>
      </div>

      <div class="timestamp">2023-12-08 13:55:40</div>
    </div>

    <!-- 右侧产量信息 -->
    <div class="right-panel">
      <div class="panel-title">上板\转产量</div>
      <div class="panel-content">
        <div class="right-row">
          <div class="right-label">正常产量：</div>
          <div class="right-value">3118/分钟</div>
        </div>
        <div class="right-row">
          <div class="right-label">剔废数量：</div>
          <div class="right-value">0/分钟</div>
        </div>
        <div class="right-row">
          <div class="right-label">过版数量：</div>
          <div class="right-value">0/分钟</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '/@/components/Icon'
</script>

<style lang="scss" scoped>
.center-bottom-container {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(30, 40, 100, 0.4);

  .left-panel {
    flex: 1;
    position: relative;
    border: 1px solid #1ecfff;
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
    margin-right: 10px;
  }

  .right-panel {
    width: 200px;
    border: 1px solid #1ecfff;
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
  }

  .panel-title {
    height: 32px;
    width: 100%;
    // background: linear-gradient(90deg, #1ecfff 40%, #1ecfff00 100%);
    display: flex;
    align-items: center;
    padding-left: 16px;
    color: #eef1f2;
    font-size: 16px;
    letter-spacing: 2px;
    text-shadow: 0 0 6px #1ecfff88;
    line-height: 32px;
    // box-shadow: 0 0 8px 0 #1ecfff88;
  }

  .panel-content {
    padding: 16px 10px 10px 16px;
  }

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 32px;
  }

  .info-label,
  .info-label-right {
    color: #1ecfff;
    font-size: 14px;
    white-space: nowrap;
  }

  .info-label-right {
    margin-left: auto;
    margin-right: 10px;
  }

  .info-value {
    color: #fff;
    font-size: 14px;
    margin-right: 20px;
  }

  .action-buttons {
    margin-left: auto;
    display: flex;
    gap: 10px;
  }

  .query-btn {
    background-color: #1ecfff;
    color: #fff;
    border: none;
    padding: 4px 15px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #19b8e6;
    }
  }

  .action-btn {
    background-color: transparent;
    border: 1px solid #1ecfff;
    color: #1ecfff;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;

    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }

  .select-box {
    display: flex;
    align-items: center;
    background-color: rgba(30, 207, 255, 0.1);
    border: 1px solid #1ecfff;
    padding: 4px 10px;
    border-radius: 2px;
    min-width: 120px;
    justify-content: space-between;

    span {
      color: #fff;
    }
  }

  .icon-placeholder {
    width: 30px;
    height: 30px;
  }

  .timestamp {
    position: absolute;
    top: 8px;
    right: 20px;
    color: #ffff00;
    font-size: 14px;
  }

  .right-row {
    display: flex;
    margin-bottom: 20px;
  }

  .right-label {
    color: #1ecfff;
    font-size: 14px;
    white-space: nowrap;
  }

  .right-value {
    color: #fff;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
