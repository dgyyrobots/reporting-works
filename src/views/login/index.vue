<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-left">
        <img alt="" class="left-img" :src="leftImg" />
      </div>
      <div class="login-right">
        <el-form ref="formRef" label-position="left" :model="form" :rules="rules" @submit.prevent>
          <div class="title">
            <img :alt="title" :src="logo" />
          </div>
          <div class="title-tips">报工系统登录</div>
          <el-form-item prop="userName">
            <el-input v-model.trim="form.userName" v-focus clearable :placeholder="translate('请输入用户名')" type="text">
              <template #prefix>
                <vab-icon icon="user-line" />
              </template>
            </el-input>
          </el-form-item>

          <el-button v-throttle="getCode" class="login-btn" :loading="loading" native-type="submit" type="primary">
            {{ translate('登录') }}
          </el-button>
        </el-form>
      </div>
    </div>
    
    <!-- 工作中心选择弹框 -->
    <el-dialog
      v-model="workcenterDialogVisible"
      title="选择工作中心"
      width="80%"
      :close-on-click-modal="false"
      :show-close="true"
    >
      <workcenter-select @select="handleWorkcenterSelect" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElLoading, ElMessage, ElDialog } from 'element-plus'
import leftImg from '/@/assets/login_images/left_img_5.png'
import { translate } from '/@/i18n'
import { useAppStore } from '/@/store/modules/app'
import { getLoginForm, setToken, removeToken } from '/@/utils/auth.ts'
import { useUserStore } from '/@/store/modules/user'
import { getUserInfo } from '/@/api/login' // 导入getUserInfo接口
import axios from 'axios'
import type { TokenType } from '/@/api/login/types'
import WorkcenterSelect from './components/WorkcenterSelect.vue'
import Cookies from 'js-cookie'  // 需要安装 js-cookie 依赖

defineOptions({
  name: 'Login',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const { systemLogo: logo, title } = storeToRefs(appStore)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const workcenterDialogVisible = ref<boolean>(false)
const selectedWorkcenter = ref<any>(null)

// 创建 loginAxios 实例
const loginAxios = axios.create({
  // baseURL: 'http://172.16.12.99', // 添加
  baseURL: '', // 添加
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// 表单数据
const form = reactive<any>({
  userName: '',
})

// 用户名验证规则
const rules = reactive<any>({
  userName: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入用户名',
    },
  ],
})

// 登录方法
const handleLogin = async () => {
  if (formRef.value)
    formRef.value.validate(async (valid: any) => {
      let elLoading = null
      if (valid)
        try {
          loading.value = true

          // 使用独立的 axios 实例发送登录请求
          const loginData = {
            userName: String(form.userName),
          }

          const response = await loginAxios.post('/zy/mes/login/login', loginData)

  
          if (!response.data || response.status !== 200) {
            ElMessage.error(response.data?.message || '登录失败')
            return
          }

    
          const res = response.data.data

          console.log(res, 'res -- 登录的res')
        // 存储登录信息到cookies
        if( res.iworkerid ) {
          Cookies.set('IWORKERID', decodeURIComponent(res.iworkerid))
          Cookies.set('login_from_6_1_1', '1')
          // 设置其他可能需要的 Cookie
          document.cookie = `stored_iworker=${res.stored_iworker}; path=/;`;
          document.cookie = `stored_company=${res.stored_company}; path=/;`;
        }


          elLoading = ElLoading.service({
            lock: true,
            text: '正在加载系统中...',
            background: 'rgba(0, 0, 0, 0.7)',
          })

          // 设置token，满足TokenType接口要求
          const tokenData: TokenType = {
            accessToken: res.access_token,
          }

          setToken(tokenData)

          console.log(tokenData, 'tokenData')

          // 存储登录信息到本地存储
          localStorage.setItem('loginInfo', JSON.stringify(res))
          
          // 获取用户信息
          try {
            const userInfoRes = await getUserInfo()
            if (userInfoRes && userInfoRes.data) {
              userInfoRes.data.userId  =res.userId
              // 存储用户信息
              localStorage.setItem('userInfo', JSON.stringify(userInfoRes.data))
            }
          } catch (userInfoError) {
            console.error('获取用户信息失败:', userInfoError)
          }
          
          // 登录成功后显示工作中心选择弹框
          setTimeout(() => {
            workcenterDialogVisible.value = true
          }, 200);
          
          if (elLoading) {
            elLoading.close()
          }
        } catch (error) {
          console.error('登录出错:', error)
          ElMessage.error('登录失败，请检查网络或服务器状态')
        } finally {
          loading.value = false
        }
    })
}

// 处理工作中心选择
const handleWorkcenterSelect = (workcenter) => {
  selectedWorkcenter.value = workcenter
  workcenterDialogVisible.value = false
  
  // 存储选择的工作中心信息
  localStorage.setItem('selectedWorkcenter', JSON.stringify(workcenter))
  
  // 选择工作中心后跳转到首页
  router.push({
    path: '/',
  })
}

// 获取Cookie
const getCookie = () => {
  const loginForm = getLoginForm()
  if (loginForm) {
    Object.assign(form, {
      ...form,
      userName: loginForm.username ? loginForm.username : form.userName,
    })
  }
}

// 获取验证码按钮点击事件
const getCode = async () => {
  await handleLogin().catch((e) => {
    console.log(e)
  })
}

// 清除所有 cookies 的函数
const clearAllCookies = () => {
  // 获取所有 cookie
  const cookies = document.cookie.split(';')
  
  // 遍历并删除每个 cookie
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
    
    // 使用 js-cookie 删除 cookie
    Cookies.remove(name)
    
    // 为了确保删除，也使用原生方式设置过期时间为过去
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname
  }
  
  console.log('所有 cookies 已清除')
}

onMounted(() => {
  // 清除所有 cookies
  clearAllCookies()
  removeToken()
  if (route.query.logout === 'true') {
    userStore.loginOut()
  }
  getCookie()
})
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/@/assets/login_images/bg-pattern.png');
    opacity: 0.05;
    pointer-events: none;
  }

  .login-form {
    display: flex;
    width: 1000px;
    height: 550px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 16px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    
    .login-left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #066bb9 0%, #0a4d8c 100%);
      padding: 20px;
      
      .left-img {
        width: 100%;
        max-width: 400px;
        object-fit: contain;
        filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
      }
    }
    
    .login-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    :deep() {
      .el-form--default {
        width: 100%;
        max-width: 360px;
      }

      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        
        img {
          height: 80px;
          transition: transform 0.3s ease;
          
          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .title-tips {
        text-align: center;
        margin: 15px 0 30px;
        font-size: 24px;
        font-weight: 600;
        color: #066bb9;
        letter-spacing: 2px;
        position: relative;
        

      }

      .el-form-item {
        margin-bottom: 25px;
        
        .el-input {
          height: 50px;
          
          .el-input__wrapper {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            
            &:hover, &:focus-within {
              box-shadow: 0 3px 12px rgba(6, 107, 185, 0.15);
            }
          }
          
          .el-input__inner {
            height: 50px;
            font-size: 16px;
          }
        }
      }

      .login-btn {
        width: 100%;
        height: 50px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 1px;
        background: linear-gradient(to right, #066bb9, #0a4d8c);
        border: none;
        box-shadow: 0 4px 12px rgba(6, 107, 185, 0.3);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(6, 107, 185, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  @media (max-width: 1024px) {
    .login-form {
      width: 90%;
      max-width: 800px;
    }
  }

  @media (max-width: 768px) {
    .login-form {
      flex-direction: column;
      height: auto;
      max-height: 90vh;
      
      .login-left {
        display: none;
      }
      
      .login-right {
        padding: 30px 20px;
      }
    }
  }
}

// 添加对话框样式优化
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  
  .el-dialog__header {
    background: #066bb9;
    padding: 15px 20px;
    margin: 0;
    
    .el-dialog__title {
      color: white;
      font-weight: 500;
    }
    
    .el-dialog__close {
      color: white;
      
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  .el-dialog__body {
    padding: 25px;
  }
}
</style>
