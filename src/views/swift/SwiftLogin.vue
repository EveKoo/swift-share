<!-- src/views/swift/SwiftLogin.vue -->
<template>
    <div class="swift-login">
        <div class="login-form">
            <div class="login-header">
                <div class="login-icon">🎵</div>
                <h2 class="login-title">欢迎回到 SwiftShare</h2>
                <p class="login-subtitle">登录你的霉霉粉丝账户</p>
            </div>

            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                class="login-form-content"
                @submit.prevent="handleLogin"
            >
                                 <el-form-item prop="username">
                     <el-input
                         v-model="loginForm.username"
                         placeholder="用户名或邮箱"
                         size="large"
                         prefix-icon="User"
                         clearable
                     />
                 </el-form-item>

                 <el-form-item prop="password">
                     <el-input
                         v-model="loginForm.password"
                         type="password"
                         placeholder="密码"
                         size="large"
                         prefix-icon="Lock"
                         show-password
                         clearable
                     />
                 </el-form-item>

                <div class="login-options">
                    <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                    <el-link type="primary" :underline="false">忘记密码？</el-link>
                </div>

                <el-form-item>
                    <el-button
                        type="primary"
                        size="large"
                        class="login-btn"
                        :loading="isLoading"
                        @click="handleLogin"
                    >
                        {{ isLoading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="login-divider">
                <span>或者</span>
            </div>

            <div class="social-login">
                <el-button class="social-btn wechat">
                    <el-icon><ChatDotRound /></el-icon>
                    微信登录
                </el-button>
                <el-button class="social-btn qq">
                    <el-icon><Message /></el-icon>
                    QQ登录
                </el-button>
            </div>

            <div class="login-footer">
                <p>还没有账户？ 
                    <el-link type="primary" :underline="false" @click="goToRegister">
                        立即注册
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

export default {
    name: 'SwiftLogin',
    components: {
        ChatDotRound,
        Message
    },
    emits: ['login-success'],
    setup(props, { emit }) {
        const loginFormRef = ref(null)
        const isLoading = ref(false)
        const rememberMe = ref(false)

        const loginForm = reactive({
            username: '',
            password: ''
        })

        const loginRules = {
            username: [
                { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
                { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, message: '密码至少6个字符', trigger: 'blur' }
            ]
        }

        const handleLogin = async () => {
            if (!loginFormRef.value) return

            try {
                await loginFormRef.value.validate()
                isLoading.value = true

                // 模拟登录请求
                await new Promise(resolve => setTimeout(resolve, 1500))

                // 模拟登录成功
                const mockUser = {
                    id: 1,
                    username: loginForm.username,
                    avatar: 'https://via.placeholder.com/40x40/e91e63/ffffff?text=TS',
                    nickname: 'Swiftie_Lover'
                }

                // 保存登录状态
                localStorage.setItem('swift_token', 'mock_token_' + Date.now())
                localStorage.setItem('swift_user', JSON.stringify(mockUser))

                if (rememberMe.value) {
                    localStorage.setItem('swift_remember', 'true')
                }

                ElMessage.success('登录成功！欢迎回到 SwiftShare')
                emit('login-success', mockUser)

            } catch (error) {
                console.error('登录失败:', error)
                ElMessage.error('登录失败，请检查用户名和密码')
            } finally {
                isLoading.value = false
            }
        }

        const goToRegister = () => {
            ElMessage.info('注册功能即将上线，敬请期待！')
        }

        return {
            loginFormRef,
            loginForm,
            loginRules,
            isLoading,
            rememberMe,
            handleLogin,
            goToRegister
        }
    }
}
</script>

<style scoped>
.swift-login {
    padding: 20px 0;
}

.login-form {
    max-width: 400px;
    margin: 0 auto;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    animation: musicNote 2s infinite;
}

.login-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--swift-dark-pink);
    margin-bottom: 8px;
}

.login-subtitle {
    color: var(--swift-text-secondary);
    font-size: 0.9rem;
}

.login-form-content {
    margin-bottom: 24px;
}

.login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.login-btn {
    width: 100%;
    height: 48px;
    border-radius: 24px;
    font-weight: 600;
    background: linear-gradient(135deg, var(--swift-pink) 0%, var(--swift-purple) 100%);
    border: none;
    transition: all 0.3s;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(233, 30, 99, 0.3);
}

.login-divider {
    text-align: center;
    margin: 24px 0;
    position: relative;
}

.login-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--swift-border-light);
}

.login-divider span {
    background: white;
    padding: 0 16px;
    color: var(--swift-text-muted);
    font-size: 0.9rem;
}

.social-login {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.social-btn {
    flex: 1;
    height: 40px;
    border-radius: 20px;
    font-weight: 500;
    transition: all 0.3s;
}

.social-btn.wechat {
    background: #07c160;
    border-color: #07c160;
    color: white;
}

.social-btn.wechat:hover {
    background: #06ad56;
    border-color: #06ad56;
    transform: translateY(-2px);
}

.social-btn.qq {
    background: #12b7f5;
    border-color: #12b7f5;
    color: white;
}

.social-btn.qq:hover {
    background: #0fa3d9;
    border-color: #0fa3d9;
    transform: translateY(-2px);
}

.login-footer {
    text-align: center;
    color: var(--swift-text-secondary);
    font-size: 0.9rem;
}

@keyframes musicNote {
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(10deg);
    }
    75% {
        transform: rotate(-10deg);
    }
}

/* Element Plus 组件样式优化 */
:deep(.el-input__wrapper) {
    border-radius: 12px;
    border: 2px solid var(--swift-border-light);
    transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
    border-color: var(--swift-pink);
}

:deep(.el-input__wrapper.is-focus) {
    border-color: var(--swift-pink);
    box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.1);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: var(--swift-pink);
    border-color: var(--swift-pink);
}

/* 响应式设计 */
@media (max-width: 480px) {
    .social-login {
        flex-direction: column;
    }
    
    .login-options {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
}
</style>