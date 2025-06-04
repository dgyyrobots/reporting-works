<template>
  <div class="login-container">
    <div class="login-form">
      <img alt="" class="left-img" :src="leftImg" />
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
  baseURL: 'http://172.16.12.99', // 添加
  // baseURL: '', // 添加
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

          const response = await loginAxios.post('/mes/login/login', loginData)

  
          if (!response.data || response.status !== 200) {
            ElMessage.error(response.data?.message || '登录失败')
            return
          }

    
          const res = response.data.data


          // 存储登录信息到本地存储
          localStorage.setItem('loginInfo', JSON.stringify(res))

        // 存储登录信息到cookies
        if( res.iworkerid ) {
          Cookies.set('IWORKERID', res.iworkerid)
          Cookies.set('stored_company', res.stored_company)
          Cookies.set('stored_iworker', res.stored_iworker)
          // 设置其他可能需要的 Cookie
          Cookies.set('login_from_6_1_1', '1')
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

onMounted(() => {
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
  background: linear-gradient(to top, var(--el-color-primary), var(--el-color-primary-light-3));

  @media (max-width: 696px) {
    .login-form {
      width: 90vw !important;
      margin: auto !important;

      .left-img {
        display: none !important;
      }

      :deep() {
        .el-form--default {
          width: 100% !important;
          margin-right: auto !important;
          margin-left: auto !important;
        }
      }
    }
  }

  @media (min-width: 696px) and (max-width: 999px) {
    .login-form {
      width: 90vw !important;
      margin: auto !important;

      :deep() {
        .el-form--default {
          width: 50% !important;
        }
      }
    }
  }

  .login-form {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1000px;
    height: 550px;
    padding: 4.5vh;
    margin: auto;
    overflow: hidden;
    background: var(--el-color-white);
    background-size: 100% 100%;
    border: 1px solid var(--el-border-color);
    border-radius: 15px;
    transition: var(--el-transition);

    .left-img {
      width: 50%;
    }

    :deep() {
      * {
        transition: var(--el-transition);
      }

      .el-form--default {
        width: 45%;
      }

      .title {
        height: 80px;
        display: flex;
        align-items: center;
      }

      .title img {
        height: 200px;
      }

      .title-tips {
        margin-top: 29px;
        font-size: 26px;
        font-weight: 400;
        color: var(--el-color-black);
      }

      .login-btn {
        width: 100%;
        height: 50px;
      }

      .el-form-item {
        margin: 20px 0;

        &__error {
          position: absolute;
          font-size: var(--el-font-size-small);
          line-height: 18px;
          color: var(--el-color-error);
        }

        .el-input {
          width: 100%;
          height: 48px;
          line-height: 48px;
        }
      }
    }
  }
}
</style>
