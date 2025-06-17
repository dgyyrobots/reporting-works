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
        <div class="panel-title">员工引用属性列表</div>
        <div class="search-box">
          <el-input v-model="searchKeyword" placeholder="" clearable>
            <template #append>
              <el-button>
                <Icon icon="svg-icon:search" />
              </el-button>
            </template>
          </el-input>
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
              {{ person.name }} ({{ person.id }})
            </div>
          </div>
        </div>
        <div class="pagination">
          <span class="page-btn prev">
            <Icon icon="svg-icon:arrow-left" />
          </span>
          <span class="page-info">1 / 6</span>
          <span class="page-btn next">
            <Icon icon="svg-icon:arrow-right" />
          </span>
        </div>
      </div>
      <div class="right-panel">
        <div class="panel-title">已选</div>
        <div class="selected-list">
          <div v-for="person in selectedPersons" :key="person.id" class="selected-item">
            {{ person.name }} ({{ person.id }})
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-checkbox v-model="selectAll" v-if="!isSingleMode">全选</el-checkbox>
        <el-button @click="resetSelection" v-if="!isSingleMode">重选</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="!isSingleMode">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, defineEmits, defineExpose, defineProps } from 'vue'
import { Icon } from '/@/components/Icon'

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
const alphabetList = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// 全选
const selectAll = ref(false)

// 模拟人员数据
const personList = ref([
  { id: '210029', name: 'Andre Sicksch' },
  { id: '230063', name: '白敬华' },
  { id: '040048', name: '陈本洪' },
  { id: '230216', name: '包际晨' },
  { id: '220005', name: '白敬华' },
  { id: '230249', name: '曹宝财' },
  { id: '220040', name: '蔡德' },
  { id: '080507', name: '陈定安' },
  // 添加H开头的人员数据
  { id: '070174', name: '何曦' },
  { id: '230080', name: '何斌' },
  { id: '220032', name: '胡本龙' },
  { id: '160107', name: '花朝克' },
  { id: '230085', name: '何崇孝' },
  { id: '220041', name: '何海兵' },
  { id: '220025', name: '胡凯' }
])

// 已选人员
const selectedPersons = ref([
  { id: '210029', name: 'Andre Sicksch' },
  { id: '230063', name: '白敬华' },
  { id: '040048', name: '陈本洪' }
])

// 按字母分组的人员列表
const groupedPersons = computed(() => {
  // 先根据搜索关键词筛选
  let filtered = personList.value.filter(person => {
    if (!searchKeyword.value) return true
    return person.name.includes(searchKeyword.value) || person.id.includes(searchKeyword.value)
  })
  
  // 再根据选中的字母筛选
  if (currentLetter.value !== 'all') {
    filtered = filtered.filter(person => {
      // 获取姓名首字母拼音
      const firstChar = getFirstLetterOfName(person.name)
      return firstChar === currentLetter.value
    })
  }
  
  const grouped = {}
  
  filtered.forEach(person => {
    // 获取姓名首字母
    const firstChar = getFirstLetterOfName(person.name)
    
    if (!grouped[firstChar]) {
      grouped[firstChar] = []
    }
    
    grouped[firstChar].push(person)
  })
  
  return grouped
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
    '白': 'B', '包': 'B',
    '曹': 'C', '蔡': 'C', '陈': 'C',
    '何': 'H', '胡': 'H', '花': 'H',
    // 可以根据需要添加更多映射
  }
  
  const firstChar = name.charAt(0)
  return pinyinMap[firstChar] || firstChar
}

// 按字母筛选
const filterByLetter = (letter) => {
  currentLetter.value = letter
}

// 打开对话框
const open = (preSelectedPersons = [], singleMode = null) => {
  // 修改这里：不要直接修改props
  // 如果明确传入了singleMode参数，则使用一个本地变量来存储模式
  if (singleMode !== null) {
    isSingleMode.value = singleMode
  }
  
  if (preSelectedPersons.length > 0) {
    selectedPersons.value = [...preSelectedPersons]
  } else {
    selectedPersons.value = []
  }
  visible.value = true
}

// 添加一个本地响应式变量来存储单选/多选模式
const isSingleMode = ref(props.isSingle)

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
  margin-bottom: 15px;
  
  :deep(.el-input__wrapper) {
    background-color: rgba(0, 21, 41, 0.5);
    border: 1px solid rgba(30, 207, 255, 0.5);
    box-shadow: none !important;
  }
  
  :deep(.el-input__inner) {
    color: #fff;
  }
  
  :deep(.el-input-group__append) {
    background-color: rgba(30, 207, 255, 0.2);
    border: 1px solid rgba(30, 207, 255, 0.5);
    color: #1ecfff;
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
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
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
  align-items: center;
  
  .el-checkbox {
    margin-right: auto;
    
    :deep(.el-checkbox__label) {
      color: #fff;
    }
    
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: #1ecfff;
      border-color: #1ecfff;
    }
  }
  
  .el-button {
    margin-left: 10px;
  }
}
</style>