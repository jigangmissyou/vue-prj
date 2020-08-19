import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/rights'
import Roles from '../components/power/roles'
import Cate from '../components/goods/Cate'
import CateParams from '../components/goods/CateParams'
import GoodsList from '../components/goods/List'
import GoodsAdd from '../components/goods/Add'

Vue.use(VueRouter);

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children:[
            { path: '/welcome', component: Welcome},
            { path: '/users', component: Users},
            { path: '/rights', component: Rights},
            { path: '/roles', component: Roles},
            { path: '/categories', component: Cate},
            { path: '/params', component: CateParams},
            { path: '/goods', component: GoodsList},
            { path: '/goods/add', component: GoodsAdd}



        ]
    }
];

const router = new VueRouter({
    routes
});

//挂在路由导航首位

router.beforeEach((to, from, next)=>{
    // to 将要访问的路径
    //from 代表从那个路径跳转过来的
    //next 是一个函数，表示放行
    if(to.path === '/login') return next();

    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login');
    next();


});

export default router
