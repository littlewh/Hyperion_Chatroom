import Vue from 'vue';
import 'ant-design-vue/dist/antd.less';
import {
  message,//全局提示
  Button,//按钮
  Input,//输入框
  Modal,//对话框
  Form,//表单
  Checkbox,//复选框
  Icon,//图标
  Tabs,//标签页
  Popover,//气泡卡片
  Dropdown,//下拉菜单
  Menu,//菜单
  Avatar,//头像
  Card,//卡片
  Select,//选择器
  Upload,//上传
  Tooltip,//文字提示
  Drawer,//抽屉
  Popconfirm,//气泡确认框
  Badge,//徽标数，显示信息条数
  Tree,//树形控件
  Collapse,//折叠面板
  Transfer,//穿梭框
  ConfigProvider,//全局化配置
  Alert,//警告提示
} from 'ant-design-vue';

Vue.use(Avatar);
Vue.use(Button);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Form);
Vue.use(Checkbox);
Vue.use(Icon);
Vue.use(Tabs);
Vue.use(Popover);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Card);
Vue.use(Select);
Vue.use(Upload);
Vue.use(Tooltip);
Vue.use(Drawer);
Vue.use(Popconfirm);
Vue.use(Badge);
Vue.use(Tree);
Vue.use(Collapse);
Vue.use(Transfer);
Vue.use(ConfigProvider);
Vue.use(Alert);
Vue.prototype.$message = message;
