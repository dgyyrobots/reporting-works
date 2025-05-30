<template>
  <div class="center-bottom-container">
    <!-- 左侧当板信息 -->
    <div class="top-action-btns">
      <button class="cyber-btn" @click="handAdd">
        <Icon class="btn-icon" icon="svg-icon:add" :style="{ color: '#1ecfff' }" />
        添加版
      </button>
      <button class="cyber-btn" @click="handCollectionFinish">
        <Icon class="btn-icon" icon="svg-icon:end" />
        结束采集
      </button>
      <button class="cyber-btn"  @click="handleChangeVersion">
        <Icon class="btn-icon" icon="svg-icon:change"/>
        切版
      </button>
      <button class="cyber-btn" >
        <Icon class="btn-icon" icon="svg-icon:huibao"/>
        完工汇报
      </button>
      <button class="cyber-btn" >
        <Icon class="btn-icon" icon="svg-icon:huibao"/>
        汇报
      </button>
      <!-- <button class="cyber-btn">
        <Icon class="btn-icon" icon="svg-icon:tagprint" />
        标签打印
      </button> -->
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
        <div class="panel-title">当版信息</div>
        <div class="panel-content">
          <div class="info-row">
            <div class="info-label">版号：</div>
            <div class="info-value flow-no">
              <input 
                ref="scannerInput" 
                v-model="scanData" 
                placeholder="请扫码或输入"  
                class="transparent-input"
              />
            </div>
            <div class="action-buttons">
              <button class="query-btn">查询</button>
              <button class="sumbmit-btn">提交</button>
            </div>
          </div>
          <div class="info-row">
            <div class="info-label">采集数：</div>
            <div class="info-value flow-no">采集数</div>
            <div class="icon-placeholder"></div>
            <div class="info-label-right">废品数：</div>
            <div class="info-value">0</div>
            <div class="icon-placeholder"></div>
          </div>

          <div class="info-row">
            <div class="info-label">过版纸数：</div>
            <div class="info-value flow-no">
              <span>合格品</span>
            </div>
            <div class="icon-placeholder"></div>
            <div class="info-label-right">合格品数：</div>
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
        <div class="panel-title">上版生产情况</div>
        <div class="panel-content">
          <div class="right-row">
            <div class="right-label">采集数：</div>
            <div class="right-value">3118</div>
          </div>
          <div class="right-row">
            <div class="right-label">合格品数：</div>
            <div class="right-value">0/分钟</div>
          </div>
          <div class="right-row">
            <div class="right-label">生产用时：</div>
            <div class="right-value">0.5H</div>
          </div>
        </div>
      </div>
    </div>
       <!-- 添加版弹框 -->
       <el-dialog
        v-model="chooseSelectNumVis"
        title="输入采集数量"
        width="400px"
        :close-on-click-modal="false"
        :show-close="true"
        :append-to-body="true"
        :destroy-on-close="true"
        custom-class="add-version-dialog"
        :modal-class="'cyber-modal'"
   
    >
      <ChooseSelectNum @close="chooseSelectNumVis = false"  />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Icon } from '/@/components/Icon'
import { updateIsStart, changeActiveRow,collectionFinish} from '@/api/mes/wk/index.ts'
import ChooseSelectNum from '../dialog/chooseSelectNum.vue'
import { ElMessageBox ,ElMessage} from 'element-plus'

import { useWorkStore } from '@/store/modules/work' // 导入store


const props = defineProps({

currentDevice: {
  type: Object,
  default: () => ({})
},
})

const workStore = useWorkStore() // 使用store
const scanData = ref(null)
const scannerInput= ref(null)
const chooseSelectNumVis = ref(false)







const handAdd = () => {
  chooseSelectNumVis.value = true
}


const handleKeyDown = (e) => {
  const keyCode = e.keyCode

  if (keyCode === 13) {
    if (!e.target.value) return
    scanData.value = e.target.value
  }
}
const handleChangeVersion = () => {
  ElMessageBox.confirm(
    '确认要切换版吗？',
    '切版确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'cyber-confirm-box'
    }
  ).then(() => {
    // 调用切版接口
    changeActiveRow({
      device_id: props.currentDevice.id
    }).then(res => {
      console.log(res, '切版')
      if (res.ret ===0 ) {
        ElMessage.success('操作成功!')
        // 刷新版号列表
        workStore.updateLicenseFleshIndex()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {
    // 用户取消操作，不做任何处理
  })
}

const handCollectionFinish = () => {
  const arr = []
  const row =  workStore.selectedLicenseCheck

  if(!row.length) return ElMessage.error('请选择一行数据')
  row.map(item=>{
    arr.push(item.id)
  })
  collectionFinish({ids:arr}).then(res => {
    console.log(res, '结束采集')
    if (res.ret === 0 ) {
      ElMessage.success('操作成功!')
      // 刷新版号列表
      workStore.updateLicenseFleshIndex()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 组件挂载时添加全局点击事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

const remove_keydownlistener = () => {
  window.removeEventListener('keydown', handleKeyDown, false)
}
// 组件卸载时移除全局点击事件监听
onUnmounted(() => {
  remove_keydownlistener()
})
</script>

<style lang="scss" scoped>
.center-bottom-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 20, 40, 0.7);
  .transparent-input {
    background-color: transparent;
    border: none;
    outline: none;
    color: #fff;
    width: 100%;
    font-size: 14px;
    padding: 0;
    margin: 0;
    height: 22px;
  }
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
    flex: 1;
    height: calc(100% - 48px); /* 稍微减少一点高度确保边框可见 */
    margin-bottom: 2px; /* 添加底部margin */
  }

  .left-panel {
    flex: 1;
    position: relative;
    border: 1px solid #1ecfff;
    box-shadow: 0 0 5px rgba(30, 207, 255, 0.3);
    margin-right: 10px;
    display: flex;
    flex-direction: column;
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
    border-bottom: 1px solid rgba(30, 207, 255, 0.4);
    padding-bottom: 2px;
    min-width: 80px;
    min-height: 22px;
    display: flex;
    align-items: flex-end;
  }

  .flow-no {
    flex: 1;
    margin-right: 10px;
  }

  .action-buttons {
    margin-left: auto;
    display: flex;
    gap: 10px;
  }

  .query-btn {
    background-color: #19b8e6;
    color: #fff;
    border: none;
    padding: 4px 15px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: rgba(25, 184, 230,.7);
    }
  }
  .sumbmit-btn {
    height: 28px;
    background: linear-gradient(180deg, #1573ce 0%, #0a2a50 100%);
    border: 1px solid #219efc;
    border-radius: 4px;
    color: #fff;
    padding: 0 12px;
    cursor: pointer;
    &:hover {
      background: linear-gradient(180deg, #1e85e2 0%, #0c315e 100%);
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
