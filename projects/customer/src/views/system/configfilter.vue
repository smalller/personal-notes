<template>
    <div class="screening">
        <div class="container">
            <div class="handle-box">
                <!-- <el-button
                    type="primary"
                    class="handle-del mr10"
                    @click="addscree"
                >新增筛选规则</el-button> -->
                <!-- <el-input v-model="query.text" placeholder="请输入关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="id" label="Id" width="70" align="center"></el-table-column>

                <el-table-column prop="type_ch" label="筛选模块" width="100" align="center"></el-table-column>


                <!-- <el-table-column prop="area" label="筛选模块" width="100"  align="center">
                    <template slot-scope="scope">
                        <span >{{scope.row.type==1?'夜店':(scope.row.type==2?'清吧':'KTV')}}</span>
                    </template>    
                </el-table-column> -->
                <el-table-column label="推荐类型/品牌" min-width="255">
                    <template slot-scope="scope">
                        <div class="com_del_box "> 
                            <span class="lab_brand" v-for="(item,i) in scope.row.labelsArr" :key="i">{{item}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="lowConsumption" label="均价范围" min-width="250" >
                    <template slot-scope="scope">
                        <div v-for="(p,i) in scope.row.rangesArr" :key="i" class="price_box">
                            <div v-if="p.split('-')[1]">
                                <span class="min_pr pr">{{p.split('-')[0]}}</span>
                                <span> ≤ 人均 ≤ </span>
                                <span class="max_pr pr">{{p.split('-')[1]}}</span>
                            </div>
                            <div v-else>
                                <span class="min_pr pr">{{p.split('-')[0]}}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">   
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <!-- <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">删除</el-button> -->
                        <!-- <el-button @click="enable(scope.$index, scope.row)" :type="scope.row.apply==1?'success':'danger'">
                            {{scope.row.apply==1?'已启用':'已禁用'}}
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>筛选规则</span>
            </div>
            <div class="store_type">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="夜店" name="1" :disabled="(activeName==1 || changeType)?false:true">
                        <el-form  label-width="70px" class="">
                            <div>
                                <el-form-item label="夜店类型">
                                    <el-form :model="formYeDianType" ref="formYeDianType"  class="demo-dynamic" >
                                        <el-form-item
                                            v-for="(domain, index) in formYeDianType.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div class="inp_box">
                                                <input class='self_inp' type="text" v-model="domain.recommendBrand" placeholder="请输入夜店类型">
                                                <i class="el-icon-error close" @click="deleteFun(domain,1)"></i>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                    <img class="addCou" src="../../../static/img/jia.png" @click="add(1)" alt="" >    
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="均价范围">
                                    <div class="add_con">
                                        <el-form :model="formYeDianPrice" ref="formYeDianPrice"  class="demo-dynamic" >
                                            <el-form-item
                                                v-for="(domain, index) in formYeDianPrice.domains"
                                                :key="domain.key"
                                                :prop="'domains.' + index + '.value'"
                                            >
                                                <div class="price_box">
                                                    <input class='self_inp' v-model="domain.min" type="number" disabled placeholder="min">
                                                    <span> ≤ 人均 ≤ &nbsp;&nbsp;</span>
                                                    <input class='self_inp' v-model="domain.max" type="number" placeholder="max">
                                                    <i class="el-icon-error" @click="deleteFun(domain,2)"></i>
                                                </div>
                                            </el-form-item>
                                        </el-form>
                                        <img class="addCou" src="../../../static/img/jia.png" @click="add(2)" alt="" >
                                    </div>
                                </el-form-item>  
                            </div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="清吧" name="2" :disabled="(activeName==2 || changeType)?false:true">    
                        <el-form  label-width="70px" class="">
                            <div>
                                <el-form-item label="清吧类型">
                                    <el-form :model="formQingBaType" ref="formQingBaType"  class="demo-dynamic" >
                                        <el-form-item
                                            v-for="(domain, index) in formQingBaType.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div class="inp_box">
                                                <input class='self_inp' type="text" v-model="domain.recommendBrand" placeholder="请输入清吧类型">
                                                <i class="el-icon-error close" @click="deleteFun(domain,3)"></i>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                    <img class="addCou" src="../../../static/img/jia.png" @click="add(3)" alt="" >    
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="均价范围">
                                    <div class="add_con">
                                        <el-form :model="formQingBaPrice" ref="formQingBaPrice"  class="demo-dynamic" >
                                            <el-form-item
                                                v-for="(domain, index) in formQingBaPrice.domains"
                                                :key="domain.key"
                                                :prop="'domains.' + index + '.value'"
                                            >
                                                <div class="price_box">
                                                    <input class='self_inp' v-model="domain.min" type="text" disabled placeholder="min">
                                                    <span> ≤ 人均 ≤ &nbsp;&nbsp;</span>
                                                    <input class='self_inp' v-model="domain.max" type="text" placeholder="max">
                                                    <i class="el-icon-error" @click="deleteFun(domain,4)"></i>
                                                </div>
                                            </el-form-item>
                                        </el-form>
                                        <img class="addCou" src="../../../static/img/jia.png" @click="add(4)" alt="" >
                                    </div>
                                </el-form-item>  
                            </div>
                        </el-form>
                    </el-tab-pane>  
                    <el-tab-pane label="KTV" name="3" :disabled="(activeName==3 || changeType)?false:true">
                        <el-form  label-width="70px" class="">
                            <div>
                                <el-form-item label="推荐品牌">
                                    <el-form :model="formKtvType" ref="formKtvType"  class="demo-dynamic" >
                                        <el-form-item
                                            v-for="(domain, index) in formKtvType.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div class="inp_box">
                                                <input class='self_inp' type="text" v-model="domain.recommendBrand" placeholder="请输入推荐品牌" >
                                                <i class="el-icon-error close" @click="deleteFun(domain,5)"></i>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                    <img class="addCou" src="../../../static/img/jia.png" @click="add(5)" alt="" >    
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="均价范围">
                                    <div class="add_con">
                                        <el-form :model="formKtvPrice" ref="formKtvPrice"  class="demo-dynamic" >
                                            <el-form-item
                                                v-for="(domain, index) in formKtvPrice.domains"
                                                :key="domain.key"
                                                :prop="'domains.' + index + '.value'"
                                            >
                                                <div class="price_box">
                                                    <input class='self_inp' v-model="domain.min" type="number" disabled placeholder="min">
                                                    <span> ≤ 人均 ≤ &nbsp;&nbsp;</span>
                                                    <input class='self_inp' v-model="domain.max" type="number" placeholder="max">
                                                    <i class="el-icon-error" @click="deleteFun(domain,6)"></i>
                                                </div>
                                            </el-form-item>
                                        </el-form>
                                        <img class="addCou" src="../../../static/img/jia.png" @click="add(6)" alt="" >
                                    </div>
                                </el-form-item>  
                            </div>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="AA拼单" name="4" :disabled="(activeName==4 || changeType)?false:true">
                        <el-form  label-width="70px" class="">
                            <div>
                                <el-form-item label="推荐品牌">
                                    <el-form :model="formAaType" ref="formAaType"  class="demo-dynamic" >
                                        <el-form-item
                                            v-for="(domain, index) in formAaType.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div class="inp_box">
                                                <input class='self_inp' type="text" v-model="domain.recommendBrand" placeholder="请输入推荐品牌">
                                                <i class="el-icon-error close" @click="deleteFun(domain,7)"></i>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                    <img class="addCou" src="../../../static/img/jia.png" @click="add(7)" alt="" >    
                                </el-form-item>
                            </div>
                            <div>
                                <el-form-item label="均价范围">
                                    <div class="add_con">
                                        <el-form :model="formAaPrice" ref="formAaPrice"  class="demo-dynamic" >
                                            <el-form-item
                                                v-for="(domain, index) in formAaPrice.domains"
                                                :key="domain.key"
                                                :prop="'domains.' + index + '.value'"
                                            >
                                                <div class="price_box">
                                                    <input class='self_inp' v-model="domain.min" type="number" disabled placeholder="min">
                                                    <span> ≤ 人均 ≤ &nbsp;&nbsp;</span>
                                                    <input class='self_inp' v-model="domain.max" type="number" placeholder="max">
                                                    <i class="el-icon-error" @click="deleteFun(domain,8)"></i>
                                                </div>
                                            </el-form-item>
                                        </el-form>
                                        <img class="addCou" src="../../../static/img/jia.png" @click="add(8)" alt="" >
                                    </div>
                                </el-form-item>  
                            </div>
                        </el-form>
                    </el-tab-pane>

                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/system/configfilter";
import {mapGetters} from "vuex";
export default {
    data: function() {
        return {
            query: {
                text: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            changeType:true,
            open:true,
            close:false,
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            activeName: '1',
            deleteArr:[],//删除类型/品牌时 临时存放 修改del状态 0未删除 1删除
            formYeDianType: {
                domains: [{
                    recommendBrand:'',
                    del:'',

                }],
            },//夜店类型
            formYeDianPrice: {
                domains: [{
                    min:'',
                    max:'',
                }],
            },//夜店均价
            formQingBaType: {
                domains: [{
                    recommendBrand:'',
                    del:'',
                }],
            },//清吧类型
            formQingBaPrice: {
                domains: [{
                    min:'',
                    max:'',
                }],
            },//清吧均价
            formKtvType: {
                domains: [{
                    recommendBrand:'',
                    power:'',
                    del:'',
                }],
            },//KTV类型
            formKtvPrice: {
                domains: [{
                    min:'',
                    max:'',
                }],
            },//KTV均价

            formAaType: {
                domains: [{
                    recommendBrand:'',
                    power:'',
                    del:'',
                }],
            },//AA类型
            formAaPrice: {
                domains: [{
                    min:'',
                    max:'',
                }],
            },//AA均价        
        };
    },
    watch:{
    },
    created(){
        this.getData();
    },
    methods: {
        getData() {
            getList().then(res => {
                let data = res.data.data;
                data.forEach(v=>{
                    v['labelsArr'] = v.labels.split(',')
                    v['rangesArr'] = v.ranges.split(',')
                    if(v.type == 1){
                        v['type_ch'] = '夜店'
                    }
                    if(v.type == 2){
                        v['type_ch'] = '清吧'
                    }
                    if(v.type == 3){
                        v['type_ch'] = 'KTV'
                    }
                    if(v.type == 4){
                        v['type_ch'] = 'AA拼单'
                    }
                })
                this.tableData = data
            });
        },

        // 新增 KTV夜店清吧
        addscree(){
            this.form = ''
            this.changeType = true
            this.activeName =  '1'
            this.formYeDianType = {domains: [{recommendBrand:'',del:'',}]}
            this.formYeDianPrice = {domains: [{min:'0',max:''}]}
            this.formQingBaType = {domains: [{recommendBrand:'',del:'',}]}
            this.formQingBaPrice = {domains: [{min:'0',max:''}]}
            this.formKtvType = {domains: [{recommendBrand:'',power:'',del:'',}]}
            this.formKtvPrice = {domains: [{min:'0',max:''}]}
            this.formAaType = {domains: [{recommendBrand:'',power:'',del:'',}]}
            this.formAaPrice = {domains: [{min:'0',max:''}]}
            this.editVisible = true
        },
        // 新增 内部 类型
        add(type) {
            switch(type){
                case 1:
                    this.formYeDianType.domains.push({
                        recommendBrand:'',
                        del:0
                    });
                    break
                case 2:
                    let len = this.formYeDianPrice.domains
                    if(!this.addRules(len)) return
                    this.formYeDianPrice.domains.push({});
                    len[len.length-1].min = Number(len[len.length-2].max) +1
                    break
                case 3:
                    this.formQingBaType.domains.push({
                        recommendBrand:'',
                        del:0
                    });
                    break
                case 4:
                    let qb = this.formQingBaPrice.domains
                    if(!this.addRules(qb)) return
                    this.formQingBaPrice.domains.push({});
                    qb[qb.length-1].min = Number(qb[qb.length-2].max) +1
                    break
                case 5:
                    this.formKtvType.domains.push({
                        recommendBrand:'',
                        del:0,
                        power:'',
                    });
                    break
                case 6:
                    let ktv = this.formKtvPrice.domains
                    if(!this.addRules(ktv)) return
                    this.formKtvPrice.domains.push({});
                    ktv[ktv.length-1].min = Number(ktv[ktv.length-2].max) +1
                    break
                case 7:
                    this.formAaType.domains.push({
                        recommendBrand:'',
                        del:0,
                        power:'',
                    });
                    break
                case 8:
                    let aa = this.formAaPrice.domains
                    if(!this.addRules(aa)) return
                    this.formAaPrice.domains.push({});
                    aa[aa.length-1].min = Number(aa[aa.length-2].max) +1
                    break
            }
        },

        // 新增时 范围 验证
        addRules(val){
            if(!val[val.length-1].max){
                this.$message({
                    message: '需要填写上条内容的最大值，才可以添加下一条',
                    type: 'warning',
                    duration:5000
                });
                return false
            }
            if(val[val.length-1].max<=val[val.length-1].min){
                    this.$message({
                    message: '最大值必须大于最小值',
                    type: 'warning',
                    duration:2000
                });
                return false
            }
            return true
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            console.log(row)
            this.deleteArr = []
            this.changeType = false
            this.idx = index;
            this.form = this.$regular.deep(row);
            this.formYeDianType.domains = []
            this.formYeDianPrice.domains = []
            this.formQingBaType.domains = []
            this.formQingBaPrice.domains = []
            this.formKtvType.domains = []
            this.formKtvPrice.domains = []
            this.formAaType.domains = []
            this.formAaPrice.domains = []
            // return
            switch(row.type){
                //待优化
                case 1:
                    row.labelsArr.forEach((i,j)=>{
                        this.formYeDianType.domains[j]={
                            recommendBrand:i
                        }
                    })
                    row.rangesArr.forEach((k,m)=>{
                        this.formYeDianPrice.domains[m]={
                            min:k.split('-')[0],
                            max:k.split('-')[1],
                        }
                        let str1 = k.split('-')[0]
                        if(str1.indexOf('以上')>-1){
                            this.formYeDianPrice.domains[m]={
                                min:str1.split('以')[0],
                            }
                        }
                    })
                    this.activeName = '1'
                    break
                case 2:
                    row.labelsArr.forEach((i,j)=>{
                        this.formQingBaType.domains[j]={
                            recommendBrand:i
                        }
                    })
                    row.rangesArr.forEach((k,m)=>{
                        this.formQingBaPrice.domains[m]={
                            min:k.split('-')[0],
                            max:k.split('-')[1],
                        }
                        let str = k.split('-')[0]
                        if(str.indexOf('以上')>-1){
                            this.formQingBaPrice.domains[m]={
                                min:str.split('以')[0],
                            }
                        }
                    })
                    
                    this.activeName = '2'
                    break
                case 3:
                    row.labelsArr.forEach((n,t)=>{
                        this.formKtvType.domains[t]={
                            recommendBrand:n
                            // del:n.del,
                            // id:n.id,
                            // power:n.power
                        }
                    })
                    row.rangesArr.forEach((k,m)=>{
                        this.formKtvPrice.domains[m]={
                            min:k.split('-')[0],
                            max:k.split('-')[1],
                        }
                        let str2 = k.split('-')[0]
                        if(str2.indexOf('以上')>-1){
                            this.formKtvPrice.domains[m]={
                                min:str2.split('以')[0],
                            }
                        }
                    })
                    this.activeName = '3'
                    break
                case 4:
                    row.labelsArr.forEach((n,t)=>{
                        this.formAaType.domains[t]={
                            recommendBrand:n
                            // del:n.del,
                            // id:n.id,
                            // power:n.power
                        }
                    })
                    row.rangesArr.forEach((k,m)=>{
                        this.formAaPrice.domains[m]={
                            min:k.split('-')[0],
                            max:k.split('-')[1],
                        }
                        let str2 = k.split('-')[0]
                        if(str2.indexOf('以上')>-1){
                            this.formAaPrice.domains[m]={
                                min:str2.split('以')[0],
                            }
                        }
                    })
                    this.activeName = '4'
                    break
            }
            // console.log(this.form)
            this.editVisible = true;
        },
        //保存前 判断价格

        minMax(max,min){
            if(Number(max)<=Number(min)){
                this.$message.warning('最大值必须大于最小值');
                return false
            }else{
                return true
            }
        },
        // 保存编辑
        saveEdit() {
            let arr=[],brr=[],crr=[]

            if(this.activeName ==1){
                this.formYeDianType.domains.forEach(i=>{
                    arr.push(i)
                })
                let compare = this.formYeDianPrice.domains
                let right = this.minMax(compare[compare.length-1].max,compare[compare.length-1].min)
                if(!right){
                    return
                }
                this.formYeDianPrice.domains.forEach(i=>{
                    brr.push(i.min + '-' + i.max)
                })

            }else if(this.activeName ==2){
                this.formQingBaType.domains.forEach(i=>{
                    arr.push(i)
                })
                let compare = this.formQingBaPrice.domains
                let right = this.minMax(compare[compare.length-1].max,compare[compare.length-1].min)
                if(!right){
                    return
                }
                this.formQingBaPrice.domains.forEach(i=>{
                    brr.push(i.min + '-' + i.max)
                })
            }else if(this.activeName ==3){
                this.formKtvType.domains.forEach(i=>{
                    arr.push(i)
                    crr.push(i)
                })
                let compare = this.formKtvPrice.domains
                let right = this.minMax(compare[compare.length-1].max,compare[compare.length-1].min)
                if(!right){
                    return
                }
                this.formKtvPrice.domains.forEach(i=>{
                    brr.push(i.min + '-' + i.max)
                })
                if(crr ==''){
                    this.$message.warning('请填写该品牌/类型的权重');
                    return        
                }
            }else{
                this.formAaType.domains.forEach(i=>{
                    arr.push(i)
                    crr.push(i)
                })
                let compare = this.formAaPrice.domains
                let right = this.minMax(compare[compare.length-1].max,compare[compare.length-1].min)
                if(!right){
                    return
                }
                this.formAaPrice.domains.forEach(i=>{
                    brr.push(i.min + '-' + i.max)
                })
                if(crr ==''){
                    this.$message.warning('请填写该品牌/类型的权重');
                    return        
                }
            }
            if(arr == ''){
                this.$message.warning('类型/品牌最少填写1个');
                return        
            }
            // if(this.deleteArr){
            //     arr = arr.concat(this.deleteArr)
            // }

            let lastVal = brr[brr.length-1].split('-')[1]
            let str='';
            if(lastVal == 'undefined' || lastVal == '' ){
                str = brr[brr.length-1].split('-')[0] + '以上'
            }
            if(str){
                brr.pop()
                brr.push(str)
            }
           
            let newArr = []
            arr.forEach(v=>{
                newArr.push(v.recommendBrand)
            })
            let data={
                id:this.form.id,
                labels:newArr,
                ranges:brr,
            }
            

            update(data).then((res) => {
                if(res.data.code == 200){
                    this.$message.success('保存成功');
                    this.editVisible = false;
                    this.getData()
                }
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        // 切换新增类型
        handleClick(tab, event) {
        },
        // 启用
        // enable(index,row){
        //     let data = {
        //         type: row.type,
	    //         id: row.id,
        //     }
        //     this.$post(`/admin/screening/use`,data).then((res) => {
        //         if(res.code == 0){
        //             this.$message.success('修改成功');
        //             this.$set(row,'apply',row.apply==1?0:1)
        //         }else{
        //             this.$message.error(res.msg);
        //         }
        //     })    
        // },
        // 删除时  改变del状态
        deleteFun(val,type){
            let index,item;
            if(type == 1 || type == 3 || type == 5 || type == 7){
                this.$set(val,'del',1)
                this.deleteArr.push(val)
            }
            switch(type){
                case 1:
                    index = this.formYeDianType.domains.indexOf(val)
                    item = this.formYeDianType.domains
                    break
                case 2:
                    index = this.formYeDianPrice.domains.indexOf(val)
                    item = this.formYeDianPrice.domains
                    break
                case 3:
                    index = this.formQingBaType.domains.indexOf(val)
                    item = this.formQingBaType.domains
                    break;
                case 4:
                    index = this.formQingBaPrice.domains.indexOf(val)
                    item = this.formQingBaPrice.domains
                    break;
                case 5:
                    index = this.formKtvType.domains.indexOf(val)
                    item = this.formKtvType.domains
                    break;
                case 6:
                    index = this.formKtvPrice.domains.indexOf(val)
                    item = this.formKtvPrice.domains
                    break;
                case 7:
                    index = this.formAaType.domains.indexOf(val)
                    item = this.formAaType.domains
                    break;
                case 8:
                    index = this.formAaPrice.domains.indexOf(val)
                    item = this.formAaPrice.domains
                    break;
            }
            if (index !== -1) {
                item.splice(index, 1)
            }
        }
    },
};
</script>
<style scoped lang='scss'>
.screening{
    .lab_brand{
        padding: 2px 5px;
        border: 1px solid #c7c7c7;
        border-radius: 4px;
        margin-right: 10px;
    }
    .pr{
        padding: 2px 20px;
        border: 1px solid #c7c7c7;
        border-radius: 4px;
    }
    .price_box{
        margin-bottom: 10px;
        .min_pr{
            margin-right: 10px;
        }
        .max_pr{
            margin-left: 10px;
        }
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
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.com_del_box{
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
}
/deep/ .el-icon-circle-close{
    color: white;
}
/deep/.handle-input{
    width: 150px;
}
/deep/ .el-dialog{
    min-width: 850px;
}
/deep/.el-dialog__header{
    padding: 0;
}
/deep/ .el-dialog__body{
    padding-top: 10px;
    .el-input{
        width: 150px;
        margin-right: 10px;
    }
    .addCou{
        height: 32px;
        cursor: pointer;
    }
    .el-form-item--small{
        display: inline-block;
    }
    .el-form{
        margin-top: 10px;
    }
    .inp_box{
        position: relative;
        .close{
            position: absolute;
            right: 4px;
            top: -6px;
            font-size: 16px;
            z-index: 2;
        }
    }
    i{
        cursor: pointer;
    }
}
</style>