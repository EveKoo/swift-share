<template>
  <div class="home">
    <div class="welcome-section">
      <h1>欢迎来到 SwiftShare</h1>
      <p class="subtitle">Taylor Swift 粉丝社区</p>
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">🎵</div>
          <h3>音乐库</h3>
          <p>探索霉霉的所有音乐作品</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎬</div>
          <h3>视频库</h3>
          <p>观看MV、演唱会、采访等精彩视频</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💕</div>
          <h3>社区</h3>
          <p>与其他Swiftie交流分享</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📰</div>
          <h3>资讯</h3>
          <p>获取霉霉最新动态和资讯</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #f48fb1 100%);
  padding: 20px;
}

.welcome-section {
  text-align: center;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

h1 {
  color: #e91e63;
  margin-bottom: 10px;
  font-size: 2.5em;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
  font-size: 1.3em;
  font-weight: 500;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-item {
  padding: 20px;
  border-radius: 15px;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
}

.feature-item h3 {
  color: #e91e63;
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: 600;
}

.feature-item p {
  color: #666;
  font-size: 0.9em;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 2em;
  }
  
  .subtitle {
    font-size: 1.1em;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>