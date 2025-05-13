<template>
  <div class="login-container">
    <div v-show="theme.showLanguage || theme.showColorPicker || theme.showDark" class="login-right-tools">
      <!-- <vab-language v-show="theme.showLanguage" />  暂时隐藏,功能缺失-->
      <vab-color-picker v-show="theme.showColorPicker" />
      <vab-dark v-show="theme.showDark" />
    </div>
    <div class="login-form">
      <img alt="" class="left-img" :src="leftImg" />
      <el-form ref="formRef" label-position="left" :model="form" :rules="rules" @submit.prevent>
        <!--        <div class="title">{{ title }}</div>-->
        <div class="title">
          <img :alt="title" :src="logo" />
        </div>
        <div class="title-tips">报工系统登录</div>
        <el-form-item class="!hidden" prop="tenantName">
          <el-input v-model.trim="form.tenantName" clearable :placeholder="translate('请输入租户名称')" type="text">
            <template #prefix>
              <vab-icon icon="home-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model.trim="form.username" v-focus clearable :placeholder="translate('请输入用户名')" type="text">
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model.trim="form.password"
            clearable
            :placeholder="translate('请输入密码')"
            show-password
            :type="passwordType"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item size="small">
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6">
              <el-checkbox v-model="form.rememberMe">
                {{ translate('login.remember') }}
              </el-checkbox>
            </el-col>
            <el-col :offset="6" :span="12">
              <!-- <el-link style="float: right" type="primary">{{ translate('login.forgetPassword') }}</el-link> -->
            </el-col>
          </el-row>
        </el-form-item>
        <el-button v-throttle="getCode" class="login-btn" :loading="loading" native-type="submit" type="primary">
          {{ translate('登录') }}
        </el-button>
        <v-verify
          ref="verify"
          :captcha-type="captchaType"
          :img-size="{ width: '400px', height: '200px' }"
          mode="pop"
          @success="handleLogin"
        />
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import { getTenantIdByName, login } from '/@/api/login'
import leftImg from '/@/assets/login_images/left_img_5.png'
import { Verify as vVerify } from '/@/components/Verifition'
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'
import { useAppStore } from '/@/store/modules/app'
import { getLoginForm, removeLoginForm, setLoginForm, setTenantId, setToken, removeToken } from '/@/utils/auth.ts'
import { isPassword } from '/@/utils/validate'
import { useUserStore } from '/@/store/modules/user'

defineOptions({
  name: 'Login',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const appStore = useAppStore()
const { theme } = storeToRefs(settingsStore)
const { systemLogo: logo, title } = storeToRefs(appStore)
const loading = ref<boolean>(false)
const passwordType = ref<string>('password')
const captchaType = ref<string>('blockPuzzle')
const redirect = ref<any>(undefined)
const formRef = ref<any>(null)
const passwordRef = ref<any>(null)
const verify = ref<any>(null)
const form = reactive<any>({
  tenantName: '',
  username: '',
  password: '',
  captchaVerification: '',
  rememberMe: false,
})

const validateUsername = (rule: any, value: any, callback: any) => {
  if ('' === value) callback(new Error(translate('用户名不能为空')))
  else callback()
}
const validateTenantName = (rule: any, value: any, callback: any) => {
  if ('' === value) callback(new Error(translate('租户名称不能为空')))
  else callback()
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!isPassword(value)) callback(new Error(translate('密码不能少于6位')))
  else callback()
}

const rules = reactive<any>({
  tenantName: [
    {
      required: true,
      trigger: 'blur',
      validator: validateTenantName,
    },
  ],
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validateUsername,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword,
    },
  ],
})

const getCookie = () => {
  const loginForm = getLoginForm()
  if (loginForm) {
    Object.assign(form, {
      ...form,
      username: loginForm.username ? loginForm.username : form.username,
      password: loginForm.password ? loginForm.password : form.password,
      rememberMe: loginForm.rememberMe ? true : false,
      tenantName: loginForm.tenantName ? loginForm.tenantName : form.tenantName,
    })
  }
}

const handleRoute = () => {
  return redirect.value === '/404' || redirect.value === '/403' ? '/' : redirect.value
}
// 获取租户 ID
const getTenantId = async () => {
  if (import.meta.env.VITE_APP_TENANT_ENABLE === 'true') {
    const res = await getTenantIdByName(form.tenantName)
    setTenantId(res)
  }
}

const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (import.meta.env.VITE_APP_CAPTCHA_ENABLE === 'false') {
    await handleLogin().catch((e) => {
      console.log(e)
    })
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}

const handleLogin = async (params = { captchaVerification: null }) => {
  if (formRef.value)
    formRef.value.validate(async (valid: any) => {
      let elLoading = null
      if (valid)
        try {
          await getTenantId()
          loading.value = true
          form.captchaVerification = params.captchaVerification
          const res = await login(form)
          if (!res) {
            return
          }
          elLoading = ElLoading.service({
            lock: true,
            text: '正在加载系统中...',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          if (form.rememberMe) {
            setLoginForm(form)
          } else {
            removeLoginForm()
          }
          setToken(res)
          await router.push(handleRoute())
        } finally {
          loading.value = false
          elLoading?.close()
        }
    })
}

watch(
  () => appStore.getTitle,
  (title) => {
    if (title) {
      form.tenantName = title
    }
  },
  {
    immediate: true,
  }
)
onBeforeMount(() => {})

watchEffect(() => {
  redirect.value = (route.query && route.query.redirect) || '/'
})

onMounted(() => {
  removeToken()
  if (route.query.logout === 'true') {
    userStore.loginOut()
  }
  getCookie()
})

onBeforeRouteLeave((to, from, next) => {
  next()
})
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100vh;
  background: linear-gradient(to top, var(--el-color-primary), var(--el-color-primary-light-3));

  .login-right-tools {
    position: fixed;
    top: var(--el-margin);
    right: var(--el-margin);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(var(--el-padding) / 2);
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);

    :deep() {
      .vab-language,
      .vab-color-picker,
      .vab-dark {
        margin: 0 calc(var(--el-padding) / 2) 0 calc(var(--el-padding) / 2) !important;
      }
    }
  }

  @media (max-width: 696px) {
    .login-right-tools {
      display: none;
    }

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
    .login-right-tools {
      display: none;
    }

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
        //font-size: 54px;
        //font-weight: 500;
        //color: var(--el-color-black);
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

      .code {
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;
        border-radius: var(--el-border-radius-base);
      }
    }
  }
}
</style>
