
<script lang="ts" setup>
import { mainStore } from '../store/main'
import { storeToRefs } from 'pinia'

const store = mainStore()
const { count } = storeToRefs(store)

// 单条数据直接修改
const handleAddCount = () => {
    store.count++
}

// 多条数据直接修改
// 使用$patch + 对象
const onObjClick = () => {
    store.$patch({
        msg: store.msg === 'hello' ? 'hello world' : 'hello',
        count: store.count + 2
    })
}
// 使用$patch + 回调
const onFunClick = () => {
    store.$patch((state) => {
        state.msg = state.msg === 'hello' ? 'hello world' : 'hello'
        state.count = state.count + 3
    })
}

// 使用action修改数据
const onActionClick = () => {
    store.changeState()
}

</script>

<template>
    <div>
        <p>{{ store.msg }}</p>
        <p>{{ count }}</p>
        <button @click="handleAddCount">+</button>
        <button @click="onObjClick">使用$patch + 对象</button>
        <button @click="onFunClick">使用$patch + 回调</button>
        <button @click="onActionClick">使用action</button>
        <p>使用getter获取数据：{{ store.getState }}</p>
        <p>使用getter获取数据：{{ store.getState }}</p>
        <p>使用getter获取数据：{{ store.getState }}</p>
        <p>getter和vue中的计算属性一样，在获取state之前会做处理，具有缓存特性，如果值没有改变，多次使用也只会调用一次</p>
        <p>获取userStore中的值：{{ store.getUserState }}</p>
    </div>
</template>

<style lang='scss' scoped>
</style>