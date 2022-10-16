//创建web服务器
let app = require("http").createServer();

//创建socketio服务器端对象
let io = require("socket.io")(app); //io模块依赖于app模块

//绑定监听端口
app.listen(4000);

//保存登录的用户名数组
let readUserArr = [];



//为io对象绑定事件 connection（当有客户端连接服务器触发此事件）
io.on("connection", (socket) => {
    //保存当前客户的用户名
    let username = "";

    // 使用 require 方法加载 fs 核心模块
    let fs = require('fs')

    //有人进入聊天室
    socket.on("username", (data) => {

        //用户名
        username = data;

        //先读取用户列表文件
        fs.readFile('./user.txt', function (error, data) {
            if (error) {
                console.log('读取文件失败')
            } else { //如果读取成功

                //如果文件里有值
                if (data.toString() !== "") {

                    //将当前的值转换成数组并赋给用户数组重新进行操作
                    readUserArr = data.toString().split(",");

                    //广播当前登录的用户列表
                    io.emit("userArr", readUserArr);
                }
            }
        })

        //判断读取的用户数组中是否有当前进入聊天室的用户
        if (readUserArr.includes(username) == false) {
            //如果没有就往用户列表数组里添加
            readUserArr.push(username)
            //广播谁加入了群聊
            io.emit("enter", "系统消息：" + username + "加入群聊");
        }

        //将当前进入聊天室的用户列表写入文件
        fs.writeFile('./user.txt', readUserArr, function (error) {
            if (error) {
                console.log('写入失败')
            }
        })
    });

    //返回聊天内容
    socket.on("message", (data) => {
        io.emit("list", data);
    });

    //有人点退出
    socket.on("exitName", data => {

        //从用户列表数组中删除当前点了退出的用户名
        readUserArr = readUserArr.filter(item => item != data);

        //更新用户列表数组
        fs.writeFile('./user.txt', readUserArr, function (error) {
            if (error) {
                console.log('写入失败')
            } else {

                //重新广播更新之后的用户列表
                io.emit("userArr", readUserArr);
            }
        })

        //广播谁退出了群聊
        io.emit("leave", "系统消息：" + data + "已退出群聊");
    });


    //当有客户端关闭浏览器
    socket.on("disconnect", (data) => {

        //从用户列表数组中删除当前点了关闭浏览器的用户名
        readUserArr = readUserArr.filter(item => item != username);

        //更新用户列表数组
        fs.writeFile('./user.txt', readUserArr, function (error) {
            if (error) {
                console.log('写入失败')
            } else {

                //重新广播更新之后的用户列表
                io.emit("userArr", readUserArr);
            }
        })

        //广播谁关闭了聊天室
        // io.emit("leave", "系统消息：" + username + "已关闭聊天室");
    })


})