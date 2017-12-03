const uploadPhotoCtrl = ($scope, $state, $stateParams, $http, wechatService, $rootScope) => {
  document.title = '上传天气照片';
  wechatService.config();

  $scope.weathers = [
    { icon: 'iconfont icon-1', name: '晴' },
    { icon: 'weathericon icon-yin', name: '阴' },
    { icon: 'weathericon icon-duoyunqing', name: '多云' },
    { icon: 'weathericon icon-wu', name: '雾' },
    { icon: 'iconfont icon-6', name: '霾' },
    { icon: 'iconfont icon-2', name: '小雨' },
    { icon: 'weathericon icon-zhongyu', name: '中雨' },
    { icon: 'iconfont icon-3', name: '大雨' },
    { icon: 'weathericon icon-baoyu', name: '暴雨' },
    { icon: 'weathericon icon-leizhenyubaitian', name: '雷阵雨' },
    { icon: 'weathericon icon-dongyu', name: '冻雨' },
    { icon: 'weathericon icon-xiaoxue', name: '小雪' },
    { icon: 'weathericon icon-zhongxue', name: '中雪' },
    { icon: 'weathericon icon-daxue', name: '大雪' },
    { icon: 'weathericon icon-baoxue', name: '暴雪' },
  ];
  $scope.currentWeather = $scope.weathers[0];
  $scope.changeWeather = (weather) => {
    $scope.currentWeather = weather;
  };

  const localIds = $stateParams.localIds;
  $scope.photoID = localIds;
  let serverId;
  $scope.show = false;
  $scope.status = 0;
  $scope.showModal = () => {
    $scope.show = true;
  };
  $scope.backToMain = () => {
    $state.go('photograph');
  };
  $scope.cancel = () => {
    $scope.status = 0;
    $scope.show = false;
  };
  $scope.a = [0, 0];
  angular.isUndefinedOrNull = (val) => (angular.isUndefined(val) || val === null);
  $scope.$watch('contents', () => {
    if (angular.isUndefinedOrNull($scope.contents)) {
      $scope.a[0] = 0;
    } else {
      $scope.a[0] = 1;
    }
  });
  $scope.$watch('address', () => {
    if (angular.isUndefinedOrNull($scope.address)) {
      $scope.a[1] = 0;
    } else {
      $scope.a[1] = 1;
    }
  });

  $scope.$watch('a', () => {
    $scope.canSubmit = $scope.a[0] * $scope.a[1];
  }, true);
  wx.ready(() => {
    wx.getLocation({
      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      fail: function (res){
        $scope.location = '上海市气象局';
      },
      complete: function (res) {
      },
      success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。

        //经纬度转为地址
        var geocoder = new qq.maps.Geocoder({
          complete:function(result){
            var addressComponents = result.detail.addressComponents;
            $scope.address = addressComponents.city + addressComponents.district + addressComponents.streetNumber;
            $scope.$digest();
          }
        });
        var coord = new qq.maps.LatLng(latitude, longitude);
        geocoder.getAddress(coord);

        // 根据经纬度处理分享
        wx.onMenuShareTimeline({
          title: '我正在上传天气照片', // 分享标题
          link: 'http://wechat.daguchuangyi.com/#/photograph', // 临时url
          imgUrl: 'http://wechat.daguchuangyi.com/img/i_report.png', // 分享图标
          success: function () {
          },
          cancel: function () {
          }
        });

        wx.onMenuShareAppMessage({
          title: '我正在上传天气照片', // 分享标题
          desc: '赢积分换气象定制礼物', // 分享描述
          link: 'http://wechat.daguchuangyi.com/#/photograph', // 临时url
          imgUrl: 'http://wechat.daguchuangyi.com/img/i_report.png', // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
          },
          cancel: function () {
          }
        });
      },
    });


  });
  $scope.uploadPhotoNow = () => {
    $scope.status = 1;
    $scope.show = true;
    wx.ready(() => {
      wx.uploadImage({
        localId: localIds,
        isShowProgressTips: 1,
        success: (uploadRes) => {
          serverId = uploadRes.serverId;
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            fail: (res) => {
              $scope.status = 3;
            },
            complete: (res) => {
              console.log(res);
            },
            success: (res) => {
              const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              const speed = res.speed; // 速度，以米/每秒计
              const accuracy = res.accuracy; // 位置精度
              const data = {
                media_id: serverId,
                lat: latitude,
                lng: longitude,
                content: $scope.contents,
                address: $scope.address,
              };
              $http.post('http://wechatapi.daguchuangyi.com/photo/upload', data).then((success) => {
                $scope.status = 2;
              }, (error) => {
                $scope.status = 3;
              });
            },
          });
        },
        fail: (res) => {
          $scope.status = 3;
        },
      });
    });
  };
};

export default uploadPhotoCtrl;
