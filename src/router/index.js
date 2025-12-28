import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录 - 养生专家智能体'
    }
  },
  {
    path: '/',
    name: 'Home',
    // 首页组件将在后续步骤中创建
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页 - 养生专家智能体',
      requireAuth: false // 需要登录才能访问
    }
  },
  {
    path: '/register',
    name: 'Register',
    // 注册组件将在后续步骤中创建
    component: () => import('../views/Register.vue'),
    meta: {
      title: '注册 - 养生专家智能体'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    // 404组件将在后续步骤中创建
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 - 页面不存在'
    }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '养生专家智能体';
  
  // 检查是否需要登录
  if (to.meta.requireAuth) {
    // 从本地存储获取token
    const token = localStorage.getItem('token');
    if (token) {
      next();
    } else {
      // 未登录，跳转到登录页
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
