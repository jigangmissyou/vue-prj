<template>
    <div>
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8" gutter="20">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" >
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>

            </el-row>
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)" size="mini"></el-button>
                    </template>
                </el-table-column>

            </el-table>

            <template>

                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryInfo.pagenum"
                            :page-sizes="[5, 10, 20, 30]"
                            :page-size="queryInfo.pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total" background>
                    </el-pagination>
                </div>
            </template>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "List",
        data(){
            return {
                queryInfo:{
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                goodslist: [],
                total: 0
            }
        },
        created() {
            this.getGoodsList();

        },
        methods:{
            async getGoodsList(){
              const {data:res} = await  this.$http.get('goods',{ params: this.queryInfo});
                if(res.meta.status !== 200){
                    return this.$message.error('获取商品列表失败')
                }
                this.$message.success('获取商品列表成功');
                this.goodslist = res.data.goods;
                this.total = res.data.total;
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize;
                this.getGoodsList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage;
                this.getGoodsList();
            },
            async removeById(id){
               const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
               if(confirmResult !== 'confirm'){
                   return this.$message.info('已经取消删除');
               }
               const {data:res} = await this.$http.delete(`goods/${id}`)
                if(res.meta.status !== 200){
                    return this.$message.error('删除失败');
                }
               this.$message.success('删除成功')
                this.getGoodsList()

            },
            goAddPage(){
                this.$router.push('/goods/add')
            }

        }
    }
</script>

<style scoped>

</style>