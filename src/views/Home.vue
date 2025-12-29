<template>
  <div class="chat-container">
    <!-- 左侧会话列表 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>养生专家智能体</h2>
        <button class="new-chat-btn" @click="handleNewChat">
          <span class="plus-icon">+</span> 新会话
        </button>
      </div>

      <div class="conversations-list">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="conversation-item"
          :class="{
            active: currentConversationId === conversation.conversation_id,
          }"
          @click="handleSwitchConversation(conversation.conversation_id)"
        >
          <div class="conversation-title">
            {{ conversation.title || "未命名会话" }}
          </div>
          <div class="conversation-time">12:34</div>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </div>

    <!-- 中间对话区域 -->
    <div class="chat-main">
      <div class="chat-header">
        <h3>{{ currentConversationTitle || "新会话" }}</h3>
      </div>

      <div class="messages-container" ref="messagesContainer">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="welcome-message">
          <h3>欢迎使用养生专家智能体</h3>
          <p>请在下方输入您的问题，我将为您提供专业的养生建议。</p>
        </div>

        <!-- 消息列表 -->
        <div
          v-for="(message, index) in reverse_messages"
          :key="index"
          class="message-item"
          :class="message.role === 'user' ? 'user-message' : 'agent-message'"
        >
          <div class="message-avatar">
            {{ message.role === "user" ? "我" : "AI" }}
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
          </div>
        </div>

        <!-- 加载中状态 -->
        <div v-if="loading" class="loading-message">
          <div class="loading-spinner"></div>
          <span>AI正在思考...</span>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <div class="input-wrapper">
          <textarea
            v-model="inputMessage"
            class="message-input"
            placeholder="请输入您的问题..."
            rows="1"
            @keydown.enter.prevent="handleSendMessage"
            :disabled="loading"
          ></textarea>
          <button
            class="send-btn"
            @click="handleSendMessage"
            :disabled="!inputMessage.trim() || loading"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import {
  createConversation,
  listConversations,
  createChat,
  getChatMessages,
  getConversationMessages,
  checkChatStatus,
} from "../api/coze";

// 路由实例
const router = useRouter();

// 会话列表
const conversations = ref([]);
// 当前会话ID
const currentConversationId = ref("");
// 当前会话标题
const currentConversationTitle = ref("");
// 消息列表
const messages = ref([]);
// 输入消息
const inputMessage = ref("");
// 加载状态
const loading = ref(false);
// 消息容器引用
const messagesContainer = ref(null);

const reverse_messages = computed(() => {
  return messages.value.slice().reverse();
});

// 初始化
onMounted(() => {
  loadConversations();
  window.debug = {
    conversations,
    currentConversationId,
    messages,
    loading,
    inputMessage,
  };
  console.log("调试模式已开启：请在控制台输入 window.debug 查看变量");
});

// 监听消息变化，自动滚动到底部
watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// 加载会话列表
const loadConversations = async () => {
  try {
    const response = await listConversations();
    conversations.value = response.conversations || [];

    // 如果有会话，默认选择第一个
    if (conversations.value.length > 0) {
      handleSwitchConversation(conversations.value[0].conversation_id);
    }
  } catch (error) {
    console.error("加载会话列表失败:", error);
  }
};

// 新建会话
const handleNewChat = async () => {
  try {
    const response = await createConversation({ name: "新会话" });
    const conversationId = response.conversation_id;

    // 添加到会话列表
    conversations.value.unshift({
      id: Date.now(),
      user_id: 0,
      conversation_id: conversationId,
      title: "新会话",
    });

    // 切换到新会话
    handleSwitchConversation(conversationId);
  } catch (error) {
    console.error("创建会话失败:", error);
  }
};

// 切换会话
const handleSwitchConversation = async (conversationId) => {
  currentConversationId.value = conversationId;

  // 更新当前会话标题
  const conversation = conversations.value.find(
    (c) => c.conversation_id === conversationId
  );
  if (conversation) {
    currentConversationTitle.value = conversation.title;
  }

  // 加载会话消息
  try {
    const response = await getConversationMessages({
      conversation_id: conversationId,
    });
    messages.value = response.messages || [];
  } catch (error) {
    console.error("加载会话消息失败:", error);
    messages.value = [];
  }
};

// 发送消息
const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || !currentConversationId.value) return;

  const messageText = inputMessage.value.trim();

  // 添加用户消息到列表
  const userMessage = {
    content: messageText,
    role: "user",
    type: "question",
  };
  messages.value.push(userMessage);

  // 清空输入框
  inputMessage.value = "";

  // 显示加载状态
  loading.value = true;

  try {
    // 调用API发送消息
    const response = await createChat({
      conversation_id: currentConversationId.value,
      message: messageText,
    });

    // 获取聊天ID
    const chatId = response.chat_id;

    // 轮询获取AI回复
    await pollChatStatus(chatId);
  } catch (error) {
    console.error("发送消息失败:", error);

    // 添加错误消息
    messages.value.push({
      content: "抱歉，发送消息失败，请稍后重试。",
      role: "agent",
      type: "answer",
    });
  } finally {
    // 隐藏加载状态
    loading.value = false;
  }
};

// 轮询聊天状态
const pollChatStatus = async (chatId, retryCount = 0) => {
  try {
    // 先检查聊天状态
    const statusResponse = await checkChatStatus({
      conversation_id: currentConversationId.value,
      chat_id: chatId,
    });

    // 如果状态为completed，获取消息
    if (statusResponse.status === "completed") {
      const messageResponse = await getChatMessages({
        conversation_id: currentConversationId.value,
        chat_id: chatId,
      });

      // 查找AI回复
      const aiMessage = messageResponse.messages.find(
        (msg) => msg.role === "assistant" && msg.type === "answer"
      );
      if (aiMessage) {
        // 添加AI回复到列表
        messages.value.push(aiMessage);
        return;
      }
    }

    // 如果状态不是completed或没有AI回复，继续轮询（最多轮询10次，每次间隔1秒）
    if (retryCount < 10) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await pollChatStatus(chatId, retryCount + 1);
    } else {
      // 超时，添加默认消息
      messages.value.push({
        content: "抱歉，AI回复超时，请稍后重试。",
        role: "agent",
        type: "answer",
      });
    }
  } catch (error) {
    console.error("获取消息失败:", error);

    // 添加错误消息
    messages.value.push({
      content: "抱歉，获取AI回复失败，请稍后重试。",
      role: "agent",
      type: "answer",
    });
  }
};

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 退出登录
const handleLogout = () => {
  // 清除本地存储中的token
  localStorage.removeItem("token");
  // 跳转到登录页
  router.push("/login");
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
}

/* 左侧会话列表 */
.sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.new-chat-btn {
  width: 100%;
  padding: 12px;
  background: black;
  opacity: 0.7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.new-chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.conversation-item {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  border: 1px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.conversation-item:hover {
  background: #e9ecef;
}

.conversation-item.active {
  background: black;
  opacity: 0.4;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.conversation-title {
  font-size: 14px;
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-time {
  font-size: 12px;
  opacity: 0.7;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

/* 中间对话区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.welcome-message h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
  align-items: flex-start;
}

.user-message {
  flex-direction: row-reverse;
}

.agent-message {
  flex-direction: row;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: grey;
}

.agent-message .message-avatar {
  background: #4caf50;
}

.message-content {
  max-width: 70%;
}

.message-text {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.user-message .message-text {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.agent-message .message-text {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px;
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.input-container {
  padding: 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  min-height: 48px;
  max-height: 120px;
  transition: all 0.3s ease;
  outline: none;
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-btn {
  padding: 12px 24px;
  background: black;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 右侧智能体信息 */
.right-sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.agent-info {
  text-align: center;
}

.agent-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.agent-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.agent-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.agent-features {
  text-align: left;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.agent-features h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.agent-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.agent-features li {
  font-size: 13px;
  color: #666;
  padding: 6px 0;
  padding-left: 18px;
  position: relative;
}

.agent-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #4caf50;
  font-weight: bold;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
