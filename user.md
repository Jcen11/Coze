## Register
var axios = require('axios');
var data = JSON.stringify({
   "username": "string",
   "email": "string",
   "password": "string"
});

var config = {
   method: 'post',
   url: '/auth/register',
   headers: { 
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

## Login
var axios = require('axios');
var data = JSON.stringify({
   "email": "string",
   "password": "string"
});

var config = {
   method: 'post',
   url: '/auth/login',
   headers: { 
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

## Get User Info By ID
var axios = require('axios');

var config = {
   method: 'get',
   url: '/user/',
   headers: { 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1c2VyIiwiZXhwIjoxNzY1NDM1OTg2LCJqdGkiOiIxIiwiaWF0IjoxNzY1MTc2Nzg2LCJpc3MiOiJoZHUtc2Utc2VydmVyIn0.zYbwoD47hyU3jwtCIBsjW_Zl484P3rIQ76bUxyubAmc'
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});

## Get User Info By Email
var axios = require('axios');

var config = {
   method: 'get',
   url: '/user?email',
   headers: { 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1c2VyIiwiZXhwIjoxNzY1NDM1OTg2LCJqdGkiOiIxIiwiaWF0IjoxNzY1MTc2Nzg2LCJpc3MiOiJoZHUtc2Utc2VydmVyIn0.zYbwoD47hyU3jwtCIBsjW_Zl484P3rIQ76bUxyubAmc'
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});