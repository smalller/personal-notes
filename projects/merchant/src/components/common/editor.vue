<template>
    <div id="editor">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-upload
            class="avatar-uploader-editor"
            :action="serverUrl"
            name="files"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            style="display: none"
        >
        </el-upload>
        <el-upload
            class="avatar-uploader-editor-video"
            :action="serverUrl"
            name="files"
            :show-file-list="false"
            :on-success="uploadSuccessVideo"
            :on-error="uploadError"
            :on-change="handleChange"
            style="display: none"
        >
        </el-upload>
        <!-- <el-upload class="avatar-uploader-editor-voice" :action="serverUrl" name="voice"  :show-file-list="false"
                    :on-success="uploadSuccessVoice" :on-error="uploadError" style="display:none"> </el-upload> -->

        <div class="container">
            <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption">
                <div id="toolbar" slot="toolbar">
                    <button class="ql-bold" title="加粗">Bold</button>
                    <button class="ql-italic" title="斜体">Italic</button>
                    <button class="ql-underline" title="下划线">underline</button>
                    <button class="ql-strike" title="删除线">strike</button>
                    <button class="ql-blockquote" title="引用"></button>
                    <button class="ql-code-block" title="代码"></button>
                    <button class="ql-header" value="1" title="标题1"></button>
                    <button class="ql-header" value="2" title="标题2"></button>
                    <button class="ql-list" value="ordered" title="有序列表"></button>
                    <button class="ql-list" value="bullet" title="无序列表"></button>
                    <select class="ql-header" title="段落格式">
                        <option selected>段落</option>
                        <option value="1">标题1</option>
                        <option value="2">标题2</option>
                        <option value="3">标题3</option>
                        <option value="4">标题4</option>
                        <option value="5">标题5</option>
                        <option value="6">标题6</option>
                    </select>
                    <select class="ql-size" title="字体大小">
                        <option value="10px">10px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px" selected>16px</option>
                        <option value="18px">18px</option>
                        <option value="20px">20px</option>
                        <option value="30px">30px</option>
                    </select>
                    <select class="ql-font" title="字体">
                        <option value="SimSun">宋体</option>
                        <option value="SimHei">黑体</option>
                        <option value="Microsoft-YaHei">微软雅黑</option>
                        <option value="KaiTi">楷体</option>
                        <option value="FangSong">仿宋</option>
                        <option value="Arial">Arial</option>
                    </select>
                    <select class="ql-color" value="color" title="字体颜色"></select>
                    <select class="ql-background" value="background" title="背景颜色"></select>
                    <select class="ql-align" value="align" title="对齐"></select>
                    <button class="ql-clean" title="清除字体样式"></button>
                    <button class="ql-image" title="图片"></button>
                    <button class="ql-video" title="视频"></button>
                    <!-- <button class="ql-audio" title="音频"><i class="el-icon-headset"></i></button>  -->
                </div>
            </quill-editor>
        </div>
        <!-- <div class="btn_bom">
            <el-button class="editor-btn" @click="submit">重置</el-button>
            <el-button class="editor-btn" type="primary" @click="submit">确定</el-button>
        </div> -->
    </div>
</template>

<script>
import { Quill, quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import Video from './video'
import Audio from './audeo'
export default {
    name: 'editor',
    data: function () {
        return {
            content: '',
            editorOption: {
                placeholder: '请输入', //文章初始化提示语
                theme: 'snow', // or 'bubble'
                modules: {
                    toolbar: {
                        container: '#toolbar',
                        handlers: {
                            image: function (value) {
                                if (value) {
                                    document.querySelector('.avatar-uploader-editor input').click();
                                } else {
                                    this.quill.format('image', false);
                                }
                            },
                            video: function (value) {
                                if (value) {
                                    document.querySelector('.avatar-uploader-editor-video input').click();
                                } else {
                                    this.quill.format('video', false);
                                }
                            },
                            audio: function (value) {
                                if (value) {
                                    document.querySelector('.avatar-uploader-editor-voice input').click();
                                } else {
                                    this.quill.format('audio', false);
                                }
                            }
                        }
                    }
                }
            },
            serverUrl: '',
            downUrl: this.$imgHead
        };
    },
    props: {
        formData: {}
    },
    watch: {
        formData: {
            deep: true,
            handler(newValue, oldValue) {
                this.content = this.formData.editor_text;
            }
        },
        content: {
            handler(newValue, oldValue) {
                this.debounce(this.toParent, 500);
            }
        }
    },
    components: {
        quillEditor
    },
    created() {
        if (process.env.NODE_ENV === 'development') {
            // 开发环境
            this.serverUrl = '/file/merchant/store/system/upload/createBatch';
        } else if(process.env.NODE_ENV === "testing"){
            this.serverUrl = 'https://storetest.cdhqht.com/merchant/store/system/upload/createBatch';
        }else{
            this.serverUrl = 'https://store.cdhqht.com/merchant/store/system/upload/createBatch';
        }

        // console.log(this.formData)
        this.content = this.formData.editor_text;
        let Size = Quill.import('attributors/style/size');
        Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '30px'];
        Quill.register(Size, true);
        var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif', '宋体', '黑体'];
        var Font = Quill.import('formats/font');
        Font.whitelist = fonts;
        Quill.register(Font, true);
        Quill.register(Video, true);
        Quill.register(Audio, true);
        // this.content = '<p>ooo</p><p>1</p><p>1</p><p>1</p><p>1</p><p><br></p><p>1</p><p>1</p><p>3s</p><p>df</p><p>2df2</p><p>2ef分</p><p>22</p><p>ddddd交换机端口积分是否杀顶方式打分杀顶发sf</p><p><strong style="color: rgb(240, 102, 102);">啊大大大师的</strong></p>'
    },
    methods: {
        // 防抖
        debounce(fn, wait) {
            if (this.fun !== null) {
                clearTimeout(this.fun);
            }
            this.fun = setTimeout(fn, wait);
        },

        toParent() {
            this.$emit('getChild', this.content);
        },

        onEditorChange({ editor, html, text }) {
            this.content = html;
        },
        submit() {
            console.log(this.formData);
            console.log(this.content);
            this.$message.success('提交成功！');
        },
        // 富文本图片上传成功
        uploadSuccess(res, file) {
            let quill = this.$refs.myQuillEditor.quill;
            console.log(res);
            if (res.code == 0) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片res.url为服务器返回的图片地址
                quill.insertEmbed(length, 'image', this.downUrl + res.data[0]);
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                this.$message.error('图片插入失败');
            }
        },
        //上传视频
        uploadSuccessVideo(res, file) {
            let quill = this.$refs.myQuillEditor.quill;
            if (res.code == 0) {
                let length = quill.getSelection().index;
                quill.insertEmbed(length, 'video', this.downUrl + res.data[0]);
                quill.setSelection(length + 1);
            } else {
                this.$message.error('视频插入失败');
            }
        },
        // 音频
        uploadSuccessVoice(res, file) {
            let quill = this.$refs.myQuillEditor.quill;
            if (res.code == 0) {
                let length = quill.getSelection().index;
                let BlockEmbed = Quill.import('blots/block/embed');
                class AudioBlot extends BlockEmbed {
                    static create(value) {
                        let node = super.create();
                        node.setAttribute('src', res.data.url); //设置audio的src属性
                        node.setAttribute('controls', true); //设置audio的controls，否则他将不会显示
                        node.setAttribute('controlsList', 'nodownload'); //设置audio的下载功能为不能下载
                        node.setAttribute('id', 'voice'); //设置一个id
                        return node;
                    }
                }

                AudioBlot.blotName = 'audio';
                AudioBlot.tagName = 'audio'; //自定义的标签为audio
                Quill.register(AudioBlot);
                // insertEmbed(index: Number(插入的位置), type: String(标签类型), value: any(参数，将传入到create的方法中去), source: String = 'api')
                quill.insertEmbed(length, 'audio', res.data.url);
                quill.setSelection(length + 1); //光标位置向后移动一位
            } else {
                this.$message.error('音频插入失败');
            }
        },
        // 富文本图片/视频/音频上传失败
        uploadError() {
            this.$message.error('插入失败');
        },

        //
        uploadSectionFile(file) {},
        handleChange(file, fileList) {
            console.log(file);
        }
    }
};
</script>
<style scoped>
.editor-btn {
    margin-top: 20px;
}
.avatar-uploader-editor {
    display: inline-block;
}
.avatar-uploader-editor-video {
    display: inline-block;
}
.avatar-uploader-editor-voice {
    display: inline-block;
}
.ql-snow .ql-picker.ql-header {
    width: 60px;
}
.ql-snow .ql-picker.ql-size {
    width: 60px;
}
.ql-snow .ql-picker.ql-font {
    width: 85px;
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
    content: '宋体';
    font-family: 'SimSun';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
    content: '黑体';
    font-family: 'SimHei';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Microsoft-YaHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Microsoft-YaHei']::before {
    content: '微软雅黑';
    font-family: 'Microsoft YaHei';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
    content: '楷体';
    font-family: 'KaiTi';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
    content: '仿宋';
    font-family: 'FangSong';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
    content: 'Arial';
    font-family: 'Arial';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Times-New-Roman']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Times-New-Roman']::before {
    content: 'Times New Roman';
    font-family: 'Times New Roman';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
    content: 'sans-serif';
    font-family: 'sans-serif';
}

.ql-font-SimSun {
    font-family: 'SimSun';
}

.ql-font-SimHei {
    font-family: 'SimHei';
}

.ql-font-Microsoft-YaHei {
    font-family: 'Microsoft YaHei';
}

.ql-font-KaiTi {
    font-family: 'KaiTi';
}

.ql-font-FangSong {
    font-family: 'FangSong';
}

.ql-font-Arial {
    font-family: 'Arial';
}

.ql-font-Times-New-Roman {
    font-family: 'Times New Roman';
}

.ql-font-sans-serif {
    font-family: 'sans-serif';
}
.btn_bom {
    text-align: right;
}
</style>