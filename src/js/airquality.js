import drawChart from './lib/typhoonChart.js';

const AirqualityController = ($scope, weatherService, $http, wechatService) => {
  $('.aq_navlist>ul').css({
    'zoom': `${$(window).width() / 375}`,
  });
  $('.aq_forecast').css({
    'zoom': `${$(window).width() / 375}`,
  });
  $('.aq_banner').css({
    'zoom': `${$(window).width() / 375}`,
  });
  $('#canvas_svg').width($(window).width() - 50);
  $('#canvas_svg').height(($(window).width() - 50) * 0.865);

  document.title = '空气质量';
  $scope.bgColor1 = '';
  $scope.tColor1 = '';
  $scope.tabMark = 'aqi';
  $scope.areaTab = [
    {
      name: 'aqi',
      tab: 'AQI',
      num: '',
    },
    {
      name: 'pm2.5',
      tab: 'PM',
      num: '2.5',
    },
    {
      name: 'o3',
      tab: 'O3',
      num: '',
    },
    {
      name: 'pm10',
      tab: 'PM',
      num: '10',
    },
    {
      name: 'no2',
      tab: 'NO2',
      num: '',
    },
  ];

  $scope.getColor = (value) => {
    if (value >= 0 && value <= 50) {
      $scope.bgColor1 = '#81C5A0';
      $scope.tColor1 = 'rgba(65,127,90,.5) 0 3px 6px';
      $scope.setAQColor($scope.bgColor1, $scope.tColor1, 1);
    } else if (value >= 51 && value <= 100) {
      $scope.bgColor1 = '#F6AA5A';
      $scope.tColor1 = 'rgba(190,116,55,.5) 0 3px 6px';
      $scope.setAQColor($scope.bgColor1, $scope.tColor1, 2);
    } else if (value >= 101 && value <= 150) {
      $scope.bgColor1 = '#F47147';
      $scope.tColor1 = 'rgba(185,75,39,.5) 0 3px 6px';
      $scope.setAQColor($scope.bgColor1, $scope.tColor1, 3);
    } else if (value >= 151 && value <= 200) {
      $scope.bgColor1 = '#E74853';
      $scope.tColor1 = 'rgba(167,40,48,.5) 0 3px 6px';
      $scope.setAQColor($scope.bgColor1, $scope.tColor1, 4);
    } else if (value >= 201 && value <= 300) {
      $scope.bgColor1 = '#ED4683';
      $scope.tColor1 = 'rgba(180,39,63,.5) 0 3px 6px';
      $scope.setAQColor($scope.bgColor1, $scope.tColor1, 5);
    } else if (value > 300) {
      $scope.bgColor1 = '#F47147';
      $scope.tColor = 'rgba(148,30,43,.5) 0 3px 6px';
      $scope.setAQColor($scope.bgColor1, $scope.tColor1, 6);
    }
  };
  $scope.setAQColor = (a, b, num) => {
    $('.aqBgImg').html(`<img width="100%" src="img/aq-banner/AQBG${num}.png" width=100% alt="" />`);
    $('.aqBannerTitle h1').css({
      'text-shadow': b,
    });
    // AQI NO2 == tab的颜色 及字体颜色
    $scope.colorTab = a;
  };
  wechatService.config();


  let imageUrl = '/img/goodaqi.png';
  weatherService.getCurrentAqi().then((data) => {
    const d = data.data;
    $scope.aqiNow = d.aqi;
    $scope.aqiScore = d.level;
    $scope.getColor($scope.aqiNow);
    switch (d.level) {
      case '优':
        imageUrl = '/img/goodaqi.png';
        $scope.aqilevel = '一级';
        break;
      case '良':
        imageUrl = '/img/alright.png';
        $scope.aqilevel = '二级';
        break;
      case '轻度污染':
        imageUrl = '/img/lserious.png';
        $scope.aqilevel = '三级';
        break;
      case '中度污染':
        imageUrl = '/img/mserious.png';
        $scope.aqilevel = '四级';
        break;
      case '重度污染':
        imageUrl = '/img/hserious.png';
        $scope.aqilevel = '五级';
        break;
      case '严重污染':
        imageUrl = '/img/vserious.png';
        $scope.aqilevel = '六级';
        break;
      default:
        imageUrl = '/img/goodaqi.png';
        $scope.aqilevel = '一级';
    }
    wx.ready(() => {
      const imgShareUrl = imageUrl;
      wx.onMenuShareTimeline({
        title: `今天的上海空气质量${$scope.aqiScore}`, // 分享标题
        link: window.location.href, // 分享链接
        imgUrl: `http://wechat.daguchuangyi.com${imgShareUrl}`, // 分享图标
        success: () => {
        },
        cancel: () => {
        },
      });

      wx.onMenuShareAppMessage({
        title: `今天的上海空气质量${$scope.aqiScore}`, // 分享标题
        desc: `实时AQI指数${$scope.aqiNow}，${$scope.aqilevel}  首要污染物${$scope.aqiForcast[1].pripoll}`, // 分享描述
        link: window.location.href, // 分享链接
        imgUrl: `http://wechat.daguchuangyi.com${imgShareUrl}`, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          // 用户确认分享后执行的回调函数
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
        },
      });
    });
  });


  const dataAqis = [];
  let nowTime;

  weatherService.getAqiHistory().then((data) => {
    const d = data.data;
    nowTime = Number(d[0].datetime.slice(-3, -1));
    $scope.nowTime = [];
    let cunt = 0;
    for (let i = (d.length - 1); i > -1; i--) {
      dataAqis[cunt] = d[i].aqi;
      cunt++;
    }
    const baseNum = Number(d[0].datetime.slice(-3, -1));
    $scope.nowTime.push(baseNum);
    for (let i = 1; i < 12; i++) {
      if (baseNum - 2 * i >= 0 && baseNum - 2 * i < 10) {
        $scope.nowTime.push(`0${baseNum - 2 * i}`);
      } else if (baseNum - 2 * i < 0) {
        $scope.nowTime.push(`${baseNum - 2 * i + 24}`);
      } else {
        $scope.nowTime.push(`${baseNum - 2 * i}`);
      }
    }
    $scope.nowTime.push(baseNum);
    // for (let i = 0; i < dataAqis.length; i++) {
    //   if (i % 2 === 1) {
    //     let temp = '';
    //     if (Number(d[i - 1].datetime.slice(-3, -1)) < 10) {
    //       temp = `0${Number(d[i - 1].datetime.slice(-3, -1))}`;
    //     } else if (Number(d[i - 1].datetime.slice(-3, -1)) > 24) {
    //       temp = `0${Number(d[i - 1].datetime.slice(-3, -1)) - 24}`;
    //     } else {
    //       temp = `${Number(d[i - 1].datetime.slice(-3, -1))}`;
    //     }
    //     $scope.nowTime.push(temp);
    //   }
    //   if (dataAqis.length - 1 === i) {
    //     if (Number(d[i].datetime.slice(-3, -1)) > 24) {
    //       $scope.nowTime.push(`0${Number(d[i].datetime.slice(-3, -1)) - 24}`);
    //     } else if (Number(d[i].datetime.slice(-3, -1)) < 10) {
    //       $scope.nowTime.push(`0${Number(d[i].datetime.slice(-3, -1))}`);
    //     } else {
    //       $scope.nowTime.push(Number(d[i].datetime.slice(-3, -1)));
    //     }
    //   }
    // }
    $scope.lastestdata = d[0].datetime.slice(5).replace(/([0-9]{2})月([0-9]{2})日\s*([0-9]{2})时/g, '$1-$2 $3:00 ');
    weatherService.getAqiForcast().then((data) => {
      const d = data.data.list;
      const aqiList = [];
      let AqiScope;
      $scope.actualTime = moment(new Date()).format('H');
      // 根据当前时间判断使用使用哪一段时间的空气预测
      if (nowTime > -1 && nowTime < 13) {
        AqiScope = d[1].aqi.split('-');
      } else if (nowTime > 12 && nowTime < 21) {
        AqiScope = d[2].aqi.split('-');
      } else if (nowTime > 20 && nowTime < 25) {
        AqiScope = d[3].aqi.split('-');
      }


      // for (let i = 0; i < 6; i++) {
      //  dataAqis.remove(0);
      // }
      //
      // for (let i = 5; i >-1; i--) {
      //  dataAqis[i]= dataAqis[i+7];
      //  dataAqis[i+7] = random(parseInt(AqiScope[0]), parseInt(AqiScope[1]));
      // }
      drawChart('aq-canvas', 'aq-canvas-dashed', $scope.colorTab, dataAqis, 1 / 2, 10, 'aqi');

      weatherService.getAqiAvg().success((data)=> {
        let pm2_5s = [];
        let o3s = [];
        let pm10s = [];
        let no2s = [];
        let add = true;
        for (let i = data.length - 1; i > -1; i--) {
          if (add) {
            pm2_5s.push(data[i].pm2_5);
            o3s.push(data[i].o3);
            pm10s.push(data[i].pm10);
            no2s.push(data[i].no2);
            add = false;
          } else {
            add = true;
          }
        }
        $scope.primaryPollutantArr = [];
        $scope.primaryPollutantArr.push(pm2_5s[pm2_5s.length - 1]);
        $scope.primaryPollutantArr.push(o3s[o3s.length - 1]);
        $scope.primaryPollutantArr.push(pm10s[pm10s.length - 1]);
        $scope.primaryPollutantArr.push(no2s[no2s.length - 1]);
        $scope.primaryPollutantArr.sort();
        const aqArr = {
          'PM25s': pm2_5s[pm2_5s.length - 1],
          'O3': o3s[o3s.length - 1],
          'PM10': pm10s[pm10s.length - 1],
          'NO2': no2s[no2s.length - 1],
        };
        if (aqArr.PM25s === $scope.primaryPollutantArr[$scope.primaryPollutantArr.length - 1]) {
          $scope.primaryPollutant = 'PM 2.5';
        } else if (aqArr.O3 === $scope.primaryPollutantArr[$scope.primaryPollutantArr.length - 1]) {
          $scope.primaryPollutant = 'O3';
        } else if (aqArr.PM10 === $scope.primaryPollutantArr[$scope.primaryPollutantArr.length - 1]) {
          $scope.primaryPollutant = 'PM 10';
        } else if (aqArr.NO2 === $scope.primaryPollutantArr[$scope.primaryPollutantArr.length - 1]) {
          $scope.primaryPollutant = 'NO2';
        }
        $scope.changeAreaTab = (tab) => {
          $scope.tabMark = tab;
          if (tab === 'aqi') {
            drawChart('aq-canvas', 'aq-canvas-dashed', $scope.colorTab, dataAqis, 1 / 2, 10, 'aqi');
          } else if (tab === 'pm2.5') {
            drawChart('aq-canvas', 'aq-canvas-dashed', $scope.colorTab, pm2_5s, 1 / 2, 10, 'aqi');
          } else if (tab === 'o3') {
            drawChart('aq-canvas', 'aq-canvas-dashed', $scope.colorTab, o3s, 1 / 2, 10, 'aqi');
          } else if (tab === 'pm10') {
            drawChart('aq-canvas', 'aq-canvas-dashed', $scope.colorTab, pm10s, 1 / 2, 10, 'aqi');
          } else if (tab === 'no2') {
            drawChart('aq-canvas', 'aq-canvas-dashed', $scope.colorTab, no2s, 1 / 2, 10, 'aqi');
          }
        };
      });

      for (let i = 0; i < d.length; i++) {
        if (d[i].level.indexOf('到') === -1) {
          aqiList[i] = 'single';
        } else {
          aqiList[i] = 'double';
        }
        d[i].part = aqiList[i];
      }

      for (let i = 0; i < aqiList.length; i++) {
        if (aqiList[i] === 'single') {
          const g = d[i].level;
          switch (g) {
            case '优':
              d[i].class = 'single1';
              break;
            case '良':
              d[i].class = 'single2';
              break;
            case '轻度污染':
              d[i].class = 'single3';
              break;
            case '中度污染':
              d[i].class = 'single4';
              break;
            case '重度污染':
              d[i].class = 'single5';
              break;
            case '严重污染':
              d[i].class = 'single6';
              break;
            default:
              d[i].class = 'single1';
          }
        } else {
          d[i].aqLeft = d[i].level.split('到')[0];
          d[i].aqRight = d[i].level.split('到')[1];
          switch (d[i].aqLeft) {
            case '优':
              d[i].class1 = 'firs1';
              break;
            case '良':
              d[i].class1 = 'firs2';
              break;
            case '轻度污染':
              d[i].class1 = 'firs3';
              break;
            case '中度污染':
              d[i].class1 = 'firs4';
              break;
            case '重度污染':
              d[i].class1 = 'firs5';
              break;
            case '严重污染':
              d[i].class1 = 'firs6';
              break;
            default:
              d[i].class1 = 'firs1';
          }
          switch (d[i].aqRight) {
            case '优':
              d[i].class2 = 'last1';
              break;
            case '良':
              d[i].class2 = 'last2';
              break;
            case '轻度污染':
              d[i].class2 = 'last3';
              break;
            case '中度污染':
              d[i].class2 = 'last4';
              break;
            case '重度污染':
              d[i].class2 = 'last5';
              break;
            case '严重污染':
              d[i].class2 = 'last6';
              break;
            default:
              d[i].class2 = 'last1';
          }
        }
      }
      if ($scope.actualTime >= 6 && $scope.actualTime <= 16) {
        for (let i = 0; i < d.length; i++) {
          d[0].stamp = '昨天夜间';
          d[1].stamp = '今天上午';
          d[2].stamp = '今天下午';
          d[3].stamp = '今天夜间';
          d[4].stamp = '明天白天';
        }
        if (aqiList[0] === 'single') {
          d[0].class = 'singleOut';
        } else {
          d[0].class1 = 'firsOut';
          d[0].class2 = 'firsOut';
        }
        if ($scope.actualTime >= 12) {
          if (aqiList[1] === 'single') {
            d[1].class = 'singleOut';
          } else {
            d[1].class1 = 'firsOut';
            d[1].class2 = 'firsOut';
          }
        }
      }
      $scope.aqiForcast = d;
    });
  });

// create random Number
  function random(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }
};

export default AirqualityController;
