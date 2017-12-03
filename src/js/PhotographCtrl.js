const PhotographCtrl = ($scope, $state, $http, wechatService, $rootScope) => {
  document.title = '拍天气';
  wechatService.config();
  let shareUrl = window.location.href;
  let shareTitle = '随手拍天气';
  let shareDesc = '上海天气相册更新啦';
  const shareImg = 'http://wechat.daguchuangyi.com/img/photo_share.png';
  wx.ready(() => {
    wechatService.share(shareTitle, shareDesc, shareImg, shareUrl);
  });
  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    $rootScope.fromName = to.name;
  });
  if (($rootScope.fromName === 'searchcity') && (window.localStorage.value)) {
    const lat = window.localStorage.value.split(',')[1];
    const lng = window.localStorage.value.split(',')[0];
    console.log(lat,lng);
    getPhotos(lat, lng);
  } else {
    wx.ready(() => {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res) => {
          const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          getPhotos(latitude, longitude);
          if (indexNow !== -1) {
            $scope.show = true;
            $http.get('http://wechatapi.daguchuangyi.com/photo/detail/' + idPhoto)
             .success((data) => {
              $scope.detail = data.photo;
              $scope.detail.url = 'http://wechatapi.daguchuangyi.com' + $scope.detail.url;
              $scope.detail.likeclass = ($scope.detail.is_recommend - 1) ? 'like' : 'liked';
              // console.log($scope.detail);
              body.bind('touchmove', function(e) {
                e.preventDefault();
              })
            });
          }
        },
      });
    });
    // $http.get('http://wechatapi.daguchuangyi.com/photo/nearby?lat=31.2&lng=121.4').success((data) => {
    //   $scope.photoes_near = data.photos;
    //   for (var i = 0; i < $scope.photoes_near.length; i++) {
    //     $scope.photoes_near[i].name = '小福福';
    //     $scope.photoes_near[i].like = 0;
    //     $scope.photoes_near[i].url = 'http://wechatapi.daguchuangyi.com'+$scope.photoes_near[i].url;
    //   }
    //   $scope.photoes = $scope.photoes_near;
    //   if (!$scope.photoes) {
    //     $scope.noPhotoes = true;
    //   }
    // });
  }

  function getPhotos(lat, lng) {
    $http.get('http://wechatapi.daguchuangyi.com/photo/list?lat=' + lat + '&lng=' + lng + '&sort=1')
     .success((data) => {
      $scope.photoes_near = data.photos;
      for (var i = 0; i < $scope.photoes_near.length; i++) {
        $scope.photoes_near[i].url = 'http://wechatapi.daguchuangyi.com' + $scope.photoes_near[i].url;
      }
      $scope.photoes = $scope.photoes_near;
      $scope.noPhotoes = $scope.photoes.length ? false : true;
    });
    $http.get('http://wechatapi.daguchuangyi.com/photo/list?lat=' + lat + '&lng=' + lng + '&sort=3')
      .success((data) => {
        $scope.photoes_hot = data.photos;
        for (var i = 0; i < $scope.photoes_hot.length; i++) {
          $scope.photoes_hot[i].url = 'http://wechatapi.daguchuangyi.com' + $scope.photoes_hot[i].url;
        }
        // console.log($scope.photoes_hot);
      });
      $http.get('http://wechatapi.daguchuangyi.com/photo/list?lat=' + lat + '&lng=' + lng + '&sort=2')
        .success((data) => {
          $scope.photoes_Now = data.photos;
          for (var i = 0; i < $scope.photoes_Now.length; i++) {
            $scope.photoes_Now[i].url = 'http://wechatapi.daguchuangyi.com' + $scope.photoes_Now[i].url;
          }
          // console.log($scope.photoes_Now);
        });
    }

  $scope.show = false;
  const body = angular.element(document.getElementsByTagName('body'));
  $scope.isActive = 'near';
  $scope.noPhotoes = false;
  $scope.activate = (str) => {
    $scope.isActive = str;
    if ($scope.isActive == 'near') {
      $scope.photoes = $scope.photoes_near;
    }
    else if ($scope.isActive == 'hot') {
      $scope.photoes = $scope.photoes_hot;
    }
    else {
      $scope.photoes = $scope.photoes_Now;
    }
    if ($scope.photoes.length === 0) {
      $scope.noPhotoes = true;
    } else {
      $scope.noPhotoes = false;
    }
  };
  const urlNow = window.location.href;
  const indexNow = urlNow.indexOf('photograph/');
  const idPhoto = parseInt(location.href.split('photograph/')[1]);


  $scope.activePhoto = -1;
  $scope.showDetail = (index) => {
    $scope.show = true;
    $scope.activePhoto = index;
    $scope.detail = $scope.photoes[index];
    $scope.detail.time = moment($scope.detail.created_at).format('MM-DD HH:mm');
    $scope.detail.view_count ++;
    $scope.detail.likeclass = ($scope.detail.is_recommend - 1) ? 'like' : 'liked';
    shareUrl = window.location.href + '/' + $scope.detail.id;
    shareTitle = `${$scope.detail.name}拍摄的天气照片，美极了~`;
    shareDesc = '镜头里的上海天气，快来赞一下！';
    body.bind('touchmove', function(e) {
      e.preventDefault();
    })
    const data = {photo_id: $scope.detail.id};
    $http.post('http://wechatapi.daguchuangyi.com/photo/visit',data).then((success) => {
      // console.log('+1s');
    });
    wx.ready(() => {
      wechatService.share(shareTitle, shareDesc, shareImg, shareUrl);
    });
  };
  $scope.likeit = () => {
    const data = {photo_id: $scope.detail.id};
    $http.post('http://wechatapi.daguchuangyi.com/photo/recommend',data).then((success) => {
      // console.log('+1s');
    });
    if ($scope.detail.is_recommend == 2) {
      if ($scope.activePhoto !== -1) {
        $scope.photoes[$scope.activePhoto].is_recommend = 1;
        $scope.photoes[$scope.activePhoto].recommend_count ++;
      } else {
        $scope.detail.is_recommend = 1;
        $scope.detail.recommend_count ++;
      }
    } else if ($scope.detail.is_recommend == 1) {
      if ($scope.activePhoto !== -1) {
        $scope.photoes[$scope.activePhoto].is_recommend = 2;
        $scope.photoes[$scope.activePhoto].recommend_count --;
      } else {
        $scope.detail.is_recommend = 2;
        $scope.detail.recommend_count --;
      }
    }
    $scope.detail.likeclass = ($scope.detail.is_recommend - 1) ? 'like' : 'liked';
  };
  $scope.hide = () => {
    $scope.show = false;
    $scope.activePhoto = -1;
    body.unbind('touchmove');
    shareUrl = window.location.href;
    shareTitle = '随手拍天气';
    shareDesc = '上海天气相册更新啦';
    wx.ready(() => {
      wechatService.share(shareTitle, shareDesc, shareImg, shareUrl);
    });
  };
  $scope.searchLoc = () => {
    $state.go('searchcity');
  };
  $scope.jumpto = () => {
    $state.go('photoActivity');
  };
  $scope.takePhoto = () => {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        $state.go('uploadPhoto', {
          localIds,
        });
      },
    });
  };

};


export default PhotographCtrl;
