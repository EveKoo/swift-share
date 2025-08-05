<template>
    <div class="notification-center">
        <transition-group name="notification" tag="div" class="notification-list">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                :class="notification.type"
            >
                <div class="notification-icon">
                    <el-icon v-if="notification.type === 'success'"><CircleCheckFilled /></el-icon>
                    <el-icon v-else-if="notification.type === 'error'"><CircleCloseFilled /></el-icon>
                    <el-icon v-else-if="notification.type === 'warning'"><WarningFilled /></el-icon>
                    <el-icon v-else><InfoFilled /></el-icon>
                </div>
                <div class="notification-content">
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
                </div>
                <div class="notification-close" @click="removeNotification(notification.id)">
                    <el-icon><Close /></el-icon>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores'
import { 
    CircleCheckFilled, 
    CircleCloseFilled, 
    WarningFilled, 
    InfoFilled, 
    Close 
} from '@element-plus/icons-vue'

export default {
    name: 'NotificationCenter',
    components: {
        CircleCheckFilled,
        CircleCloseFilled,
        WarningFilled,
        InfoFilled,
        Close
    },
    setup() {
        const appStore = useAppStore()
        
        const notifications = computed(() => appStore.notifications)
        
        const removeNotification = (id) => {
            appStore.removeNotification(id)
        }
        
        const formatTime = (timestamp) => {
            const now = new Date()
            const time = new Date(timestamp)
            const diff = now - time
            
            if (diff < 60000) { // 1分钟内
                return '刚刚'
            } else if (diff < 3600000) { // 1小时内
                return `${Math.floor(diff / 60000)}分钟前`
            } else if (diff < 86400000) { // 1天内
                return `${Math.floor(diff / 3600000)}小时前`
            } else {
                return time.toLocaleDateString()
            }
        }
        
        return {
            notifications,
            removeNotification,
            formatTime
        }
    }
}
</script>

<style scoped>
.notification-center {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    pointer-events: none;
}

.notification-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 400px;
    pointer-events: auto;
    border-left: 4px solid var(--swift-pink);
    transition: all 0.3s ease;
}

.notification-item.success {
    border-left-color: #67c23a;
}

.notification-item.error {
    border-left-color: #f56c6c;
}

.notification-item.warning {
    border-left-color: #e6a23c;
}

.notification-item.info {
    border-left-color: #409eff;
}

.notification-icon {
    margin-right: 12px;
    margin-top: 2px;
    flex-shrink: 0;
}

.notification-item.success .notification-icon {
    color: #67c23a;
}

.notification-item.error .notification-icon {
    color: #f56c6c;
}

.notification-item.warning .notification-icon {
    color: #e6a23c;
}

.notification-item.info .notification-icon {
    color: #409eff;
}

.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-message {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    line-height: 1.4;
}

.notification-time {
    font-size: 0.8rem;
    color: #999;
}

.notification-close {
    margin-left: 12px;
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
    flex-shrink: 0;
    margin-top: 2px;
}

.notification-close:hover {
    color: #666;
}

/* 动画 */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.notification-move {
    transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .notification-center {
        top: 70px;
        right: 10px;
        left: 10px;
    }
    
    .notification-item {
        min-width: auto;
        max-width: none;
    }
}
</style> 