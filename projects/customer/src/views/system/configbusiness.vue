<template>
    <div class="announcement">
        <div class="container">
            <div class="handle-box">
                <el-button
                    icon="el-icon-edit"
                    type="primary"
                    class="handle-del mr10"
                    @click="addEdit()"
                >新增热门商区</el-button>
                <el-input v-model="query.text" placeholder="请输入关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column  label="ID" fixed type="index" align="center"></el-table-column>
                <!-- <el-table-column prop="districtCode" label="Id" width="100" align="center"></el-table-column> -->

                <el-table-column prop="province" label="省份" min-width="85"  align="center"></el-table-column>
                <el-table-column prop="city" label="市区" min-width="155"  align="center"></el-table-column>

                <el-table-column prop="districtName" label="区域名称" min-width="155"  align="center"></el-table-column>
                <el-table-column label="区域街道" min-width="255">
                    <template slot-scope="scope">
                        <div class="com_del_box"> 
                            {{scope.row.districtStreet}}
                            <span v-for="(item,i) in scope.row.streetList" :key="i">{{item.districtStreet}}，</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="districtSort" label="权重" width="60" align="center"></el-table-column>
                <el-table-column label="操作" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="deleteEdit(scope.$index, scope.row)" type="primary">删除</el-button>
                        <!-- <el-button @click="enable(scope.$index, scope.row)" :type="scope.row.openStatus==1?'success':'danger'">
                            {{scope.row.openStatus==1?'已启用':'启用'}}
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>热门商区设定</span>
            </div>
            <el-form ref="form" :model="form" label-width="70px" class="">
                <el-form-item label="区域名称">
                    <el-select v-model="address.one" placeholder="请选择省份" @change="selectProvince">
                        <el-option
                        v-for="item in province"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                    <el-select v-model="address.two" placeholder="请选择城市"  @change="selectCity">
                        <el-option
                        v-for="item in city"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                    <el-select v-model="address.three" placeholder="请选择区域" @change="selectArea">
                        <el-option
                        v-for="item in area"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域权重">
                    <el-input v-model="form.districtSort" type="number" placeholder="请选择排序权重"></el-input>
                </el-form-item>
                <el-form-item label="区域街道">
                    <div class="flex_box">
                        <div class="add_con">
                            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic" >
                                <el-form-item
                                    v-for="(domain, index) in dynamicValidateForm.domains"
                                    :key="domain.key"
                                    :prop="'domains.' + index + '.value'"
                                >
                                    <!-- <el-input v-model="domain.address" placeholder="请输入区域街道" @focus='focusInp(domain,index)' @input='adrFun(domain.address,index)'></el-input>
                                    <el-input v-model="domain.lat" placeholder="经度" disabled></el-input>
                                    <el-input v-model="domain.lng" placeholder="纬度" disabled></el-input> -->
                                    <input class="lat_lng" type="text" v-model="domain.address" placeholder="请输入区域街道" @focus='focusInp(domain,index)' @input='adrFun(domain.address,index)'>
                                    <input class="lat_lng not" type="text" v-model="domain.lng" placeholder="纬度" disabled>
                                    <input class="lat_lng not" type="text" v-model="domain.lat" placeholder="经度" disabled>
                                    <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                </el-form-item>
                            </el-form>
                            <img class="addCou" src="../../../static/img/jia.png" @click="addArea" alt="" >
                        </div>
                        <div class="map">
                            <mapView :mapList="mapList" @child-data="mapData" @child-adress='mapListFun'></mapView>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import mapView from '../../components/common/map'
import {getList, getDetail, add, update, remove,areas} from "@/api/system/configbusiness";
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
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            currentPage4: 1,
            province:[],
            city:[],
            area:[],
            address:{
                one:'',
                two:'',
                three:''
            },
            dynamicValidateForm: {
                domains: [{
                    address: '',
                    lng: '', //经度
                    lat: '', //纬度
                    id:'',
                }],
            },

            addressLists:[],
            mapList:{
                width:'450px',
                height:'400px',
                other:false,//不显示城市选择和详细地址
                status:true,
                searchAddress: '',//搜索地址
                addressList:[],//同时搜索多个地址
                city:'',//定位城市
                trustAddress: '',//详情信息如楼层等
            },
            addressDetails:'',
            areaName:'',//区名字，搜索范围
            cityName:'',//市名称
            provinceName:'',//省名称
            index:0,//临时存放选择input 下标
            list_id:'',//详情id
        };
    },
    watch:{
        'dynamicValidateForm.domains': {
            handler: function (val) {
            },
            deep: true
        },
        'form.districtSort': {
            handler: function (val) {
                if(val<=0){
                    this.form.districtSort = 0
                }
                if(val>=99){
                    this.form.districtSort = 99
                }
            },
            deep: true
        },
    },
    created(){
        this.getData();
        this.getProvince()
    },
    components:{
        mapView
    },
    methods: {
        adrFun(i,j){
            this.mapList.addressList = i
            this.index = j
        },
        focusInp(i,j){
            // console.log(i,j,123123123)
            // this.mapList.addressList = i.address
            // this.index = j
        },  
        getData() {
            let data = {
                current:this.query.pageIndex,
                size:this.query.pageSize,
                keyword:this.query.text,
            }
            getList(data).then((res) => {
                if(res.data.code == 200){
                    this.tableData = res.data.data.records
                    this.pageTotal = res.data.data.total
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        // 获取省市区列表
        getProvince(){
            areas().then((res) => {
                if(res.data.code == 200){
                    this.province = res.data.data
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        getCity(val){
            if(!val)return
            areas({provinceCode:val}).then((res) => {
                if(res.data.code == 200){
                    this.city = res.data.data
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        getArea(val){
            if(!val)return
            areas({cityCode:val}).then((res) => {
                if(res.data.code == 200){
                    this.area = res.data.data
                }else{
                    this.$message.error(res.msg);
                }
            })
        },

        // 监听 省/市改变
        selectProvince(e){
            this.address.two = ''
            this.address.three = ''
            this.getCity(e)

            this.province.map((item) => { 
                if(item.code === e) {
                    this.provinceName = item.name
                }
            })
        },
        selectCity(e){
            this.city.map((item) => { 
                if(item.code === e) {
                    this.address.three = ''
                    this.cityName = item.name
                    this.getArea(item.code)
                }
            })
        },
        selectArea(e){
            this.area.map((item) => { 
                if(item.code === e) {
                    this.mapList.city = item.name
                    this.areaName = item.name
                }
            })
        },
        // 批量增加区域街道
        addArea() {
            if(this.dynamicValidateForm.domains.length<1){
                this.dynamicValidateForm.domains.push({
                });
                return
            }
            let last = this.dynamicValidateForm.domains.slice(-1)
            if(!last[0].lat){
                this.$message.warning(`请先填写上一个区域地址`);
                return
            }
            this.dynamicValidateForm.domains.push({
            });
        },
        // 删除批量增加的街道
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1)
            }
        },
        // 地图返回数据
        mapData(val){
            this.addressLists = val
        },
        // 地图返回地址列表参数
        mapListFun(val){
            let lastList = this.dynamicValidateForm.domains[this.index]
            this.$set(this.dynamicValidateForm.domains,this.index,
            {
                address:val.title,
                lat:val.location.lng,
                lng:val.location.lat,
            })
        },
        // 启用
        enable(index,row){
            this.$get(`/admin/app/region/updateOpenStatus/${row.districtCode}`).then((res) => {
                if(res.code == 0){
                    this.$message.success('修改成功');
                    this.$set(row,'openStatus',row.openStatus==1?2:1)
                }else{
                    this.$message.error(res.msg);
                }
            })    
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
        deleteEdit(index, val){
            let str = val.districtCode
            // let str = val.provinceCode + ','+ val.cityCode + ',' + val.districtCode
            this.$confirm('确认删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                remove(str).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success(`删除成功`);
                        this.tableData.splice(index, 1);
                    }else {
                        this.$message.error(res.data.msg);
                    }
                })
            });
        },
        // 新增
        addEdit(){
            this.form = {}
            this.dynamicValidateForm={
                domains: [{
                    address: '',
                    lng: '', //经度
                    lat: '', //纬度
                }],
            }
            this.address={
                one:'',
                two:'',
                three:''
            }
            this.list_id = ''
            this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.form = {}
            this.dynamicValidateForm={
                domains: [{
                    address: '',
                    lng: '', //经度
                    lat: '', //纬度
                    id:''
                }],
            }
            this.address={
                one:'',
                two:'',
                three:''
            }
            
            this.addressDetails = row
            this.form = {
                districtSort:row.districtSort,
            }
            this.address={
                one:row.provinceCode,
                two:row.cityCode,
                three:row.districtCode,
            }
            this.getCity(row.provinceCode)
            this.getArea(row.cityCode)
            this.provinceName =row.province
            this.cityName = row.city
            this.areaName = row.districtName
            this.mapList.city = row.districtName

            for(let j=0;j<row.streetList.length;j++){
                this.dynamicValidateForm.domains[j] = {
                    address:row.streetList[j].districtStreet,
                    lng:row.streetList[j].lonlat.split(',')[0],
                    lat:row.streetList[j].lonlat.split(',')[1],
                }
            }
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            let last = this.dynamicValidateForm.domains.slice(-1)
            if(!last[0].lat){
                this.$message.warning(`请先填加新地址`);
                return
            }
            let arr = []
            this.dynamicValidateForm.domains.forEach(i=>{
                let obj = {}
                obj['districtStreet'] = i.address
                obj['lonlat'] = i.lng + ',' + i.lat
                arr.push(obj)
            })

            let data = {
                provinceCode:this.address.one,
                cityCode:this.address.two,
                districtCode:this.address.three,
                province:this.provinceName,
                city:this.cityName,
                districtName:this.areaName,
                districtSort:this.form.districtSort,
                id:this.list_id,
                streetList: arr
            }

            update(data).then(res=>{
                if(res.data.code == 200){
                    this.$message.success('操作成功');
                    this.editVisible = false;
                    this.getData()
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    },
};
</script>

<style scoped lang='scss'>
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
    min-width: 1200px;
}
/deep/.el-dialog__header{
    padding: 0;
}
/deep/ .el-dialog__body{
    padding-top: 10px;
    .el-input{
        width: 180px;
        margin-right: 10px;
    }
    .addCou{
        height: 32px;
        cursor: pointer;
    }
    .flex_box{
        display: flex;
        .add_con{
            flex: .56;
            height: 500px;
            overflow-y: scroll;
            .add_list {
                font-size: 13px;
                width: 300px;
                background: #fff;
                list-style: none;
                padding: 10px 0 10px 0;
                position: absolute;
                z-index: 10;
                box-shadow: 0 2px 5px #5a5a5a;
                border-radius: 5px;
                top: 40px;
                li {
                    cursor: pointer;
                    line-height: 30px;
                    padding: 0 10px;
                }
                li:hover {
                    background: rgb(209, 209, 209);
                }
                span {
                    color: #888888;
                }
                .notAdd {
                    text-align: center;
                    color: #9c9c9c;
                    padding: 10px 0;
                }
            }
            .lat_lng{
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
            .not{
                cursor: not-allowed;
                color:#C0C4CC;
            }
            .not::-webkit-input-placeholder{
                color:#C0C4CC ;
            }
        }
        .map{
            flex: .44;
        }
    }
}
</style>