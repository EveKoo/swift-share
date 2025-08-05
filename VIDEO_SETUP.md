# 视频播放功能实现说明

## 功能概述

本项目实现了点击视频播放的功能，用户可以在首页点击任意视频项目来播放视频。

## 实现细节

### 1. 组件结构

- **SwiftHome.vue**: 主页面，包含视频列表
- **VideoPlayer.vue**: 视频播放器组件，负责实际的视频播放功能

### 2. 数据流

1. 用户在 SwiftHome.vue 中点击视频项目
2. 触发 `viewDetail(id)` 方法
3. 设置 `currentVideo` 数据
4. 显示 VideoPlayer 组件
5. VideoPlayer 组件接收视频数据并开始播放

### 3. 关键代码

#### SwiftHome.vue 中的播放方法
```javascript
const viewDetail = (id) => {
    // 假设 trendingContent 中的 item 是视频
    const item = trendingContent.value.find(item => item.id === id);
    if (item) {
        currentVideo.value = {
            id: item.id,
            title: item.title,
            cover: item.cover,
            url: item.url // 视频URL
        };
        showVideoPlayer.value = true;
        ElMessage.success(`正在播放: ${item.title}`);
    } else {
        // 如果 item 不是视频，则跳转到详情页
        router.push(`/detail/${id}`);
    }
}
```

#### VideoPlayer.vue 中的视频播放
```javascript
<video
    ref="videoRef"
    :src="video?.url"
    :poster="video?.thumbnail"
    controls
    preload="metadata"
    class="video-element"
    @loadedmetadata="onVideoLoaded"
    @timeupdate="onTimeUpdate"
    @ended="onVideoEnded"
    @play="onPlay"
    @pause="onPause"
>
    您的浏览器不支持视频播放
</video>
```

### 4. 视频数据格式

每个视频项目包含以下属性：
```javascript
{
    id: 1,
    title: 'Taylor Swift - Cruel Summer (Live)',
    description: 'Eras Tour 现场版精彩表演，感受现场的热烈氛围。霉霉的精彩演出让所有观众都为之疯狂！',
    cover: '封面图片URL',
    thumbnail: '缩略图URL',
    views: 1200000,
    likes: 89000,
    comments: 2300,
    badge: 'HOT',
    url: '/videos/cruel-summer-live.mp4',
    tags: ['Live', 'Eras Tour', 'Cruel Summer']
}
```

### 5. 功能特性

- ✅ 点击视频项目播放视频
- ✅ 显示视频播放器模态框
- ✅ 视频控制（播放/暂停/进度条/音量）
- ✅ 视频信息显示（标题、描述、观看次数等）
- ✅ 点赞和收藏功能
- ✅ 分享功能
- ✅ 相关视频推荐
- ✅ 标签显示
- ✅ 响应式设计

### 6. 使用方法

1. 启动项目：`npm run serve`
2. 访问首页
3. 在"热门推荐"部分点击任意视频项目
4. 视频播放器会自动打开并开始播放

### 7. 视频文件配置

#### 当前视频文件
项目现在包含以下视频文件（位于 `public/videos/` 目录）：
- `cruel-summer-live.mp4`
- `midnights-review.mp4`
- `eras-tour-bts.mp4`

#### 如何添加真实视频文件

1. **替换现有文件**：
   - 将您的视频文件重命名为对应的文件名
   - 替换 `public/videos/` 目录中的文件

2. **添加新视频**：
   - 将视频文件放入 `public/videos/` 目录
   - 更新 `src/views/swift/SwiftHome.vue` 中的 `trendingContent` 数据

3. **使用在线视频**：
   - 直接在视频数据中使用在线视频文件的URL

### 8. 支持的视频格式

- MP4 (.mp4)
- WebM (.webm)
- OGV (.ogv)
- MOV (.mov)

### 9. 注意事项

1. **版权问题**：请确保您有使用视频文件的合法权限
2. **文件大小**：建议视频文件大小不超过 100MB，以确保快速加载
3. **编码格式**：推荐使用 H.264 编码的 MP4 格式，兼容性最好
4. **分辨率**：建议使用 720p 或 1080p 分辨率

### 10. 测试方法

1. **视频测试页面**：
   ```
   http://localhost:8080/video-test.html
   ```
   这个页面可以测试所有视频文件是否可以正常播放

2. **主页面测试**：
   ```
   http://localhost:8080
   ```
   在首页点击任意视频项目，视频播放器会自动打开

### 11. 故障排除

如果视频无法播放，请检查：
1. 文件路径是否正确
2. 文件格式是否支持
3. 浏览器控制台是否有错误信息
4. 文件是否损坏
5. 视频编码是否兼容

## 技术栈

- Vue 3 (Composition API)
- Element Plus UI 组件库
- HTML5 Video API
- CSS3 动画效果 