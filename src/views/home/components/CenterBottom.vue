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
      <button class="cyber-btn"  @click="handleCompleteReport">
        <Icon class="btn-icon" icon="svg-icon:huibao"/>
        完工汇报
      </button>
      <button class="cyber-btn" @click="handleReport">
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
        <div class="panel-title">版信息查询</div>
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
              <button class="query-btn" @click="handleQuery">查询</button>
              <button class="sumbmit-btn" @click="handSubmit">提交</button>
            </div>
          </div>
          <div class="info-row">
            <div class="info-label">采集数：</div>
            <div class="info-value fixed-width">{{ toInteger(currentVersionInfo.collection_qty) }}</div>
            <div class="icon-placeholder"></div>
            <div class="info-label-right">废品数：</div>
            <div class="info-value fixed-width">{{ toInteger(currentVersionInfo.no_okqty)  }}</div>
            <div class="icon-placeholder"></div>
          </div>

          <div class="info-row">
            <div class="info-label">过版纸数：</div>
            <div class="info-value fixed-width">
              <span>{{ toInteger(currentVersionInfo.pass_qty)  }}</span>
            </div>
            <div class="icon-placeholder"></div>
            <div class="info-label-right">合格品数：</div>
            <div class="info-value fixed-width">{{ toInteger(currentVersionInfo.ok_qty) }}</div>
            <div class="icon-placeholder"></div>
          </div>
        </div>

        <div class="timestamp">
          {{  formatDate(currentVersionInfo.collect_date)  }}
        </div>
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
            <div class="right-value">{{ toInteger(previousVersionInfo?.collection_qty) || 0 }}</div>
          </div>
          <div class="right-row">
            <div class="right-label">合格品数：</div>
            <div class="right-value">{{ toInteger(previousVersionInfo?.ok_qty) || 0 }}</div>
          </div>
          <div class="right-row">
            <div class="right-label">生产用时：</div>
            <div class="right-value">{{ formatDuration(previousVersionInfo?.collect_time) || '0H' }}</div>
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
      <ChooseSelectNum @close="chooseSelectNumVis = false" :currentDevice="currentDevice" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Icon } from '/@/components/Icon'
import { updateIsStart, changeActiveRow,collectionFinish , reportVersion,finishReportVersion,addVersionByCode  } from '@/api/mes/wk/index.ts'
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
// 当前版号信息
const currentVersionInfo = reactive({})


const previousVersionInfo = computed(() => {
  const sortedVersions = workStore.licenseCheckSortByCollectDate
  // 检查数组长度是否大于1，如果是则返回index为1的项，否则返回空对象
  return sortedVersions && sortedVersions.length > 1 ? sortedVersions[1] : {}
})
// 格式化时长显示
const formatDuration = (seconds) => {
  if (!seconds) return '0H'
  
  // 将秒数转换为小时，保留一位小数
  const hours = (parseInt(seconds) / 3600).toFixed(1)
  return `${hours}H`
}
// 查询按钮点击事件
const handleQuery = () => {
  if (!scanData.value) {
    return ElMessage.error('请输入版号')
  }
  
  const licenseCheck = workStore.licenseCheck

  
  // 查找匹配的版号
  const matchedVersion = licenseCheck.find(item => item.version_no === scanData.value)
  
  if (matchedVersion) {
    // 找到匹配的版号，更新显示信息
    Object.assign(currentVersionInfo, matchedVersion)

    console.log(currentVersionInfo, 'currentVersionInfo')
    
    ElMessage.success('查询成功')
  } else {
    ElMessage.warning('未找到匹配的版号信息')
  }
}

const handSubmit = () => {
  if (!scanData.value) return ElMessage.error('版号不能为空')
  const taskInfo = workStore.taskInfo
  addVersionByCode({
    device: props.currentDevice,
    version_no: scanData.value,
    jobbill_id: taskInfo.id,
    is_device_collect: 1
  }).then(res => {
    if (res.ret === 0) {
      ElMessage.success('添加版成功!')
      // 刷新版号列表
      workStore.updateLicenseFleshIndex()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const handleReport = () => {
  const selectedLicenseCheck = workStore.selectedLicenseCheck
  const taskInfo = workStore.taskInfo
  
  if (!selectedLicenseCheck.length) {
    return ElMessage.error('请至少选择一行汇报')
  }

  
  if (!taskInfo.id) {
    return ElMessage.error('未找到当前设备的工单信息')
  }
  
  ElMessageBox.confirm(
    '确认要汇报选中的版号吗？',
    '汇报确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'cyber-confirm-box'
    }
  ).then(() => {
    // 调用汇报接口
    const params = {
      data: selectedLicenseCheck, // 获取选中版号的ID数组
      jobbill_id: taskInfo.id
    }
    
    reportVersion(params).then(res => {
      if (res.ret === 0) {
        ElMessage.success('汇报成功!')
        // 刷新版号列表
        workStore.updateLicenseFleshIndex()
      } else {
        ElMessage.error(res.msg || '汇报失败')
      }
    }).catch(error => {
      console.error('汇报失败:', error)
      ElMessage.error('汇报失败: ' + (error.message || '未知错误'))
    })
  }).catch(() => {
    // 用户取消操作，不做任何处理
  })
}
// 添加完工汇报处理函数
const handleCompleteReport = () => {
  const selectedLicenseCheck = workStore.selectedLicenseCheck
  const taskInfo = workStore.taskInfo
  
  if (!selectedLicenseCheck.length) {
    return ElMessage.error('请至少选择一行汇报')
  }

  
  if (!taskInfo.id) {
    return ElMessage.error('未找到当前设备的工单信息')
  }
  ElMessageBox.confirm(
    '是否确认完工汇报？',
    '完工汇报确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'cyber-confirm-box'
    }
  ).then(() => {
    // 调用汇报接口
    const params = {
      data: selectedLicenseCheck, // 获取选中版号的ID数组
      jobbill_id: taskInfo.id
    }
    
    finishReportVersion(params).then(res => {
      if (res.ret === 0) {
        ElMessage.success('完工汇报成功!')
        // 刷新版号列表
        workStore.updateLicenseFleshIndex()
      } else {
        ElMessage.error(res.msg || '完工汇报失败')
      }
    }).catch(error => {
      ElMessage.error('汇报失败: ' + (error.message || '未知错误'))
    })
  }).catch(() => {
    // 用户取消操作，不做任何处理
  })
}


const handAdd = () => {
  chooseSelectNumVis.value = true
}
// 将字符串或数字转换为整数
const toInteger = (value) => {
  if (value === null || value === undefined) return ''

  // 如果是字符串，先尝试转换为数字
  if (typeof value === 'string') {
    // 移除非数字字符（保留负号）
    const numStr = value.replace(/[^\d.-]/g, '')
    value = parseFloat(numStr)
  }

  // 如果转换后不是有效数字，返回0
  if (isNaN(value)) return 0

  // 返回整数部分
  return Math.floor(value)
}
// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '--'

  try {
    const date = new Date(parseInt(timestamp) * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('日期格式化错误:', error)
    return timestamp
  }
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
  /* 添加固定宽度的样式 */
  .fixed-width {
    width: 120px; /* 设置固定宽度 */
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
