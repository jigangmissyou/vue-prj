<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
<!--            角色列表区域-->
            <el-table :data="roleList" border stripe>
<!--                展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '' ]" v-for="(item1, i1) in scope.row.children" :key="item1.id">
<!--                            渲染一级-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
<!--                            渲染二级和三级-->
                            <el-col :span="19">
<!--                                通过循环嵌套-->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop']" v-for="(item2, i2) in item1.children" :key="">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
<!--                                    三级权限-->
                                    <el-col :span="18">
                                        <el-tag type="danger" closable @close="removeRightById(scope.row, item3.id)" v-for="(item3, i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>

                                    </el-col>

                                </el-row>
                            </el-col>

                        </el-row>
                    </template>
                </el-table-column>

                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <el-tree :data="rightList" ref="treeRef" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
            <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "roles",
        data(){
            return {
                roleList:[],
                rightList: [],
                // 当前即将分配权限的角色id
                roleId: '',
                setRightDialogVisible: false,
                treeProps:{
                    'label': 'authName',
                    'children': 'children'
                },
                defKeys: []
            }
        },
        created() {
            this.getRolesList();
        },
        methods:{
           async getRolesList(){
               const {data:res} = await this.$http.get('roles');
               if(res.meta.status !== 200){
                   return this.$message.error('获取角色列表数据失败');
               }
               this.roleList = res.data;
            },
            async removeRightById(role, rightId){
                //弹框提示是否要删除
               const confirmResult = await this.$confirm(
                   '此操作将永久删除该用户, 是否继续?',
                   '提示',
                   {
                       confirmButtonText: '确定',
                       cancelButtonText: '取消',
                       type: 'warning'
                   }
               ).catch(err => err);

               if(confirmResult !== 'confirm'){
                   return this.$message.info('取消删除');
               }

        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        if(res.meta.status !== 200){
            return this.$message.error('删除权限失败');
        }
        //防止列表的刷新
        role.children = res.data;
        this.$message.success('删除成功');
        },
        async showRightDialog(role){
           this.roleId = role.id;
           //获取所有权限的数据
            const { data: res } = await this.$http.get('rights/tree');

            if (res.meta.status !== 200) {
                return this.$message.error('获取权限数据失败！')
            }
            this.rightList = res.data;
            this.getLeafKeys(role, this.defKeys);
            this.setRightDialogVisible = true;
        },
        getLeafKeys(node, arr){
           if(!node.children){
               return arr.push(node.id);
           }
           node.children.forEach(item => this.getLeafKeys(item, arr));
        },
        setRightDialogClosed(){
           this.defKeys = []
        },
        async allotRights(){
           const keys = [
                   ...this.$refs.treeRef.getCheckedKeys(),
                   ...this.$refs.treeRef.getHalfCheckedKeys(),

           ];
           const idStr = keys.join(',');
           const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{
               rids: idStr
           });
           if(res.meta.status !== 200){
               return this.$message.error('分配权限失败');
           }
           this.getRolesList();
            this.$message.success('分配权限成功');
           this.setRightDialogVisible = false;
        }


        }
    }
</script>

<style lang="less" scoped>
.el-tag{
    margin:7px;
}
    .bdtop{
        border-top: 1px solid #eeeeee;
    }
.bdbottom{
    border-bottom: 1px solid #eeeeee;
}
</style>