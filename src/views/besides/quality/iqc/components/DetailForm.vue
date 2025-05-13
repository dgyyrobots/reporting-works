<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-descriptions title="检验单信息" :column="2" :size='size' border>
      <el-descriptions-item label="来料检验单编号" align="center">{{ formData.iqcCode }}</el-descriptions-item>
      <el-descriptions-item label="来料检验单名称" align="center">{{ formData.iqcName }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="供应商信息" :column="2" :size='size' border align="center">
      <el-descriptions-item label="供应商编码" align="center">{{ formData.vendorCode }}</el-descriptions-item>
      <!-- <el-descriptions-item label="供应商ID" align="center">{{ formData.vendorId }}</el-descriptions-item> -->
      <el-descriptions-item label="供应商批次号" align="center">{{ formData.vendorBatch }}</el-descriptions-item>
      <el-descriptions-item label="供应商名称" align="center">{{ formData.vendorName }}</el-descriptions-item>
      <el-descriptions-item label="供应商简称" align="center">{{ formData.vendorNick }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="产品物料信息" :column="2" :size='size' border align="center">
      <el-descriptions-item label="产品物料编码" align="center">{{ formData.itemCode }}</el-descriptions-item>
      <!-- <el-descriptions-item label="产品物料ID" align="center">{{ formData.itemId }}</el-descriptions-item> -->
      <el-descriptions-item label="产品物料名称" align="center">{{ formData.itemName }}</el-descriptions-item>
      <el-descriptions-item label="规格型号" align="center">{{ formData.specification }}</el-descriptions-item>
      <el-descriptions-item label="单位" align="center">{{ formData.unitOfMeasure }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="检测信息" :column="2" :size='size' border>
      <el-descriptions-item label="检验模板ID" align="center" min-width="200">{{ formData.templateId }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="" :column="2" :size='size' border align="center" min-width="100">
      <!-- <el-descriptions-item label="产品物料ID" align="center">{{ formData.itemId }}</el-descriptions-item> -->
      <el-descriptions-item label="本次接收数量" align="center">{{ formData.quantityRecived }}</el-descriptions-item>
      <el-descriptions-item label="最低检测数" align="center">{{ formData.quantityMinCheck }}</el-descriptions-item>
      <el-descriptions-item label="最大不合格数" align="center">{{ formData.quantityMaxUnqualified }}</el-descriptions-item>
      <el-descriptions-item label="不合格数" align="center">{{ formData.quantityUnqualified }}</el-descriptions-item>
      <el-descriptions-item label="致命缺陷数量" align="center">{{ formData.crQuantity }}</el-descriptions-item>
      <el-descriptions-item label="致命缺陷率" align="center">{{ formData.crRate }}</el-descriptions-item>
      <el-descriptions-item label="严重缺陷数量" align="center">{{ formData.majQuantity }}</el-descriptions-item>
      <el-descriptions-item label="严重缺陷率" align="center">{{ formData.majRate }}</el-descriptions-item>
      <el-descriptions-item label="轻微缺陷数量" align="center">{{ formData.minQuantity }}</el-descriptions-item>
      <el-descriptions-item label="轻微缺陷率" align="center">{{ formData.minRate }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="结果" :column="2" :size='size' border>
      <el-descriptions-item label="检测结果" align="center">{{ formData.checkResult }}</el-descriptions-item>
      <el-descriptions-item label="检测人员" align="center">{{ formData.inspector }}</el-descriptions-item>
      <el-descriptions-item label="来料日期" align="center">{{ formData.reciveDate }}</el-descriptions-item>
      <el-descriptions-item label="检测日期" align="center">{{ formData.inspectDate }}</el-descriptions-item>
      <el-descriptions-item label="备注" align="center">{{ formData.remark }}</el-descriptions-item>
      <el-descriptions-item label="单据状态" align="center">
        <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT" :value="formData.status" />
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="showform" type="success" :disabled="formLoading" v-if="showpost">提交审核</el-button>
      <el-button @click="reCheck" type="danger" :disabled="formLoading" v-if="showreCheck">反审核</el-button>
      <el-button @click="passCheck" type="success" :disabled="formLoading" v-if="show">审核</el-button>
      <el-button @click="refuseCheck" type="danger" :disabled="formLoading" v-if="show">驳回</el-button>
      <el-button @click="dialogVisible = false"   >取 消</el-button>
    </template>
  </Dialog>

  <el-dialog v-model="centerDialogVisible" title="系统提示" width="30%" center>
    <span>
      确认提交审核？
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="postCheck()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as Api from '@/api/iqc/iqc'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const size = ref('large')
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})

const formData = ref({
  id: undefined,
  iqcCode: undefined,
  iqcName: undefined,
  templateId: undefined,
  vendorId: undefined,
  vendorCode: undefined,
  vendorName: undefined,
  vendorNick: undefined,
  vendorBatch: undefined,
  itemId: undefined,
  itemCode: undefined,
  itemName: undefined,
  specification: undefined,
  unitOfMeasure: undefined,
  quantityMinCheck: undefined,
  quantityMaxUnqualified: undefined,
  quantityRecived: undefined,
  quantityCheck: undefined,
  quantityUnqualified: undefined,
  crRate: undefined,
  majRate: undefined,
  minRate: undefined,
  crQuantity: undefined,
  majQuantity: undefined,
  minQuantity: undefined,
  checkResult: undefined,
  reciveDate: undefined,
  inspectDate: undefined,
  inspector: undefined,
  status: undefined,
  remark: undefined,
  attr1: undefined,
  attr2: undefined,
  attr3: undefined,
  attr4: undefined
})

const formType = ref('') // 表单的类型：create - 新增；update - 修改
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    iqcCode: undefined,
    iqcName: undefined,
    templateId: undefined,
    vendorId: undefined,
    vendorCode: undefined,
    vendorName: undefined,
    vendorNick: undefined,
    vendorBatch: undefined,
    itemId: undefined,
    itemCode: undefined,
    itemName: undefined,
    specification: undefined,
    unitOfMeasure: undefined,
    quantityMinCheck: undefined,
    quantityMaxUnqualified: undefined,
    quantityRecived: undefined,
    quantityCheck: undefined,
    quantityUnqualified: undefined,
    crRate: undefined,
    majRate: undefined,
    minRate: undefined,
    crQuantity: undefined,
    majQuantity: undefined,
    minQuantity: undefined,
    checkResult: undefined,
    reciveDate: undefined,
    inspectDate: undefined,
    inspector: undefined,
    status: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined
  }
}

/** 打开弹窗   区别于查看详情和审核*/
const show = ref(true)
const showpost = ref(true)
const showreCheck = ref(true)
const open = async (type: string, way: string, id?: number) => {
  //  修改时，设置数据
  if (id) {
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
    resetForm()
    formLoading.value = true
    try {
      formData.value = await Api.get(id)
    } finally {
      formLoading.value = false
    }
    show.value = false
    showpost.value = false
    showreCheck.value = false
    if (formData.value.status == '0') {
      showpost.value = true
    }
    else if (formData.value.status == '1') {
      show.value = true
    }
    else if (formData.value.status == '2') {
      showreCheck.value = true
    }
  }
  else {
    message.error('请选择一个出货检验')
    return
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
//审核通过
const passCheck = async () => {
  formData.value.status = '2'
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as Api.VO
    await Api.update(data)
    message.success(t('common.bringtrialSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

//审核驳回
const refuseCheck = async () => {
  formData.value.status = '3'
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as Api.VO
    await Api.update(data)
    message.success('驳回成功') 
    // 发送操作成功的事件
    emit('success')
  } finally {
    dialogVisible.value = false
    formLoading.value = false
    centerDialogVisible.value = false
  }
}

//反审核
const reCheck = async () => {
  formData.value.status = '0'
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as Api.VO
    await Api.update(data)
    message.success('反审核成功')
    // 发送操作成功的事件
    emit('success')
  } finally {
    dialogVisible.value = false
    formLoading.value = false
    centerDialogVisible.value = false
  }
}

//审核提交
const centerDialogVisible = ref(false)
const showform = () => {
  centerDialogVisible.value = true
}
const postCheck = async () => {
  formData.value.status = '1'
  // 校验表单
  formLoading.value = true
  try {
    const data = formData.value as unknown as Api.VO
    await Api.startBpm(data)
    message.success('提交审核成功') 
    // 发送操作成功的事件
    emit('success')
  } finally {
    dialogVisible.value = false
    formLoading.value = false
    centerDialogVisible.value = false
  }
}

</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
</style>
