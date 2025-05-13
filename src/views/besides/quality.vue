<template>
    <div class="content">
      <el-menu :default-active="route.name" router  mode="horizontal" :ellipsis="false">
          <el-menu-item index="iqc">
            <img src="" alt="" style="width: 20px; height: 20px; margin-left: 12px; margin-right: 12px" />
            <span>来料检验</span>
          </el-menu-item>
          <el-menu-item index="oqc">
            <img src="" alt="" style="width: 20px; height: 20px; margin-left: 12px; margin-right: 12px" />
            <span>出库检验</span>
          </el-menu-item>
          <!-- <el-menu-item index="fqlist" :route="{ name: 'fqlist', query: { type: '课程管理' } }">
            <img src="" alt="" style="width: 20px; height: 20px; margin-left: 12px; margin-right: 12px" />
            <span>单独报工</span>
          </el-menu-item>
          <el-menu-item index="jslist" :route="{ name: 'jslist', query: { type: '课程管理' } }">
            <img src="" alt="" style="width: 20px; height: 20px; margin-left: 12px; margin-right: 12px" />
            <span>班组名单</span>
          </el-menu-item>
          <el-menu-item index="jy">
            <img src="" alt="" style="width: 20px; height: 20px; margin-left: 12px; margin-right: 12px" />
            <span>报工记录</span>
          </el-menu-item> -->
        </el-menu>
      <div >
        <!-- <iqc></iqc> -->
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import iqc from './quality/iqc/index.vue'
  import { DICT_TYPE } from '/@/utils/dict'
  import { Delete, Search, Plus } from '@element-plus/icons-vue'
  import type { TableInstance } from 'element-plus'
  import { deleteWorkorder, getWorkorderPage } from '/@/api/workOrder'
  const route = useRoute()
  defineOptions({
    name: 'WorkOrder',
  })
  
  const tableRef = ref<TableInstance>()
  const list = ref<any>([])
  const listLoading = ref<boolean>(true)
  const total = ref<number>(0)
  const selectRows = ref<any>([])
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 20,
  })
  
  onActivated(() => {
    tableRef.value?.doLayout()
  })
  
  const fetchData = async () => {
    listLoading.value = true
    const data = await getWorkorderPage(queryForm)
    console.log(data)
    list.value = data.list
    total.value = data.total
    listLoading.value = false
  }
  



  
  onBeforeMount(() => {
    fetchData()
  })
  </script>
  <style scoped>

 
  </style>
  