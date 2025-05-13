<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable linebreak-style -->
<template>
  <div class="contnt" style="padding-bottom: 120px;">
    <ContentWrap class="left" v-loading="dataListLoading">
      <div class="tab-nav">
        <div 
          v-for="(item, index) in tabItems" 
          :key="index"
          :class="['tab-item', flag == item.value ? 'active' : '']"
          @click="activeChange(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="task-list-container" v-if="dataList.length">
        <el-row :gutter="16">
          <el-col 
            :span="6"
            v-for="item in dataList" 
            :key="item.id"
            @click="getDetail(item.id)"
          >
            <vab-colorful-card 
              class="task-card"
              :class="{ 'is-selected': item.id == detailId }"
              :body-style="cardStyle" 
              :style="item.id == detailId ? style1 : style2"
            >
              <div class="task-card__header">
                <div :class="['status-line', item.status === 'FINISHED' ? 'is-finished' : '']"></div>
                <div class="material-info">
                <div class="label">产出物料</div>
                <div class="value">{{ item.itemName }}</div>
                <div class="value code">{{ item.itemCode }}</div>
              </div>
              </div>
              
              <el-progress 
                :percentage="Math.round((item.quantityProduced / item.quantity) * 100)"
                :status="item.status === 'FINISHED' ? 'success' : 'primary'"
                class="task-progress"
              />
              
              <div class="task-info">
                <div class="info-item">
                  <span class="label">任务状态</span>
                  <el-tag size="small" :type="item.status === 'FINISHED' ? 'success' : 'primary'">
                    {{ item.status === 'FINISHED' ? '已完成' : '已领取' }}
                  </el-tag>
                </div>
                <div class="info-item">
                  <span class="label">任务进度</span>
                  <el-tag size="small">{{ getDictLabel('mes_pro_task_status', item.status) }}</el-tag>
                </div>
                <div class="info-item">
                  <span class="label">生产进度</span>
                  <span class="value highlight">{{ item.quantityProduced }}/{{ item.quantity }}</span>
                </div>
                <div class="info-item">
                  <span class="label">工单编号</span>
                  <span class="value">{{ item.workorderCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">需求日期</span>
                  <span class="value">{{ formatDate(item.requestDate) }}</span>
                </div>
              </div>
            </vab-colorful-card>
          </el-col>
        </el-row>
     </div>
      <!-- <div class="ec" v-for="item in dataList" :key="item.id" @click="getDetail(item.id)">
        <div>产出物料：<text>{{ item.itemName }}-{{ item.itemCode }}</text></div>
        <div>
          <div>
            <div class="loader"></div>
            <text>进行中{{ item.quantityProduced / item.quantity }}%</text>
          </div>
          <div>
            <div>任务状态：已领取</div>
            <div>任务进度：{{ getDictLabel('mes_pro_task_status', item.status) }}</div>
            <div>生产进度：{{ item.quantityProduced }}/{{ item.quantity }}</div>
            <div>生产工单编号：{{ item.workorderCode }}</div>
            <div>需求日期：{{ formatDate(item.requestDate) }}</div>
          </div>
        </div>
      </div> -->
      <el-empty v-if="!dataList.length" class="vab-data-empty" description="暂无数据" />
      <!-- <div class="ec v8189a8">        <div>产出物料：<text>钢丝10cm</text></div>
        <div>
          <div>
            <div class="loader"></div>
              <text>进行中80%</text>
          </div>
          <div>
            <div>任务进度：未完成<text style="font-size: 20px;">13</text>个，共<text style="font-size: 20px;">25</text>个</div>
            <div>生产进度：1000/5225</div>
            <div>订单号：xs202025311522</div>
            <div>订单发货日期：2020-60-20</div>
          </div>
        </div></div> -->
    </ContentWrap>
    <div class="right">
      <el-tabs v-model="tabs" type="border-card">
        <el-tab-pane label="任务详情" name="任务详情">
          <detail :form-data="formData" />
        </el-tab-pane>
        <el-tab-pane label="BOM明细" name="BOM明细">
          <bom :item-id="formData.itemId" />
        </el-tab-pane>
        <el-tab-pane label="SOP" name="SOP">
          <MdProductSopList :item-id="formData.itemId" />
        </el-tab-pane>
        <el-tab-pane label="SIP" name="SIP" style="height: max-content;"> <el-empty description="暂无数据" /></el-tab-pane>
        <el-tab-pane label="领料明细" name="领料明细">
          <IssueLineList :taskCode="formData.taskCode" />
        </el-tab-pane>
        <el-tab-pane label="投料明细" name="投料明细"><el-empty description="暂无数据" /></el-tab-pane>
        <el-tab-pane label="产出明细" name="产出明细">
          <ProductProduceLineList :taskCode="formData.taskCode" />
        </el-tab-pane>
        <el-tab-pane label="检验明细" name="检验明细">
          <LineList :taskCode="formData.taskCode" />
        </el-tab-pane>
        <el-tab-pane label="报工明细" name="报工明细">
          <FeedbackList :taskCode="formData.taskCode" />
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="操作日志"><el-empty description="暂无数据" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>

  <action-buttons 
      :status="formData?.status"
      @action="but"
    />
  <Dialog v-if="bg.open" v-model="bg.open" width="90%" title="生产报工">
    <el-form ref="form" :model="bg.form" :rules="rules">
      <el-form-item prop="quantityFeedback" label="报工总数量">
        <el-input-number v-model="bg.form.quantityFeedback" :max="formData.quantity - formData.quantityProduced" :min="1" />
      </el-form-item>
      <el-form-item prop="nickName" label="报工人">
        <el-input v-model="bg.form.nickName" placeholder="请输入报工人姓名" disabled />
      </el-form-item>
      <!-- <el-form-item prop="reportFee" label="报工价格">
        <el-input v-model="bg.form.reportFee" placeholder="请输入报工价格" />
      </el-form-item> -->
      <el-form-item prop="quantityQualify" label="合格品数量">
        <el-input-number v-model="bg.form.quantityQualify"
          :max="bg.form.quantityFeedback - bg.form.quantityUnqualify" :min="0" />
      </el-form-item>
      <el-form-item prop="quantityUnqualify" label="不良品数量">
        <el-input-number v-model="bg.form.quantityUnqualify"
          :max="bg.form.quantityFeedback - bg.form.quantityQualify" :min="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div>
        <el-button type="primary" @click="submitForm">提交 </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </Dialog>
  <ProductProduceLineForm ref="formRef" @success="getDetail(detailId.value)" />
  <IpqcForm ref="formRefs" @success="getDetail" />
</template>
<!-- eslint-disable linebreak-style -->
<!-- eslint-disable prettier/prettier -->
<script lang="ts" setup>
import ProductProduceLineList from './list/ProductProduceLineList.vue'
import LineList from './list/LineList.vue'
import detail from './list/detail.vue'
import FeedbackList from './list/FeedbackList.vue'
import IssueLineList from './list/IssueLineList.vue'
import MdProductSopList from './list/MdProductSopList.vue'
import IpqcForm from './ipqc/IpqcForm.vue'
import bom from './list/bom.vue'
import { Search } from '@element-plus/icons-vue'
import * as ProductionApi from '/@/api/production/index'
import { DICT_TYPE, getDictLabel, getDictObj, getStrDictOptions } from '/@/utils/dict'
import { formatDate } from '/@/utils/formatTime'
import ProductProduceLineForm from './list/ProductProduceLineForm.vue'
import ActionButtons from './components/ActionButtons.vue'
// 模拟数据
const formData = ref({
  id: undefined,
  taskCode: undefined,
  taskName: undefined,
  workorderId: undefined,
  workorderCode: undefined,
  workorderName: undefined,
  workstationId: undefined,
  workstationCode: undefined,
  workstationName: undefined,
  processId: undefined,
  processCode: undefined,
  processName: undefined,
  itemId: undefined,
  itemCode: undefined,
  itemName: undefined,
  specification: undefined,
  unitOfMeasure: undefined,
  quantity: 1,
  quantityProduced: undefined,
  quantityQuanlify: undefined,
  quantityUnquanlify: undefined,
  quantityChanged: undefined,
  clientId: undefined,
  clientCode: undefined,
  clientName: undefined,
  clientNick: undefined,
  startTime: undefined,
  duration: 1,
  endTime: undefined,
  colorCode: undefined,
  requestDate: undefined,
  status: undefined,
  remark: undefined
})
// 左边生产任务
const dataList: any = ref([])
const total = ref(0)
const Ntotal = ref(0)
const flag = ref(1)


const tabItems = [
  { label: `待领取0个`, value: 3 },
  { label: `未完工${Ntotal.value}个`, value: 0 },
  { label: `已完工${total.value - Ntotal.value}个`, value: 2 },
  { label: `全部${total.value}个`, value: 1 }
]
onMounted(async () => {
  getList()
})
const dataListLoading = ref(false)
// 标签页配置

const cardStyle = {
  height: '100%',
  padding: '16px',
}
// 获取列表
const getList = async () => {
  dataListLoading.value = true
  try {
    let data = await ProductionApi.getTaskPage({ pageSize: 100 })
    total.value = data.total
    let count = 0;
    let arr = []
    let arr2 = []
    for (const item of data.list) {
      if (item.status !== 'FINISHED') {
        arr.push(item)
        count++;
      } else {
        arr2.push(item)
      }
    }
    Ntotal.value = count
    if (flag.value == 0) {
      dataList.value = arr
    } else if (flag.value == 1) {
      dataList.value = data.list
    } else if (flag.value == 2) {
      dataList.value = arr2
    } else {
      dataList.value = []
    }
  } finally {
    dataListLoading.value = false
  }
}
// 列表内容切换
const activeChange = (v: any) => {
  flag.value = v
  getList()
}
// 获取详情内容
const detailLoading = ref(false)
const detailId = ref()
const getDetail = async (v: any) => {
  detailId.value = v
  detailLoading.value = true
  try {
    let data = await ProductionApi.getTask(v)
    // // 强刷数据
    // formData.value = {}
    // await nextTick(() => { })
    formData.value = data
  } finally {
    detailLoading.value = false
  }

}
import { translate } from '/@/i18n'
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()
const { username } = storeToRefs(userStore)
const message = useMessage() // 国际化
// 报工数据--------------------------------------
const form = ref()
const bg = reactive({
  open: false,
  form: {
    quantityUnqualify: 0,
    quantityQualify: 1,
    reportFee: undefined,
    nickName: username,
    quantityFeedback: 1
  },
  row: undefined
})
/** 表单重置 */
const reset = () => {
  bg.form = {
    quantityUnqualify: 0,
    quantityQualify: 1,
    reportFee: undefined,
    nickName: username,
    quantityFeedback: 1
  }
  form.value?.resetFields()
}
/** 取消按钮 */
const cancel = () => {
  bg.open = false
  reset()
}

/** 提交按钮 */
const submitForm = async () => {
  bg.form.feedbackType = 'SELF'
  if (bg.form.reportFee) bg.form.reportFee = bg.form.reportFee * 1
  delete bg.row.id
  await ProductionApi.createFeedback(Object.assign(bg.form, bg.row))
  bg.open = false
  message.success('上报成功')
  getList()
  getDetail(detailId.value)
}

const tabs = ref('任务详情')

const formRef = ref()

// 下面操作按钮逻辑----------------------------------------
const formRefs = ref()
const but = async (v: any) => {
  if (!detailId.value || !formData.value) return message.error('请先选择一个任务');
  if (v == 1) {
    if (formData.value.status != 'NORMAL') return message.error('当前状态不可开工')
    // 开工逻辑
    await message.confirm('确认开工？')
    await ProductionApi.updateTask({ id: detailId.value, status: 'STARTED' })
    message.success('开工成功')
    getList()
    getDetail(detailId.value)
  }
  if (v == 2) {
    if (formData.value.status == 'STARTED' || formData.value.status == 'FINISHED') {
      //报工逻辑
      bg.row = formData.value
      reset()
      bg.open = true
    } else {
      return message.error('当前状态不可报工')
    }
  }
  if (v == 3) {
    if (formData.value.status != 'STARTED') return message.error('当前状态不可完工')
    await message.confirm('确认完工？')
    await ProductionApi.updateTask({ id: detailId.value, status: 'FINISHED' })
    message.success('完工成功')
    getList()
    getDetail(detailId.value)
  }
  if (v == 4) {
    await message.confirm(`确认领取${formData.value.taskName}？`)
  }
  if (v == 5) {
    tabs.value = 'BOM明细'
  }
  if (v == 6) {
    if (formData.value.status != 'STARTED') return message.error('当前状态不可产出')
    let data = await ProductionApi.getProductProducePage({ taskCode: formData.value.taskCode })
    if (data.list && data.list.length) {
      formRef.value.open('create', null, data.list[0].id)
    } else {
      message.error('没有对应的产出记录无法新增产出明细')
    }
  }
  if (v == 7) {
    /** 添加/修改操作 */
    if (formData.value.status != 'STARTED') return message.error('当前状态不可新增过程检验')
    formRefs.value.open('create', null, formData.value)
  }
}
const colorFrom2 = ref<string>('var(--el-color-primary-light-9)')
const colorTo2 = ref<string>('var(--el-color-white)')
const colorFrom1 = ref<string>('rgba(240,2,20,0.098)')
const colorTo1 = ref<string>('var(--el-color-white)')
const style2 = {
  background: `linear-gradient(to right,${colorFrom2.value}, ${colorTo2.value}) no-repeat`,
  border: 0,

}
const style1 = {
  background: `linear-gradient(to right,${colorFrom1.value}, ${colorTo1.value}) no-repeat`,
  border: 0,

}
</script>
<!-- eslint-disable linebreak-style -->
<!-- eslint-disable prettier/prettier -->
<style lang="scss" scoped>

.task-list-container {
  padding:0 12px 12px 12px;
  height: 36vh;
  overflow-y: auto;
  
  .el-row {
    margin: -6px; 
  }
  
  .el-col {
    padding: 6px;
  }
}

.task-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0;
  // height: 240px;

  

  &.is-selected {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &__header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    
    .status-line {
      width: 4px;
      height: 32px;
      background: var(--el-color-primary);
      border-radius: 2px;
      margin-right: 12px;
      
      &.is-finished {
        background: var(--el-color-success);
      }
    }
    
    .material-info {
  flex: 1;
  width: 100%;
  overflow: hidden;
  
  .label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
  }
  .value {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    
    &.code {
      font-size: 14px;
      font-weight: normal;
      margin-top: 2px;
    }
  }
}
  }
  
  .task-progress {
    margin:0px 0px 8px 0;
  }
  
  .task-info {
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 6px; // 减小项目间距
    
    .label {
      min-width: 70px; // 固定标签宽度
      width: auto;     // 允许自适应
      color: var(--el-text-color-secondary);
      font-size: 14px;
      margin-right: 8px; // 添加右侧间距
    }
    
    .value {
      flex: 1;
      color: var(--el-text-color-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
      &.highlight {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }
  }
}
}

// 适配平板
@media screen and (max-width: 820px) {
  .task-list-container {
    padding:12px;
    
    .el-col {
      width: 100%;
    }
  }
  
  .task-card {
    // height: 290px;
    
    &__header {
      .material-info {
        .value {
          font-size: 14px;
        }
      }
    }
    
    .task-info {
      .info-item {
        margin-bottom: 6px;
        
        .label {
          width: 70px;
          font-size: 13px;
        }
        
        .value {
          font-size: 13px;
        }
      }
    }
  }
}


.contnt {
  display: flex;
  flex-direction: column;

  .left {
    max-height: calc(100vh);
    overflow-y: scroll;
    // width: 500px;
    min-width: 500px;
    margin-right: 20px;

    * {
      color: var(--el-text-color-regular);
    }

  .tab-nav {
  display: flex;
  justify-content: center;
  margin-bottom: var(--el-margin);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 20px;
  
  .tab-item {
    position: relative;
    cursor: pointer;
    padding: 12px 24px;
    font-weight: 500;
    font-size: 15px;
    color: var(--el-text-color-regular);
    transition: all 0.3s;
    
    &:hover {
      color: var(--el-color-primary);
    }
    
    &.active {
      color: var(--el-color-primary);
      
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 20%;
        width: 60%;
        height: 2px;
        background-color: var(--el-color-primary);
        border-radius: 2px;
        transition: all 0.3s;
      }
    }
  }
}

    .ec {
      cursor: pointer;
      width: 100%;
      height: 190px;
      background-color: #5d6584;
      margin-top: 30px;
      padding: 30px;
      box-sizing: border-box;

      >div {
        color: #fff;
      }

      >div:nth-child(2) {
        display: flex;
        margin-top: 10px;

        >div:first-child {
          margin-right: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;

          >text {
            margin-top: 10px;
          }

          .loader {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 10px solid #f3f3f3;
            border-top: 10px solid #3498db;
            animation: spin 2s linear infinite;
            margin-top: 10px;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }

        }

        >div:last-child {
          >div {
            margin: 8px;
          }
        }
      }
    }
  }

  .right {
    flex: 1;

    .title {
      font-size: 20px;
    }

    .border {
      width: 100%;
      height: 1px;
      background-color: #f4f4f4;
      margin: 30px 0;
    }

    .bottom {
      display: flex;
      justify-content: space-between;

      >div {
        flex: 1;
        height: 300px;
      }

      >div:nth-child(2) {
        margin: 0 100px;
        background-color: #101731;
        padding: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #fff;

        text {
          font-size: 20px;
        }
      }

      >div:nth-child(1) {
        background-color: #1e2f71;
      }

      >div:nth-child(3) {
        background-color: #101731;
        margin: 0 100px;
        padding: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #fff;

        text {
          font-size: 20px;
        }
      }

      >div:first-child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px;
        box-sizing: border-box;

        >div {
          // height: 40%;
          width: 100%;
          background-color: #01104a;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          color: #fff;
          flex-direction: column;
          padding: 20px;

          >div:nth-child(2) {
            background-color: #10327a;
            border: 3px solid #3388de;
            border-radius: 5px;
            padding: 10px;
            margin: 10px 0;
          }
        }
      }
    }
  }
}

.v8189a8 {
  background-color: #8189a8;
}


.pending-count {
  --el-badge-size: 16px;
  margin-left: 3px;
}

:deep() {
  sup {
    top: -1px;
  }

  .el-tag {
    margin-right: 5px;
  }
  .vab-data-empty {
    min-height: 220px !important;
  }

  .el-card__body {
    padding-bottom: 0;
  }

  .parting-line {
    float: left;
    width: 10px;
    height: calc(100% - 40px);
    margin-top: 15px;
    margin-right: 20px;
    border-radius: 10px;

    &-danger {
      background: var(--el-color-danger);
    }

    &-primary {
      background: var(--el-color-primary);
    }
  }

  .pending-title {
    display: block;
    margin-top: 12px;
    font-size: var(--el-font-size-medium);
    font-weight: bold;
    line-height: 38px;
    color: var(--el-color-primary);

    span {
      font-size: var(--el-font-size-extra-small);
      font-weight: normal;
      color: var(--el-color-primary);
    }

    &-danger {
      color: var(--el-color-danger);
    }

    &-primary {
      color: var(--el-color-primary);
    }
  }

  .pending-tips {
    font-size: var(--el-font-size-extra-small);
    color: var(--el-text-color-regular);
    margin: 4px;
    display: block;
    font-size: 14px;
  }

  .el-tag__content {
    color: var(--el-color-primary);
  }
}
</style>
