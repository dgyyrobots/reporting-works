<template>
  <el-dialog
    v-model="visible"
    :title="isSingleMode ? '请选择人员' : '请选择'"
    width="1100px"
    :close-on-click-modal="false"
    class="choose-person-dialog"
    :before-close="handleClose"
  >
    <div class="dialog-content">
      <div class="left-panel">
        <div class="panel-title">成员</div>
        <div class="search-box">
          <input v-model="searchKeyword" placeholder="请输入关键词搜索" class="search-input">
          <el-button class="search-btn" @click="handSearch">
                <Icon icon="svg-icon:search" />
          </el-button>
        </div>
        <div class="alphabet-filter">
          <span 
            class="filter-item" 
            :class="{ active: currentLetter === 'all' }"
            @click="filterByLetter('all')"
          >全部</span>
          <span 
            v-for="letter in alphabetList" 
            :key="letter" 
            class="filter-item"
            :class="{ active: currentLetter === letter }"
            @click="filterByLetter(letter)"
          >
            {{ letter }}
          </span>
        </div>
        <div class="person-list">
        <div v-for="(group, key) in groupedPersons" :key="key" class="person-group">
          <div class="group-title">{{ key }}</div>
          <div 
            v-for="person in group" 
            :key="person.id" 
            class="person-item" 
            @click="handlePersonClick(person)"
          >
            {{ person.fullname }} 
            <span class="company-name">({{ person.org_name }})</span>
          </div>
        </div>
        <div v-if="Object.keys(groupedPersons).length === 0" class="no-data">
          暂无数据
        </div>
      </div>
        <div class="pagination">
          <span class="page-btn prev" @click="handPageBtn(currentPage-1)">
            <Icon icon="svg-icon:arrow-left" />
          </span>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <span class="page-btn next" @click="handPageBtn(currentPage + 1)">
            <Icon icon="svg-icon:arrow-right" />
          </span>
        </div>
      </div>
      <div class="right-panel">
        <div class="panel-title">已选成员</div>
        <div class="selected-list">
          <div v-for="person in selectedPersons" :key="person.id" class="selected-item">
            {{ person.fullname }} <span class="company-name">({{ person.org_name }})</span>
          </div>
          <div v-if="selectedPersons.length === 0" class="no-data">
            暂无选择
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetSelection" v-if="!isSingleMode">重选</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits, defineExpose, defineProps } from 'vue'
import { Icon } from '/@/components/Icon'
import { getPagePicker } from '@/api/mes/wk/index.ts'

const props = defineProps({
  isSingleMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'close'])

// 对话框可见性
const visible = ref(false)

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的字母
const currentLetter = ref('all')

// 字母表过滤
const alphabetList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// 分页和人员总数
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(20)

// 已选人员
const selectedPersons = ref([])

// 人员列表
const personList = ref([])

// 按字母分组的人员列表

const groupedPersons = computed(() => {

  if(!personList.value) {
    return {}
  }
  // 创建结果对象
  const grouped = {}
  
  // 遍历personList.value的所有键（字母索引）
  Object.keys(personList.value).forEach(key => {
    // 跳过非字母键和内部属性
    const persons = personList.value[key];
    if (Array.isArray(persons) && persons.length > 0) {
      grouped[key] = persons;
    }
  });
  
  return grouped;
})
// 获取姓名首字母
const getFirstLetterOfName = (name) => {
  // 判断是否为英文名
  if (/^[A-Za-z]/.test(name)) {
    return name.charAt(0).toUpperCase()
  }
  
  // 中文名根据拼音首字母分组
  // 这里简化处理，实际项目中可能需要使用拼音库
  const pinyinMap = {
    '艾': 'A', '安': 'A', '敖': 'A',
    '白': 'B', '包': 'B', '鲍': 'B', '毕': 'B', '卞': 'B',
    '曹': 'C', '蔡': 'C', '陈': 'C', '程': 'C', '崔': 'C','寸': 'C',
    '邓': 'D', '丁': 'D', '董': 'D', '杜': 'D', '戴': 'D','段': 'D','代': 'D','窦': 'D',
    '范': 'F', '冯': 'F', '傅': 'F', '方': 'F', '房': 'F',
    '高': 'G', '郭': 'G', '顾': 'G', '龚': 'G', '甘': 'G',
    '何': 'H', '胡': 'H', '花': 'H', '黄': 'H', '韩': 'H', '侯': 'H',
    '金': 'J', '江': 'J', '姜': 'J', '蒋': 'J', '贾': 'J', '季': 'J',
    '李': 'L', '刘': 'L', '梁': 'L', '罗': 'L', '林': 'L', '卢': 'L',
    '马': 'M', '孟': 'M', '毛': 'M', '莫': 'M', '梅': 'M',
    '牛': 'N', '倪': 'N', '聂': 'N', '宁': 'N',
    '彭': 'P', '潘': 'P', '庞': 'P', '裴': 'P',
    '钱': 'Q', '秦': 'Q', '邱': 'Q', '乔': 'Q',
    '任': 'R', '阮': 'R', '饶': 'R', '芮': 'R',
    '孙': 'S', '宋': 'S', '苏': 'S', '沈': 'S', '石': 'S', '史': 'S',
    '唐': 'T', '田': 'T', '陶': 'T', '谭': 'T', '汤': 'T',
    '王': 'W', '吴': 'W', '魏': 'W', '汪': 'W', '韦': 'W', '卫': 'W',
    '徐': 'X', '谢': 'X', '夏': 'X', '肖': 'X', '熊': 'X', '项': 'X',
    '杨': 'Y', '叶': 'Y', '袁': 'Y', '姚': 'Y', '尹': 'Y', '严': 'Y',
    '张': 'Z', '赵': 'Z', '郑': 'Z', '周': 'Z', '朱': 'Z', '钟': 'Z', '曾': 'Z',
    '谷': 'G', '樊': 'F', '邹': 'Z', '詹': 'Z', '翟': 'Z','章': 'Z',
    // 可以根据需要添加更多映射
  }
  
  const firstChar = name.charAt(0)
  return pinyinMap[firstChar] || firstChar
}

// 处理搜索
const handSearch = () => {
  // 重置页码
  currentPage.value = 1
  
  // 调用接口获取数据
  fetchData()
}

// 打开对话框
const open = (preSelectedPersons = [], singleMode = null) => {
  // 如果明确传入了singleMode参数，则使用本地变量存储模式
  if (singleMode !== null) {
    isSingleMode.value = singleMode
  }
  
  if (preSelectedPersons.length > 0) {
    selectedPersons.value = [...preSelectedPersons]
  } else {
    selectedPersons.value = []
  }
  
  visible.value = true
  
  // 初始加载数据
  fetchData()
}

// 本地响应式变量存储单选/多选模式
const isSingleMode = ref(props.isSingleMode)

// 处理人员点击
const handlePersonClick = (person) => {
  if (isSingleMode.value) {
    // 单选模式：直接选中并关闭
    emit('confirm', [person])
    visible.value = false
  } else {
    // 多选模式：添加到已选列表
    selectPerson(person)
  }
}

// 选择人员
const selectPerson = (person) => {
  const index = selectedPersons.value.findIndex(p => p.id === person.id)
  if (index === -1) {
    selectedPersons.value.push(person)
  }
}

// 重置选择
const resetSelection = () => {
  selectedPersons.value = []
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 确认选择
const handleConfirm = () => {
  emit('confirm', selectedPersons.value)
  visible.value = false
}

// 获取人员数据
// 获取人员数据
const fetchData = () => {
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
  const data = {
    page: currentPage.value,
    page_size: pageSize.value,
    type:'mate',
    user_type:'0',
    onlyControlled:'0',
    with_not_actived:'0',
    cache_check_key:`ajax/userpicker/page_userpicker{"type":"mate","user_type":0,"onlyControlled":0,"with_not_actived":0,"auth_limit":[]}|company_id:${loginInfo.stored_company}|user_id:${loginInfo.userId}`,
    page:1
  }
  
  // 添加搜索关键词
  if (searchKeyword.value) {
    data.name = searchKeyword.value
  }
  
  // 添加字母筛选
  if (currentLetter.value !== 'all') {
    data.first_letter = currentLetter.value
  }
  
  getPagePicker(data).then(res => {
    if (res && res.data) {
      // 直接使用返回的数据，不需要额外处理
      personList.value = res.data.rows || {}
      
      // 更新分页信息
      totalPages.value = res.data.pages || 1
      currentPage.value = res.data.page || 1
    } else {
      personList.value = {}
      totalPages.value = 1
      currentPage.value = 1
    }
  }).catch(error => {
    console.error('获取人员数据失败:', error)
    personList.value = {}
    totalPages.value = 1
    currentPage.value = 1
  })
}
// 翻页处理
const handPageBtn = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

// 按字母筛选
const filterByLetter = (letter) => {
  currentLetter.value = letter
  currentPage.value = 1
  fetchData()
}

// 暴露方法
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.choose-person-dialog {
  :deep(.el-dialog) {
    background: rgba(0, 21, 41, 0.95);
    border: 1px solid #1ecfff;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(30, 207, 255, 0.4);
  }
  
  :deep(.el-dialog__header) {
    margin-right: 0;
    border-bottom: 1px solid rgba(30, 207, 255, 0.3);
    background: linear-gradient(90deg, #1573ce 0%, #0a2a50 100%);
    padding: 15px 20px;
  }
  
  :deep(.el-dialog__title) {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
  
  :deep(.el-dialog__headerbtn) {
    top: 15px;
    
    .el-dialog__close {
      color: #fff;
    }
  }
  
  :deep(.el-dialog__footer) {
    border-top: 1px solid rgba(30, 207, 255, 0.3);
    padding: 15px 20px;
  }
}

.dialog-content {
  display: flex;
  min-height: 400px;
  color: #fff;
  padding-top: 14px;
}

.left-panel {
  flex: 1;
  border-right: 1px solid rgba(30, 207, 255, 0.3);
  padding-right: 20px;
}

.right-panel {
  width: 450px;
  padding-left: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: 500;
  color: #1ecfff;
  margin-bottom: 15px;
}

.search-box {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  
  .search-input {
    flex: 1;
    height: 32px;
    background-color: rgba(0, 21, 41, 0.5);
    border: 1px solid rgba(30, 207, 255, 0.5);
    border-radius: 4px;
    color: #fff;
    padding: 0 10px;
    outline: none;
    
    &::placeholder {
      color: rgba(182, 234, 255, 0.5);
    }
    
    &:focus {
      border-color: #1ecfff;
    }
  }
  
  .search-btn {
    margin-left: 8px;
    height: 32px;
    padding: 0 12px;
    background-color: rgba(30, 207, 255, 0.2);
    border: 1px solid rgba(30, 207, 255, 0.5);
    color: #1ecfff;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.3);
    }
  }
}

.alphabet-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  
  .filter-item {
    display: inline-block;
    padding: 2px 6px;
    cursor: pointer;
    color: #b6eaff;
    
    &:hover, &.active {
      color: #1ecfff;
    }
  }
}

.person-list {
  height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(30, 207, 255, 0.3);
  background-color: rgba(0, 21, 41, 0.3);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(30, 207, 255, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 21, 41, 0.5);
  }
}

.person-group {
  margin-bottom: 10px;
  
  .group-title {
    font-weight: 500;
    padding: 5px 10px;
    background-color: rgba(30, 207, 255, 0.1);
  }
  
  .person-item {
    padding: 8px 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
    
    .company-name {
      color: #b6eaff;
      opacity: 0.8;
      margin-left: auto;
    }
}
}

.selected-list {
  height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(30, 207, 255, 0.3);
  background-color: rgba(0, 21, 41, 0.3);
  
  .selected-item {
    padding: 8px 15px;
    border-bottom: 1px solid rgba(30, 207, 255, 0.1);
    display: flex;
    justify-content: space-between;
      
    .company-name {
      color: #b6eaff;
      opacity: 0.8;
    }
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(30, 207, 255, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 21, 41, 0.5);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  
  .page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(30, 207, 255, 0.5);
    color: #1ecfff;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }
  
  .page-info {
    margin: 0 10px;
    color: #b6eaff;
  }
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
  
  .el-button {
    margin-left: 10px;
  }
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #b6eaff;
  opacity: 0.6;
}
</style>