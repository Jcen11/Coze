## 创建新的会话
var axios = require('axios');
var data = JSON.stringify({
   "name": "string"
});

var config = {
   method: 'post',
   url: '/coze/conversation',
   headers: { 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1c2VyIiwiZXhwIjoxNzY3MTk0NjI0LCJqdGkiOiIzIiwiaWF0IjoxNzY2OTM1NDI0LCJpc3MiOiJoZHUtc2Utc2VydmVyIn0.5wXyUJxzcEtLjHynWe4e1MMi4ZMbf3eijVIYQwoxA3A', 
      'Content-Type': 'application/json'
   },
   data : data
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

## 展示用户所有的conversation
var axios = require('axios');

var config = {
   method: 'get',
   url: '/coze/conversation',
   headers: { 
      'Authorization': ''
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

## 发起一个会话
var axios = require('axios');
var data = JSON.stringify({
   "message": "string",
   "conversation_id": "string"
});

var config = {
   method: 'post',
   url: '/coze/chat',
   headers: { 
      'Authorization': '', 
      'Content-Type': 'application/json'
   },
   data : data
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

## 检查chat状态
var axios = require('axios');

var config = {
   method: 'get',
   url: '/coze/chat?conversation_id&chat_id',
   headers: { 
      'Authorization': ''
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

## 详细会话
var axios = require('axios');

var config = {
   method: 'get',
   url: '/coze/chat/message?conversation_id&chat_id',
   headers: { 
      'Authorization': ''
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

## 会话所有会话
var axios = require('axios');

var config = {
   method: 'get',
   url: '/coze/conversation/message?conversation_id',
   headers: { 
      'Authorization': ''
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});