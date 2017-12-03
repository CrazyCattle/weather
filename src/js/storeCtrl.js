const storeCtrl = ($scope, $state, storeService, $http, wechatService) => {
  wechatService.config();

  wx.ready(() => {
    wx.onMenuShareTimeline({
      title: '我在气象商城兑换礼品', // 分享标题
      desc: '成为气象志愿者赢积分，换好礼！', // 分享描述
      link: window.location.href, // 分享链接
      imgUrl: 'http://wechat.daguchuangyi.com/img/store.png', // 分享图标
      success: () => {

      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      },
    });
    wx.onMenuShareAppMessage({
      title: '我在气象商城兑换礼品', // 分享标题
      desc: '成为气象志愿者赢积分，换好礼！', // 分享描述
      link: window.location.href, // 分享链接
      imgUrl: 'http://wechat.daguchuangyi.com/img/store.png', // 分享图标
      success: () => {

      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      },
    });
  });
  storeService.getGoodsList().then((data) => {
    $scope.goods = data.wares;
    angular.forEach($scope.goods, (w) => {
      w.photoUrl = `http://wechatapi.daguchuangyi.com${w.image}`;
      w.selected = false;
      w.show = false;
    });
  });
  let canAdd = true;
  $scope.addGoods = (good) => {
    if (canAdd) {
      canAdd = false;
      const left = $(window).width() / 2 + 5;
      const top = $(window).height() - 45;
      const jqElement = $(`#good-pic-${good.id}`);
      jqElement.css({
        position: 'fixed',
        top: jqElement.offset().top,
        left: jqElement.offset().left,
        'z-index': 11,
      });
      jqElement.animate({
        left,
        top,
        width: 0,
        height: 0,
        // z-index: 11,
      }, 1000, () => {
        jqElement.css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: 130,
          height: 130,
          // z-index: 11,
        });
        good.show = false;
        canAdd = true;
      });
      good.show = true;
      storeService.setShoppingList(good.id);
      good.selected = true;
    }
  };
  $scope.checkOut = () => {
    $state.go('consume');
  };
};

export default storeCtrl;
