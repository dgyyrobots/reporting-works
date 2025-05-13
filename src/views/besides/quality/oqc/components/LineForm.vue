<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="检测项ID" prop="indexId">
            <el-input v-model="formData.indexId" placeholder="请输入检测项ID" :disabled="disinput">
              <template #append>
                <el-button @click="SelectIndex">
                  <Icon icon="ep:search" class="mr-5px" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="检测项名称" prop="indexName">
            <el-input v-model="formData.indexName" placeholder="请输入检测项名称" :disabled="disinput"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测项类型" prop="indexType">
            <el-select v-model="formData.indexType" placeholder="请选择检测项类型" :disabled="disinput"> 
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.MES_INDEX_TYPE)" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="检测工具" prop="qcTool">
            <el-input v-model="formData.qcTool" placeholder="请输入检测工具" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测要求" prop="checkMethod">
            <el-input v-model="formData.checkMethod" placeholder="请输入检测要求" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标准值" prop="standerVal">
            <el-input v-model="formData.standerVal" placeholder="请输入标准值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unitOfMeasure">
            <el-input v-model="formData.unitOfMeasure" placeholder="请输入单位" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="误差上限" prop="thresholdMax">
            <el-input v-model="formData.thresholdMax" placeholder="请输入误差上限" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="误差下限" prop="thresholdMin">
            <el-input v-model="formData.thresholdMin" placeholder="请输入误差下限" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>参数设置</el-divider>
      <el-row>
        <el-col :span="16">
          <el-form-item label="致命缺陷数量" prop="crQuantity">
            <el-input v-model="formData.crQuantity" placeholder="请输入致命缺陷数量" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>

        <el-col :span="16">
          <el-form-item label="严重缺陷数量" prop="majQuantity">
            <el-input v-model="formData.majQuantity" placeholder="请输入严重缺陷数量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="轻微缺陷数量" prop="minQuantity">
            <el-input v-model="formData.minQuantity" placeholder="请输入轻微缺陷数量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>

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
  <IndexSlect ref="index" @on-selected="onSelectedIndex" />
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import * as Api from '@/api/oqc/oqc'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const disinput = ref(true)//输入禁用
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  oqcId: undefined,
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
  crQuantity: undefined,
  majQuantity: undefined,
  minQuantity: undefined,
  remark: undefined,
  attr1: undefined,
  attr2: undefined,
  attr3: undefined,
  attr4: undefined
})
const formRules = reactive({
  oqcId: [{ required: true, message: '检验单ID不能为空', trigger: 'blur' }],
  indexId: [{ required: true, message: '检测项ID不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, oqcId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.oqcId = oqcId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await Api.getLine(id)
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
      data.id = undefined
      await Api.createLine(data)
      message.success(t('common.createSuccess'))
    } else {
      await Api.updateLine(data)
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
    oqcId: undefined,
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
    crQuantity: undefined,
    majQuantity: undefined,
    minQuantity: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
  }
  formRef.value?.resetFields()
}

import IndexSlect from './IndexSlect.vue'
//选择选择检测项
const index = ref() // 弹窗的是否展示
const SelectIndex = () => {
  index.value.open(formData.value.oqcId);
}
const onSelectedIndex = (v) => {
  if (v != undefined && v != null) {
    console.log(v)
    for (var key in formData.value) {
      if (v.hasOwnProperty(key) && formData.value.hasOwnProperty(key)) {
        formData.value[key] = v[key];
      }
    }
  }
}
</script>