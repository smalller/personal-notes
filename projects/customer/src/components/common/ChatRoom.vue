<template>
    <div class="chat_room" id="chat_room">
        <!-- v-if="$store.state.showChatRoom" -->
        <div v-drag class="floating"  @click="showChat">
            <span class="all_unread" v-show="$store.state.headerUnread>0">{{$store.state.headerUnread}}</span>
        </div>

        <!-- <div ref="simulation">1111</div> -->
        <el-dialog v-dialogDrag center :visible.sync="showRoom" width="65%" top="8vh" @close='closeDialog'>
            <div id="service" v-if="(showRoom && $store.state.showChatRoom) || $store.state.headerClickMsg" 
            v-loading="loadingChat"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="box">
                    <div class="people_list">
                        <ul>
                            <li class="userList" :class="active==i?'active':''" @click="getChat(item,i)" v-for="(item,i) in userList" :key="i" @mouseenter="mouseover(item,i)" @mouseleave="mouseLeave(item,i)">
                                <img class="head_portrait"  :src="item.portrait" alt="">
                                <span>{{item.name}}</span>
                                <span class="not_read" v-show="item.unreadMessageCount>0 && active != i">{{item.unreadMessageCount}}</span>
                                <span v-show="item.showClear" class="close_x"><i @click.stop="closeX(item,i)" class="el-icon-error"></i></span>
                            </li>
                        </ul>
                    </div>
                    <div class="chat" v-if="now_user">
                        <div class="record">
                            <div class="username">{{now_user.name}}</div>
                            <div class="chat_list"  ref='parTopDistance' @scroll="scrollEvent">
                                <div class="getMore" v-show="getMore">加载中...</div>
                                <div class="getMore" v-show="!hasHistoryMsg">没有更多了</div>
                                <div class="cli" ref='topDistance' >
                                    <div class="cmsg" v-for="(item,i) in msgArr" :key="i" ref="cmsg">
                                        <template v-if="item.messageType == 'UnknownMessage'">
                                            <div class="withdraw notMsgType">
                                                <div>不支持的消息类型</div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="send_or_rece">{{item.sentTime | formatTime(that)}}</div>
                                            <div class="msg_list" v-if="item.messageDirection==2">
                                                <div class="headImg">
                                                    <img v-if="item.content" :src="imgHead+item.content.portrait" alt="">
                                                </div>
                                                <!-- 文本消息 -->
                                                    <div class="withdraw" v-if="item.messageType == 'RecallCommandMessage'">
                                                        <div>对方撤回了一条消息</div>
                                                    </div>
                                                <div class="msg e" v-if="item.messageType == 'TextMessage'">
                                                    <!-- <div>{{item.content.content}}</div> -->
                                                    <div v-html="item.content.content"></div>
                                                </div>
                                                <!-- 图片 -->
                                                <div class="msg d" v-if="item.messageType == 'ImageMessage'">
                                                    <img class="msg_picture" v-if="item.content" :src="item.content.imageUri" alt="">
                                                </div>
                                                <!-- 订单消息 -->
                                                <div class="msg" v-if="item.targetId == '10001'">
                                                    <div class="orderinfo">
                                                        <!-- {{item.content.content}} -->
                                                        <div class="fx">
                                                            <div style="flex:.3">内容:</div>
                                                            <div style="flex:.7">{{item.content.content}}</div>
                                                        </div>
                                                        <div class="fx">
                                                            <div style="flex:.3">时间:</div>
                                                            <div style="flex:.7">{{$regular.timeData(item.sentTime,3)}}</div>
                                                        </div>
                                                        <div class="fx">
                                                            <div style="flex:.3">用户名:</div>
                                                            <div style="flex:.7">{{item.content.title}}</div>
                                                        </div>
                                                        <div @click="lookOrder(item)" style="text-align:center;padding-top:10px;border-top:1px solid white;cursor: pointer;">查看详情</div>
                                                    </div>
                                                </div>
                                                <!-- 官方消息 -->
                                                <div class="msg c" v-if="item.targetId == '10000'">
                                                    <div class="official">
                                                        <div>{{item.content.title}}</div>        
                                                        <div>{{item.content.content}}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="msg_list self" v-else>
                                                <div class="msg a self_msg"  v-if="item.messageType == 'TextMessage'">
                                                    <!-- <div>{{item.content.content}}</div> -->
                                                    <div v-html="item.content.content"></div>
                                                </div>
                                                <div class="msg b self_msg"  v-if="item.messageType == 'ImageMessage'">
                                                    <img class="msg_picture" v-if="item.content" :src="item.content.imageUri" alt="">
                                                </div>
                                                <div class="headImg self_img">
                                                    <img v-if="item.content" :src="imgHead + item.content.portrait" alt="">
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text_box" v-show="unInput">
                            <div class="icons">
                                <div class="flexo">
                                    <img class="send_icon" @click="showEmoji" style="height:20px" src="../../assets/img/emoji.png" alt="">
                                    <div class="emoji_box" v-show="emojiShow">
                                        <div class="emojiItem" v-for="emList in emoji" :key="emList.unicode" v-html="emList.node.outerHTML" @click="selectEmoji(emList)"></div>
                                    </div>
                                </div>
                                <div class="flexo">
                                    <img class="send_icon" style="height:20px" src="../../assets/img/tupian.png" alt="">
                                    <el-upload
                                        v-loading="loading"
                                        action="fakeaction"
                                        list-type="picture-card"
                                        :http-request="uploadSectionFile"
                                        :limit="4"
                                        :auto-upload="false"
                                        multiple
                                        :file-list="form.list"
                                        :on-change="handleChange"
                                        :on-remove="handleRemove"
                                        :on-exceed="exceed"
                                    >
                                    </el-upload>

                                    <ul v-if="form.list.length>0" class="imgs">
                                        <li v-for="(item,i) in form.list" :key="i">
                                            <img :src="item.url" alt="">
                                            <span class="del" @click="handleRemove(item)">x</span>
                                        </li>
                                        <li></li>
                                    </ul>

                                </div>
                            </div>
                            <textarea ref="focusTextarea" @keyup.enter='send()'  class="textarea"  v-html="selectEmojiHtml" v-model="sendText" id=""></textarea>
                            <div class="btn_oper">
                                <el-button type="primary" @click="send()">发送</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="chat" v-else></div>
                    <div class="quick" >
                        <div class="goods_list">
                            <el-tabs v-model="activeName" @tab-click="handleClick" v-show="unInput">
                                <el-tab-pane label="快捷回答" name="first">
                                    <ul class="one">
                                        <li @click="quickRrep(item)" v-for="(item,i) in oneList" :key="i">{{item}}</li>
                                    </ul>
                                </el-tab-pane>
                                <!-- <el-tab-pane label="香槟" name="second">清吧</el-tab-pane>
                                <el-tab-pane label="啤酒" name="third">KTV</el-tab-pane> -->
                            </el-tabs>

                            <div class="operating_btn">
                                <div>
                                    <el-button type="primary" @click="clearConversation" class="btn">清空所有会话列表</el-button>
                                </div>
                                <div>
                                    <el-button type="primary" v-show="now_user" @click="clearConverHisMsg" class="btn">清除当前会话历史记录</el-button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import init from "../../assets/js/init";
import {getUserInfo,fileUpload} from "@/api/system/chatRoom";
export default {
    data() {
        return {
            loading:false,
            formData: [],
            dialogImageUrl: '',
            dialogVisible: false,
            loading: false,
            form: {
                list: []
            },
            joinUrl: this.$imgHead,
            uplodeImg: [],
            // 以上图片上传
            that:this,
            getMore:true,
            imgHead: this.$imgHead,
            showRoom:false,
            activeName: 'first',
            selectEmojiHtml: "",
            now_user: "",
            mySelf: { //我的信息
                // {userId,name,onlineTime,offlineTime}
            },
            // active:null,//默认需要点击
            active: null,
            sendText: '',//发送的消息
            msgArr: [ //历史消息
                // { userId, msgType, sender, receiver,bodyType,body{txt,imgIndex,jsonObj,url,lng,lat,address} }
            ],
            moreHistory:true,
            userList: [],
            oneList: [
                '你好，请问有什么问题呢？', "You're welcome", 'OK'
            ],
            selfInfo:'',
            emoji:[],
            emojiShow: false,
            hasHistoryMsg:true,
            // firstDomHeight:null,
            // twoDomHeight:null,
            scorllFalse:false,//用于判断 切换会话时 停止监听 滚动条
            audioUrl:"",
            unInput:true,
            isMute:false,
            loadingChat:false
        };
    },


    directives:{
        drag(el,bindings){
            let firstTime = ''
            let lastTime = ''
            el.onmousedown = function(e){
                document.querySelector('.chat_room').setAttribute('drag-flag', false)
                firstTime = new Date().getTime()
                var disx = e.pageX - el.offsetLeft;
                var disy = e.pageY - el.offsetTop;
                document.onmousemove = function (e){
                    el.style.left = e.pageX - disx+'px';
                    el.style.top = e.pageY - disx+'px';
                    lastTime = new Date().getTime()
                    if (lastTime - firstTime > 200) {
                        // console.log('拖拽')
                        document.querySelector('.chat_room').setAttribute('drag-flag', true)
                    }else{
                    }
                }
                document.onmouseup = function(){
                    document.onmousemove = document.onmouseup = null;
                }
            }
        }
    },
    created(){
        this.selfInfo = JSON.parse(localStorage.getItem('saber-userInfo')).content 
    },

    computed:{
        watchMsgNum(){
            return this.$store.state.newMsgNum
        },
        headClick(){
            return this.$store.state.headerClickMsg
        },
        mute(){
            return this.$store.state.headerClickMute
        }
    },
    watch: {
        headClick:{
            handler(val){
                val?this.showRoom = true : this.showRoom = false
            }
        },
        mute:{
            handler(val){
                val?this.isMute = true : this.isMute = false
            }
        },
        watchMsgNum: {
            handler(newValue, oldValue) {
                let that = this
                let arr = [],lastObj=''
                arr = this.$store.state.newMsgArr
                lastObj = arr[arr.length-1]
                console.log(lastObj,'收到')

                that.lookOrderOne(lastObj);

                if(lastObj.offLineMessage){
                    return
                }
                try{
                    if(lastObj.messageType != 'RecallCommandMessage' && lastObj.messageType != 'UnknownMessage' ){
                        lastObj.content.content = RongIMLib.RongIMEmoji.emojiToHTML(lastObj.content.content);
                    }else{
                        if (lastObj.messageType == 'RecallCommandMessage') {
                            if (lastObj.targetId == this.now_user.targetId) {
                                for (let i = 0; i < this.msgArr.length; i++) {
                                    if(this.msgArr[i].messageUId == lastObj.messageUId){
                                        this.msgArr.splice(i,1)
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }catch{
                    if (lastObj.messageType == 'RecallCommandMessage') {
                        if (lastObj.targetId == this.now_user.targetId) {
                            for (let i = 0; i < this.msgArr.length; i++) {
                                if(this.msgArr[i].messageUId == lastObj.messageUId){
                                    this.msgArr = this.msgArr.splice(i,1)
                                }
                                break;
                            }
                        }
                    }
                }
                if(!lastObj.offLineMessage){
                    if(lastObj.messageType == 'TextMessage'){
                        this.audioUrl = 'default/system/message.mp3'
                        this.$notify.info({
                            title: '提示',
                            message: '您有一条新的消息',
                            duration: 2500,
                            customClass:'notify',
                            onClick(){
                                that.showChat()
                                this.close()
                            }
                        });
                    }else if(lastObj.messageType == 'OrderMessage'){
                        switch(lastObj.content.kind){
                            case 'JZ:MessageCustomOrder' : //预约
                                this.audioUrl = 'default/system/order.mp3';
                                this.$notify.info({
                                    title: '提示',
                                    message: '您有一条新的订单消息',
                                    duration: 0,
                                    customClass: 'notify',
                                    onClick() {
                                        that.lookOrder(lastObj);
                                        this.close();
                                    }
                                });
                                break;

                            case 'JZ:MessageOccupyOrder' : //占座
                                this.audioUrl = 'default/system/order.mp3';
                                this.$notify.info({
                                    title: '提示',
                                    message: '您有一条新的占座订单',
                                    duration: 0,
                                    customClass:'notify',
                                    onClick(){
                                        that.lookOrder(lastObj)
                                        this.close()
                                    }
                                });
                                break;
                            case 'JZ:MessageReminderOrder' : //催单
                                this.audioUrl = 'default/system/system.mp3';
                                this.$notify.info({
                                    title: '提示',
                                    message: '您有一条新的催单消息',
                                    duration: 2500,
                                    customClass: 'notify',
                                    onClick() {
                                        that.lookOrder(lastObj);
                                        this.close();
                                    }
                                });
                                break;
                        }
                    }else if(lastObj.messageType == 'SystemMessage'){
                        this.audioUrl = 'default/system/system.mp3'
                        this.$notify.info({
                            title: '提示',
                            message: '您有一条新的官方消息',
                            duration: 5000,
                            customClass:'notify',
                            onClick(){
                                that.showChat()
                                this.close()
                            }
                        });
                    }
                }
                var audio = new Audio() ;
                audio.src = this.joinUrl + this.audioUrl;
                this.isMute?audio.muted = true : audio.muted = false
                audio.play();
                // 自定义 更新会话列表 
                let newUser = true  //如果是true   则 是新用户  会话列表中 还没有出现
                let time = this.userList.length>0? 0 : 1000
                let timer = setTimeout(()=>{
                    clearTimeout(timer)
                    for(let i=0;i<this.userList.length;i++){
                        if(this.userList[i].targetId == lastObj.targetId){
                            newUser = false   //找到一个相同  证明是已出现过
                            break
                        }
                    }
                    if(newUser){
                        getUserInfo(lastObj.targetId).then((res) => {
                            if(res.data.code == 200){
                                lastObj['id'] = res.data.data.userId
                                lastObj['name'] = res.data.data.userName
                                lastObj['portrait'] = this.imgHead + res.data.data.userPortrait
                                // 获取未读消息条数
                                var conversationType = RongIMLib.ConversationType.PRIVATE;
                                var targetId = lastObj.targetId;
                                RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
                                    onSuccess: function(count){
                                        lastObj['unreadMessageCount'] = count
                                        that.userList.unshift(lastObj)    
                                    },
                                    onError: function(){
                                        // that.$message({ message: res.msg, type: 'warning' });
                                    }
                                });
                            }else{
                                this.$message({ message: res.msg, type: 'warning' });
                            }
                        });
                        return
                    }
                    
                    getUserInfo(lastObj.targetId).then((res) => {
                        if(res.data.code == 200){
                            lastObj.content['id'] = res.data.data.userId
                            lastObj.content['name'] = res.data.data.userName
                            lastObj.content['portrait'] = res.data.data.userPortrait
                            // this.msgArr.push(lastObj)
                            // this.$nextTick(this.scrollEnd);
                            // 当前聊天等于消息发送人  清空未读
                            if(lastObj.targetId == this.now_user.targetId && this.showRoom == true){
                                this.clearUnreadNum(lastObj.targetId)
                                this.msgArr.push(lastObj)
                                // this.$nextTick(this.scrollEnd);
                            }else{
                                if(!lastObj.offLineMessage){
                                    that.$store.commit('headerUnreadFun',that.$store.state.headerUnread +=1)
                                }
                                // 当前聊天不是发送人
                            }
                        }else{
                            this.$message({ message: res.msg, type: 'warning' });
                        }
                       
                    });
                },time)

            },
            deep:true
        }
    },
    filters:{
        formatTime(time,that){
            var s1 = new Date(time),
            s2 = new Date(),
            runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
            var year = Math.floor(runTime / 86400 / 365);
            runTime = runTime % (86400 * 365);
            var month = Math.floor(runTime / 86400 / 30);
            runTime = runTime % (86400 * 30);
            var day = Math.floor(runTime / 86400);
            runTime = runTime % 86400;
            var hour = Math.floor(runTime / 3600);
            runTime = runTime % 3600;
            var minute = Math.floor(runTime / 60);
            runTime = runTime % 60;
            var second = runTime;

            if(year>0 || month>0){
                return that.$regular.timeData(time,3)
            }

            if(day>0){
                return that.$regular.timeData(time,3)
            }

            if(hour>0 && hour<=3){
                return hour + '小时前'
            }

            if(hour>3){
                return that.$regular.timeData(time,4)
            }

            if(minute>0 && minute<=10){
                return minute + '分钟前'
            }

            if(minute>10){
                return that.$regular.timeData(time,4)
            }

            if(second>0){
                return '刚刚'
            }
        }
    },

    methods: {
        mouseover(val,index){
            this.$set(this.userList[index],'showClear',true)
        },
        mouseLeave(val,index){
            this.$set(this.userList[index],'showClear',false)
        },
        lookOrderOne(val){
            // if(val.content.kind == 'JZ:MessageOccupyOrder'){
            //     if (this.$route.path == '/seat') {
            //         setTimeout(()=>{
            //             this.$store.commit('onloadOrderFun', (this.$store.state.onloadOrder += 1));
            //         },500)
            //         // this.$store.commit('onloadOrderFun', true);
            //     }
            // }else{
            //     if(this.$route.path == '/orderManage'){
            //         setTimeout(()=>{
            //             this.$store.commit('onloadOrderFun', (this.$store.state.onloadOrder += 1));
            //         },500)
            //         // this.$store.commit('onloadOrderFun', true);
            //     }
            // }
            setTimeout(()=>{
                this.$store.commit('onloadOrderFun', (this.$store.state.onloadOrder += 1));
            },800)
            // this.showRoom = false;
        },
        lookOrder(val){
            if(val.content.kind == 'JZ:MessageOccupyOrder'){
                // 占座
                if (this.$route.path != '/system/occupy') {
                    this.$store.commit('onloadOrderFun', (this.$store.state.onloadOrder += 1));
                    this.$router.push('/system/occupy');
                } else {
                    this.$store.commit('onloadOrderFun', (this.$store.state.onloadOrder += 1));
                    // this.$store.commit('onloadOrderFun', true);
                }
            }else{
                // 催单
                if (this.$route.path != '/system/order') {
                    this.$store.commit('onloadOrderFun', (this.$store.state.onloadOrder += 1));
                    this.$router.push('/system/order');
                } else {
                    this.$store.commit('onloadOrderFun', (this.$store.state.onloadOrder += 1));
                    // this.$store.commit('onloadOrderFun', true);
                }
            }
            this.showRoom = false
        },
        closeX(item,index){
            let that = this
            let conversationType = RongIMLib.ConversationType.PRIVATE;
            let targetId = item.targetId
            RongIMClient.getInstance().removeConversation(conversationType,targetId,{
                onSuccess: function() {
                    RongIMClient.getInstance().clearUnreadCount(conversationType,targetId,{
                        onSuccess:function(){
                            that.allUnreadMsg()
                            that.userList.splice(index,1)  
                            if(that.now_user){
                                // 删除的会话  是当前的聊天会话
                                if(that.now_user.targetId == targetId){
                                    that.now_user = ''
                                }
                            }
                        },
                        onError:function(error){
                            console.log(error)
                        }
                    });
                },
                onError: function(error) {
                    that.$message({ message: '系统繁忙，请刷新后重试', type: 'warning' });
                }
            });
        },
        // 模拟点击事件 执行 音频
        // simulationClick(){
        //     console.log(11111)
        //     var audio=this.$refs.audio
        //     audio.play()
        // },

        // 监听聊天的关闭弹窗
        closeDialog(){
            this.$store.commit('headerClickMsgFun', false);
        },
        showChat(){
            let isClick = document.querySelector('.chat_room').getAttribute('drag-flag');
            if(isClick == 'true') {
                return 
            }
            this.$nextTick(this.scrollEnd);       
            this.showRoom = !this.showRoom
            if(this.now_user){
                this.getChat(this.now_user,this.active)
            }
            // this.conversation()
        },
        getChat(val, i) {
            this.loadingChat = true
            if(val.targetId == '10000' || val.targetId == '10001'){
                this.unInput = false
            }else{
                this.unInput = true
            }
            this.msgArr = []
            this.scorllFalse = true    
            this.now_user = val;
            this.active = i;
            this.emojiShow = false;
            this.getMore = true
            this.hasHistoryMsg = true
            this.getAssignHis(1)
            this.$nextTick(this.scrollEnd);
        },
        // 会话列表
        conversation(){
            // 1394245110005395457
            let that = this
            RongIMClient.getInstance().getConversationList({
                onSuccess: function(list) {
                    var result = [];
                    var obj = {};
                    for(var i =0; i<list.length; i++){
                       if(!obj[list[i].targetId]){
                          result.push(list[i]);
                          obj[list[i].targetId] = true;
                       }
                    }
                    var userId = ''
                    let arr = []
                    if(result.length<=0)return
                    result.forEach(v=>{
                        if(v.objectName != 'RC:GrpNtf' && v.objectName != 'JZ:GroupCustomNotice' ){
                            userId = v.targetId 
                            getUserInfo(userId).then((res) => {
                                if(res.data.code == 200){
                                    v['id'] = res.data.data.userId
                                    v['name'] = res.data.data.userName
                                    v['portrait'] = that.imgHead + res.data.data.userPortrait
                                    arr.push(v)
                                }else{
                                    that.$message({ message: '获取会话列表失败，请刷新', type: 'warning' });
                                }
                            });
                        }
                    })
                    that.userList = arr
                    console.log(that.userList)
                },
                onError: function(error) {
                    // do something
                    console.log(error)
                }
            }, null);
        },
        // 清除 未读消息条数
        clearUnreadNum(userId){
            let that = this
            // 成功获取对话历史后 清空 未读条数
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            var targetId = userId;
            RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                onSuccess: function(){
                    // 清除未读消息成功
                    that.$set(that.now_user,'unreadMessageCount',0)
                    that.allUnreadMsg()
                },
                onError: function(error){
                    console.log(error)
                    // that.$message({ message: res.msg, type: 'warning' });
                    // error => 清除未读消息数错误码
                }
            });
        },

        scrollEvent(event){
            if(this.scorllFalse)return
            let parent_scroll = this.$refs.parTopDistance.getBoundingClientRect().top
            let child_scroll = this.$refs.topDistance.getBoundingClientRect().top
            if(parent_scroll<=child_scroll){
                // this.firstDomHeight = this.$refs.topDistance.getBoundingClientRect().height
                this.debounce(this.getAssignHis,500);
            }
        },
        debounce:function(fn,wait){
            if (this.fun!==null){
                clearTimeout(this.fun)
            }
            this.fun = setTimeout(fn,wait)
        },

        // 获取指定用户的 会话历史
        getAssignHis(type=''){
            let that = this,timer=0
            if(!that.hasHistoryMsg)return
            this.getMore = true
            if(type == 1){
                that.msgArr = []
            }
            if(this.msgArr.length>0){
                timer = this.msgArr[0].sentTime
            }else{
                timer = 0
            }
            var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的会话类型即可
            var targetId = this.now_user.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
            var timestrap = timer; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;    
            var count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
                onSuccess: function(list, hasMsg) {
                    that.hasHistoryMsg = hasMsg;
                    let html = "";
                    that.getAssignInfo(that.now_user.targetId,list,type)
                    that.clearUnreadNum(that.now_user.targetId)
                    // list => Message 数组。
                    // hasMsg => 是否还有历史消息可以获取。
                },
                onError: function(error) {
                    console.log('GetHistoryMessages, errorcode:' + error);
                }
            });
        },

        // 获取指定用户信息
        getAssignInfo(userId,list,type){
            getUserInfo(userId).then((res) => {
                if(res.data.code == 200){
                    let newArr = []
                    let userInfo = res.data.data
                    console.log(res)
                    list.forEach((v,i)=>{
                        try{
                            if(v.messageType != 'UnknownMessage' && v.messageType != 'RecallCommandMessage' ){
                                v.content.content = RongIMLib.RongIMEmoji.emojiToHTML(v.content.content);
                            } 
                        }catch{
                        }
                        // 调用历史记录
                        if(v.messageDirection == 2){
                            if(userInfo.id == "10001"){
                                // 如果是订单消息
                                v.content['id'] = userInfo.userId
                                v.content['name'] = userInfo.userName
                                v.content['portrait'] = v.content.userPortrait
                            }else{
                                v.content['id'] = userInfo.userId
                                v.content['name'] = userInfo.userName
                                v.content['portrait'] = userInfo.userPortrait
                            }
                        }else if(v.messageDirection == 1){
                            v.content['id'] = this.selfInfo.user_id
                            v.content['name'] = this.selfInfo.user_name
                            v.content['portrait'] = this.selfInfo.avatar
                        }
                        newArr.unshift(v)
                    })
                    newArr.forEach(v=>{
                        this.msgArr.unshift(v)
                    })
                    if(type == 1){
                        this.$nextTick(this.scrollEnd);
                    }else{
                        this.$nextTick( () => {    
                            this.$refs.cmsg[list.length-1].scrollIntoView()
                        })
                    }
                    this.scorllFalse = false
                    this.getMore = false
                    this.loadingChat = false
                }else{
                    this.loadingChat = false
                    this.$message({ message: res.msg, type: 'warning' });
                }
                
            });
        },

        send() {
            this.emojiShow = false;
            let that = this
            if (!this.sendText && this.form.list.length<=0) {
                this.$message('发送消息不能为空');
                return;
            }
            if(this.form.list.length>0){
                this.form.list.forEach(v=>{
                    let base64Str,imageUri,msg,conversationType,targetId,image,base64,yasuo
                    image = new Image();  
                    image.crossOrigin = '';
                    image.src = this.joinUrl + v.name;  
                    image.onload = function(){  
                        base64 = that.$regular.getBase64Image(image); 
                        if(base64.length>=600000){
                            yasuo = 400
                        }else if(base64.length>=400000){
                            yasuo = 500
                        }else if(base64.length>=200000){
                            yasuo = 800
                        }else{
                            yasuo = 1000
                        }

                        that.$regular.compress(base64, yasuo, 0.5).then(function (val) {
                            base64Str = val.split(',')[1]
                            imageUri = that.joinUrl + v.name; // 上传到自己服务器的 URL。
                            msg = new RongIMLib.ImageMessage({content: base64Str, imageUri: imageUri});
                            conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的会话类型即可
                            targetId = that.now_user.targetId; // 目标 Id
                            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                                onSuccess: function (message) {
                                    // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
                                    that.form.list = [];
                                    message.content['id'] = that.selfInfo.user_id;
                                    message.content['name'] = that.selfInfo.user_name
                                    message.content['portrait'] = that.selfInfo.avatar

                                    that.msgArr.push(message);
                                    that.$nextTick(that.scrollEnd);
                                },
                                onError: function (errorCode, message) {
                                    var info = '';
                                    switch (errorCode) {
                                        case RongIMLib.ErrorCode.TIMEOUT:
                                            info = '超时';
                                            break;
                                        case RongIMLib.ErrorCode.UNKNOWN:
                                            info = '未知错误';
                                            break;
                                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                                            info = '在黑名单中，无法向对方发送消息';
                                            break;
                                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                                            info = '不在讨论组中';
                                            break;
                                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                                            info = '不在群组中';
                                            break;
                                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                                            info = '不在聊天室中';
                                            break;
                                    }
                                    console.log('发送失败:' + info + errorCode);
                                }
                            });
                        });

                       
                    }      
                })
            }
           
            if(!this.sendText)return
            // var msg = new RongIMLib.TextMessage({
            //     content: this.sendText,
            //     extra: "附加信息"
            // });
            // 自定义消息
            var messageName = 'PersonMessage'; // 消息名称
            var objectName = 'RC:TxtMsg'; // 消息内置名称，请按照此格式命名
            var isCounted = true; // 消息计数
            var isPersited = true; // 消息保存
            var mesasgeTag = new RongIMLib.MessageTag(isCounted, isPersited); // 消息是否保存是否计数，true true 计数且保存，false false 不计数不保存
            var prototypes = ['content', 'extra', 'messageName','user']; // 消息类中的属性名
            RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);

            var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的会话类型即可
            var targetId = this.now_user.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id

            
            var msg = new RongIMClient.RegisterMessage.PersonMessage(
                { 
                    content: this.sendText, 
                    extra: '',
                    messageName:'TextMessage',
                    user:{
                        id:this.selfInfo.user_id,
                        name:this.selfInfo.user_name,
                        portrait:this.selfInfo.avatar,
                    }
                }
            );
            
            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                onSuccess: function (message) {
                    console.log(message)
                    that.sendText = '';
                    message.content['id'] = message.content.user.id
                    message.content['name'] = message.content.user.name
                    message.content['portrait'] = message.content.user.portrait

                    that.msgArr.push(message);
                    that.$nextTick(that.scrollEnd);
                    console.log(that.msgArr)
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
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = x;
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            });
            // 自定义消息 end
            return
            // var conversationType = RongIMLib.ConversationType.PRIVATE;
            // var targetId = this.now_user.userId;
            // RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            //     // 发送消息成功
            //     onSuccess: function(message) {
            //         that.sendText = '';
            //         that.msgArr.push(message);
            //         that.$nextTick(that.scrollEnd);
            //     },
            //     onError: function (errorCode,message) {
            //         showResult("发送文字消息 失败",message,start);
            //     }
            // });
        },

        // 选择表情
        selectEmoji(emoji){
            this.sendText += emoji.emoji;
            // this.emojiShow = false;
        },
        // 展示表情
        showEmoji(){
            this.emojiShow = !this.emojiShow
        },
        scrollEnd: function() {
            var list =  this.$refs.cmsg
            if(!list)return
            this.$nextTick( () => {    
                if (list.length > 1) {
                    var last = list[list.length - 1];
                    last.scrollIntoView();
                }
            })
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        // 点击快捷回复
        quickRrep(val) {
            this.$refs.focusTextarea.focus();
            this.sendText = val;
        },
        clearConversation(){
            let that = this
            this.$confirm('确认清空所有会话', '提示', {
                type: 'warning'
            })
                .then(() => {
                    /*
                        clearTotalUnreadCount //清除全部会话未读数
                        clearUnreadCount  // 清除会话未读数
                        clearConversations// 删除所有会话
                    */
                    RongIMClient.getInstance().clearConversations({
                        onSuccess: function() {
                            RongIMClient.getInstance().clearTotalUnreadCount({
                                onSuccess: function(){
                                    // 清除未读消息成功
                                    that.userList = []
                                    that.now_user = ''
                                    that.allUnreadMsg()
                                },
                                onError: function(error){
                                    // error => 清除未读消息数错误码
                                    console.log(error)
                                }
                            });
                        },
                        onError: function(error) {
                            that.$message({ message: '系统繁忙，请刷新后重试', type: 'warning' });
                        }
                    });

                    // RongIMClient.getInstance().clearConversations({
                    //     onSuccess: function() {
                    //         that.userList.forEach(v=>{
                    //             let conversationType = RongIMLib.ConversationType.PRIVATE;
                    //             let targetId = v.targetId;
                    //             RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                    //                 onSuccess: function(){
                    //                     // 清除未读消息成功
                    //                     that.userList = []
                    //                     that.now_user = ''
                    //                     that.allUnreadMsg()
                    //                 },
                    //                 onError: function(error){
                    //                     // error => 清除未读消息数错误码
                    //                     console.log(error)
                    //                 }
                    //             });
                    //         })
                    //         return

                    //     },
                    //     onError: function(error) {
                    //         that.$message({ message: '系统繁忙，请刷新后重试', type: 'warning' });
                    //     }
                    // });
                })
                .catch(() => {});
        },
        

        clearConverHisMsg(){
            let that = this
            if(that.msgArr = []){
                this.$message({ message: '当前会话没有历史记录', type: 'warning' });
            }
            this.$confirm('确认清除当前会话历史记录', '提示', {
                type: 'warning'
            })
                .then(() => {
                    var params = {
                        conversationType: RongIMLib.ConversationType.PRIVATE, // 会话类型
                        targetId: this.now_user.targetId, // 目标 Id
                        timestamp: 0 // 清除时间点
                    };
                    RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
                        onSuccess: function() {
                            that.msgArr = []
                        },
                        onError: function(error) {
                            // 请排查：单群聊消息云存储是否开通
                            console.log(error);
                        }
                    });
                })
                .catch(() => {});
        },

        // 图片上传
        uploadImg() {
            let config = {
                'Content-Type': 'multipart/form-data'
            };
            let fromdata = new FormData();
            fromdata.append('file', this.formData);
            fileUpload(fromdata).then((res) => {
                if (res.data.code == 200) {
                    let img = {
                        name: res.data.data.name,
                        url: this.joinUrl + res.data.data.name
                    };
                    this.form.list.push(img);
                } else {
                    this.$message.error(`图片上传失败，请刷新后再试`);
                }
                this.loading = false;
            });
        },
        handleRemove(file) {
            this.form.list.forEach((i, index) => {
                if (file.name == i.name) {
                    this.form.list.splice(index, 1);
                }
            });
        },
         beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 0.4;
            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleChange(file, fileList) {
            if(file.size / 1024 / 1024 > .4){
                this.$message({ message: '请压缩图片大小', type: 'warning' });
                return
            }
            this.formData = file.raw;
            this.loading = true;
            this.uploadImg();
        },
        uploadSectionFile(file) {
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        exceed(files, fileList){
            this.$message({ message: '一次最多支持发送4张图片', type: 'warning' });
        },

        // 获取所有未读消息
        allUnreadMsg(){
            let that = this
            RongIMClient.getInstance().getTotalUnreadCount({
                onSuccess: function(count) {
                    if(count>10000000){
                        var conversationTypes = [RongIMLib.ConversationType.PRIVATE, RongIMLib.ConversationType.DISCUSSION];
                        RongIMClient.getInstance().getConversationUnreadCount(conversationTypes, {
                            onSuccess: function(count){
                                that.$store.commit('headerUnreadFun',count)
                            },
                            onError: function(error){
                                that.$message({ message: '获取会话消息失败，请刷新', type: 'warning' });
                            }
                        });
                    }else{
                        that.$store.commit('headerUnreadFun',count)
                    }
                },
                onError: function(error) {
                    // error => 获取总未读数错误码
                    console.log(error)
                }
            });
        }
    },
    mounted() {
        window.addEventListener( 'beforeunload', e => RongIMClient.getInstance().logout());
        if(!localStorage.getItem('saber-userInfo')){
            return
        }
        let that = this
        let rToken = JSON.parse(localStorage.getItem('saber-userInfo')).content.rong_token
        var userInfo = {
            appKey: this.$rongyunKey,
            token:rToken
        };
        // // 获取会话列表
        var callbacks = {};
        init(userInfo,callbacks);
        
        setTimeout(()=>{
            this.conversation()
            this.emoji = RongIMLib.RongIMEmoji.list
            this.allUnreadMsg()
        },1000)
        // this.scrollEnd();
    },
};
</script>
<style scoped lang='scss'>
div{
    line-height: initial;
}
.floating{
    height: 65px;
    width: 65px;
    border-radius: 50%;
    background: url('../../assets/img/kefu.jpg');
    background-size: 100% 100%;
    position: fixed;
    right: 100px;
    top: 80%;
    z-index: 1500;
    cursor: pointer;
    .all_unread{
        position: absolute;
        right: 0;
        top: 0;
        padding: 2px 5px;
        background: red;
        border-radius: 50%;
        color: white;
        font-size: 12px;
    }
}
.msg_picture{
    width: 200px;
    height: auto;
    border-radius: 4px;
}

$border-color: #e2e2e2;
#service {
    .userList{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        .not_read{
            position: absolute;
            right: 8px;
            background: #ff4e4e;
            padding: 0 4px;
            border-radius: 50%;
            display: inline-block;
            height: 16px;
            font-size: 12px;
            line-height: 16px;
            color: white;
            top: calc(50% - 8px);
        }
        .head_portrait{
            height: 40px;
            width: 40px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: 10px;
            font-size: 0;
            vertical-align: middle;
        }
        .close_x{
            position: absolute;
            right: 0px;
            top: -15px;
        }
    }
    .box {
        height: 730px;
        display: flex;
        background: white;
        .people_list {
            flex: .2;
            border-right: 1px solid $border-color;
            box-sizing: border-box;
            background: #f5f5f5;
            overflow-y: scroll;
            ul {
                li {
                    height: 50px;
                    line-height: 50px;
                    padding: 0 10px;
                    cursor: pointer;
                }
                li:hover {
                    background: $border-color;
                }
            }
            &::-webkit-scrollbar {
                display: none
            }
            & {
                scrollbar-width: none;
            }
            & {
                -ms-overflow-style: none;
            }
        }
        .chat {
            flex: .52;
            .record {
                height: 72%;
                border-bottom: 1px solid $border-color;
                box-sizing: border-box;

                .username {
                    line-height: 50px;
                    text-align: center;
                    background: #eaeaea;
                }
                .chat_list {
                    overflow-y: scroll;
                    height: calc(100% - 50px);
                    background: #f7f7f7;
                    // &::-webkit-scrollbar {
                    //     display: none
                    // }
                    // & {
                    //     scrollbar-width: none;
                    // }
                    // & {
                    //     -ms-overflow-style: none;
                    // }
                    &::-webkit-scrollbar{ 
                        width:4px;
                    }
                    &::-webkit-scrollbar-track{
                        background: rgb(230, 230, 230);
                        border-radius:2px;
                    }
                    &::-webkit-scrollbar-thumb{
                        background: #999;
                        border-radius:10px;
                    }
                    &::-webkit-scrollbar-thumb:hover{
                        background: rgb(187, 187, 187);
                    }
                    &::-webkit-scrollbar-corner{
                        background: #179a16;
                    }
                    .getMore{
                        text-align: center;
                        font-size: 12px;
                        padding: 10px 0px;
                    }
                }
                .cli {
                    padding: 10px 20px;
                    .cmsg {
                        .send_or_rece{
                            text-align: center;
                            line-height: 25px;
                            font-size: 12px;
                            color: #999;
                        }
                        .msg_list {
                            display: flex;
                            padding: 10px 0;
                            position: relative;
                        }
                        .self {
                            text-align: right;
                        }
                        .headImg {
                            flex: .08;
                            min-width: 50px;
                            img {
                                height: 35px;
                                width: 35px;
                                border-radius: 4px;
                            }
                        }
                        .msg {
                            flex: .92;
                            width: 200px;
                            &>div {
                                padding: 10px;
                                border-radius: 10px;
                                color: #f3f3f3;
                                max-width: 400px;
                                display: inline-block;
                                background: #de6200;
                                white-space: normal;
                            }
                        }
                        .withdraw {
                            & > div {
                                padding: 10px;
                                border-radius: 10px;
                                color: white;
                                max-width: 400px;
                                display: inline-block;
                                background: #dadada;
                            }
                        }
                        .notMsgType{
                            text-align: center;
                            margin-bottom: 12px;
                        }
                        .self_img {
                            text-align: right;
                        }
                        .self_msg {
                            div {
                                margin: auto;
                                margin-right: 0;
                                text-align: left;
                                background: #39b54a;
                                white-space: normal;
                            }
                        }
                        .orderinfo{
                            min-width: 220px;
                            .fx{
                                display: flex;
                                margin-bottom: 12px;
                            }
                        }
                    }
                }
            }

            .text_box {
                height: 28%;
                padding: 0 10px;
                .icons{
                    padding-top: 10px;
                    font-size: 0;
                    .flexo{
                        display: inline-block;
                        margin-right: 10px;
                        position: relative;
                        height: 20px;
                        width: 20px;
                        .up_file{
                            position: absolute;
                            width: 20px;
                            height: 20px;
                            left: 0;
                            top: 0;
                            opacity: 0;
                            cursor: pointer;
                        }
                        .emoji_box{
                            background: #fff;
                            z-index: 20;
                            border-radius: 4px;
                            box-shadow: 0 0 2px #bbbbbb;
                            width: 310px;
                            height: 100px;
                            position: absolute;
                            left: 0;
                            top: -132px;
                            overflow-y: scroll;
                            font-size: 14px;
                            padding: 12px;
                            .emojiItem{
                                display: inline-block;
                                cursor: pointer;
                                margin: 0 2px;
                            }
                        }
                        .emoji_box::-webkit-scrollbar {
                            display: none;
                        }
                        .emoji_box {
                            scrollbar-width: none;
                        }
                        .emoji_box {
                            -ms-overflow-style: none;
                        }

                        /deep/.el-upload--picture-card{
                            background: none;
                            border: none;
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 20px;
                            height: 20px;
                        }
                        .imgs{
                            position: absolute;
                            width: 296px;
                            left: 30px;
                            display: inline-block;
                            top: -172px;
                            background: #f7f7f7;
                            box-shadow: 0 0 5px #6d6d6d;
                            border-radius: 4px;
                            padding: 5px;
                            .del{
                                color: red;
                                font-size: 20px;
                                right: 8px;
                                position: absolute;
                                cursor: pointer;
                            }
                            li{
                                display: inline-block;
                                position: relative;
                            }
                            img{
                                width: 148px;
                                height: 148px;
                                object-fit: cover;
                                border-radius: 5px;
                                border: 1px solid #dcdcdc;
                                box-sizing: border-box;
                            }
                        }
                        /deep/ .el-upload-list{
                            
                            display: none;
                        }
                    }
                }
                .send_icon{
                    height: 20px;
                    width: 20px;
                    object-fit: cover;
                    cursor: pointer;
                }
                .textarea {
                    width: 100%;
                    padding-top: 10px;
                    height: calc(75% - 30px);
                    border: none;
                    resize: none;
                    outline: none;
                }
                .btn_oper {
                    height: 20%;
                    text-align: right;
                }
            }
        }
        /deep/ .quick {
            flex: .28;
            background: #f9f9f9;
            border-left: 1px solid $border-color;
            box-sizing: border-box;
            .goods_list {
                height: 100%;
                .one {
                    li {
                        line-height: 40px;
                        cursor: pointer;
                        padding: 0 10px;
                        &:hover {
                            background: $border-color;
                        }
                    }
                }
                .operating_btn{
                    padding-left:10px ;
                    button{
                        margin-bottom: 12px;
                        margin-left: 0;
                    }
                }
            }
            // element
            .el-tab-pane {
                height: 420px;
                overflow-y: scroll;
            }
            .el-tab-pane::-webkit-scrollbar {
                display: none
            }
            .el-tab-pane {
                scrollbar-width: none;
            }
            .el-tab-pane {
                -ms-overflow-style: none;
            }
            .el-input__inner {
                border: none;
                font-size: 16px;
                color: #000;
                height: 30px;
                line-height: 30px;
            }
            .el-date-editor {
                width: 120px;

            }
            .el-input__prefix {
                display: none;
            }
            .el-tabs__item {
                height: 50px;
                line-height: 50px;
            }
            .el-tabs__nav-wrap {
                padding: 0 10px;
            }
            
        }
        .active {
            background: $border-color;
        }
    }
}
/deep/.el-dialog{
    min-width:850px ;
}
/deep/.notify{
    cursor: pointer;
}
</style>
