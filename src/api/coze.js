import request from '../utils/request';

// 创建新会话
export const createConversation = (data) => {
  return request({
    url: '/coze/conversation',
    method: 'post',
    data
  });
};

// 获取用户所有会话
export const listConversations = () => {
  return request({
    url: '/coze/conversation',
    method: 'get'
  });
};

// 发起会话
export const createChat = (data) => {
  return request({
    url: '/coze/chat',
    method: 'post',
    data
  });
};

// 检查聊天状态
export const checkChatStatus = (params) => {
  return request({
    url: '/coze/chat',
    method: 'get',
    params
  });
};

// 获取详细会话
export const getChatMessages = (params) => {
  return request({
    url: '/coze/chat/message',
    method: 'get',
    params
  });
};

// 获取会话所有消息
export const getConversationMessages = (params) => {
  return request({
    url: '/coze/conversation/message',
    method: 'get',
    params
  });
};
