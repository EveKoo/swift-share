# 音乐文件设置说明

## 当前状态

项目现在已经配置了本地音频文件，您可以在 `public/audio/` 目录中找到以下文件：
- `cruel-summer.mp3`
- `anti-hero.mp3`
- `cardigan.mp3`
- `shake-it-off.mp3`

## 如何添加真实的音乐文件

### 方法一：替换现有文件
1. 将您的音乐文件重命名为对应的文件名
2. 替换 `public/audio/` 目录中的文件
3. 确保文件格式为 MP3、WAV 或 OGG

### 方法二：添加新的音乐文件
1. 将您的音乐文件放入 `public/audio/` 目录
2. 更新 `src/views/swift/SwiftHome.vue` 中的 `latestMusic` 数据
3. 添加新的音乐项目：

```javascript
{
    id: 5,
    title: '您的歌曲标题',
    artist: 'Taylor Swift',
    album: '专辑名称',
    cover: '封面图片URL',
    duration: '3:45',
    durationSeconds: 225,
    url: '/audio/您的文件名.mp3'
}
```

### 方法三：使用在线音频文件
如果您有在线音频文件的URL，可以直接在音乐数据中使用：

```javascript
{
    id: 1,
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    album: 'Lover',
    cover: '封面图片URL',
    duration: '3:28',
    durationSeconds: 208,
    url: 'https://您的音频文件URL.mp3'
}
```

## 支持的音频格式

- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- AAC (.aac)

## 注意事项

1. **版权问题**：请确保您有使用音乐文件的合法权限
2. **文件大小**：建议音频文件大小不超过 10MB，以确保快速加载
3. **音质**：建议使用 128kbps 或更高的音质
4. **格式**：推荐使用 MP3 格式，兼容性最好

## 测试音乐播放

1. 启动开发服务器：`npm run serve`
2. 访问 `http://localhost:8080`
3. 在首页点击任意音乐项目
4. 音乐播放器会自动打开并开始播放

## 故障排除

如果音乐无法播放，请检查：
1. 文件路径是否正确
2. 文件格式是否支持
3. 浏览器控制台是否有错误信息
4. 文件是否损坏

## 推荐资源

如果您需要免费的示例音乐文件，可以考虑：
- Free Music Archive
- ccMixter
- Incompetech (Kevin MacLeod)
- Bensound

请确保遵守相关的使用条款和版权规定。 