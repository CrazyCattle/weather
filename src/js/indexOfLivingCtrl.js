
const indexOfLivingCtrl = ($scope, $http, $rootScope, $state) => {
  $scope.characterId = [];
  $scope.list = [];
  $scope.transData = [];
  let count = 0;
  $http.get('http://139.196.210.102:8083/v1/weather/indexOfLiving')
  .success((data) => {
    $scope.list = data.data.list;
    $scope.listicon = {
      '日照指数': '1',
      '体感指数': 'iconbody',
      '穿衣指数': 'iconcloth',
      '中暑指数': 'iconhot',
      '饮水指数': 'iconyinshui',
      '干燥指数': 'icondry',
      '感冒指数': 'iconganmao',
      '晨练指数': 'iconchenlian',
      '洗晒指数': 'iconwash',
      '钓鱼指数': 'iconfish',
      '火险指数': 'iconhuoxian',
      '润肤指数': 'iconface',
      '空调开启指数': 'iconcold',
      '学生户外活动指数': 'iconchildren',
      '户外晚间锻炼指数': 'iconnight',
      '洗车指数': 'iconwashing',
      '霉变指数': 'meibian',
      '花粉浓度指数': 'page11',
      '紫外线': 'iconuv',
    };
    for (let i = 0; i < $scope.list.length; i++) {
      $scope.list[i].number = $scope.list[i].level.substr(0, 1);
      $scope.list[i].icon = $scope.listicon[$scope.list[i].name_prefix];
      $scope.list[i].selected = false;
    }
    for (let i = 0; i < $scope.list.length; i++) {
      for (let j = 0; j < $rootScope.statusData.length; j++) {
        if ($scope.list[i].index_id === $rootScope.statusData[j]) {
          $scope.list[i].selected = true;
        }
      }
    }
  });
  count = $rootScope.statusData.length;
  // 添加数组remove方法
  Array.prototype.remove = function (val) {
    const index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

  // 获取选择指数的,放入数组$scope.characterId
  $scope.addbg = (id) => {
    if (count < 5) {
      if (event.target.className === '') {
        event.target.className = 'iconfont1 icon1-selected bn';
        $rootScope.statusData.push(Number(id));
        count++;
      } else {
        event.target.className = '';
        $rootScope.statusData.remove(Number(id));
        if (count >= 1) {
          count--;
        }
      }
    } else if (count === 5 && event.target.className === 'iconfont1 icon1-selected bn') {
      event.target.className = '';
      $rootScope.statusData.remove(Number(id));
      $rootScope.statusData.sort();
      count--;
    } else if (count === 5 && event.target.className === '') {
      $('.upper-limit>h1').html('可择指数已达上限');
      $('.mask-bg').fadeIn(150);
      $('.upper-limit').fadeIn(150);
    }
  };

  // 隐藏提示框
  $scope.hideMask = () => {
    $('.mask-bg').fadeOut(150);
    $('.upper-limit').fadeOut(150);
  };

  // 选择的指数数量提示
  let tempNum = 0;
  $scope.showCharacter = () => {
    $rootScope.characterIndex = [];
    if (count <= 5 && count > 0) {
      // 修复选择时的顺序乱，导致显示顺序颠倒
      for (let i = 0; i < $rootScope.statusData.length; i++) {
        for (let j = 0; j < $rootScope.statusData.length - 1; j++) {
          if ($rootScope.statusData[j] > $rootScope.statusData[j + 1]) {
            tempNum = $rootScope.statusData[j] + $rootScope.statusData[j + 1];
            $rootScope.statusData[j + 1] = tempNum - $rootScope.statusData[j + 1];
            $rootScope.statusData[j] = tempNum - $rootScope.statusData[j + 1];
          }
        }
      }
      for (let i = 0; i < $scope.list.length; i++) {
        for (let j = 0; j < $rootScope.statusData.length; j++) {
          if ($scope.list[i].index_id === $rootScope.statusData[j]) {
            $rootScope.characterIndex.push($scope.list[i]);
            $scope.list.remove($scope.list[i]);
            if (i > 0) {
              i--;
            }
          }
        }
      }
      $rootScope.lifeLimit = $rootScope.statusData.length;
      $rootScope.listNum = $rootScope.statusData.length;
      for (let i = 0; i < $scope.list.length; i++) {
        $rootScope.characterIndex.push($scope.list[i]);
      }
      let setting = '[';
      $rootScope.statusData.forEach((data, index) => {
        setting = `${setting}${data}`;
        if (index === $rootScope.statusData.length - 1) {
          setting = `${setting}]`;
        } else {
          setting = `${setting},`;
        }
      });
      $http.get(`http://wechatapi.daguchuangyi.com/setting/living?setting=${setting}`)
      .success((data) => {
        // console.log(data);
        $state.go('weather');
      });
    } else if (count > 5) {
      $('.upper-limit>h1').html('你选择的指数少于5个！');
      $('.mask-bg').fadeIn(150);
      $('.upper-limit').fadeIn(150);
    } else if (count === 0) {
      $rootScope.lifeLimit = 5;
      $rootScope.listNum = 5;
      $rootScope.characterIndex = $scope.list;
      $http.get('http://wechatapi.daguchuangyi.com/setting/living?setting=[1,2,3,4,5]')
      .success((data) => {
        // console.log(data);
        $state.go('weather');
      });
    }
  };
};
export default indexOfLivingCtrl;
