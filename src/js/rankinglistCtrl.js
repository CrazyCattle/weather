
const rankinglistCtrl = ($scope, $http, $state, wechatService) => {
  wechatService.config();
  $scope.user_infor = {
    user_rank: 2,
  };
  wx.ready(() => {
    wechatService.share('气象志愿者琅琊榜', `我的排名是${$scope.user_infor.user_rank}`, 'http:/wechat.daguchuangyi.com/img/ranklist.png', window.location.href);
  });
  $scope.goto = () => {
    $state.go('store');
  };
  $http.get('http://139.196.210.102:8083/v1/get/rank', {
    'headers': {
      'Authorization': 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEzMTIyMTUyNjI1IiwibmFtZSI6Ilx1NTQ2OFx1NTNlZlx1NTEzZiJ9.1F3uY2HwAirpkO2FgfPxMXsokEAvFFoP4NP1efY00Gw',
    },
  }).success((data) => {
    $scope.ranks = data.data.ten_rank;
    $scope.user_infor = data.data.user_infor;
  });
};

export default rankinglistCtrl;
