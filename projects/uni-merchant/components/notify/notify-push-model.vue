<template>
    <!-- 通知栏 -->
    <view class="notify-push-model fadeIn" :class="[type, translate]" v-if="visible" @touchstart="start" @touchend="end">
        <view>{{ text }}</view>
        <view class="more-text" v-if="isShowMore">查看更多>></view>
        <view class="notify-push-model-close cross" @click.stop="onClose"></view>
    </view>
</template>

<script>
export default {
    props: {
        duration: {
            // 显示时间
            type: Number,
            default: 3000
        },
        transition: {
            // 是否开启动画
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            visible: false,
            type: '',
            text: '',
            translate: '',
            startData: {},
            closeDuration: 300,
            isShowMore: false
        };
    },
    computed: {
        isRing() {
            return this.$store.state.isRing; //是否铃声
        },
        isNotificationBar() {
            return this.$store.state.isNotificationBar; //是否通知
        },
        isShock() {
            return this.$store.state.isShock; //是否震动
        }
    },
    methods: {
        // 通知音效
        playAudio() {
            const innerAudioContext = uni.createInnerAudioContext();
            innerAudioContext.autoplay = true;
            innerAudioContext.src = '/static/audio/notify-2.mp3';
            innerAudioContext.onPlay(() => {
                // console.log('通知音效 - 播放');
            });
            innerAudioContext.onError(res => {
                console.log('通知音效 - 报错',res.errCode);
            });
        },

        // 设备震动
        onVibrate() {
            let vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
            if (vibrate) {
                navigator.vibrate([500, 300, 400, 300]);
            } else {
                console.warn('不支持设备震动！');
            }
        },

        open() {
            //开启通知栏时
            if (this.isNotificationBar) {
                this.visible = true;
                if (this.isRing) {
                    setTimeout(() => {
                        this.playAudio();
                    }, 0);
                }
                if (this.isShock) {
                    this.onVibrate();
                }
            }
        },

        // 自动隐藏
        autoHide() {
            setTimeout(() => {
                this.translate = 'top-leave';
                this.close('noMore');
            }, this.duration - this.closeDuration);
        },

        // 隐藏消息通知
        close(type) {
            setTimeout(() => {
                this.translate = '';
                this.visible = false;
                this.isShowMore = type === 'noMore' ? false : true; //如果是自己关闭的就隐藏更多,如果是消息太多关闭之前的就显示更多
            }, this.closeDuration);
        },

        // 关闭按钮
        onClose() {
            this.translate = 'top-leave';
            this.close('noMore');
        },

        // 开始滑动
        start(e) {
            this.startData.clientX = e.changedTouches[0].clientX;
            this.startData.clientY = e.changedTouches[0].clientY;
        },

        // 滑动结束
        end(e) {
            const subX = e.changedTouches[0].clientX - this.startData.clientX;
            const subY = e.changedTouches[0].clientY - this.startData.clientY;
            if (subY > 50 || subY < -50) {
                this.translate = '';
                console.log('上下滑');
            } else {
                if (subX > 100) {
                    //右滑
                    this.translate = 'right-leave';
                    this.close('noMore');
                } else if (subX < -100) {
                    //左滑
                    this.translate = 'left-leave';
                    this.close('noMore');
                } else {
                    this.translate = '';
                    console.log('滑动无效');
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
/*弹层动画（从上往下）*/
.fadeIn {
    -webkit-animation: fadeInDown 0.5s;
    animation: fadeInDown 0.5s;
}

@keyframes fadeInDown {
    0% {
        transform: translate3d(0, -100%, 0);
        opacity: 0;
    }
    100% {
        -webkit-transform: none;
        transform: none;
        opacity: 1;
    }
}

.top-leave {
    transform: translateY(-110%);
    transition-timing-function: cubic-bezier(0.36, 0.66, 0.04, 1);
}
.right-leave {
    transform: translateX(110%);
    transition-timing-function: cubic-bezier(0.36, 0.66, 0.04, 1);
}
.left-leave {
    transform: translateX(-110%);
    transition-timing-function: cubic-bezier(0.36, 0.66, 0.04, 1);
}

// 消息通知框
.notify-push-model {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    width: 100%;
    height: auto;
    min-height: 50rpx;
    font-size: 30rpx;
    font-family: PingFang-SC-Medium;
    color: #f1f1f1;
    background: rgba($color: #000000, $alpha: 0.8);
    border-radius: 10rpx;
    padding: 25rpx 70rpx 25rpx 30rpx;
    box-sizing: border-box;
    transition-property: width, height, transform, background, font-size;
    transition-duration: 0.3s, 0.3s, 0.3s, 0.3s, 0.3s;
    box-shadow: 0 2rpx 12rpx 0 rgba($color: #000000, $alpha: 0.1);
    // transform: translateY(-100%);
    opacity: 0.9;
}

// 关闭按钮
.notify-push-model-close {
    position: absolute;
    top: 50%;
    right: 0;
    width: 30rpx;
    height: 30rpx;
    padding: 20rpx 20rpx;
    &::before,
    &::after {
        content: '';
        position: absolute;
        display: flex;
        justify-content: center;
        background: #f1f1f1;
        top: 0;
        left: 19rpx;
        width: 30rpx;
        height: 3rpx;
    }
    &::before {
        transform: rotate(45deg);
    }
    &::after {
        transform: rotate(-45deg);
    }
}

// 主要
.notify-push-model.primary {
    color: #f1f1f1;
    background: rgba($color: #0f88eb, $alpha: 1);
    .cross {
        &::before,
        &::after {
            background: #f1f1f1;
        }
    }
}

// 成功
.notify-push-model.success {
    color: #f1f1f1;
    background: rgba($color: #07c160, $alpha: 1);
    .cross {
        &::before,
        &::after {
            background: #f1f1f1;
        }
    }
}

// 警告
.notify-push-model.warning {
    color: #bb9f4c;
    background: rgba($color: #fff0d6, $alpha: 1);
    .cross {
        &::before,
        &::after {
            background: #bb9f4c;
        }
    }
}

// 危险
.notify-push-model.danger {
    color: #f1f1f1;
    background: rgba($color: #f56c6c, $alpha: 1);
    .cross {
        &::before,
        &::after {
            background: #f1f1f1;
        }
    }
}

// 信息
.notify-push-model.info {
    color: #f1f1f1;
    background: rgba($color: #909399, $alpha: 1);
    .cross {
        &::before,
        &::after {
            background: #f1f1f1;
        }
    }
}

.more-text {
    font-size: 24rpx;
    text-align: right;
}
</style>