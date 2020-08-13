<template>
    <div>
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
<!--        卡片试图-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
<!--            表格-->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border >
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" v-else-if="scope.row.cat_level === 1 " type="success">二级</el-tag>
                    <el-tag size="mini" v-else type="warning">三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

                </template>
            </tree-table>

<!--            分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 3, 4,5]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
<!--        添加分类的对话框-->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%" @close="closeCateDialog">
<!--            <span>这是一段信息</span>-->
<!--            添加分类的表单-->
            <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="80px">
                <el-form-item label="名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:" >
                    <el-cascader
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentChange"
                            clearable
                    >

                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        data(){
            return {
                //控制添加对话框的现实
                addCateDialogVisible: false,
                total: 0,
                cate_deleted: false,
                parentCateList:[],
                selectedKeys: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover',
                    checkStrictly: true
                },
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        // 表示，将当前列定义为模板列
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'isok'
                    },
                    {
                        label: '排序',
                        // 表示，将当前列定义为模板列
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'order'
                    },
                    {
                        label: '操作',
                        // 表示，将当前列定义为模板列
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'opt'
                    }
                ],
                cateList: [],
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                addCateForm:{
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0

                },
                addCateFormRules:{
                    cat_name:[
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]

                }
            }
        },
        created() {
            this.getCateList();
        },
        methods:{
           async getCateList(){
            const {data:res} =  await this.$http.get('categories',{params: this.queryInfo});
                if(res.meta.status !== 200){
                    return this.$message.error('获取商品分类失败');
                }
                this.cateList = res.data.result;
                this.total = res.data.total;
            },
            handleSizeChange(newSize){
               this.queryInfo.pagesize = newSize;
               this.getCateList();
            },
            handleCurrentChange(newPage){
               this.queryInfo.pagenum = newPage;
               this.getCateList();
            },
            showAddCateDialog(){
                this.getParentCateList();

                this.addCateDialogVisible = true;

            },
            async getParentCateList(){
             const {data:res} = await this.$http.get('categories',{
                   params:{type:2}
               });
             if(res.meta.status !== 200){
                 return this.$message.error('获取父级分类数据失败')
             }
             this.parentCateList = res.data;
            },
            //选择项发生变化触发
            parentChange(){
                if(this.selectedKeys.length > 0){
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                    this.addCateForm.cat_level = this.selectedKeys.length;
                    return;

                }else{
                    this.addCateForm.cat_pid = 0;
                    this.addCateForm.cat_level = 0;
                }
            },
            addCate(){
               this.$refs.addCateFormRef.validate( async valid =>{
                  if(!valid) return;
                  const {data:res} = await this.$http.post('categories', this.addCateForm);
                  if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败');
                  }
                  this.$message.success('添加分类成功');
                  this.getCateList();
                  this.addCateDialogVisible = false;
               })
            },
            closeCateDialog(){
               this.$refs.addCateFormRef.resetFields();
               this.selectedKeys = [];
               this.addCateForm.cat_level = 0;
               this.addCateForm.cat_pid = 0;
            }
        }
    }
</script>

<style lang="less" scoped>

    .el-cascader{
        width: 100%;
    }



</style>