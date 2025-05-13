<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
  <el-form-item>
        <!-- <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button> -->
        <el-button
          type="primary"
          plain
          @click="xuanzekehu"
          v-hasPermi="['qmcbasic:template:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
       <el-table-column label="检测项ID" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.indexId`" :rules="formRules.indexId" class="mb-0px!">
            <el-input v-model="row.indexId" placeholder="请输入检测项ID" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="检测项编码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.indexCode`" :rules="formRules.indexCode" class="mb-0px!">
            <el-input v-model="row.indexCode" placeholder="请输入检测项编码" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="检测项名称" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.indexName`" :rules="formRules.indexName" class="mb-0px!">
            <el-input v-model="row.indexName" placeholder="请输入检测项名称" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="检测项类型" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.indexType`" :rules="formRules.indexType" class="mb-0px!">
            <el-select v-model="row.indexType" placeholder="请选择检测项类型">
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.MES_INDEX_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="检测工具" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.qcTool`" :rules="formRules.qcTool" class="mb-0px!">
            <el-input v-model="row.qcTool" placeholder="请输入检测工具" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="检测要求" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.checkMethod`" :rules="formRules.checkMethod" class="mb-0px!">
            <el-input v-model="row.checkMethod" placeholder="请输入检测要求" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="标准值" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.standerVal`" :rules="formRules.standerVal" class="mb-0px!">
            <el-input v-model="row.standerVal" placeholder="请输入标准值" />
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
      <el-table-column label="误差上限" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.thresholdMax`" :rules="formRules.thresholdMax" class="mb-0px!">
            <el-input v-model="row.thresholdMax" placeholder="请输入误差上限" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="误差下限" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.thresholdMin`" :rules="formRules.thresholdMin" class="mb-0px!">
            <el-input v-model="row.thresholdMin" placeholder="请输入误差下限" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="说明图" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.docUrl`" :rules="formRules.docUrl" class="mb-0px!">
            <el-input v-model="row.docUrl" placeholder="请输入说明图" />
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
    <el-button @click="handleAdd" round>+ 添加检测模板项</el-button>
  </el-row>
<TemplateList ref="Template" @on-selected="onSelectedTemplate" />
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import * as TemplateApi from '@/api/qmcbasic/template'

const props = defineProps<{
  templateId: undefined // 检测模板ID（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  templateId: [{ required: true, message: '检测模板ID不能为空', trigger: 'change' }],
  indexId: [{ required: true, message: '检测项ID不能为空', trigger: 'change' }],
  indexCode: [{ required: true, message: '检测项编码不能为空', trigger: 'change' }],
  indexName: [{ required: true, message: '检测项名称不能为空', trigger: 'change' }],
  indexType: [{ required: true, message: '检测项类型不能为空', trigger: 'change' }]
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
      formData.value = await TemplateApi.getTemplateIndexListByTemplateId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const visible = ref(false)
const form = reactive({
    id: undefined,
    templateId: undefined,
    indexId: undefined,
    indexCode: undefined,
    indexName: undefined,
    indexType: undefined,
    qcTool: undefined,
    checkMethod: undefined,
    standerVal: undefined,
    unitOfMeasure: undefined,
    thresholdMax: undefined,
    thresholdMin: undefined,
    docUrl: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
})

const handleAdd = () => {
  const row = {
    id: undefined,
    templateId: undefined,
    indexId: undefined,
    indexCode: undefined,
    indexName: undefined,
    indexType: undefined,
    qcTool: undefined,
    checkMethod: undefined,
    standerVal: undefined,
    unitOfMeasure: undefined,
    thresholdMax: undefined,
    thresholdMin: undefined,
    docUrl: undefined,
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

/** 重置按钮操作 */
const resetQuery = () => {
  formData.value=[]
}

import TemplateList from './TemplateList.vue'
const listformRef = ref() // 表单 Ref
const openlistForm = (type: string) => {
  listformRef.value.open(type)
}

// 模板
const Template = ref()
const xuanzekehu = () => {
  Template.value.showFlag()
}
const onSelectedTemplate = (obj) => {
  // formData.value=obj
  obj.forEach(element => {
    const row = {
    id: undefined,
    templateId: undefined,
    indexId: undefined,
    indexCode: undefined,
    indexName: undefined,
    indexType: undefined,
    qcTool: undefined,
    checkMethod: undefined,
    standerVal: undefined,
    unitOfMeasure: undefined,
    thresholdMax: undefined,
    thresholdMin: undefined,
    docUrl: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
  }
  row.indexId=element.id
  row.indexCode=element.indexCode
  row.indexName=element.indexName
  row.indexType=element.indexType
  row.remark=element.remark
  row.qcTool=element.qcTool
  row.templateId = props.templateId
  formData.value.push(row)
  });
  console.log(formData.value)
}

defineExpose({ validate, getData })
</script>