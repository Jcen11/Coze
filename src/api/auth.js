import request from '../utils/request';

// 登录接口
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
};

// 注册接口
export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  });
};

// 获取用户信息接口
export const getUserInfo = (id) => {
  return request({
    url: `/user/${id}`,
    method: 'get'
  });
};

// 根据邮箱获取用户信息接口
export const getUserInfoByEmail = (email) => {
  return request({
    url: `/user?email=${email}`,
    method: 'get'
  });
};
