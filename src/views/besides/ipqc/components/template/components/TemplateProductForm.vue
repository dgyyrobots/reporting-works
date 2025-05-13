<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading" label-width="0px"
    :inline-message="true">
    <el-form-item>
      <!-- <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button> -->
      <el-button type="primary" plain @click="handleSelectProduct" v-hasPermi="['qmcbasic:template:create']">
        <Icon icon="ep:plus" class="mr-5px" /> 新增
      </el-button>
    </el-form-item>
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="产品物料ID" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.itemId`" :rules="formRules.itemId" class="mb-0px!">
            <el-input v-model="row.itemId" placeholder="请输入产品物料ID" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品物料编码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.itemCode`" :rules="formRules.itemCode" class="mb-0px!">
            <el-input v-model="row.itemCode" placeholder="请输入产品物料编码" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品物料名称" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.itemName`" :rules="formRules.itemName" class="mb-0px!">
            <el-input v-model="row.itemName" placeholder="请输入产品物料名称" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.specification`" :rules="formRules.specification" class="mb-0px!">
            <el-input v-model="row.specification" placeholder="请输入规格型号" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.unitOfMeasure`" :rules="formRules.unitOfMeasure" class="mb-0px!">
            <el-input v-model="row.unitOfMeasure" placeholder="请输入单位" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="最低检测数" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantityCheck`" :rules="formRules.quantityCheck" class="mb-0px!">
            <el-input v-model="row.quantityCheck" placeholder="请输入最低检测数" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="最大不合格数" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantityUnqualified`" :rules="formRules.quantityUnqualified" class="mb-0px!">
            <el-input v-model="row.quantityUnqualified" placeholder="请输入最大不合格数" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="最大致命缺陷率" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.crRate`" :rules="formRules.crRate" class="mb-0px!">
            <el-input v-model="row.crRate" placeholder="请输入最大致命缺陷率" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="最大严重缺陷率" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.majRate`" :rules="formRules.majRate" class="mb-0px!">
            <el-input v-model="row.majRate" placeholder="请输入最大严重缺陷率" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="最大轻微缺陷率" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.minRate`" :rules="formRules.minRate" class="mb-0px!">
            <el-input v-model="row.minRate" placeholder="请输入最大轻微缺陷率" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <!-- <el-table-column label="预留字段1" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.attr1`" :rules="formRules.attr1" class="mb-0px!">
            <el-input v-model="row.attr1" placeholder="请输入预留字段1" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="预留字段2" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.attr2`" :rules="formRules.attr2" class="mb-0px!">
            <el-input v-model="row.attr2" placeholder="请输入预留字段2" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="预留字段3" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.attr3`" :rules="formRules.attr3" class="mb-0px!">
            <el-input v-model="row.attr3" placeholder="请输入预留字段3" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="预留字段4" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.attr4`" :rules="formRules.attr4" class="mb-0px!">
            <el-input v-model="row.attr4" placeholder="请输入预留字段4" />
          </el-form-item>
        </template>
      </el-table-column> -->
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加检测模板产品</el-button>
  </el-row>
  <ItemSelect ref="Select" @on-selected="onSelected" />
</template>
<script setup lang="ts">
import * as TemplateApi from '@/api/qmcbasic/template'

const props = defineProps<{
  templateId: undefined // 检测模板ID（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  templateId: [{ required: true, message: '检测模板ID不能为空', trigger: 'change' }],
  itemId: [{ required: true, message: '产品物料ID不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.templateId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await TemplateApi.getTemplateProductListByTemplateId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    templateId: undefined,
    itemId: undefined,
    itemCode: undefined,
    itemName: undefined,
    specification: undefined,
    unitOfMeasure: undefined,
    quantityCheck: undefined,
    quantityUnqualified: undefined,
    crRate: undefined,
    majRate: undefined,
    minRate: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
  }
  row.templateId = props.templateId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}


const Select = ref() // 弹窗的是否展示
const handleSelectProduct = () => {
  Select.value.showFlag();
}
const onSelected = (v) => {
  if (v != undefined && v != null) {
    console.log(v)
    const row = {
      id: undefined,
      templateId: undefined,
      itemId: undefined,
      itemCode: undefined,
      itemName: undefined,
      specification: undefined,
      unitOfMeasure: undefined,
      quantityCheck: undefined,
      quantityUnqualified: undefined,
      crRate: undefined,
      majRate: undefined,
      minRate: undefined,
      remark: undefined,
      attr1: undefined,
      attr2: undefined,
      attr3: undefined,
      attr4: undefined,
    }
    row.itemId = v.id;
    row.itemCode = v.itemCode;
    row.itemName = v.itemName;
    row.specification = v.specification;
    row.unitOfMeasure = v.unitOfMeasure;
    row.templateId = props.templateId
    formData.value.push(row)
  }

}


defineExpose({ validate, getData })
</script>