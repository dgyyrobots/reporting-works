<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="检测项编码" prop="indexCode" >
        <el-input v-model="formData.indexCode" placeholder="请输入检测项编码" >
          <template #append>
                <SwitchS name="QMS_INDEX_CODE" :obj="formData" val="indexCode" />
              </template>
            </el-input>
      </el-form-item>
      <el-form-item label="检测项名称" prop="indexName">
        <el-input v-model="formData.indexName" placeholder="请输入检测项名称" />
      </el-form-item>
      <el-form-item label="检测项类型" prop="indexType">
        <el-select v-model="formData.indexType" placeholder="请选择检测项类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.MES_INDEX_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测工具" prop="qcTool">
        <el-input v-model="formData.qcTool" placeholder="请输入检测工具" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" :rows="2" type="textarea"/>
      </el-form-item>
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
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import * as qmsIndexApi from '@/api/qmcbasic/qmsIndex'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  indexCode: undefined,
  indexName: undefined,
  indexType: undefined,
  qcTool: undefined,
  remark: undefined,
  attr1: undefined,
  attr2: undefined,
  attr3: undefined,
  attr4: undefined
})
const formRules = reactive({
  indexCode: [{ required: true, message: '检测项编码不能为空', trigger: 'change' }],
  indexName: [{ required: true, message: '检测项名称不能为空', trigger: 'change' }],
  indexType: [{ required: true, message: '检测项类型不能为空', trigger: 'change' }]
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
      formData.value = await qmsIndexApi.getqmsIndex(id)
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
    const data = formData.value as unknown as qmsIndexApi.qmsIndexVO
    if (formType.value === 'create') {
      await qmsIndexApi.createqmsIndex(data)
      message.success(t('common.createSuccess'))
    } else {
      await qmsIndexApi.updateqmsIndex(data)
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
    indexCode: undefined,
    indexName: undefined,
    indexType: undefined,
    qcTool: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
  }
  formRef.value?.resetFields()
}
</script>