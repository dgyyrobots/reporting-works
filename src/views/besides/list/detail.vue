<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable linebreak-style -->
<template>
    <el-divider>生产任务</el-divider>
  <ContentWrap>
    <el-form ref="formRef" inline label-width="100px" :model="formData" :disabled="true">

      <el-form-item label="任务编号" prop="taskCode">
        <el-input v-model="formData.taskCode" placeholder="请输入任务编号" />
        <!-- <SwitchS name="TASK_CODE" :obj="formData" val="taskCode" /> -->
      </el-form-item>

      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="formData.taskName" placeholder="请输入任务名称" /> </el-form-item>
      <!-- <el-form-item label="生产工单编号" prop="workorderCode">
        <el-input v-model="formData.workorderCode" placeholder="请输入生产工单编号">
        </el-input>
      </el-form-item> -->
      <!-- <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="formData.workorderName" placeholder="请输入工单名称" /> </el-form-item> -->
      <el-form-item label="工作站编号" prop="workstationCode">
        <el-input v-model="formData.workstationCode" placeholder="请输入工作站编号">
        </el-input> </el-form-item>
      <el-form-item label="工作站名称" prop="workstationName">
        <el-input v-model="formData.workstationName" placeholder="请输入工作站名称" /> </el-form-item>

      <el-form-item label="工序编码" prop="processCode">
        <el-input v-model="formData.processCode" placeholder="请输入工序编码" /> </el-form-item>
      <el-form-item label="工序名称" prop="processName">
        <el-input v-model="formData.processName" placeholder="请输入工序名称" /> </el-form-item>

      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input v-model="formData.itemCode" placeholder="请输入产品物料编码" /> </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input v-model="formData.itemName" placeholder="请输入产品物料名称" /> </el-form-item>

      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="formData.specification" placeholder="请输入规格型号" /> </el-form-item>
      <el-form-item label="单位" prop="unitOfMeasure">
        <el-input v-model="formData.unitOfMeasure" placeholder="请输入单位" /> </el-form-item>
      <el-form-item label="排产数量" prop="quantity">
        <!-- <el-input v-model="formData.quantity" placeholder="请输入排产数量" /> -->
        <el-input-number :min="1" v-model="formData.quantity" /> </el-form-item>
      <!-- <el-form-item label="客户编码" prop="clientCode">
        <el-input v-model="formData.clientCode" placeholder="请输入客户编码">
        </el-input> </el-form-item>

      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="formData.clientName" placeholder="请输入客户名称" /> </el-form-item>
      <el-form-item label="客户简称" prop="clientNick">
        <el-input v-model="formData.clientNick" placeholder="请输入客户简称" /> </el-form-item> -->
      <el-form-item label="开始生产时间" prop="startTime">
        <el-date-picker v-model="formData.startTime" clearable type="datetime" v placeholder="选择开始生产时间" />
      </el-form-item>
      <el-form-item label="生产时长" prop="duration">
        <!-- <el-input v-model="formData.duration" placeholder="请输入生产时长" /> -->
        <el-input-number :min="1" :precision="0" :step="1" v-model="formData.duration" />
      </el-form-item>

      <el-form-item label="完成生产时间" prop="endTime">
        <el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择完成生产时间" disabled />
      </el-form-item>
      <el-form-item label="甘特图显示颜色" prop="colorCode" label-width="110px">
        <el-color-picker v-model="formData.colorCode" /> </el-form-item>
      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker v-model="formData.requestDate" type="date" value-format="x" placeholder="选择需求日期" />
      </el-form-item>
      <el-form-item label="生产状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="dict in getStrDictOptions('mes_pro_task_status')" :key="dict.value" :value="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" style='width:300px' />
      </el-form-item>
    </el-form>
  </ContentWrap>
  <el-divider>生产工单</el-divider>
  <ContentWrap>
    <el-form inline ref="formRef" :model="formData2" label-width="100px">
      <el-form-item label="工单编号" prop="workorderCode">
        <el-col style="display: flex"><el-input v-model="formData2.workorderCode" placeholder="请输入工单编号" disabled />
          <SwitchS name="WORKORDER_CODE" :obj="formData2" val="workorderCode" />
        </el-col>
      </el-form-item>
      <el-form-item label="工单名称" prop="workorderName">
        <el-input v-model="formData2.workorderName" placeholder="请输入工单名称" disabled />
      </el-form-item>
      <el-form-item label="生产方" prop="isOut">
        <el-radio-group v-model="formData2.isOut" disabled>
          <el-radio :key="false" :value="false">自产</el-radio>
          <el-radio :key="true" :value="true">委外</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="来源类型" prop="channelType">
        <!-- <el-input v-model="formData.orderSource" placeholder="请输入来源类型" /> -->
        <el-radio-group v-model="formData2.channelType" disabled>
          <el-radio v-for="dict in getStrDictOptions('mes_workorder_sourcetype')" :key="dict.value" :value="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单据状态" prop="status" style="width: 200px;">
        <el-select v-model="formData2.status" disabled placeholder="请选择单据状态">
          <el-option v-for="dict in getStrDictOptions('mes_order_status')" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="sourceCode" v-if="formData2.orderSource == 'ORDER'">
        <el-input v-model="formData2.sourceCode" placeholder="请输入订单编号" />
      </el-form-item>

      <el-form-item label="产品编号" prop="productCode">
        <el-input v-model="formData2.productCode" placeholder="请输入产品编号" disabled>
          <template #append>
            <!--<el-button @click="handleSelectProduct" :icon="Search" />-->
            <el-button :icon="Search" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formData2.productName" placeholder="请输入产品名称" disabled />
      </el-form-item>
      <el-form-item label="规格型号" prop="productSpc">
        <el-input v-model="formData2.productSpc" placeholder="请输入规格型号" disabled />
      </el-form-item>
      <el-form-item label="单位" prop="unitOfMeasure">
        <el-input v-model="formData2.unitOfMeasure" placeholder="请输入单位" disabled />
      </el-form-item>
      <el-form-item label="工单数量" prop="quantity">
        <el-input-number :min="1" v-model="formData2.quantity" disabled />
      </el-form-item>
      <el-form-item label="客户编码" prop="clientCode" v-if="formData2.channelType == 'ORDER'">
        <el-input v-model="formData2.clientCode" placeholder="请输入客户编码" disabled>
          <template #append> <el-button @click="handleSelectClient" :icon="Search" /> </template></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName" v-if="formData2.channelType == 'ORDER'">
        <el-input v-model="formData2.clientName" placeholder="请输入客户名称" disabled />
      </el-form-item>
      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker v-model="formData2.requestDate" type="date" value-format="x" placeholder="选择需求日期" disabled />
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input v-model="formData2.batchCode" placeholder="请输入批次号" disabled />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formData2.remark" placeholder="请输入备注" disabled />
          </el-form-item>
      <el-row>

        <el-col :span="24">
          <el-form-item label="附件列表" prop="adjuncts">
            <template v-if="formData2.adjuncts && isString(formData2.adjuncts)">
              <div class="mr-2 flex" v-for="(item, i) in formData2.adjuncts.split(',')" :key="i" style=""
                :style="`background-image:url(${item});background-size: contain;background-repeat: no-repeat;`">
                <div class="flex-center h-50 w-50 flex flex-col overflow-hidden border border-gray border-solid"
                  v-if="item">
                  <el-icon style="width: 100%; height: 100%">
                    <Document style="width: 50%; height: 30%" />
                  </el-icon>
                  <el-link :href="item" target="_blank" class="mt-2">{{ item.split('.').pop().toUpperCase()
                    }}(点击下载)</el-link>
                </div>
              </div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ContentWrap>


</template>
<!-- eslint-disable linebreak-style -->
<!-- eslint-disable prettier/prettier -->
<script lang="ts" setup>
import { DICT_TYPE, getDictLabel, getDictObj, getStrDictOptions } from '/@/utils/dict'
import { Document, Search } from '@element-plus/icons-vue'
import { isString } from '/@/utils/is'
import * as ProductionApi from '/@/api/production/index'
const props = defineProps<{
  formData: undefined // 
}>()
const formData = ref({

})
const formData2 = ref({

})
watch(
  () => props.formData,
  async (val) => {
    formData.value = val
    if (!val.workorderId) return
    formData2.value = await ProductionApi.getWorkorder(val.workorderId)
    formData2.value.adjuncts = formData2.value.adjuncts ? formData2.value.adjuncts : ''
    formData2.value.requestDate = formData2.value.requestDate ? formData2.value.requestDate : undefined
  },
  { immediate: true }
)
</script>
<!-- eslint-disable linebreak-style -->
<!-- eslint-disable prettier/prettier -->
<style lang="scss" scoped></style>
