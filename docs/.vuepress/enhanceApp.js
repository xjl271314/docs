import ElementUI from "element-ui";
import ViLike from 'vilike';
// import Bmob from "hydrogen-js-sdk";
import "./public/styles/element-variables.scss";
import "./public/styles/overide.scss";

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  Vue.use(ElementUI);
  Vue.use(ViLike);
  // Vue.prototype.Bmob = Bmob;
};

// 请自行修改相关配置信息
ViLike.configure({
  secretKey: 'cfba00864a7da46d',
  safeKey: '331023',
  table: 'statistic',
  key: 'skey',
  visit: 'visit',
  like: 'like'
});

// 初始化
ViLike.init();

