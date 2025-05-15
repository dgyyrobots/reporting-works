<template>
  <div class="center-bottom-container">
    <!-- 左侧当板信息 -->
    <div class="top-action-btns">
      <button class="cyber-btn">
        <Icon class="btn-icon" icon="svg-icon:testdetail" :style="{ color: '#1ecfff' }" />
        任务明细
      </button>
      <button class="cyber-btn">
        <Icon class="btn-icon" icon="svg-icon:tablesearch" />
        报表查询
      </button>
    </div>
    <div class="panel-container">
      <div class="left-panel">
        <div class="cyber-divider divider1">
          <svg height="8" viewBox="0 0 148 8" width="148">
            <!-- 左4个短条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="0" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="9" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="18" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="27" y="2" />
            <!-- 中间长条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="40" x="36" y="2" />
            <!-- 右3个短条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="82" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="91" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="100" y="2" />
            <defs>
              <filter id="glow" height="24" width="40" x="-10" y="-10">
                <feGaussianBlur result="coloredBlur" stdDeviation="2" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
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
        <div class="cyber-divider divider2">
          <svg height="8" viewBox="0 0 148 8" width="148">
            <!-- 左4个短条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="0" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="9" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="18" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="27" y="2" />
            <!-- 中间长条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="40" x="36" y="2" />
            <!-- 右3个短条 -->
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="82" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="91" y="2" />
            <rect fill="#1ecfff" filter="url(#glow)" height="2" rx="2" width="6" x="100" y="2" />
            <defs>
              <filter id="glow" height="24" width="40" x="-10" y="-10">
                <feGaussianBlur result="coloredBlur" stdDeviation="2" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
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
  </div>
</template>

<script setup>
import { Icon } from '/@/components/Icon'
</script>

<style lang="scss" scoped>
.center-bottom-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .top-action-btns {
    width: 100%;
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
    justify-content: flex-start;
  }

  .panel-container {
    display: flex;
    flex-direction: row;
  }

  .left-panel {
    flex: 1;
    position: relative;
    border: 1px solid #1ecfff;
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
    margin-right: 10px;
    .divider1 {
      position: absolute;
      top: -10px;
      left: -12px;
    }
  }

  .right-panel {
    width: 200px;
    border: 1px solid #1ecfff;
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
    position: relative;
    .divider2 {
      position: absolute;
      top: -10px;
      left: -12px;
    }
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

.cyber-divider {
  display: flex;
  justify-content: flex-start;
  margin: 0 0 8px 16px;
  pointer-events: none;
  user-select: none;
}

.cyber-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 30, 60, 0.18);
  border: 1.2px solid #1ecfff;
  color: #eef1f2;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  padding: 0 16px 0 14px;
  height: 32px;
  min-width: 90px;
  cursor: pointer;
  box-shadow: 0 0 6px 0 #1ecfff55;
  transition:
    border-color 0.2s,
    color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;
  justify-content: flex-start;
}

.cyber-btn:hover {
  border-color: #4fdfff;
  color: #fff;
  box-shadow: 0 0 10px 2px #1ecfff99;
  background: rgba(30, 207, 255, 0.1);
}

.btn-icon {
  font-size: 16px;
  margin-right: 4px;
  color: #1ecfff;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
