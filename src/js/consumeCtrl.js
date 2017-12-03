const consumeCtrl = ($scope, $http, storeService, $state) => {
  $scope.cost = 0;
  $scope.status = 0;
  $scope.points = 5500;

  const shoppingList = storeService.getShoppingList();
  $scope.goods = [];
  storeService.getGoodsList().then((data) => {
    angular.forEach(data.wares, (w) => {
      if (shoppingList.has(w.id)) {
        w.cost = parseInt(w.score, 10);
        w.num = shoppingList.get(w.id);
        w.photoUrl = `http://wechatapi.oneband.life${w.image}`;
        $scope.goods.push(w);
      }
    });
  });
  $scope.info = { '姓名': undefined };
  $scope.canSubmit = false;
  $scope.canDelete = false;
  $scope.canDelete2 = false;
  $scope.canDelete3 = false;
  $scope.canAdd = true;
  $scope.canSubtract = true;
  $scope.add = (index) => {
    const g = $scope.goods[index];
    if (($scope.cost + g.cost) <= $scope.points) {
      g.num++;
      $scope.cost += g.cost;
    } else {
      $scope.canAdd = false;
    }
  };
  $scope.subtract = (index) => {
    const g = $scope.goods[index];
    if (g.num - 1 === 0) {
      $scope.canSubtract = false;
      $scope.goods.splice(index, 1);
    } else {
      g.num--;
      $scope.cost -= g.cost;
    }
  };
  $scope.$on('inputChange', (evt, data) => {
    $scope.info[data.key] = data.value;
  });
  $scope.delete2 = () => {
    $scope.goods = [];
    $scope.cost = 0;
    storeService.resetShoppingList();
    $state.go('store');
  };
  $scope.delete = () => {
    $scope.info = { '姓名': undefined };
    $scope.$broadcast('empty', {});
  };
  $scope.$watch('info', () => {
    let flag = true;
    let flag2 = false;
    angular.forEach($scope.info, (value, key) => {
      if (value) {
        flag2 = true;
      }
      if (key !== '留言（选填）') {
        if (!value) {
          flag = false;
        } else {
          $scope.canDelete3 = true;
        }
      }
    });
    if (flag) {
      $scope.canDelete = true;
    } else {
      $scope.canDelete = false;
    }
    if (!flag2) {
      $scope.canDelete3 = false;
    }
    $scope.canSubmit = $scope.canDelete2 && $scope.canDelete;
  }, true);
  $scope.$watch('goods', () => {
    if ($scope.goods.length) {
      $scope.canDelete2 = true;
    } else {
      $scope.canDelete2 = false;
    }
    $scope.cost = 0;
    angular.forEach($scope.goods, (d) => {
      $scope.cost += d.cost * d.num;
    });
    $scope.canSubmit = $scope.canDelete2 && $scope.canDelete;
  }, true);
  $scope.consume = () => {
    const consumeData = {
      wares: angular.toJson([{ 'id': '1', 'number': '2' }]),
      user_name: $scope.info['姓名'],
      user_address: $scope.info['地址'],
      user_phone: $scope.info['手机号码'],
      user_message: $scope.info['留言（选填）'],
    };
    $scope.canSubmit = false;
    $http.post('http://wechatapi.oneband.life/shop/order/create', consumeData).then((success) => {
      alert('下单成功');
      $scope.status = 1;
      $scope.canSubmit = true;
      $state.go('store');
    }, (error) => {
      alert('下单失败');
      $scope.status = 2;
      $scope.canSubmit = true;
    });
  };
};


export default consumeCtrl;
