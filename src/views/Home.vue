<template>
  <div class="home-container">
    <h1 class="home-title">欢迎使用养生专家智能体</h1>
    <p class="home-subtitle">这是您的专属养生顾问平台</p>
    <div class="home-content">
      <div class="home-card">
        <h3>智能咨询</h3>
        <p>获取个性化的养生建议和健康指导</p>
      </div>
      <div class="home-card">
        <h3>健康管理</h3>
        <p>记录和跟踪您的健康数据和生活习惯</p>
      </div>
      <div class="home-card">
        <h3>养生知识</h3>
        <p>学习丰富的养生知识和健康生活方式</p>
      </div>
    </div>
    <div class="home-footer">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// 路由实例
const router = useRouter();

// 退出登录处理
const handleLogout = () => {
  // 清除本地存储中的token
  localStorage.removeItem('token');
  // 跳转到登录页
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.home-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.home-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
}

.home-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.home-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.home-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.home-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.home-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.home-footer {
  margin-top: 40px;
}

.logout-btn {
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}
</style>
