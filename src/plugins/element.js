import Vue from 'vue'
import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, BreadcrumbItem, Breadcrumb, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option, Cascader, Alert, TabPane, Tabs, Steps, Step, Checkbox, CheckboxGroup, Upload } from 'element-ui'

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
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(TabPane);
Vue.use(Tabs);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Upload);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
