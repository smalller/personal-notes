<template>
    <div>一对一的聊天室</div>
</template>

<script>
export default {
    data() {
        return {}
    },

    mounted() {
        //创建socket对象并且连接服务器
        let clientSocket = io("ws://127.0.0.1:3000");

        //向服务器发送消息（触发事件message）
        clientSocket.emit("message","大家好！！！");

        //接收服务器发送过来的消息，绑定事件
        clientSocket.on("server",(data) => {
            console.log(data);
        });

        //接收服务器发送的广播
        clientSocket.on("list",(data) => {
            console.log("广播消息：" + data);
        });
    }
}
</script>