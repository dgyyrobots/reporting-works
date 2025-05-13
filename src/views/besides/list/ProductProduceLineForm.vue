<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-form
    inline
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    > 
    <el-row>
      <el-col :span="12">      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="formData.itemCode" placeholder="请输入产品物料编码" >
          <template #append>
            <el-button @click="handleSelectProduct" :icon="Search"  :disabled="formType == 'detail'"/>
          </template>
        </el-input>
      </el-form-item></el-col>
      <el-col :span="12">      <el-form-item label="产出数量" prop="quantityProduce">
        <el-input v-model="formData.quantityProduce" type="number" placeholder="请输入产出数量" />
      </el-form-item></el-col>
    </el-row>
    <el-row>
      <el-col :span="12">      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="formData.batchCode" placeholder="请输入批次号" />
      </el-form-item></el-col>
      <el-col :span="12">      <el-form-item label="来源类型" prop="orderSource">
        <el-input v-model="formData.orderSource" placeholder="请输入来源类型" />
      </el-form-item></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item></el-col>
    </el-row>
       <!-- <el-form-item label="产品物料ID" prop="itemId">
        <el-input v-model="formData.itemId" placeholder="请输入产品物料ID" />
      </el-form-item> -->

      <!-- <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="formData.itemName" placeholder="请输入产品物料名称" />
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="formData.specification" placeholder="请输入规格型号" />
      </el-form-item>
      <el-form-item label="单位" prop="unitOfMeasure">
        <el-input v-model="formData.unitOfMeasure" placeholder="请输入单位" />
      </el-form-item> -->


      <!-- <el-form-item label="仓库ID" prop="warehouseId">
        <el-input v-model="formData.warehouseId" placeholder="请输入仓库ID" />
      </el-form-item>
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input v-model="formData.warehouseCode" placeholder="请输入仓库编码" />
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="formData.warehouseName" placeholder="请输入仓库名称" />
      </el-form-item>
      <el-form-item label="库区ID" prop="locationId">
        <el-input v-model="formData.locationId" placeholder="请输入库区ID" />
      </el-form-item>
      <el-form-item label="库区编码" prop="locationCode">
        <el-input v-model="formData.locationCode" placeholder="请输入库区编码" />
      </el-form-item>
      <el-form-item label="库区名称" prop="locationName">
        <el-input v-model="formData.locationName" placeholder="请输入库区名称" />
      </el-form-item>
      <el-form-item label="库位ID" prop="areaId">
        <el-input v-model="formData.areaId" placeholder="请输入库位ID" />
      </el-form-item>
      <el-form-item label="库位编码" prop="areaCode">
        <el-input v-model="formData.areaCode" placeholder="请输入库位编码" />
      </el-form-item>
      <el-form-item label="库位名称" prop="areaName">
        <el-input v-model="formData.areaName" placeholder="请输入库位名称" />
      </el-form-item> -->


    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <ItemSelect ref="Select" @on-selected="onSelected" />
</template>
<script setup lang="ts">
import * as ProductProduceApi from '/@/api/wms/productproduce'
import {
  Search
} from '@element-plus/icons-vue'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  recordId: undefined,
  itemId: undefined,
  itemCode: undefined,
  itemName: undefined,
  specification: undefined,
  unitOfMeasure: undefined,
  quantityProduce: undefined,
  batchCode: undefined,
  warehouseId: undefined,
  warehouseCode: undefined,
  warehouseName: undefined,
  locationId: undefined,
  locationCode: undefined,
  locationName: undefined,
  areaId: undefined,
  areaCode: undefined,
  areaName: undefined,
  remark: undefined,
  attr1: undefined,
  attr2: undefined,
  attr3: undefined,
  attr4: undefined,
  orderSource: undefined
})
const formRules = reactive({
  itemId: [{ required: true, message: '产品物料ID不能为空', trigger: 'blur' }],
  quantityProduce: [{ required: true, message: '产出数量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, recordId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.recordId = recordId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProductProduceApi.getProductProduceLine(id)
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
    const data = formData.value
    if (formType.value === 'create') {
      await ProductProduceApi.createProductProduceLine(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductProduceApi.updateProductProduceLine(data)
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
    recordId: undefined,
    itemId: undefined,
    itemCode: undefined,
    itemName: undefined,
    specification: undefined,
    unitOfMeasure: undefined,
    quantityProduce: undefined,
    batchCode: undefined,
    warehouseId: undefined,
    warehouseCode: undefined,
    warehouseName: undefined,
    locationId: undefined,
    locationCode: undefined,
    locationName: undefined,
    areaId: undefined,
    areaCode: undefined,
    areaName: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
    orderSource: undefined
  }
  formRef.value?.resetFields()
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

    formData.value.areaCode = v.areaCode;
    formData.value.areaId = v.areaId;
    formData.value.areaName = v.areaName;

    formData.value.locationName = v.locationName;
    formData.value.locationId = v.id;
    formData.value.locationCode = v.locationCode;

    formData.value.warehouseCode = v.warehouseCode;
    formData.value.warehouseId = v.id;
    formData.value.warehouseName = v.warehouseName;
  }
}
</script>