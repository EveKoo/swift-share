<!-- src/views/swift/SwiftSearch.vue -->
<template>
    <div class="swift-search">
        <h2>�� 搜索</h2>
        <p>关键词: {{ keyword }}</p>
        <p>类型: {{ type }}</p>
    </div>
</template>

<script>
export default {
    name: 'SwiftSearch',
    props: {
        keyword: String,
        type: String
    }
}
</script>

<style scoped>
.swift-search {
    padding: 20px;
    text-align: center;
}
</style>