<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table
                    :data="rightList"
                    style="width: 100%" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column
                        prop="authName"
                        label="权限名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="path"
                        label="路径"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="level"
                        label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level=== '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>

                    </template>
                </el-table-column>


            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                //权限列表
                rightList: []
            }
        },
        created() {
            this.getRightsList();
        },
        methods:{
           async getRightsList(){
             const {data: res} = await this.$http.get('rights/list');
             if(res.meta.status !== 200){
                 return this.$message.error('获取列表出错');
             }
             this.rightList = res.data;
             console.log(this.rightList);
           }
        }
    }
</script>