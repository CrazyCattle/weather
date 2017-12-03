
const activityCtrl = ($scope, $rootScope, wechatService) => {
  $rootScope.clickNum = 4;
  wx.ready(() => {
    wechatService.share('这里的天气发布我承包了！', '移动气象站，人人测天气', 'http:/wechat.daguchuangyi.com/img/i_test.png', window.location.href);
  });
};
export default activityCtrl;
