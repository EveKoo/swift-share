<template>
  <div class="home">
    <h1>Welcome to SwiftShare</h1>
    <p>Taylor Swift Video Sharing Platform</p>
    <el-button type="primary" @click="showMessage">Click Me</el-button>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  name: 'HomePage', // 改为多词组件名
  methods: {
    showMessage() {
      ElMessage.success('Hello Swiftie! 🎵')
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 50px 20px;
}

h1 {
  color: #e91e63; /* 霉霉粉色 */
  margin-bottom: 20px;
  font-size: 2.5em;
}

p {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.2em;
}
</style>