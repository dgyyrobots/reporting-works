<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="90%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="检测模板编号" prop="templateCode">
            <el-input v-model="formData.templateCode" placeholder="请输入检测模板编号">
              <template #append>
                <SwitchS name="QMS_TEMPLATE_CODE" :obj="formData" val="templateCode" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="检测模板名称" prop="templateName">
            <el-input v-model="formData.templateName" placeholder="请输入检测模板名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检测种类" prop="qcTypes">
            <el-select v-model="formData.qcTypes" placeholder="请选择检测种类">
              <el-option v-for="dict in getStrDictOptions('mes_qc_type')" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否启用" prop="enableFlag">
        <el-radio-group v-model="formData.enableFlag">
          <el-radio v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
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
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="检测模板项" name="templateIndex">
        <TemplateIndexForm ref="templateIndexFormRef" :template-id="formData.id" />
      </el-tab-pane>
      <el-tab-pane label="检测模板产品" name="templateProduct">
        <TemplateProductForm ref="templateProductFormRef" :template-id="formData.id" />
      </el-tab-pane>
      <!-- <el-tab-pane label="检测模板项" name="templateIndex1">
        <TemplateIndexList ref="templateIndexList" :template-id="formData.id" />
      </el-tab-pane>
      <el-tab-pane label="检测模板产品" name="templateProduct1">
        <TemplateProductList ref="templateProductList" :template-id="formData.id" />
      </el-tab-pane> -->
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import * as TemplateApi from '@/api/qmcbasic/template'
import TemplateIndexForm from './components/TemplateIndexForm.vue'
import TemplateProductForm from './components/TemplateProductForm.vue'


// import TemplateIndexList from './components/TemplateIndexList.vue'
// import TemplateProductList from './components/TemplateProductList.vue'
// const templateIndexList = ref()
// const templateProductList = ref()
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  templateCode: undefined,
  templateName: undefined,
  qcTypes: undefined,
  enableFlag: undefined,
  remark: undefined,
  attr1: undefined,
  attr2: undefined,
  attr3: undefined,
  attr4: undefined
})
const formRules = reactive({
  templateCode: [{ required: true, message: '检测模板编号不能为空', trigger: 'change' }],
  qcTypes: [{ required: true, message: '检测种类不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('templateIndex')
const templateIndexFormRef = ref()
const templateProductFormRef = ref()


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
      formData.value = await TemplateApi.getTemplate(id)
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
  // 校验子表单
  try {
    await templateIndexFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'templateIndex'
    return
  }
  try {
    await templateProductFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'templateProduct'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as TemplateApi.TemplateVO
    // 拼接子表的数据
    data.templateIndexs = templateIndexFormRef.value.getData()
    data.templateProducts = templateProductFormRef.value.getData()
    if (formType.value === 'create') {
      await TemplateApi.createTemplate(data)
      message.success(t('common.createSuccess'))
    } else {
      await TemplateApi.updateTemplate(data)
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
    templateCode: undefined,
    templateName: undefined,
    qcTypes: undefined,
    enableFlag: undefined,
    remark: undefined,
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
  }
  formRef.value?.resetFields()
}
</script>