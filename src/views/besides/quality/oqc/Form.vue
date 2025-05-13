<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-form
ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading"
      :label-position='labelPosition'>
      <el-row el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出货检验单编号" prop="oqcCode">
            <el-input v-model="formData.oqcCode" placeholder="请输入出货检验单编号" :disabled="disinput">
              <template #append>
                <SwitchS name="QMS_OQC_CODE" :obj="formData" val="oqcCode" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出货检验单名称" prop="oqcName">
            <el-input v-model="formData.oqcName" placeholder="请输入出货检验单名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>订单信息</el-divider>
      <el-row el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订单编号" prop="sourceCode">
            <el-input v-model="formData.sourceCode" placeholder="请输入订单编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次号" prop="batchCode">
            <el-input v-model="formData.batchCode" placeholder="请输入批次号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户ID" prop="clientId">
            <el-input v-model="formData.clientId" placeholder="请输入客户ID" :disabled="disinput">
              <template #append>
                <el-button @click="xuanzekehu">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户编码" prop="clientCode">
            <el-input v-model="formData.clientCode" placeholder="请输入客户编码" :disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称" prop="clientName">
            <el-input v-model="formData.clientName" placeholder="请输入客户名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>模板信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="检验模板ID" prop="templateId">
            <el-input v-model="formData.templateId" placeholder="请输入检验模板ID" maxlength :disabled="disinput">
              <template #append>
                <el-button @click="SelectTemplate">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品物料ID" prop="itemId">
            <el-input v-model="formData.itemId" placeholder="请输入产品物料ID" :disabled="disinput">
              <template #append>
                <el-button @click="handleSelectProduct" :icon="Search" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">

        <el-col :span="12">
          <el-form-item label="产品物料编码" prop="itemCode">
            <el-input v-model="formData.itemCode" placeholder="请输入产品物料编码" :disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品物料名称" prop="itemName">
            <el-input v-model="formData.itemName" placeholder="请输入产品物料名称" :disabled="disinput" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="规格型号" prop="specification">
            <el-input v-model="formData.specification" placeholder="请输入规格型号" :disabled="disinput" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unitOfMeasure">
            <el-input v-model="formData.unitOfMeasure" placeholder="请输入单位" :disabled="disinput" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="最低检测数" prop="quantityMinCheck">
            <el-input v-model="formData.quantityMinCheck" placeholder="请输入最低检测数" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大不合格数" prop="quantityMaxUnqualified">
            <el-input v-model="formData.quantityMaxUnqualified" placeholder="请输入最大不合格数" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>检测信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="发货数量" prop="quantityOut">
            <el-input v-model="formData.quantityOut" placeholder="请输入发货数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="本次检测数量" prop="quantityCheck">
            <el-input v-model="formData.quantityCheck" placeholder="请输入本次检测数量" type="number" />
          </el-form-item>

        </el-col>

      </el-row>
      <el-row :gutter="20">

        <el-col :span="12">
          <el-form-item label="合格数量" prop="quantityQuanlified">
            <el-input v-model="formData.quantityQuanlified" placeholder="请输入合格数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12"> <el-form-item label="不合格数" prop="quantityUnqualified">
            <el-input v-model="formData.quantityUnqualified" placeholder="请输入不合格数" type="number" />
          </el-form-item></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="致命缺陷数量" prop="crQuantity">
            <el-input v-model="formData.crQuantity" placeholder="请输入致命缺陷数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="致命缺陷率" prop="crRate">
            <el-input v-model="formData.crRate" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="严重缺陷数量" prop="majQuantity">
            <el-input v-model="formData.majQuantity" placeholder="请输入严重缺陷数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="10"> <el-form-item label="严重缺陷率" prop="majRate">
            <el-input v-model="formData.majRate" disabled />
          </el-form-item></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="轻微缺陷数量" prop="minQuantity">
            <el-input v-model="formData.minQuantity" placeholder="请输入轻微缺陷数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="轻微缺陷率" prop="minRate">
            <el-input v-model="formData.minRate" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>检测结果</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检测结果" prop="checkResult">
            <el-input v-model="formData.checkResult" placeholder="请输入检测结果" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测人员" prop="inspector">
            <el-input v-model="formData.inspector" placeholder="请输入检测人员" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出货日期" prop="outDate">
            <el-date-picker v-model="formData.outDate" type="date" value-format="x" placeholder="选择出货日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测日期" prop="inspectDate">
            <el-date-picker v-model="formData.inspectDate" type="date" value-format="x" placeholder="选择检测日期" />
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
  <ClientSelect ref="Client" @on-selected="onClientSelected" />
  <ItemSelect ref="Select" @on-selected="onSelected" />
  <TemplateSelect ref="template" @on-selected="onSelectedTemplate" />
  <!-- <UserList ref="formUserRef" @success="getList" /> -->
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import * as Api from '@/api/oqc/oqc'

import {
  Search
} from '@element-plus/icons-vue'

const labelPosition = 'top'//input lable位置
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  sourceCode: undefined,
  oqcCode: undefined,
  oqcName: undefined,
  templateId: undefined,
  clientId: undefined,
  clientCode: undefined,
  clientName: undefined,
  batchCode: undefined,
  itemId: undefined,
  itemCode: undefined,
  itemName: undefined,
  specification: undefined,
  unitOfMeasure: undefined,
  quantityMinCheck: undefined,
  quantityMaxUnqualified: undefined,
  quantityOut: undefined,
  quantityCheck: undefined,
  quantityUnqualified: undefined,
  quantityQuanlified: undefined,
  crRate: undefined,
  majRate: undefined,
  minRate: undefined,
  crQuantity: undefined,
  majQuantity: undefined,
  minQuantity: undefined,
  checkResult: undefined,
  outDate: undefined,
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
  oqcCode: [{ required: true, message: '出货检验单编号不能为空', trigger: 'change' }],
  templateId: [{ required: true, message: '检验模板ID不能为空', trigger: 'change' }],
  clientId: [{ required: true, message: '客户ID不能为空', trigger: 'change' }],
  // clientCode: [{ required: true, message: '客户编码不能为空', trigger: 'change' }],
  clientName: [{ required: true, message: '客户名称不能为空', trigger: 'change' }],
  itemId: [{ required: true, message: '产品物料ID不能为空', trigger: 'change' }],
  quantityOut: [{ required: true, message: '发货数量不能为空', trigger: 'change' }],
  quantityCheck: [{ required: true, message: '本次检测数量不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await Api.get(id)
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
    const data = formData.value as unknown as Api.VO
    if (formType.value === 'create') {
      data.status = '0'
      await Api.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await Api.update(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    sourceCode: undefined,
    oqcCode: undefined,
    oqcName: undefined,
    templateId: undefined,
    clientId: undefined,
    clientCode: undefined,
    clientName: undefined,
    batchCode: undefined,
    itemId: undefined,
    itemCode: undefined,
    itemName: undefined,
    specification: undefined,
    unitOfMeasure: undefined,
    quantityMinCheck: undefined,
    quantityMaxUnqualified: undefined,
    quantityOut: undefined,
    quantityCheck: undefined,
    quantityUnqualified: undefined,
    quantityQuanlified: undefined,
    crRate: undefined,
    majRate: undefined,
    minRate: undefined,
    crQuantity: undefined,
    majQuantity: undefined,
    minQuantity: undefined,
    checkResult: undefined,
    outDate: undefined,
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


//数量加减
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
  formData.value.crQuantity == undefined || formData.value.quantityOut == undefined ? formData.value.crRate = undefined : formData.value.crRate = (formData.value.crQuantity / formData.value.quantityOut).toFixed(2)
  formData.value.majQuantity == undefined || formData.value.quantityOut == undefined ? formData.value.majRate = undefined : formData.value.majRate = (formData.value.majQuantity / formData.value.quantityOut).toFixed(2)
  formData.value.minQuantity == undefined || formData.value.quantityOut == undefined ? formData.value.minRate = undefined : formData.value.minRate = (formData.value.minQuantity / formData.value.quantityOut).toFixed(2)
},
  { deep: true })


// 客户
const Client = ref();
const xuanzekehu = () => {
  Client.value.showFlag();
}
const onClientSelected = (obj) => {
  if (obj != undefined && obj != null) {
    console.log(obj)
    formData.value.clientId = obj.id;
    formData.value.clientName = obj.name
    formData.value.clientCode = obj.clientCode
  }
}

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

//选择模板
import TemplateSelect from './components/TemplateSelect.vue'
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
    formData.value.quantityMinCheck = v.selectedPro[0].quantityCheck;
    formData.value.quantityMaxUnqualified = v.selectedPro[0].quantityUnqualified;

  }
}


//输入禁用
const disinput = ref(true)
</script>