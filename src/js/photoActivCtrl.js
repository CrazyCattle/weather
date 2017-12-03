const photoActivityCtrl = ($scope, $http, wechatService, $state) => {
  wechatService.config();
  wx.ready(() => {
    wechatService.share('气象直播征集中', '上传拍摄的上海天气照片，小编帮你上首页！赢积分，换好礼！', 'http:/wechat.daguchuangyi.com/img/photo_share.png', window.location.href);
  });
  $scope.jump = () => {
    $state.go('photograph');
  };
};
export default photoActivityCtrl;
