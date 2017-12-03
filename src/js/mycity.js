import map from './lib/mycity.js';

const mycityController = ($scope, $http, $rootScope, weatherService, wechatService) => {
  wx.ready(() => {
    wechatService.share('气象众包！人人都是播报员', '来自气象爱好者测量的天气地图', 'http:/wechat.daguchuangyi.com/img/i_test.png', 'http://wechat.daguchuangyi.com/#/measure/mycity');
  });
  $scope.data = [];
  $rootScope.clickNum = 2;
  $scope.arr1 = [];
  $scope.arr2 = [];

  $http.get('http://139.196.210.102:8083/v1/weather/station/static')
  .success((data1) => {
    $scope.arr1 = data1.data;
    $http.post('http://139.196.210.102:8083/v1/weather/station/user?start=2015-01-01 00:00:00&end=2016-07-12 00:00:00')
    .success((data2) => {
      $scope.arr2 = data2.data;
      map('mycity', $scope.arr1, $scope.arr2);
    });
  });
};

export default mycityController;
