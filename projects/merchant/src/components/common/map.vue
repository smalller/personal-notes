<template>
    <div id="map">
        <!-- element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)" -->
        <div class="seac_address" v-loading="cityTrue">
            <!-- 如果是租车行 -->
            <div v-if="mapList.merchantType === 2" class="choose-area">
                <el-cascader v-model="chooseValue" :options="cityList" @change="handleChange"></el-cascader>
            </div>
            <span @click.stop class="pro_add">
                <el-input v-model="fristForm.address" placeholder="请输入地址" @focus.stop="showFun(1)"></el-input>
                <!-- <el-button @click="defGet" icon="el-icon-search" circle style="position: relative;left: -52px;border:none"></el-button> -->
            </span>
            <!-- <el-input v-model="fristForm.longitude" placeholder="经度" ></el-input>
            <el-input v-model="fristForm.latitude" placeholder="纬度" ></el-input>-->
            <div class="city" @click.stop v-if="mapList.merchantType === 1">
                <span>{{ value }}</span>
                <span class="changeCity" @click.stop="showCityFun()">切换城市</span>
                <div class="cityList" v-if="showCity">
                    <div class="all" v-for="(c, i) in city" :key="i">
                        <div class="province">
                            <span>{{ c.label }}</span>
                        </div>
                        <div class="city">
                            <span @click="changeCity(j)" v-for="(j, index) in c.children" :key="index">{{ j.label }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dtl_add">
                <el-input v-model="fristForm.dtl_address" @blur="trustAddress" placeholder="请输入详细地址"></el-input>
            </div>
            <ul :class="mapList.merchantType === 1 ? 'add_list merchant-type1' : 'add_list merchant-type2'" v-if="showList">
                <div v-if="addressLists != ''">
                    <li @click="assignText(item)" v-for="(item, index) in addressLists" :key="index">
                        {{ item.title }}
                        <span>{{ item.address }}</span>
                    </li>
                </div>
                <div v-else class="notAdd">没有相关地址~</div>
            </ul>
            <div id="container" ref="container" :style="{ width: mapWidth, height: maiHeight }"></div>
        </div>
    </div>
</template>

<script>
var geocoder, map;
import city from '../../../static/js/city';
export default {
    data() {
        return {
            fun: null,
            mapData: '',
            mapWidth: '',
            maiHeight: '',
            cityTrue: true,
            fristForm: {
                longitude: -1, //经度
                latitude: -1, //纬度
                address: '', //输入的地址
                dtl_address: '' //详细地址
            },
            add_info: '', //子组件传值
            markersArray: [],
            addressLists: [], //下拉菜单数据
            city: [],
            value: '',
            searchService: '',
            geocoder: '',
            // marker:'',//控件
            markers: [],

            cityList: [], //返回的省市列表
            chooseValue: [] //选择省市
        };
    },
    props: {
        mapList: { type: Object },
        provAndCity: { type: Object }
    },

    computed: {
        showCity() {
            return this.$store.state.popupState2;
        },
        showList() {
            return this.$store.state.popupState1;
        }
    },
    created() {
        if (this.mapList) {
            this.mapWidth = this.mapList.width ? this.mapList.width : '1000px';
            this.maiHeight = this.mapList.height ? this.mapList.height : '600px';
            if (this.mapList.searchAddress) {
                this.fristForm.address = this.mapList.searchAddress;
            }

            if (this.mapList.trustAddress) {
                this.fristForm.dtl_address = this.mapList.trustAddress;
            }

            if (this.mapList.merchantType === 2) {
                this.chooseProv();

                if (this.provAndCity.province && this.provAndCity.city) {
                    this.chooseValue.push(this.provAndCity.province, this.provAndCity.city);
                }
            }
        }
        this.city = city;
    },
    mounted() {
        this.mapTX();
        let geolocation = new qq.maps.Geolocation('UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ', 'dingzuo');
        geolocation.getLocation(this.showPosition, this.showPositionErr, { timeout: 20000 });
    },
    watch: {
        'fristForm.address': {
            handler: function (val) {
                this.debounce(this.changeStr, 500);
                // this.childData()
            },
            deep: true
        }

        // 'fristForm.dtl_address': {
        //     handler: function (newVal, oldVal) {
        //         this.trustAddress();
        //     },
        //     deep: true
        // }
    },
    methods: {
        //获取后台返回的省份
        chooseProv() {
            this.$get('/merchant/store/vehicleStore/provinceList').then((res) => {
                if (res.code === 0) {
                    let result = res.data.map((item) => {
                        let obj = {};
                        obj.value = item.province;
                        obj.label = item.province;

                        let childrenList = [];
                        item.areaDTOS.forEach((i) => {
                            childrenList.push({
                                value: i.city + i.id,
                                label: i.city
                            });
                        });

                        obj.children = childrenList;

                        return obj;
                    });

                    this.cityList = result;
                }
            });
        },

        //选择完省市后的操作
        handleChange(res) {
            var pattern = new RegExp('[0-9]+');
            var num = res[1].match(pattern);
            let resCity = res[1].substr(0, num.index);
            this.value = resCity;
            this.$emit('child-city', this.chooseValue);
        },

        // 没有 点击下拉菜单时默认赋值返回数据第一个
        // defGet(){
        //     if(this.add_info == ''){
        //         this.add_info = this.addressLists[0]
        //         this.fristForm.longitude = this.addressLists[0].location.lng
        //         this.fristForm.latitude = this.addressLists[0].location.lat
        //     }
        //     console.log(this.add_info)
        // },
        trustAddress() {
            this.childData();
        },

        childData() {
            this.add_info['trustAddress'] = this.fristForm.dtl_address;
            this.$emit('child-data', this.add_info);
        },
        showCityFun() {
            this.$store.commit('change', 1);
        },
        showPosition(position) {
            console.log('aaa', this.mapList);

            this.cityTrue = false;
            if (this.mapList) {
                this.mapWidth = this.mapList.width ? this.mapList.width : '1000px';
                this.maiHeight = this.mapList.height ? this.mapList.height : '600px';
                if (this.mapList.searchAddress) {
                    this.fristForm.address = this.mapList.searchAddress;
                    this.$nextTick(() => {
                        this.changeStr();
                    });
                }
                if (this.mapList.trustAddress) {
                    this.fristForm.dtl_address = this.mapList.trustAddress;
                }
            }

            //地图上的定位点
            this.value = this.mapList.city === '' ? position.city : this.mapList.city;
            this.fristForm.longitude = this.mapList.longitude === -1 ? position.lng : this.mapList.longitude;
            this.fristForm.latitude = this.mapList.latitude === -1 ? position.lat : this.mapList.latitude;

            //自动将地图界面定位到当前选中的地方
            this.searchService.search();
        },
        showPositionErr(err) {
            this.cityTrue = false;
            this.value = '成都市';
            this.fristForm.longitude = 104.08329;
            this.fristForm.latitude = 30.65618;
        },
        // 关闭弹窗
        close() {
            this.showList = false;
            this.showCity = false;
        },
        // 展示搜索结果
        showFun(type) {
            this.$store.commit('change', 3);
        },
        // 防抖
        debounce(fn, wait) {
            if (this.fun !== null) {
                clearTimeout(this.fun);
            }
            this.fun = setTimeout(fn, wait);
        },
        changeStr(data) {
            let address = encodeURI(this.fristForm.address);
            const KEY = 'UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ';
            let url = 'https://apis.map.qq.com/ws/place/v1/search';
            this.$jsonp(url, {
                key: KEY,
                boundary: `region(${this.value},0)`,
                keyword: address,
                output: 'jsonp'
            })
                .then((res) => {
                    if (res.status == 0) {
                        this.addressLists = res.data;
                        this.add_info = res.data[0];
                    } else if (res.status == 330) {
                        this.addressLists = [];
                    } else {
                        this.$message({
                            message: '遇到一点问题~，请刷新后再试',
                            type: 'warning'
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            // return
            // this.$map_get(`/ws/place/v1/search?keyword=${address}&boundary=region(${this.value},0)&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ&output=jsonp`)
            //     .then((res) => {
            //         // this.addressLists = res.data;
            //         // console.log(JSON.parse(res))
            //         console.log(res)
            //         // this.add_info = res.data[0];
            //         // if (res.status == 0) {

            //         //     // console.log(res.data);
            //         // } else if (res.status == 330) {
            //         //     this.addressLists = [];
            //         // } else {
            //         //     this.$message({
            //         //         message: '遇到一点问题~，请刷新后再试',
            //         //         type: 'warning'
            //         //     });
            //         // }
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     })
            // this.searchService.search(this.fristForm.address);
            // this.searchService.setLocation(this.value);
        },
        // 地图控件  展示
        mapControls(data) {
            console.log('vvv', data);
            this.searchService.search(this.fristForm.address);
        },
        // 点击搜索结果赋值、
        assignText(val) {
            // 调用接口时
            this.add_info = val;
            this.$store.commit('change', 3);
            this.fristForm.longitude = val.location.lng;
            this.fristForm.latitude = val.location.lat;
            this.fristForm.address = val.title;

            this.mapControls(this.add_info);

            this.childData();
            // 本地搜索时 展示
            // this.fristForm.longitude = val.latLng.lng
            // this.fristForm.latitude = val.latLng.lat
            // this.fristForm.address = val.name
        },
        // 切换城市
        changeCity(val) {
            this.value = val.label;
        },

        TMap() {
            return new Promise(function (resolve, reject) {
                window.init = function () {
                    resolve(qq);
                };
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://map.qq.com/api/js?v=2.exp&callback=init&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ';
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },
        mapTX() {
            let that = this;
            this.TMap().then((qq) => {
                map = new qq.maps.Map(this.$refs.container, {
                    //初始经纬度
                    center: new qq.maps.LatLng(30.611913633860105, 104.08172607421875),
                    zoom: 13
                });
                var scaleControl = new qq.maps.ScaleControl({
                    align: qq.maps.ALIGN.BOTTOM_LEFT,
                    margin: qq.maps.Size(85, 15),
                    map: map
                });
                //绑定单击事件添加参数  点击地图
                qq.maps.event.addListener(map, 'click', function (event) {
                    that.fristForm.longitude = event.latLng.getLng(); // 经度
                    that.fristForm.latitude = event.latLng.getLat(); // 纬度
                    if (that.markersArray) {
                        for (let i in that.markersArray) {
                            that.markersArray[i].setMap(null);
                        }
                    }
                    var marker = new qq.maps.Marker({
                        map: map,
                        position: event.latLng
                    });
                    that.markersArray.push(marker);
                });
                geocoder = new qq.maps.Geocoder({
                    complete: function (result) {
                        map.setCenter(result.detail.location);
                        var gps = result.detail.location.lat + ',' + result.detail.location.lng;
                        var marker = new qq.maps.Marker({
                            map: map,
                            position: result.detail.location
                        });
                        that.markersArray.push(marker);
                        if (that.markersArray.length > 1) {
                            for (let i = 0; i < that.markersArray.length - 1; i++) {
                                that.markersArray[i].setMap(null); //清除标记
                            }
                        }
                    }
                });

                // 本地查询 不调用接口
                this.searchService = new qq.maps.SearchService({
                    complete: function (results) {
                        // that.addressLists = results.detail.pois
                        if (results.type === 'CITY_LIST') {
                            that.searchService.setLocation(results.detail.cities[0].cityName);
                            that.searchService.search(that.fristForm.address);
                            return;
                        }
                        that.clearOverlays(that.markers);
                        var pois = results.detail.pois;
                        var latlngBounds = new qq.maps.LatLngBounds();
                        for (var i = 0, l = pois.length; i < l; i++) {
                            var poi = pois[i];
                            latlngBounds.extend(poi.latLng);
                            var marker = new qq.maps.Marker({
                                map: map,
                                position: poi.latLng
                            });
                            marker.setTitle(poi.name);
                            that.markers.push(marker);
                        }
                        map.fitBounds(latlngBounds);
                    }
                });
            });
        },

        clearOverlays(overlays) {
            if (overlays) {
                for (let i in overlays) {
                    overlays[i].setMap(null);
                }
            }
        }
    }
};
</script>

<style scoped lang='scss'>
#map {
    height: 100%;

    .choose-area {
        margin-bottom: 10px;
    }

    /deep/ .seac_address {
        width: 1100px;
        width: 100%;
        margin-bottom: 20px;
        position: relative;

        .merchant-type1 {
            top: 40px;
        }

        .merchant-type2 {
            top: 80px;
        }

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
            // top: 40px;
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
        .city {
            font-size: 12px;
            position: relative;
            display: inline-block;
            .changeCity {
                color: red;
                cursor: pointer;
                margin-left: 10px;
            }
            .cityList {
                position: absolute;
                z-index: 10;
                background: white;
                padding: 10px;
                width: 200px;
                box-shadow: 0 2px 5px #5a5a5a;
                border-radius: 5px;
                top: 25px;
                height: 400px;
                overflow-y: scroll;
                span {
                    margin-right: 10px;
                    margin-bottom: 10px;
                    display: inline-block;
                    // width: 25%;
                }
                .city {
                    span {
                        color: #676767;
                        cursor: pointer;
                    }
                    span:hover {
                        color: red;
                    }
                }
                .all {
                    display: flex;
                    .province {
                        flex: 0.3;
                    }
                    .city {
                        flex: 0.7;
                    }
                }
            }
            .cityList::-webkit-scrollbar {
                display: none;
            }
            .cityList {
                scrollbar-width: none;
            }
            .cityList {
                -ms-overflow-style: none;
            }
        }
        .el-input--small {
            width: 300px;
            margin-right: 20px;
        }
    }
}
</style>