<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
<!--            搜索与添加区域-->

            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" @clear="getUserList" clearable v-model="queryInfo.query" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

<!--            用户列表去-->

            <el-table
                    :data="userlist"
                    style="width: 100%" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="mobile"
                        label="电话">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色">
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template slot-scope="scope">
                        <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="点击编辑" placement="top">
                        <el-button type="primary" icon="el-icon-edit" @click=showEditDialog(scope.row.id) circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="点击删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" @click=removeUserById(scope.row.id)  circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="点击修改" placement="top">
                            <el-button type="warning" @click="setRole(scope.row)" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 3, 4]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
<!--添加用户的对话框-->
            <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="dialogClosed">
<!--                内容主题区域-->
                <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>


                </el-form>
<!--                对话框的地步按钮区域-->
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
                 </span>
            </el-dialog>

            <!-- 修改用户的对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
            </el-dialog>
<!--            分配角色对话框-->
            <el-dialog
                    title="提示"
                    :visible.sync="setRoleDialogVisible"
                    width="30%">
                <div>
                    <p>当前的用户:{{userInfo.username}}</p>
                    <p>当前的角色:{{userInfo.role_name}}</p>
                    <p>
                        分配新角色
                        <template>
                            <el-select v-model="selectedRoleId" placeholder="请选择">
                                <el-option
                                        v-for="item in roleList"
                                        :key="item.id"
                                        :label="item.roleName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </p>

                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogClosed">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>


    </div>
</template>

<script>
    export default {
        name: "Users",
        data(){
            // 验证邮箱的规则
            var checkEmail = (rule, value, cb) => {
                // 验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return cb()
                }

                cb(new Error('请输入合法的邮箱'))
            };
            // 验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                // 验证手机号的正则表达式
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

                if (regMobile.test(value)) {
                    return cb()
                }

                cb(new Error('请输入合法的手机号'))
            };
            return {
                //获取用户列表的参数对象
                queryInfo:{
                    query:'',
                    //当前的页数
                    pagenum: 1,
                    //当前每页显示多少条数据
                    pagesize: 2
                },
                userlist:[],
                total: 0,
                setRoleDialogVisible: false,
                dialogVisible: false,
                userInfo: '',
                roleList:'',
                selectedRoleId:'',
                //添加用户的表单数据
                addForm: {
                    username: '',
                    email: '',
                    mobile: '',
                    password: ''
                },
                addFormRules:{
                    username:[
                        {required: true, message: "请输入用户名", trigger: "blur"},
                        {min: 3, max: 10, message: "用户名在3-10个字符之间", trigger: "blur"}
                    ],
                    password:[
                        {required: true, message: "请输入密码", trigger: "blur"},
                        {min: 6, max: 15, message: "密码在6-15个字符之间", trigger: "blur"}
                    ],
                    email:[
                        {required: true, message: "请输入邮箱", trigger: "blur"},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile:[
                        {required: true, message: "请输入电话", trigger: "blur"},
                        {validator: checkMobile, trigger: 'blur'}

                    ]
                    },
                // 控制修改用户对话框的显示与隐藏
                editDialogVisible: false,
                // 查询到的用户信息对象
                editForm: {},
                // 修改表单的验证规则对象
                editFormRules: {
                    email: [
                        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入用户手机', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },

            }
        },
        created(){
            this.getUserList();
        },
        methods:{
           async getUserList(){
             const {data: res} =  await this.$http.get('users',{params: this.queryInfo});
             if(res.meta.status !== 200){
                return this.$message.error('获取用户列表错误');
             }
             this.userlist = res.data.users;
             this.total = res.data.total;
           },
            //监听pagesize改变的事件
            handleSizeChange(newSize){
               this.queryInfo.pagesize = newSize;
               this.getUserList();
            },
            //监听页码值的改变
            handleCurrentChange(page){
                this.queryInfo.pagenum = page;
                this.getUserList();
            },
            async userStateChange(userInfo){
                const {data: res} =  await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
                if(res.meta.status !== 200){
                    userInfo.mg_state = !userInfo.mg_state;
                    return this.$message.error('更新用户状态失败');
                }
                this.$message.success('更新用户状态成功！');

            },
            dialogClosed(){
                this.$refs.addFormRef.resetFields();
            },
            addUser(){
               this.$refs.addFormRef.validate( async valid => {
                   if(!valid) return;
                   const {data:res} = await this.$http.post('users', this.addForm);
                   if(res.meta.status !== 201){
                       this.$message.error('添加用户失败');
                   }

                   this.$message.success('添加成功');
                   this.dialogVisible = false;
                   //重新获取列表数据
                   this.getUserList();

               } );
            },
            // 展示编辑用户的对话框
            async showEditDialog(id) {
                const { data: res } = await this.$http.get('users/' + id);

                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败！')
                }

                this.editForm = res.data;
                this.editDialogVisible = true;
            },
            // 监听修改用户对话框的关闭事件
            editDialogClosed() {
                this.$refs.editFormRef.resetFields();
            },
            // 修改用户信息并提交
            editUserInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;
                    // 发起修改用户信息的数据请求
                    const { data: res } = await this.$http.put(
                        'users/' + this.editForm.id,
                        {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        }
                    );

                    if (res.meta.status !== 200) {
                        return this.$message.error('更新用户信息失败！')
                    }

                    // 关闭对话框
                    this.editDialogVisible = false;
                    // 刷新数据列表
                    this.getUserList();
                    // 提示修改成功
                    this.$message.success('更新用户信息成功！')
                })
            },
            // 根据Id删除对应的用户信息
            async removeUserById(id) {
                // 弹框询问用户是否删除数据
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该用户, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err);

                // 如果用户确认删除，则返回值为字符串 confirm
                // 如果用户取消了删除，则返回值为字符串 cancel
                // console.log(confirmResult)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }

                const { data: res } = await this.$http.delete('users/' + id);

                if (res.meta.status !== 200) {
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！');
                this.getUserList()
            },
           async setRole(userInfo){
               this.userInfo = userInfo;
               //在展示对话框之前获取角色的列表
                const {data:res} = await this.$http.get('roles');
                if(res.meta.status !== 200){
                    return this.$message.error('获取角色列表错误');
                }
                this.roleList = res.data;
               this.setRoleDialogVisible = true;
           },
           async saveRoleInfo(){
                   if(!this.selectedRoleId){
                       return this.$message.error('请选择一个角色');
                   }
                  const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
                      rid: this.selectedRoleId
                  });
                   if(res.meta.status !== 200){
                       return this.$message.error('保存失败');
                   }
                   this.$message.success('分配成功');
                   this.setRoleDialogVisible = false;
                   this.setRoleDialogClosed();
                    this.getUserList()

           },
            setRoleDialogClosed(){
              this.selectedRoleId = '';
              this.roleList = '';
              this.setRoleDialogVisible = false;
            }

        }
    }
</script>

<style lang="less" scoped>

</style>