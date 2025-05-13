<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-form ref="formRef" :model="formData"  :rules="formRules" label-width="100px" v-loading="formLoading"
      :label-position='labelPosition'>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检验单编号" prop="ipqcCode">
            <el-input v-model="formData.ipqcCode" placeholder="请输入检验单编号">
              <template #append>
                <SwitchS name="QMS_IQC_CODE" :obj="formData" val="ipqcCode" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验单名称" prop="ipqcName">
            <el-input v-model="formData.ipqcName" placeholder="请输入检验单名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>工单信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="任务ID" prop="taskId">
            <el-input v-model="formData.taskId" placeholder="请输入任务ID" disabled="disinput">
              <!-- <template #append>
                <el-button @click="SelectTask">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template> -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务编号" prop="taskCode">
            <el-input v-model="formData.taskCode" placeholder="请输入任务编号" disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="formData.taskName" placeholder="请输入任务名称" disabled="disinput" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工单ID" prop="workorderId">
            <el-input v-model="formData.workorderId" placeholder="请输入工单ID" disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单编码" prop="workorderCode">
            <el-input v-model="formData.workorderCode" placeholder="请输入工单编码" disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单名称" prop="workorderName">
            <el-input v-model="formData.workorderName" placeholder="请输入工单名称" disabled="disinput" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工作站ID" prop="workstationId">
            <el-input v-model="formData.workstationId" placeholder="请输入工作站ID" disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作站编号" prop="workstationCode">
            <el-input v-model="formData.workstationCode" placeholder="请输入工作站编号" disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作站名称" prop="workstationName">
            <el-input v-model="formData.workstationName" placeholder="请输入工作站名称" disabled="disinput" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工序ID" prop="processId">
            <el-input v-model="formData.processId" placeholder="请输入工序ID" disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序编码" prop="processCode">
            <el-input v-model="formData.processCode" placeholder="请输入工序编码" disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序名称" prop="processName">
            <el-input v-model="formData.processName" placeholder="请输入工序名称" disabled="disinput" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>模板信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="检验模板ID" prop="templateId">
            <el-input v-model="formData.templateId" placeholder="请输入检验模板ID" maxlength disabled="disinput">
              <template #append>
                <el-button @click="SelectTemplate">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验类型" prop="ipqcType">
            <dict-tag :type="'mes_qc_type'" :value="formData.ipqcType" />
            <!-- <el-select v-model="formData.ipqcType" placeholder="请选择检测种类">
              <el-option v-for="dict in getStrDictOptions('mes_ipqc_type')" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品物料ID" prop="itemId">
            <el-input v-model="formData.itemId" placeholder="请输入产品物料ID" :disabled="disinput" />
            <!-- <template #append>
                <el-button @click="handleSelectProduct">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template>
            </el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品物料编码" prop="itemCode">
            <el-input v-model="formData.itemCode" placeholder="请输入产品物料编码" :disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品物料名称" prop="itemName">
            <el-input v-model="formData.itemName" placeholder="请输入产品物料名称" :disabled="disinput" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="规格型号" prop="specification">
            <el-input v-model="formData.specification" placeholder="请输入规格型号" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="单位" prop="unitOfMeasure">
            <el-input v-model="formData.unitOfMeasure" placeholder="请输入单位" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>检测信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="本次检测数量" prop="quantityCheck">
            <el-input v-model="formData.quantityCheck" placeholder="请输入本次检测数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合格品数量" prop="quantityQualified">
            <el-input v-model="formData.quantityQualified" placeholder="请输入合格品数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不合格数" prop="quantityUnqualified">
            <el-input v-model="formData.quantityUnqualified" placeholder="请输入不合格数" type="number" />
          </el-form-item></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="致命缺陷数量" prop="crQuantity">
            <el-input v-model="formData.crQuantity" placeholder="请输入致命缺陷数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="致命缺陷率" prop="crRate">
            <el-input v-model="formData.crRate" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" :offset="0">
        <el-col :span="12" :offset="0">
          <el-form-item label="严重缺陷数量" prop="majQuantity">
            <el-input v-model="formData.majQuantity" placeholder="请输入严重缺陷数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0"> <el-form-item label="严重缺陷率" prop="majRate">
            <el-input v-model="formData.majRate" disabled />
          </el-form-item></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="轻微缺陷数量" prop="minQuantity">
            <el-input v-model="formData.minQuantity" placeholder="请输入轻微缺陷数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="轻微缺陷率" prop="minRate">
            <el-input v-model="formData.minRate" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>检测结果</el-divider>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="检测结果" prop="checkResult">
            <el-input v-model="formData.checkResult" placeholder="请输入检测结果" />
          </el-form-item>
        </el-col>

        <el-col :span="12" :offset="0">
          <el-form-item label="检测日期" prop="inspectDate">
            <el-date-picker v-model="formData.inspectDate" type="date" value-format="x" placeholder="选择检测日期" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="检测人员" prop="inspector">
            <el-input v-model="formData.inspector" placeholder="请输入检测人员" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" :rows="2" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="单据状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择单据状态">
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item> -->
      <!-- <el-form-item label="检测数量" prop="quantityCheck">
        <el-input v-model="formData.quantityCheck" placeholder="请输入检测数量" />
      </el-form-item>
      <el-form-item label="不合格数" prop="quantityUnqualified">
        <el-input v-model="formData.quantityUnqualified" placeholder="请输入不合格数" />
      </el-form-item>
      <el-form-item label="合格品数量" prop="quantityQualified">
        <el-input v-model="formData.quantityQualified" placeholder="请输入合格品数量" />
      </el-form-item>
      <el-form-item label="致命缺陷率" prop="crRate">
        <el-input v-model="formData.crRate" placeholder="请输入致命缺陷率" />
      </el-form-item>
      <el-form-item label="严重缺陷率" prop="majRate">
        <el-input v-model="formData.majRate" placeholder="请输入严重缺陷率" />
      </el-form-item>
      <el-form-item label="轻微缺陷率" prop="minRate">
        <el-input v-model="formData.minRate" placeholder="请输入轻微缺陷率" />
      </el-form-item>
      <el-form-item label="致命缺陷数量" prop="crQuantity">
        <el-input v-model="formData.crQuantity" placeholder="请输入致命缺陷数量" />
      </el-form-item>
      <el-form-item label="严重缺陷数量" prop="majQuantity">
        <el-input v-model="formData.majQuantity" placeholder="请输入严重缺陷数量" />
      </el-form-item>
      <el-form-item label="轻微缺陷数量" prop="minQuantity">
        <el-input v-model="formData.minQuantity" placeholder="请输入轻微缺陷数量" />
      </el-form-item> -->
      <!-- <el-form-item label="检测日期" prop="inspectDate">
        <el-date-picker v-model="formData.inspectDate" type="date" value-format="x" placeholder="选择检测日期" />
      </el-form-item>
      <el-form-item label="检测结果" prop="checkResult">
            <el-input v-model="formData.checkResult" placeholder="请输入检测结果" />
          </el-form-item>
      <el-form-item label="检测人员" prop="inspector">
        <el-input v-model="formData.inspector" placeholder="请输入检测人员" />
      </el-form-item>
      <el-form-item label="单据状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item> -->
      <!-- <el-form-item label="预留字段1" prop="attr1">
        <el-input v-model="formData.attr1" placeholder="请输入预留字段1" />
      </el-form-item>
      <el-form-item label="预留字段2" prop="attr2">
        <el-input v-model="formData.attr2" placeholder="请输入预留字段2" />
      </el-form-item>
      <el-form-item label="预留字段3" prop="attr3">
        <el-input v-model="formData.attr3" placeholder="请输入预留字段3" />
      </el-form-item>
      <el-form-item label="预留字段4" prop="attr4">
        <el-input v-model="formData.attr4" placeholder="请输入预留字段4" />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <ItemSelect ref="Select" @on-selected="onSelected" />
  <TemplateSelect ref="template" @on-selected="onSelectedTemplate" />
  <TaskSelect ref="task" @on-selected="onSelectedTaks" />
</template>
<script setup lang="ts">
import { DICT_TYPE, getStrDictOptions } from '/@/utils/dict'
import * as IpqcApi from '/@/api/ipqc/ipqc'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const labelPosition = 'top'


const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  ipqcCode: undefined,
  ipqcName: undefined,
  ipqcType: undefined,
  templateId: undefined,
  workorderId: undefined,
  workorderCode: undefined,
  workorderName: undefined,
  taskId: undefined,
  taskCode: undefined,
  taskName: undefined,
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
  quantityCheck: undefined,
  quantityUnqualified: undefined,
  quantityQualified: undefined,
  crRate: undefined,
  majRate: undefined,
  minRate: undefined,
  crQuantity: undefined,
  majQuantity: undefined,
  minQuantity: undefined,
  checkResult: undefined,
  inspectDate: undefined,
  inspector: undefined,
  status: undefined,
  remark: undefined,
  attr1: undefined,
  attr2: undefined,
  attr3: undefined,
  attr4: undefined
})
const formRules = reactive({
  ipqcCode: [{ required: true, message: '检验单编号不能为空', trigger: 'change' }],
  ipqcType: [{ required: true, message: '检验类型不能为空', trigger: 'change' }],
  templateId: [{ required: true, message: '检验模板ID不能为空', trigger: 'change' }],
  workorderId: [{ required: true, message: '工单ID不能为空', trigger: 'change' }],
  workstationId: [{ required: true, message: '工作站ID不能为空', trigger: 'change' }],
  itemId: [{ required: true, message: '产品物料ID不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number,obj?:Object) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if(obj){
    onSelectedTaks(obj)
  }
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await IpqcApi.getIpqc(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as IpqcApi.IpqcVO
    if (formType.value === 'create') {
      data.status = '0'
      await IpqcApi.createIpqc(data)
      message.success(t('新增成功'))
    } else {
      await IpqcApi.updateIpqc(data)
      message.success(t('修改成功'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', formData.value.taskId)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    ipqcCode: undefined,
    ipqcName: undefined,
    ipqcType: undefined,
    templateId: undefined,
    workorderId: undefined,
    workorderCode: undefined,
    workorderName: undefined,
    taskId: undefined,
    taskCode: undefined,
    taskName: undefined,
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
    quantityCheck: undefined,
    quantityUnqualified: undefined,
    quantityQualified: undefined,
    crRate: undefined,
    majRate: undefined,
    minRate: undefined,
    crQuantity: undefined,
    majQuantity: undefined,
    minQuantity: undefined,
    checkResult: undefined,
    inspectDate: undefined,
    inspector: undefined,
    status: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
  }
  formRef.value?.resetFields()
}

//产品物料选择
const Select = ref() // 弹窗的是否展示
const handleSelectProduct = () => {
  Select.value.showFlag();
}
const onSelected = (v) => {
  if (v != undefined && v != null) {
    console.log(v.id)
    formData.value.itemId = v.id;
    formData.value.itemCode = v.itemCode;
    formData.value.itemName = v.itemName;
    formData.value.specification = v.specification;
    formData.value.unitOfMeasure = v.unitOfMeasure;
  }
}

// 数量加减
// function pluscrQuantity() {
//   formData.value.crQuantity == undefined ? formData.value.crQuantity = 1 : formData.value.crQuantity = Number(formData.value.crQuantity) + 1
// }
// function MincrQuantity() {
//   formData.value.crQuantity != undefined && formData.value.crQuantity > 0 ? formData.value.crQuantity -= 1 : formData.value.crQuantity = 0

// }

// function plusmajQuantity() {
//   formData.value.majQuantity == undefined ? formData.value.majQuantity = 1 : formData.value.majQuantity = Number(formData.value.majQuantity) + 1
// }
// function MinmajQuantity() {
//   formData.value.majQuantity != undefined && formData.value.majQuantity > 0 ? formData.value.majQuantity -= 1 : formData.value.majQuantity = 0
// }

// function plusminQuantity() {
//   formData.value.minQuantity == undefined ? formData.value.minQuantity = 1 : formData.value.minQuantity = Number(formData.value.minQuantity) + 1
// }
// function MinminQuantity() {
//   formData.value.minQuantity != undefined && formData.value.minQuantity > 0 ? formData.value.minQuantity -= 1 : formData.value.minQuantity = 0
// }

watch(formData, () => {
  formData.value.crQuantity == undefined || formData.value.quantityCheck == undefined ? formData.value.crRate = undefined : formData.value.crRate = (formData.value.crQuantity / formData.value.quantityCheck).toFixed(2)
  formData.value.majQuantity == undefined || formData.value.quantityCheck == undefined ? formData.value.majRate = undefined : formData.value.majRate = (formData.value.majQuantity / formData.value.quantityCheck).toFixed(2)
  formData.value.minQuantity == undefined || formData.value.quantityCheck == undefined ? formData.value.minRate = undefined : formData.value.minRate = (formData.value.minQuantity / formData.value.quantityCheck).toFixed(2)
},
  { deep: true })

import TemplateSelect from './components/TemplateSelect.vue'
//选择模板
const template = ref() // 弹窗的是否展示
const SelectTemplate = () => {
  template.value.open();
}
const onSelectedTemplate = (v) => {
  if (v != undefined && v != null) {
    console.log(v)
    formData.value.templateId = v.selectedRows.id;
    formData.value.itemCode = v.selectedRows.itemCode;
    formData.value.itemName = v.selectedRows.itemName;
    formData.value.specification = v.selectedRows.specification;
    formData.value.unitOfMeasure = v.selectedRows.unitOfMeasure;
    formData.value.itemCode = v.selectedPro[0].itemCode;
    formData.value.itemId = v.selectedPro[0].itemId;
    formData.value.itemName = v.selectedPro[0].itemName;
    formData.value.specification = v.selectedPro[0].specification;
    formData.value.unitOfMeasure = v.selectedPro[0].unitOfMeasure;
    formData.value.ipqcType = v.selectedRows.qcTypes;
    // formData.value.quantityMaxUnqualified = v.selectedPro[0].quantityUnqualified;
  }
}

import TaskSelect from './components/TaskSelect.vue'
//选择任务
const task = ref() // 弹窗的是否展示
const SelectTask = () => {
  task.value.open();
}
const onSelectedTaks = (v) => {
  if (v != undefined && v != null) {
    // console.log(v)
    formData.value.taskCode = v.taskCode;
    formData.value.taskName = v.taskName;
    formData.value.taskId = v.id;
    formData.value.workorderCode = v.workorderCode;
    formData.value.workorderName = v.workorderName;
    formData.value.workorderId = v.workorderId;
    formData.value.processCode = v.processCode;
    formData.value.processName = v.processName;
    formData.value.processId = v.processId;
    formData.value.workstationCode = v.workstationCode;
    formData.value.workstationName = v.workstationName;
    formData.value.workstationId = v.workstationId;
  }
}
//输入禁用
const disinput = ref(true)
</script>
<style>
.el-form-item__label{
  margin-top: 5px;
}
</style>