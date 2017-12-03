
const MyfriendlistController = ($scope, $http, $rootScope, $state, wechatService, userService) => {
  wx.ready(() => {
    wechatService.share('气象众包！人人都是播报员', '来自气象爱好者测量的天气地图', 'http:/wechat.daguchuangyi.com/img/i_test.png', 'http://wechat.daguchuangyi.com/#/measure/mycity');
  });
  $rootScope.clickNum = 3;
  userService.validateUrl($state);
  userService.validateUrl().then((data) => {
    userService.getfriendlist().success((d) => {
      if (d.data.friends) {
        $scope.friends = d.data.friends;
      } else {
        $('.nofriend-mask').show();
      }
    });
  });

  $scope.jump = (friendData) => {
    $rootScope.friendData = friendData;
    $state.go('myfriendevc');
  };
};

export default MyfriendlistController;
