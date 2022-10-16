<template>
    <div id="app" @click="close">
        <!-- <chatRoom></chatRoom> -->
        <router-view />
    </div>
</template>

<script>
// import chatRoom from './components/common/ChatRoom';
export default {
    name: "app",
    data() {
        return {};
    },
    watch: {},
    created() {

    },
    // components: {
    //     chatRoom
    // },
    methods: {
        close() {
            this.$store.commit('change', 2);
        }
    },
};
</script>
<style lang="scss">
#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
$def-color: #000;
$line-bg-color: #409eff;
.column {
    display: flex;
    margin:10px 0 20px 0;
    height: 30px;
}
.line {
    width: 5px;
    background: $line-bg-color;
    margin-right: 10px;
    display: inline-block;
}
.lw1 {
    height: 30px;
}
.lw2 {
    height: 20px;
}
.self_inp{
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    border: 1px solid #E4E7ED;
    outline: none;
    color:#606266;
    width: 150px;
    border-radius: 4px;
    margin-right: 10px;
}
.self_inp::-webkit-input-placeholder{
    color:#C0C4CC ;
}
</style>
