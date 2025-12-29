<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">养生专家智能体</h1>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-item">
          <label for="email" class="form-label">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            class="form-input"
            placeholder="请输入邮箱"
            required
          >
        </div>
        <div class="form-item">
          <label for="password" class="form-label">密码</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            class="form-input"
            placeholder="请输入密码"
            required
          >
        </div>
        <div class="form-actions">
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
        <div class="form-footer">
          <span>还没有账号？</span>
          <a href="/register" class="register-link">立即注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../api/auth';
import { useRouter } from 'vue-router';

// 路由实例
const router = useRouter();

// 表单数据
const formData = ref({
  email: '',
  password: ''
});

// 加载状态
const loading = ref(false);

// 登录处理
const handleLogin = async () => {
  try {
    loading.value = true;
    const response = await login(formData.value);
    
    // 保存token到本地存储
    localStorage.setItem('token', response.result.token);
    
    // 登录成功，跳转到首页
    router.push('/');
  } catch (error) {
    loading.value = false;
    console.error('登录失败:', error);
    alert('登录失败，请检查邮箱和密码是否正确');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width:100%;
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  margin-top: 10px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>
