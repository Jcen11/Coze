<template>
  <div class="not-found-container">
    <div class="not-found-box">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-subtitle">抱歉，页面不存在</p>
      <p class="not-found-desc">您访问的页面可能已被删除、移动或输入了错误的URL</p>
      <div class="not-found-actions">
        <router-link to="/" class="back-home-btn">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.not-found-box {
  background: white;
  padding: 50px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.not-found-title {
  font-size: 80px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 20px;
  line-height: 1;
}

.not-found-subtitle {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.not-found-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.not-found-actions {
  margin-top: 20px;
}

.back-home-btn {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
