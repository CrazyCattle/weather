const reportActivityCtrl = ($scope, $http, wechatService, $state) => {
  wechatService.config();
  wx.ready(() => {
    wechatService.share('上海天气好声音！', '我在气象台等你，报名体验气象播报员，赢积分换气象定制礼物！', 'http:/wechat.daguchuangyi.com/img/i_report.png', window.location.href);
  });
  $scope.jump = () => {
    $state.go('signup');
  };
};
export default reportActivityCtrl;
