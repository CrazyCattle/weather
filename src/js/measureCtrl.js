
const measureCtrl = ($scope, $state, wechatService) => {
  wechatService.config();
  document.title = '测天气';
};

export default measureCtrl;
