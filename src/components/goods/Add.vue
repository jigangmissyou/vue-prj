<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                    title="添加商品信息"
                    type="info" :closable="false">
            </el-alert>
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" label-position="top">

            <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input  type="number" v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input  type="number" v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input  type="number" v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_number">
                        <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                expand-trigger="hover"
                                :props="cateProps"
                                @change="handleChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <el-button type="primary" @click="add">添加商品</el-button>
                </el-tab-pane>
                <el-tab-pane label="完成" name="5">完成</el-tab-pane>

            </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        name: "Add",
        data(){
            return {
                activeIndex: "0",
                tabPosition: 'left',
                cateList: [],
                cateProps:{
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                addForm:{
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat:[],
                    pics:[],
                    goods_introduce: '',
                    attrs:[]
                },
                addFormRules:{
                    goods_name:[
                        {required: true, message:'请输入商品名称', trigger: 'blur'}
                    ],
                    goods_price:[
                        {required: true, message:'请输入商品价格', trigger: 'blur'}
                    ],
                    goods_weight:[
                        {required: true, message:'请输入商品重量', trigger: 'blur'}

                    ],
                    goods_number:[
                        {required: true, message:'请输入商品数量', trigger: 'blur'}

                    ]
                },
                manyTableData:[],
                onlyTableData:[],
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                headerObj:{
                    Authorization: window.sessionStorage.getItem('token'),
                },
                previewPath: '',
                previewVisible: false
            }
        },
        created() {
            this.getCateList()
        },
        computed:{
          cateId(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2];
            }
            return null;
          }
        },
        methods:{
           async getCateList(){
               const {data:res} = await this.$http.get('categories');
               if(res.meta.status !== 200){
                   return this.$message.error('获取商品分类列表错误');
               }
               this.cateList = res.data;

            },
            handleChange(){
                if(this.addForm.goods_cat.length !== 3){
                    this.addForm.goods_cat = [];
                }
            },
            beforeTabLeave(activeName, oldActiveName){
               if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                    this.$message.error('没有选择三级分类');
                   return false;
               }
            },
           async tabClicked(){
               if(this.activeIndex === '1'){
                  const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                       params: {
                           sel: 'many'
                       }
                   });
                   if(res.meta.status !== 200){
                       return this.$message.error('获取动态参数列表失败')
                   }
                   res.data.forEach(item => {
                       item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                   });
                    this.manyTableData = res.data;
               }else if(this.activeIndex === '2'){
                   const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                       params: {
                           sel: 'only'
                       }
                   });
                   if(res.meta.status !== 200){
                       return this.$message.error('获取静态参数列表失败')
                   }

                   this.onlyTableData = res.data;
               }
            },
            handlePreview(file) {
                console.log(file)
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            handleRemove(file){
                const filePath = file.response.data.tmp_path;
                const i = this.addForm.pics.findIndex(x => x.pic === filePath)
                this.addForm.pics.splice(i, 1)

            },
            handleSuccess(response){
               const picInfo = {pic: response.data.tmp_path};
               console.log(picInfo);
               this.addForm.pics.push(picInfo);
            },
            add(){
                this.$refs.addForm.validate( async valid =>{
                    if(!valid){
                        return this.$message.error('请填写必要的表单项');
                    }
                    const form = _.cloneDeep(this.addForm);

                    form.goods_cat = form.goods_cat.join(',');
                    this.manyTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        };
                        this.addForm.attrs.push(newInfo);
                    })

                    this.onlyTableData.forEach(item=>{
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo);
                    })

                    form.attrs = this.addForm.attrs;

                    const {data:res} = await this.$http.post('goods', form)

                    if(res.meta.status !== 201){
                        return this.$message.error('添加商品失败');
                    }
                    this.$message.success('添加商品成功')
                    this.$router.push('/goods');



                });
            }



        }
    }
</script>

<style lang="less" scoped>
.el-form-item{
    text-align: left;
}
.previewImg{
    width: 100%;
}
</style>