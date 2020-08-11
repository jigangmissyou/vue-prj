<template>
   <el-container class="home-container">
       <el-header>
           <div><span>电商后台管理系统</span></div>
           <el-button type="info" @click="logout">退出</el-button></el-header></el-header>
       <el-container>
           <el-aside width="200px">Aside
<!--测边栏布局-->
               <el-menu
                       class="el-menu-vertical-demo"
                       background-color="#545c64"
                       text-color="#fff"
                       active-text-color="#ffd04b" router :default-active="activePath">
<!--                   一级菜单-->
                   <el-submenu :index="item.id + '' "  v-for="item in menuList" :key="item.id">
<!--                       一级菜单模板-->
                       <template slot="title">
                           <i class="el-icon-location"></i>
                           <span>{{item.authName}}</span>
                       </template>
<!--                       二级菜单-->
                       <el-menu-item :index=" '/' + subItem.path" v-for="subItem in item.children " :key="subItem.id" @click="saveNavState('/'+ subItem.path)">
                           <template slot="title">
                               <i class="el-icon-location"></i>
                            <span slot="title">{{subItem.authName}}</span>
                           </template>
                       </el-menu-item>
                   </el-submenu>
                   <el-menu-item index="2">
                       <i class="el-icon-menu"></i>
                       <span slot="title">导航二</span>
                   </el-menu-item>

               </el-menu>
           </el-aside>
           <el-main><router-view></router-view></el-main>
       </el-container>
   </el-container>
</template>

<script>
    export default {
        name: "Home",
        data(){
          return {
              menuList: [],
              activePath:''
          }
        },
        created(){
          this.getMenuList();
          this.activePath = window.sessionStorage.getItem('activePath');
        },
        methods: {
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            async getMenuList(){
              const {data: res} = await this.$http.get('menus');
              // console.log(data);
              if(res.meta.status != 200) return this.$message.error(res.meta.msg);
              this.menuList = res.data;

              console.log(res);
            },
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath', activePath);
                this.activePath = activePath;
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container{
        height: 100%;
    }

    .el-header{
        background-color: #373d41;
        display: block;
        padding-left: 0;
        color: white;
        font-size: 20px;
        > div{
            display: flex;
        }
    }
    .el-aside{
        background-color: #333744;
    }
    .el-main{
        background-color: #eaedf1;
    }
</style>