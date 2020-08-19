<template>
    <div>
<!--        面包屑导航栏-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                    title="注意：只允许为第三级分类设置相关参数！"
                    type="error" :closable = "false">
            </el-alert>
            <el-row>
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader v-model="selectedCateKeys" :options="catelist" :props="cateProps" @change="handleChange">

                    </el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">

                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>

                                <el-input
                                        class="input-new-tag"
                                        v-if="inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">

                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>

                                <el-input
                                        class="input-new-tag"
                                        v-if="inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
            <!-- 添加参数或属性对话框 -->
            <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
                <!-- 添加表单 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改参数的对话框 -->
            <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                <!-- 添加参数的对话框 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "CateParams",
        data(){
            return {
                catelist: [],
                selectedCateKeys:[],
                cateProps:{
                    value: 'cat_id',
                    label:'cat_name',
                    children: 'children'
                },
                activeName:'many',
                // 动态参数的数据
                manyTableData: [],
                // 静态属性的数据
                onlyTableData: [],
                addDialogVisible: false,
                // 添加参数的表单数据对象
                addForm: {
                    attr_name: ''
                },
                // 控制修改对话框的显示与隐藏
                editDialogVisible: false,
                //修改表单对象
                editForm:{

                },
                // 添加表单的验证规则对象
                addFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                // 修改表单的验证规则对象
                editFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                inputVisible: false,

            }
        },
        computed:{
            // 如果按钮需要被禁用，则返回true，否则返回false
            isBtnDisabled() {
                if(this.selectedCateKeys.length !== 3) {
                    return true
                }
                return false
            },
            // 当前选中的三级分类的Id
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },
            titleText(){
                if(this.activeName === 'many'){
                    return '动态参数';
                }else{
                    return '静态属性';
                }
            }
        },
        created() {
            this.getCateList();
        },
        methods:{
            handleChange() {
                this.getParamsData()
            },
            handleTabClick(){
                this.getParamsData()

            },
            async getCateList(){
                const { data: res } = await this.$http.get('categories');
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败！')
                }
                this.catelist = res.data;
            },
            //获取参数列表数据
            async getParamsData(){
                //证明选中的不是三级分类
                if(this.selectedCateKeys.length  !== 3){
                    this.selectedCateKeys = [];
                    this.manyTableData = [];
                    this.onlyTableData = [];
                    return;
                }
                // 根据所选分类的Id，和当前所处的面板，获取对应的参数
                const { data: res } = await this.$http.get(
                    `categories/${this.cateId}/attributes`,
                    {
                        params: { sel: this.activeName }
                    }
                );

                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败！')
                }

                res.data.forEach(item =>{
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    item.inputVisible = false;
                    // 文本框中输入的值
                    item.inputValue = ''
                });

                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }

            },
            addDialogClosed(){
                //重置表单内容为空
                this.$refs.addFormRef.resetFields();
                this.addDialogVisible = false
            },
            addParams(){
                this.$refs.addFormRef.validate( async valid =>{
                    if(!valid) return;
                    const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                            attr_name: this.addForm.attr_name,
                            attr_sel: this.activeName
                        }
                    );
                    if(res.meta.status !== 200){
                        this.$message.error('添加参数失败');
                    }
                    this.$message.success('添加参数成功');
                    this.addDialogClosed();
                    this.getParamsData();
                });

            },
             editParams(){
                this.$refs.editFormRef.validate(async valid =>{
                    if(!valid) return;
                    const {data:res} = await this.$http.put(
                        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                        {attr_name: this.editForm.attr_name, attr_sel: this.activeName}
                    );
                    if(res.meta.status !== 200){
                        return this.$message.error('修改失败');
                    }
                    this.$message.success('修改参数成功');
                    this.getParamsData();
                    this.editDialogVisible = false;
                })
            },
            async showEditDialog(attr_id){
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{ params:{attr_sel: this.activeName}});
                if(res.meta.status !== 200){
                    return this.$message.error('获取参数信息失败！')
                }
                this.editForm = res.data;
                this.editDialogVisible = true;
            },
            editDialogClosed(){
                this.$refs.editFormRef.resetFields();
                this.editDialogVisible = false;
            },
            //文本框失去焦点或者恩下按钮都会触发
            handleInputConfirm(row){
                console.log(row.inputValue);
                if(row.inputValue.trim().length === 0){
                    row.inutVlaue = "";
                    row.inputVisible = false;
                    return
                }
                row.attr_vals.push(row.inputValue);
                row.inputValue = '';
                row.inputVisible = false;
                this.saveAttrVals(row);
            },
            async saveAttrVals(row){
              const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                  attr_name: row.attr_name,
                  attr_sel: row.attr_sel,
                  attr_vals: row.attr_vals,
              });
              if(res.meta.status !== 200){
                  return this.$message.error('edit failed');
              }
              this.$message.success('edit success');
            },
            //click button, show input

            handleClose(i, row) {
                row.attr_vals.splice(i, 1);
                this.saveAttrVals(row);
                // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },


        },


    }
</script>

<style lang="less" scoped>
    .input-new-tag{
        width: 120px;
    }

</style>