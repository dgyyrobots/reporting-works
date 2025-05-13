<template>

  <div class="content">
    <div class="top">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item >报警</el-breadcrumb-item>
      <el-breadcrumb-item>报警记录</el-breadcrumb-item>
     </el-breadcrumb>
      <el-button  @click="resetQuery" type="primary"><Icon icon="ep:refresh" class="mr-5px" /> 刷新</el-button>
    </div>
  <ContentWrap>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="list"   :height="tableHeight">
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="用户类型" align="center" prop="userType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType" />
          </template>
        </el-table-column>
        <el-table-column label="用户编号" align="center" prop="userId" width="80" />
        <el-table-column label="模板编码" align="center" prop="templateCode" width="80" />
        <el-table-column label="发送人名称" align="center" prop="templateNickname" width="180" />
        <el-table-column
          label="模版内容"
          align="center"
          prop="templateContent"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="模版参数"
          align="center"
          prop="templateParams"
          width="180"
          show-overflow-tooltip
        >
          <template #default="scope"> {{ scope.row.templateParams }}</template>
        </el-table-column>
        <el-table-column label="模版类型" align="center" prop="templateType" width="120">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE" :value="scope.row.templateType" />
          </template>
        </el-table-column>
        <el-table-column label="是否已读" align="center" prop="readStatus" width="100">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.readStatus" />
          </template>
        </el-table-column>
        <el-table-column
          label="阅读时间"
          align="center"
          prop="readTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column label="操作" align="center" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openDetail(scope.row)"
              v-hasPermi="['system:notify-message:query']"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
    <!-- 表单弹窗：详情 -->
    <NotifyMessageDetail ref="detailRef" />
  </div>  

  </template>
  <script lang="ts" setup>
  import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
  import { dateFormatter } from '@/utils/formatTime'
  import * as NotifyMessageApi from '@/api/system/notify/message'
  import NotifyMessageDetail from './NotifyMessageDetail.vue'

  defineOptions({ name: 'SystemNotifyMessage' })
  
  const loading = ref(true) // 列表的加载中
  const total = ref(0) // 列表的总页数
  const list = ref([]) // 列表的数据
  const windowHeight = ref(window.innerHeight)
  const tableHeight = computed(() => windowHeight.value - 260)
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    userType: undefined,
    userId: undefined,
    templateCode: undefined,
    templateType: undefined,
    createTime: []
  })
  const queryFormRef = ref() // 搜索的表单
  
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await NotifyMessageApi.getNotifyMessagePage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }
  
  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    getList()
  }
  
  /** 重置按钮操作 */
  const resetQuery = () => {
    // console.log(6666)
    // queryFormRef.value.resetFields()
    handleQuery()
  }
  
  /** 详情操作 */
  const detailRef = ref()
  const openDetail = (data: NotifyMessageApi.NotifyMessageVO) => {
    detailRef.value.open(data)
  }
  
  /** 初始化 **/
  onMounted(() => {
    getList()
  })
  </script>
  <style lang="scss" scoped>
.content {
  padding: 14px 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  
  .top {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  // 添加ContentWrap样式控制
  :deep(.el-card) {
    width: 100%;
    overflow: hidden;
    
    .el-card__body {
      overflow-x: auto;
    }
  }
  
  // 控制表格宽度和滚动
  :deep(.el-table) {
    width: 100%;
    
    // 表格内容过多时显示横向滚动条
    .el-table__body-wrapper {
      overflow-x: auto;
    }
  }
}
</style>