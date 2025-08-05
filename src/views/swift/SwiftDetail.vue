<!-- src/views/swift/SwiftDetail.vue -->
<template>
    <div class="swift-detail">
        <h2>📄 内容详情</h2>
        <p>ID: {{ $route.params.id }}</p>
    </div>
</template>

<script>
export default {
    name: 'SwiftDetail'
}
</script>

<style scoped>
.swift-detail {
    padding: 20px;
    text-align: center;
}
</style>