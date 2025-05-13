<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading"
      :label-position='labelPosition'>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="来料检验单编号" prop="iqcCode">
            <el-input v-model="formData.iqcCode" placeholder="请输入来料检验单编号">
              <template #append>
                <SwitchS name="QMS_IQC_CODE" :obj="formData" val="iqcCode" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来料检验单名称" prop="iqcName">
            <el-input v-model="formData.iqcName" placeholder="请输入来料检验单名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>供应商信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商编码" prop="vendorCode">
            <el-input v-model="formData.vendorCode" placeholder="请输入供应商编码">
              <template #append>
                <el-button @click="SelectSupplier">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商ID" prop="vendorId">
            <el-input v-model="formData.vendorId" placeholder="请输入供应商ID" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商批次号" prop="vendorBatch">
            <el-input v-model="formData.vendorBatch" placeholder="请输入供应商批次号" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="供应商名称" prop="vendorName">
            <el-input v-model="formData.vendorName" placeholder="请输入供应商名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="供应商简称" prop="vendorNick">
            <el-input v-model="formData.vendorNick" placeholder="请输入供应商简称" />
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
            <el-input v-model="formData.itemId" placeholder="请输入产品物料ID" :disabled="disinput" />
            <!-- <template #append>
                <el-button @click="handleSelectProduct">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template>
            </el-input> -->
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
        <el-col :span="12">
          <el-form-item label="本次接收数量" prop="quantityRecived">
            <el-input v-model="formData.quantityRecived" placeholder="请输入本次接收数量" type="number" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="本次检测数量" prop="quantityCheck">
            <el-input v-model="formData.quantityCheck" placeholder="请输入本次检测数量" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
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
          <el-form-item label="检测人员" prop="inspector">
            <el-input v-model="formData.inspector" placeholder="请输入检测人员" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="来料日期" prop="reciveDate">
            <el-date-picker v-model="formData.reciveDate" type="date" value-format="x" placeholder="选择来料日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
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
  <ItemSelect ref="Select" @on-selected="onSelected" />
  <TemplateSelect ref="template" @on-selected="onSelectedTemplate" />
  <SupplierSelect ref="supplier" @on-selected="onSelectedSupplier" />
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import * as Api from '@/api/iqc/iqc'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
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
const formRules = reactive({
  iqcCode: [{ required: true, message: '来料检验单编号不能为空', trigger: 'change' }],
  iqcName: [{ required: true, message: '来料检验单名称不能为空', trigger: 'change' }],
  templateId: [{ required: true, message: '检验模板ID不能为空', trigger: 'change' }],
  vendorId: [{ required: true, message: '供应商ID不能为空', trigger: 'change' }],
  vendorCode: [{ required: true, message: '供应商编码不能为空', trigger: 'change' }],
  vendorName: [{ required: true, message: '供应商名称不能为空', trigger: 'change' }],
  itemId: [{ required: true, message: '产品物料ID不能为空', trigger: 'change' }],
  quantityRecived: [{ required: true, message: '本次接收数量不能为空', trigger: 'change' }],
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
      // await Api.createLine(linedata.value)
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
    attr4: undefined,
  }
  formRef.value?.resetFields()
}

const labelPosition = 'top'//input lable位置

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
watch(formData, (newval, olval) => {
  formData.value.crQuantity == undefined || formData.value.quantityRecived == undefined ? formData.value.crRate = undefined : formData.value.crRate = (formData.value.crQuantity / formData.value.quantityRecived).toFixed(2)
  formData.value.majQuantity == undefined || formData.value.quantityRecived == undefined ? formData.value.majRate = undefined : formData.value.majRate = (formData.value.majQuantity / formData.value.quantityRecived).toFixed(2)
  formData.value.minQuantity == undefined || formData.value.quantityRecived == undefined ? formData.value.minRate = undefined : formData.value.minRate = (formData.value.minQuantity / formData.value.quantityRecived).toFixed(2)
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
    console.log(v.selectedTmp)
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

import SupplierSelect from './components/SupplierSelect.vue'
//选择供应商
const supplier = ref() // 弹窗的是否展示
const SelectSupplier = () => {
  supplier.value.open();
}
const onSelectedSupplier = (v) => {
  if (v != undefined && v != null) {
    console.log(v.selectedTmp[0].quantityCheck, v.selectedTmp[0].quantityUnqualified)
    formData.value.vendorId = v.id;
    formData.value.vendorCode = v.vendorCode;
    formData.value.vendorName = v.vendorName;
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