<template>
  <div class="register-container">
    <div class="register-box">
      <h1 class="register-title">养生专家智能体</h1>
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-item">
          <label for="username" class="form-label">用户名</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            class="form-input"
            placeholder="请输入用户名"
            required
          >
        </div>
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
            minlength="6"
          >
        </div>
        <div class="form-actions">
          <button type="submit" class="register-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>
        <div class="form-footer">
          <span>已有账号？</span>
          <a href="/login" class="login-link">立即登录</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { register } from '../api/auth';
import { useRouter } from 'vue-router';

// 路由实例
const router = useRouter();

// 表单数据
const formData = ref({
  username: '',
  email: '',
  password: ''
});

// 加载状态
const loading = ref(false);

// 注册处理
const handleRegister = async () => {
  try {
    loading.value = true;
    await register(formData.value);
    
    // 注册成功，跳转到登录页
    alert('注册成功，请登录');
    router.push('/login');
  } catch (error) {
    loading.value = false;
    console.error('注册失败:', error);
    alert('注册失败，请检查输入信息或稍后重试');
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.register-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.register-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.register-form {
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
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

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>
