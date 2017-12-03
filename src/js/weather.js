import Contour from 'js/lib/contour';
import chart from 'js/lib/chart';
import drawChart from 'js/lib/drawChartWithLabel';
import raindrop from 'js/lib/rainDrop';
import fluid from 'js/lib/fluid';

const WeatherController = ($scope, weatherService, $interval, $http, $rootScope, wechatService) => {
  wechatService.config();
  const currentWidth = $(document).width();
  const originWidth = 375;
  $scope.scale = {
    'zoom': `${currentWidth / originWidth}`,
  };
  const options = {
    dd: 50,
    color: {
      r: '80',
      g: '175',
      b: '255',
      a: '0.5',
    },
  };

  $('.weather_detail').css({
    'zoom': $(window).width() / 375,
  });

  $('.reporter-container').css({
    'zoom': $(window).width() / 375,
  });

  $scope.times = [
    '现在',
    moment(new Date()).add(-2, 'hours').minute(0).format('HH:mm'),
    moment(new Date()).add(-4, 'hours').minute(0).format('HH:mm'),
    moment(new Date()).add(-6, 'hours').minute(0).format('HH:mm'),
    moment(new Date()).add(-8, 'hours').minute(0).format('HH:mm'),
    moment(new Date()).add(-10, 'hours').minute(0).format('HH:mm'),
  ].reverse();

  // 选择生活指数  动态的显示在weather页面中，选择的数目与显示的数目相同
  // $rootScope.characterIndex 指数页面中被选择的且排好序的数组
  // $rootScope.lifeLimit 计算指数显示的数目的
  // $rootScope.listNum 指定最低显示的数目
  $scope.changeLifeLimit = () => {
    if (($rootScope.lifeLimit === $rootScope.listNum) && $rootScope.characterIndex) {
      $rootScope.lifeLimit = $rootScope.characterIndex.length;
    } else if ($rootScope.lifeLimit === $rootScope.listNum) {
      $rootScope.lifeLimit = $scope.list.length;
    } else if ($rootScope.listNum) {
      $rootScope.lifeLimit = $rootScope.listNum;
    } else {
      $rootScope.lifeLimit = 5;
    }
  };

  $scope.stationLimit = 5;
  $scope.now = moment(new Date()).format('MM:DD HH:mm');
  $scope.changeStationLimit = () => {
    if ($scope.stationLimit === 5) {
      $scope.stationLimit = $scope.table.length;
    } else {
      $scope.stationLimit = 5;
    }
  };

  let coordinateHere = '?lon=121&lat=31.23444';
  weatherService.getTenDayWeather().then((data) => {
    $scope.color2 = '';
    const d = data.data;
    $scope.dShare = d;
    const nowTime = Date.parse(moment(new Date()));
    const timeStep1 = 30 * 60 * 1000;
    const timeStep2 = 60 * 60 * 1000;
    let sunrise;
    let sunset;
    $http.get('http://apis.baidu.com/apistore/weatherservice/weather?citypinyin=shanghai', {
      'headers': {
        'apikey': '0d94ad23ab63ebdfe94bc5e1b0794374',
        'Authorization': undefined,
      },
    }).success((timeJson) => {
      sunset = Date.parse(moment(`20${timeJson.retData.date} ${timeJson.retData.sunset}:00`));
      sunrise = Date.parse(moment(`20${timeJson.retData.date} ${timeJson.retData.sunrise}:00`));

      if ((d[0].keyword.indexOf('雾') !== -1) || (d[0].keyword.indexOf('霾') !== -1)) {
        options.color = { r: 151, g: 150, b: 174, a: 1 };
        addBG(0, '#B7B5C5', 'rgba(142,414,162,.5)', 'rgba(142,414,162,.5) 0 3px 5px', 'rgba(142,414,162,.5) 0 2px 3px');
      } else if (d[0].keyword.indexOf('沙尘') !== -1) {
        options.color = { r: 225, g: 135, b: 75, a: 1 };
        addBG(4, '#EEA534', 'rgba(208,120,58,.5)', 'rgba(208,120,58,.5) 0 3px 5px', 'rgba(208,120,58,.5) 0 2px 3px');
      } else {
        if ((nowTime >= sunrise - timeStep1) && (nowTime < sunrise + timeStep1)) {
          if (d[0].keyword.indexOf('暴雨') !== -1) {
            options.color = { r: 91, g: 154, b: 151, a: 1 };
          } else {
            options.color = { r: 211, g: 109, b: 114, a: 1 };
          }
          addBG(1, '#F88A95', 'rgba(231,103,127,.5)', 'rgba(231,103,127,.5) 0 3px 5px', 'rgba(231,103,127,.5) 0 2px 3px');
        } else if ((nowTime >= sunrise + timeStep1) && (nowTime < sunset - timeStep2)) {
          if (d[0].keyword.indexOf('暴雨') !== -1) {
            options.color = { r: 91, g: 154, b: 151, a: 1 };
          } else {
            options.color = { r: 107, g: 158, b: 195, a: 1 };
          }
          addBG(2, '#8EB9EA', 'rgba(57,116,159,.5)', 'rgba(74,135,178,.5) 0 3px 5px', 'rgba(57,116,159,.5) 0 2px 3px');
        } else if ((nowTime >= sunset - timeStep2) && (nowTime < sunset - timeStep1)) {
          if (d[0].keyword.indexOf('暴雨') !== -1) {
            options.color = { r: 91, g: 154, b: 151, a: 1 };
          } else {
            options.color = { r: 225, g: 135, b: 75, a: 1 };
          }
          addBG(3, '#80B9B4', 'rgba(55,101,101,.5)', 'rgba(74,135,178,.5) 0 3px 5px', 'rgba(57,116,159,.5) 0 2px 3px');
        } else if ((nowTime >= sunset - timeStep1) && (nowTime < sunset + timeStep1)) {
          if (d[0].keyword.indexOf('暴雨') !== -1) {
            options.color = { r: 91, g: 154, b: 151, a: 1 };
          } else {
            options.color = { r: 225, g: 135, b: 75, a: 1 };
          }
          addBG(4, '#EEA534', 'rgba(208,120,58,.5)', 'rgba(208,120,58,.5) 0 3px 5px', 'rgba(208,120,58,.5) 0 2px 3px');
        } else if ((nowTime > sunset + timeStep1) || (nowTime < sunrise - timeStep1)) {
          if (d[0].keyword.indexOf('暴雨') !== -1) {
            options.color = { r: 91, g: 154, b: 151, a: 1 };
          } else {
            options.color = { r: 60, g: 81, b: 118, a: 1 };
          }
          addBG(5, '#5482AB', 'rgba(40,58,94,.5)', 'rgba(40,58,95,.5) 0 3px 5px', 'rgba(40,58,95,.5) 0 2px 3px');
        }
      }
    });
    const addBG = (num, wColor, tColor, ts1, ts2) => {
      // 根据时间 切换背景图片
      $('#bgi-container').html(`<img src="img/index-banner/bgs${num}.png" width=100% height=100%>`);
      $('.aboutWeatherT>h2').css({
        'color': wColor,
      });
      $('.aboutWeatherT>p').css({
        'color': wColor,
      });
      $('.lf_data>div>i').css({
        'color': wColor,
      });
      $('.weather_info h1').css({
        'text-shadow': ts1,
      });
      $('.weather_info h3').css({
        'text-shadow': ts2,
      });
      $('.weather_info p').css({
        'text-shadow': ts2,
      });
      $scope.color = tColor;
      $scope.color2 = wColor;

      const tempe = [];
      $scope.date = [];
      $scope.weather = [];
      $scope.dateD = {
        '0': '周日',
        '1': '周一',
        '2': '周二',
        '3': '周三',
        '4': '周四',
        '5': '周五',
        '6': '周六',
      };
      const weather = {
        '暴雪': 'baoxue',
        '暴雨': 'baoyu',
        '大暴雨': 'dabaoyu',
        '大雪': 'daxue',
        '大雨': 'dayu',
        '冻雨': 'dongyu',
        '多云': 'duoyunqing',
        '浮尘': 'fuchen',
        '雷雨': 'leiyu',
        '雷阵雨': 'leizhenyubaitian',
        '雷阵雨伴有冰雹': 'leizhenyubanyoubingbao',
        '霾': 'mai',
        '晴': 'qingbaitian',
        '特大暴雨': 'tedabaoyu',
        '雾': 'wu',
        '小雪': 'xiaoxue',
        '小雨': 'xiaoyu',
        '扬沙': 'yangsha',
        '阴': 'yin',
        '雨夹雪': 'yujiaxue',
        '中雪': 'zhongxue',
        '中雨': 'zhongyu',
        '阵雪': 'zhenxuebaitian',
        '强沙尘暴': 'qiangshachenbao',
        '沙尘暴': 'shachenbao',
        '冰雹': 'bingbao',
        '阵雨': 'zhenyubaitian',
      };
      $scope.newTemp = [];
      $scope.oldTemp = [];
      weatherService.getTempYesterday().then((data) => {
        if (d.length <= 12) {
          $scope.displayDay = d.length - 2;
          for (let i = 0; i < d.length; i++) {
            if (d[i].num === -1) {
              $scope.oldTemp.push([Math.round(parseFloat(data.minTemp, 10)), Math.round(parseFloat(data.maxTemp, 10)), '昨天', weather[d[i].keyword]]);
            } else if (d[i].num === -2) {
              $scope.oldTemp.unshift([parseInt(d[i].tempL, 10), parseInt(d[i].tempU, 10), '前天', weather[d[i].keyword]]);
            } else if (d[i].num === 0) {
              $scope.newTemp.push([parseInt(d[i].tempL, 10), parseInt(d[i].tempU, 10), '今天', weather[d[i].keyword]]);
            } else {
              $scope.newTemp.push([parseInt(d[i].tempL, 10), parseInt(d[i].tempU, 10), $scope.dateD[Number(d[i].weakday)], weather[d[i].keyword]]);
            }
          }
          $scope.newTemp.unshift($scope.oldTemp[1]);
          $scope.newTemp.unshift($scope.oldTemp[0]);
          chart('reporter-canvas', 'reporter-canvas-dashed', 4 / 5, -70, $scope.newTemp, $scope.color2);
          $scope.newTemp.pop();
        }
        $scope.tempeRange = $scope.newTemp[2];
        $scope.weatherToday = d[0].weather;
      });
    };

    wx.ready(() => {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res) => {
          const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          $http.get(`http://139.196.210.102:8083/v1/weather/rain/next?lat=${latitude}&lon=${longitude}`)
            .success((data) => {
              if ((data[0].time === '6') && (data[0].type === '分钟')) {
                const rain1 = raindrop(options);
              }
            });
          // 经纬度转为地址
          const geocoder = new qq.maps.Geocoder({
            complete: (result) => {
              const addressComponents = result.detail.addressComponents;
              if (addressComponents.city === '上海市') {
                $scope.address = addressComponents.district + addressComponents.street;
              } else {
                $scope.address = addressComponents.city;
              }
              $scope.$digest();
            },
          });
          geocoder.getAddress(new qq.maps.LatLng(latitude, longitude));

          coordinateHere = `?lon=${longitude}&lat=${latitude}`;
          weatherService.setCoordinate(coordinateHere);
          weatherService.getCurrentWeather().then((data) => {
            $scope.realtime = data.data;
            if (($scope.realtime.wind_speed >= 0) && ($scope.realtime.wind_speed <= 0.2)) {
              $scope.realtime.wind_range = 0;
            } else if (($scope.realtime.wind_speed > 0.2) && ($scope.realtime.wind_speed <= 1.5)) {
              $scope.realtime.wind_range = 1;
            } else if (($scope.realtime.wind_speed > 1.5) && ($scope.realtime.wind_speed <= 3.3)) {
              $scope.realtime.wind_range = 2;
            } else if (($scope.realtime.wind_speed > 3.3) && ($scope.realtime.wind_speed <= 5.4)) {
              $scope.realtime.wind_range = 3;
            } else if (($scope.realtime.wind_speed > 5.4) && ($scope.realtime.wind_speed <= 7.9)) {
              $scope.realtime.wind_range = 4;
            } else if (($scope.realtime.wind_speed > 7.9) && ($scope.realtime.wind_speed <= 10.7)) {
              $scope.realtime.wind_range = 5;
            } else if (($scope.realtime.wind_speed > 10.7) && ($scope.realtime.wind_speed <= 13.8)) {
              $scope.realtime.wind_range = 6;
            } else if (($scope.realtime.wind_speed > 13.8) && ($scope.realtime.wind_speed <= 17.1)) {
              $scope.realtime.wind_range = 7;
            } else if (($scope.realtime.wind_speed > 17.1) && ($scope.realtime.wind_speed <= 20.7)) {
              $scope.realtime.wind_range = 8;
            } else if (($scope.realtime.wind_speed > 20.7) && ($scope.realtime.wind_speed <= 24.4)) {
              $scope.realtime.wind_range = 9;
            } else if (($scope.realtime.wind_speed > 24.4) && ($scope.realtime.wind_speed <= 28.4)) {
              $scope.realtime.wind_range = 10;
            } else if ($scope.realtime.wind_speed > 28.4) {
              $scope.realtime.wind_range = 11;
            }
            $scope.fromNow = moment(data.data.datetime).fromNow();
            const fromNow = $interval(() => {
              $scope.fromNow = moment(data.data.datetime).fromNow();
            }, 1000);
            wx.ready(() => {
              wechatService.share(`我在${$scope.address}，这里是我的天气，你那里呢`,
                `气温${$scope.realtime.tempe}度，${$scope.weatherToday}，能见度${$scope.realtime.visibility}，${$scope.realtime.wind_dir}${$scope.realtime.wind_speed}级。点击查看我的实时天气`,
                `http:/wechat.daguchuangyi.com/img/weather-share/pic_${$scope.dShare[0].keyword}.png`, window.location.href);
            });
          });
        },
      });
    });
  });

  weatherService.getCurrentWeather().then((data) => {
    $scope.realtime = data.data;
    $scope.fromNow = moment(data.data.datetime).fromNow();
    const fromNow = $interval(() => {
      $scope.fromNow = moment(data.data.datetime).fromNow();
    }, 1000);
  });
  $scope.selectedList = [];
  $scope.arr = [];
  Array.prototype.remove = function (val) {
    const index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };
  weatherService.getLifeStatus().then((data) => {
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
    }
    const hour = moment().hour();

    $http.get('http://wechatapi.daguchuangyi.com/setting/living')
    .success((d) => {
      d.sort();
      $rootScope.statusData = d;
      $scope.dataArrLength = d.length;
      for (let i = 0; i < d.length; i++) {
        for (let j = 0; j < $scope.list.length; j++) {
          if (d[i] === $scope.list[j].index_id) {
            $scope.selectedList.push($scope.list[j]);
            $scope.list.remove($scope.list[j]);
          }
        }
      }
      for (let i = 0; i < $scope.list.length; i++) {
        $scope.selectedList.push($scope.list[i]);
      }
      if (!$rootScope.listNum) {
        if ($scope.dataArrLength === 0) {
          $rootScope.lifeLimit = 5;
          $rootScope.listNum = 5;
        } else {
          $rootScope.lifeLimit = $scope.dataArrLength;
          $rootScope.listNum = $scope.dataArrLength;
        }
      }
    });
  });

  // 处理时间
  $scope.chartTimes = [];
  if (moment(new Date()).minute() === 0) {
    for (let i = 1; i <= 12; i++) {
      $scope.chartTimes.push(moment(new Date()).add(-2 * i, 'hours').minute(0).format('HH'));
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      $scope.chartTimes.push(moment(new Date()).add(-2 * i + 1, 'hours').minute(0).format('HH'));
    }
  }
  $scope.chartTimes = $scope.chartTimes.reverse();
  $scope.curveData = [];

  let historyData;
  let newData;
  let sites;

  let tableTemp;
  let tableRain;
  let tableWind;

  const tableData = {};
  const arrayData = {};
  const times = [];
  const contour = new Contour('scattergram');

  $scope.currentKey = '徐家汇';
  $scope.mainSitePoint = [];

  weatherService.getTempeHistory().then((res) => {
    const data = res;

    historyData = data.data;
    newData = data.new_data;
    sites = data.site;

    // 处理温度数据
    contour.buildTemp(data);
    arrayData.tempe = {};
    tableData.tempe = [];

    // 处理时间
    historyData.forEach((value) => {
      value.st_time = moment(value.st_time).format('HH:mm');
    });

    // 数据处理
    angular.forEach(historyData[0].data_content, (d, siteCode) => {
      const oneArr = [];
      if (angular.isDefined(sites[siteCode])) {
        oneArr.push(newData[siteCode] ? parseFloat(newData[siteCode].tempe) : parseFloat(historyData[0].data_content[siteCode].max_temp));
        for (let i = 0; i < historyData.length - 1; i++) {
          oneArr.push(historyData[i].data_content[siteCode] ? parseFloat(historyData[i].data_content[siteCode].max_temp) : null);
        }
        arrayData.tempe[sites[siteCode].name] = oneArr;
        tableData.tempe.push({
          name: sites[siteCode].name,
          currentTemp: oneArr[0] ? oneArr[0] : historyData[0].data_content[siteCode].max_temp,
          hTemp: Math.max.apply(Math, [sites[siteCode].max_t, newData[siteCode] ? newData[siteCode].max_tempe : -10]),
          lTemp: Math.min.apply(Math, [sites[siteCode].min_t, newData[siteCode] ? newData[siteCode].min_tempe : 50]),
        });
      }
    });

    for (let i = historyData.length - 1; i >= 0; i--) {
      times.push(historyData[i].st_time);
    }
    $scope.activateArea($scope.currentKey);
    $scope.changeAreaTab('tempe');
  });

  // 时间格
  const timeKeys = [moment(new Date()).format('YYYY-MM-DD HH')];
  for (let i = 1; i < 24; i ++) {
    timeKeys.push(moment(new Date()).add(-i, 'hours').format('YYYY-MM-DD HH'));
  }

  // 雨量数据处理
  weatherService.getRainHistory().then((res) => {
    const data = res.data;
    contour.buildRain(data);

    arrayData.rain = [];
    tableData.rain = [];

    for (const key of Object.keys(data)) {
      const site = data[key];
      const oneArr = [];

      timeKeys.forEach((timeKey, index) => {
        if (angular.isDefined(site.rain_data[timeKey])) {
          oneArr.push(parseFloat(site.rain_data[timeKey].toFixed(1)));
        } else {
          if (oneArr.length > 0) {
            oneArr.push(oneArr[oneArr.length - 1]);
          } else {
            oneArr.push(0.0);
          }
        }
      });

      arrayData.rain[site.name] = oneArr;
      tableData.rain.push({
        name: site.name,
        currentTemp: (oneArr[0]).toFixed(1),
        hTemp: (oneArr[0] + oneArr[1] + oneArr[2]).toFixed(1),
        lTemp: oneArr.reduce((a, b) => a + b, 0).toFixed(1),
      });
    }
  });

  weatherService.getWindHistory().then((res) => {
    const data = res.data;
    contour.buildWind(data);

    arrayData.wind = [];
    tableData.wind = [];

    for (const key of Object.keys(data)) {
      const site = data[key];
      const oneArr = [];

      timeKeys.forEach((timeKey, index) => {
        if (angular.isDefined(site.data[timeKey])) {
          oneArr.push(parseFloat(site.data[timeKey].h.toFixed(1)));
        } else {
          if (oneArr.length > 0) {
            oneArr.push(oneArr[oneArr.length - 1]);
          } else {
            oneArr.push(0.0);
          }
        }

        // 增加一个点..
        if (index === 0) {
          oneArr.push(oneArr[0]);
        }
      });

      arrayData.wind[site.name] = oneArr;
      tableData.wind.push({
        name: site.name,
        currentTemp: (oneArr[0]).toFixed(1),
        hTemp: Math.max.apply(Math, [oneArr[0], oneArr[1], oneArr[2]]),
        lTemp: Math.max.apply(Math, oneArr),
      });
    }
  });

  // 激活区域
  $scope.activateArea = (name) => {
    $scope.currentKey = name;
    $scope.curveData = arrayData[$scope.tab.name][name].slice(0, timeKeys.length).reverse();

    const chartType = $scope.tab.name === 'tempe' ? 'aq' : $scope.tab.name;
    drawChart('curve', 'curve-dashed', $scope.tab.curveColor, $scope.curveData, 2 / 5, - 25, chartType, times);
  };

  $scope.switchButton = (parameter) => {
    if (parameter === 'shs') {
      $('.map-name').show();
      $('.scattergram-point-wrapper').hide();
      $('#bg-move').removeClass('tab-click-1').addClass('tab-click-0');
      $('#bg-move')[0].style.left = '2px';
    } else if (parameter === 'fq') {
      $('.map-name').hide();
      $('.scattergram-point-wrapper').show();
      $('#bg-move').removeClass('tab-click-0').addClass('tab-click-1');
      $('#bg-move')[0].style.left = '98px';
    }
  };

  $scope.areaTab = {
    tempe: {
      name: 'tempe',
      tab: '实时温度',
      color: '#ff8090',
      title: '逐时最高气温变化曲线',
      detail: '各气象站点逐时最高气温',
      theadOne: '当前温度',
      theadTwo: '今日最高',
      theadThree: '今日最低',
      curveColor: '#d32338',
    },
    rain: {
      name: 'rain',
      tab: '累计雨量',
      color: '#86bdee',
      title: '逐时累计雨量变化曲线',
      detail: '各气象站点累计雨量',
      theadOne: '1h累计雨量',
      theadTwo: '3h累计雨量',
      theadThree: '24h累计雨量',
      curveColor: '#86bdee',
    },
    wind: {
      name: 'wind',
      tab: '风速风向',
      color: '#9bce81',
      title: '逐时风速变化曲线',
      detail: '各气象站点风速',
      theadOne: '1h最大风速',
      theadTwo: '3h最大风速',
      theadThree: '24h最大风速',
      curveColor: '#9bce81',
    },
  };

  $scope.tab = $scope.areaTab.tempe;
  $scope.allColor = '#ff8090';
  $scope.tabwind = false;
  // 更改区域
  $scope.changeAreaTab = (tabName) => {
    let fluid1;
    $scope.table = tableData[tabName];
    $scope.tab = $scope.areaTab[tabName];
    contour.initialize(tabName);
    $scope.colorScales = contour.getColorScales();
    // 处理阴影效果
    $scope.colorScales.forEach((scale) => {
      scale.boxShadowColor = hexToRgba(scale.color);
    });

    // 风速流向
    if (tabName === 'wind') {
      // $scope.tabwind = true;
      // fluid1 = fluid(contour.getWindFlowPoint(12));
    } else {
      // $scope.tabwind = false;
      // fluid1 = undefined;
    }

    $scope.mainSitePoint = contour.getMainSitePoint(12);
    $scope.allColor = $scope.tab.color;
    $scope.activateArea($scope.currentKey);
  };

  // 点击播放
  $scope.clickPlayButton = () => {
    if (playing) {
      stopAnimation();
      changeSvg();
    } else {
      playAnimation();
      changeSvg();
    }
  };

  // 处理滚动条
  const width = $('.dragdealer').width();
  const barWidth = $('.handle').width();

  $('.container').scrollLeft(600);
  $('.handle').css('transform', `translateX(${(width - barWidth)}px)`);
  $('.handle').show();

  // progress
  const imagesNumber = 12; // 图片数量
  let playing = false;
  let progress = 12;
  let interval;

  const playAnimation = () => {
    playing = true;
    if (progress > imagesNumber - 1) {
      progress = 1;
      $('.handle').css('transition', 'none');
      $('.handle').css('transform', 'translateX(0px)');
      contour.reloadData(progress);
    }

    const animation = () => {
      // 更新 contour 数据
      progress++;
      contour.reloadData(progress);
      $scope.mainSitePoint = contour.getMainSitePoint(progress);
      $scope.$digest();
      const endWidth = ((progress - 1) / (imagesNumber - 1)) * (width - barWidth);
      $('.handle').css('transition', 'all 1s');
      $('.handle').css('transform', `translateX(${endWidth}px)`);
      if (progress > imagesNumber - 1) {
        clearInterval(interval);
        playing = false;
        changeSvg();
      }
    };
    interval = setInterval(animation, 500);
  };

  const stopAnimation = () => {
    clearInterval(interval);
    playing = false;
    changeSvg();
  };

  const changeSvg = () => {
    if (!playing) {
      $('#play').attr('visibility', 'visible');
      $('#pause').attr('visibility', 'hidden');
    } else {
      $('#play').attr('visibility', 'hidden');
      $('#pause').attr('visibility', 'visible');
    }
  };

  // 计算经纬度距离
  const EARTH_RADIUS = 6378137.0; // 单位M
  const PI = Math.PI;
  const getRad = (d) => d * PI / 180.0;
  const getGreatCircleDistance = (lat1, lng1, lat2, lng2) => {
    const radLat1 = getRad(lat1);
    const radLat2 = getRad(lat2);
    const a = radLat1 - radLat2;
    const b = getRad(lng1) - getRad(lng2);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;
    return s;
  };

  const hexToRgba = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, 0.5)`;
  };
};

export default WeatherController;
