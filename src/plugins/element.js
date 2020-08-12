import Vue from 'vue'
import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, BreadcrumbItem, Breadcrumb, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree } from 'element-ui'

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(BreadcrumbItem);
Vue.use(Breadcrumb);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
