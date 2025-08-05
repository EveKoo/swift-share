<template>
    <div class="swift-register">
        <div class="register-form">
            <div class="register-header">
                <div class="register-icon">🎵</div>
                <h2 class="register-title">加入 SwiftShare</h2>
                <p class="register-subtitle">成为霉霉粉丝社区的一员</p>
            </div>

            <el-form
                ref="registerFormRef"
                :model="registerForm"
                :rules="registerRules"
                class="register-form-content"
                @submit.prevent="handleRegister"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="registerForm.username"
                        placeholder="用户名"
                        size="large"
                        prefix-icon="User"
                        clearable
                    />
                </el-form-item>

                <el-form-item prop="nickname">
                    <el-input
                        v-model="registerForm.nickname"
                        placeholder="昵称"
                        size="large"
                        prefix-icon="UserFilled"
                        clearable
                    />
                </el-form-item>

                <el-form-item prop="email">
                    <el-input
                        v-model="registerForm.email"
                        placeholder="邮箱"
                        size="large"
                        prefix-icon="Message"
                        clearable
                    />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        v-model="registerForm.password"
                        type="password"
                        placeholder="密码"
                        size="large"
                        prefix-icon="Lock"
                        show-password
                        clearable
                    />
                </el-form-item>

                <el-form-item prop="confirmPassword">
                    <el-input
                        v-model="registerForm.confirmPassword"
                        type="password"
                        placeholder="确认密码"
                        size="large"
                        prefix-icon="Lock"
                        show-password
                        clearable
                    />
                </el-form-item>

                <div class="register-options">
                    <el-checkbox v-model="agreeTerms">
                        我已阅读并同意
                        <el-link type="primary" :underline="false">用户协议</el-link>
                        和
                        <el-link type="primary" :underline="false">隐私政策</el-link>
                    </el-checkbox>
                </div>

                <el-form-item>
                    <el-button
                        type="primary"
                        size="large"
                        class="register-btn"
                        :loading="isLoading"
                        @click="handleRegister"
                    >
                        {{ isLoading ? '注册中...' : '立即注册' }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="register-divider">
                <span>或者</span>
            </div>

            <div class="social-register">
                <el-button class="social-btn wechat">
                    <el-icon><ChatDotRound /></el-icon>
                    微信注册
                </el-button>
                <el-button class="social-btn qq">
                    <el-icon><Message /></el-icon>
                    QQ注册
                </el-button>
            </div>

            <div class="register-footer">
                <p>已有账户？ 
                    <el-link type="primary" :underline="false" @click="goToLogin">
                        立即登录
                    </el-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ChatDotRound, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

export default {
    name: 'SwiftRegister',
    components: {
        ChatDotRound,
        Message
    },
    emits: ['register-success', 'switch-to-login'],
    setup(props, { emit }) {
        const registerFormRef = ref(null)
        const isLoading = ref(false)
        const agreeTerms = ref(false)

        const registerForm = reactive({
            username: '',
            nickname: '',
            email: '',
            password: '',
            confirmPassword: ''
        })

        const validateConfirmPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== registerForm.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }

        const registerRules = {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
            ],
            nickname: [
                { required: true, message: '请输入昵称', trigger: 'blur' },
                { min: 2, max: 20, message: '昵称长度在2到20个字符', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
            ],
            confirmPassword: [
                { required: true, validator: validateConfirmPassword, trigger: 'blur' }
            ]
        }

        const handleRegister = async () => {
            if (!registerFormRef.value) return

            if (!agreeTerms.value) {
                ElMessage.warning('请先同意用户协议和隐私政策')
                return
            }

            try {
                await registerFormRef.value.validate()
                isLoading.value = true

                // eslint-disable-next-line no-unused-vars
                const { confirmPassword, ...registerData } = registerForm
                const response = await userApi.register(registerData)
                
                if (response.code === 200) {
                    ElMessage.success('注册成功！')
                    emit('register-success', response.data)
                } else {
                    ElMessage.error(response.message || '注册失败')
                }
            } catch (error) {
                console.error('注册错误:', error)
                ElMessage.error(error.message || '注册失败，请检查输入信息')
            } finally {
                isLoading.value = false
            }
        }

        const goToLogin = () => {
            emit('switch-to-login')
        }

        return {
            registerFormRef,
            registerForm,
            registerRules,
            isLoading,
            agreeTerms,
            handleRegister,
            goToLogin
        }
    }
}
</script>

<style scoped>
.swift-register {
    padding: 20px;
}

.register-form {
    max-width: 400px;
    margin: 0 auto;
}

.register-header {
    text-align: center;
    margin-bottom: 30px;
}

.register-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.register-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.register-subtitle {
    color: #666;
    font-size: 14px;
}

.register-form-content {
    margin-bottom: 24px;
}

.register-options {
    margin-bottom: 24px;
}

.register-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%);
    border: none;
    border-radius: 8px;
}

.register-btn:hover {
    background: linear-gradient(135deg, #c2185b 0%, #7b1fa2 100%);
}

.register-divider {
    text-align: center;
    margin: 24px 0;
    position: relative;
}

.register-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e0e0e0;
}

.register-divider span {
    background: white;
    padding: 0 16px;
    color: #666;
    font-size: 14px;
}

.social-register {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.social-btn {
    flex: 1;
    height: 40px;
    border-radius: 8px;
    font-size: 14px;
}

.social-btn.wechat {
    background: #07c160;
    border-color: #07c160;
    color: white;
}

.social-btn.qq {
    background: #12b7f5;
    border-color: #12b7f5;
    color: white;
}

.register-footer {
    text-align: center;
    color: #666;
    font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 480px) {
    .swift-register {
        padding: 16px;
    }
    
    .register-form {
        max-width: 100%;
    }
    
    .social-register {
        flex-direction: column;
    }
}
</style> 