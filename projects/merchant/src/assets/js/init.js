import store from '../../store/index'

export default function init(userInfo,callbacks) {
    if (!userInfo.appKey || !userInfo.token){
        return false; 
    }
    // var config = {
    //     appkey: userInfo.appKey ,
    // };
    // var im = RongIMLib.init(config);
    
    //公有云初始化
    RongIMLib.RongIMClient.init(userInfo.appKey);

    
    var instance = RongIMClient.getInstance();

    //连接状态监听器
    RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
            // status 标识当前连接状态
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    console.log('链接成功');
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    console.log('正在链接');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    console.log('其他设备登录');
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    console.log('域名不正确');
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    console.log('网络不可用');
                    break;
            }
        }
    });

    var num = 1
    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            console.log(message)
            // 判断消息类型
            switch(message.messageType){
                case RongIMClient.MessageType.TextMessage:
                    num += 1
                    // var audioFile = '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...';
                    // // 音频文件长度   
                    // var duration = audioFile.length / 1024;
                    // // 预加载
                    // RongIMLib.RongIMVoice.preLoaded(audioFile, function(){
                    //     // 播放声音
                    //     RongIMLib.RongIMVoice.play(audioFile, duration);
                    // });


                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    // message.content.content => 文字内容
                    break;
                case RongIMClient.MessageType.VoiceMessage:
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    // message.content.content => 格式为 AMR 的音频 base64
                    break;
                case RongIMClient.MessageType.ImageMessage:
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    // message.content.content => 图片缩略图 base64
                    // message.content.imageUri => 原图 URL
                    break;
                case RongIMClient.MessageType.LocationMessage:
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    // message.content.latiude => 纬度
                    // message.content.longitude => 经度
                    // message.content.content => 位置图片 base64
                    break;
                case RongIMClient.MessageType.RichContentMessage:
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    // message.content.content => 文本消息内容
                    // message.content.imageUri => 图片 base64
                    // message.content.url => 原图 URL
                    break;
                case RongIMClient.MessageType.OrderMessage:
                    // 订单消息
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                        break;
                case RongIMClient.MessageType.SystemMessage:
                    // 官方消息
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    break;
                case RongIMClient.MessageType.RecallCommandMessage:
                    // 撤回消息
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    break
                case RongIMClient.MessageType.deteleMessage:
                    num += 1
                    store.commit('newMsg', message);
                    store.commit('newMsgState',num)
                    break
                // case RongIMClient.MessageType.TypingStatusMessage:
                //     num +=1
                //     console.log('收到5')
                //     store.commit('newMsg', message);
                //     store.commit('newMsgState',num)
                //     break;
                // case RongIMClient.MessageType.InformationNotificationMessage:
                //     store.commit('newMsg', message);
                //     store.commit('newMsgState',num)
                //     break;
                // case RongIMClient.MessageType.ContactNotificationMessage:
                //     store.commit('newMsg', message);
                //     store.commit('newMsgState',num)
                //     break;
                // case RongIMClient.MessageType.ProfileNotificationMessage:
                //     store.commit('newMsg', message);
                //     store.commit('newMsgState',num)
                //     break;
                // case RongIMClient.MessageType.CommandNotificationMessage:
                //     store.commit('newMsg', message);
                //     store.commit('newMsgState',num)
                //     break;
                // case RongIMClient.MessageType.CommandMessage:
                //     store.commit('newMsg', message);
                //     store.commit('newMsgState',num)
                //     break;
                // case RongIMClient.MessageType.UnknownMessage:
                //     store.commit('newMsg', message);
                //     store.commit('newMsgState',num)
                //     break;
                // default:
                    // console.log(14)
                    // store.commit('newMsg', message);
            }
        }
    });

    var messageName = 'OrderMessage'; // 消息名称  订单消息
    var objectName = 'JZ:MessageCustomOrder'; // 消息内置名称，请按照此格式命名
    var isCounted = true; // 消息计数
    var isPersited = true; // 消息保存
    var mesasgeTag = new RongIMLib.MessageTag(isCounted, isPersited); // 消息是否保存是否计数，true true 计数且保存，false false 不计数不保存
    var prototypes = ['content', 'extra', 'headerImageUrl', 'status', 'title','kind']; // 消息类中的属性名  extra 是订单号
    RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);

    var messageName1 = 'SystemMessage'; // 消息名称  官方消息
    var objectName1 = 'JZ:MessageCustomSystem'; // 消息内置名称，请按照此格式命名
    var isCounted1 = true; // 消息计数
    var isPersited1 = true; // 消息保存
    var mesasgeTag1 = new RongIMLib.MessageTag(isCounted1, isPersited1); // 消息是否保存是否计数，true true 计数且保存，false false 不计数不保存
    var prototypes1 = ['content', 'extra', 'status', 'title','kind']; // 消息类中的属性名
    RongIMClient.registerMessageType(messageName1, objectName1, mesasgeTag1, prototypes1);

    var messageName = 'deteleMessage';  // 消息名称  用于删除消息会话 未读等
    var objectName = 'JZ:MessageDel';  // 消息类型名，请按照此格式命名
    var isCounted = true;  // 消息计数
    var isPersited = true;  // 消息保存
    var mesasgeTag = new RongIMLib.MessageTag(isCounted, isPersited);
    var prototypes = ['content','extra','user'];  // 消息类中的属性名
    RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);


    //开始链接
    RongIMClient.connect(userInfo.token, {
        onSuccess: function (id) {
            // console.log('Connect successfully. ' + userId);
            callbacks.Success && callbacks.Success(id);
        },
        onTokenIncorrect: function () {
            console.log('token无效');
        },
        onError: function (errorCode) {
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                    info = '不可接受的协议版本';
                    break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                    info = 'appkey不正确';
                    break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                    info = '服务器不可用';
                    break;
            }
            console.log(info);
        }
    });
    // initBiaoqing(list);
    //重连
    var callback = {
        onSuccess: function(userId) {
            console.log('Reconnect successfully. ' + userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError: function(errorCode){
            console.log(errorcode);
        }
    };
    var config = {
        // 默认 false, true 启用自动重连，启用则为必选参数
        auto: true,
        // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
        rate: [100, 1000, 3000, 6000, 10000]
    };
    RongIMClient.reconnect(callback, config);



    // // 表情初始化
    RongIMLib.RongIMEmoji.init();
    var config = {
        size: 24, // 大小, 默认 24, 建议18 - 58
        url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // Emoji 背景图片
        lang: 'zh', // Emoji 对应名称语言, 默认 zh
        // 扩展表情
        extension: {
            dataSource: {
                u1F914: {
                    en: 'thinking face', // 英文名称
                    zh: '思考', // 中文名称
                    tag: '🤔', // 原生 Emoji
                    position: '0 0' // 所在背景图位置坐标
                }
            },
            url: '//cdn.ronghub.com/thinking-face.png' // 新增 Emoji 背景图 url
        }
    };
    RongIMLib.RongIMEmoji.init(config);


    // RongIMLib.RongIMVoice.init();
}