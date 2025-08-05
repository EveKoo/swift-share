<!-- src/views/NotFound.vue -->
<template>
    <div class="not-found">
        <h1>404</h1>
        <p>页面未找到</p>
        <router-link to="/">返回首页</router-link>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>

<style scoped>
.not-found {
    text-align: center;
    padding: 50px;
}
</style>