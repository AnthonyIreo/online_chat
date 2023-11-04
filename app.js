const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// parse
const bodyParser = require('body-parser');
// 使用body-parser中间件来解析POST请求的数据
app.use(bodyParser.urlencoded({ extended: true }));
// 设置EJS模板引擎
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 登录页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/index', (req, res) => {
    res.redirect('/');
});

// 处理登录表单提交
app.post('/index', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (password == "zhu") {
        console.log(`${username} logined.`);
        res.render((path.join(__dirname, 'views', 'index')), { name: username });
    }
    else{
        console.log(`failed to login.`)
    }
    // 在这里进行用户身份验证逻辑，例如检查用户名和密码是否匹配
    // 如果验证通过，可以重定向到用户的个人页面
    // 如果验证失败，可以返回登录页面并显示错误信息
});


// 用于保存所有连接的客户端
const clients = [];
//webSocket
wss.on('connection', (ws) => {
    // 将新连接的客户端添加到clients列表中
    clients.push(ws);
    // console.log(clients);

    ws.on('message', (message) => {
        // 将Buffer对象转换为字符串
        const decodedMessage = message.toString('utf8');
            
        console.log(decodedMessage);
        // 当接收到客户端的消息时，广播给所有连接的客户端
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(decodedMessage);
            }
        });
    });
    

    ws.on('close', () => {
        // 客户端断开连接时，从clients列表中移除该客户端
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

    
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
