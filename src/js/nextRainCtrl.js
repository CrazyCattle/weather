import drawChart from './lib/typhoonChart.js';
import raindrop from 'js/lib/rainDrop';

const nextRainCtrl = ($scope, $http, wechatService) => {
  wechatService.config();
  const options = {
    dd: 50,
    color: {r: 107, g: 158, b: 195, a: 1},
  };
  wx.ready(() => {
    wx.getLocation({
      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      fail: (res) => {
        $scope.location = '上海市气象局';
      },
      complete: (res) => {
      },
      success: (res) => {
        const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        $http.get(`http://139.196.210.102:8083/v1/weather/rain/next?lat=${latitude}&lon=${longitude}`)
          .success((data) => {
            // console.log(data);
            if ((data[0].time === '6') && (data[0].type === '分钟')) {
              wx.ready(() => {
                wechatService.share(`${$scope.address}正在下雨，快回家收衣服`, '点击查看我的位置距离下一场雨还有多久', 'http:/wechat.daguchuangyi.com/img/next_rain.png', window.location.href);
              });
              const rain1 = raindrop(options);
              $('h1').html('正在<br/>下雨');
              $('h1').css('font-size', 40);
              $('h1').css('margin-top', 25);
              $('h1').css('margin-bottom', 25);
            } else if ((data[0].time === '0') && (data[0].type === '天')) {
              $scope.nextrain = '1';
              $scope.type = data[0].type;
              wx.ready(() => {
                wechatService.share(`${$scope.address}距离下一场雨还有${$scope.nextrain}${data[0].type}，快回家收衣服`, '点击查看我的位置距离下一场雨还有多久', 'http:/wechat.daguchuangyi.com/img/next_rain.png', window.location.href);
              });
            } else {
              $scope.nextrain = data[0].time;
              $scope.type = data[0].type;
              wx.ready(() => {
                wechatService.share(`${$scope.address}距离下一场雨还有${data[0].time}${data[0].type}，快回家收衣服`, '点击查看我的位置距离下一场雨还有多久', 'http:/wechat.daguchuangyi.com/img/next_rain.png', window.location.href);
              });
            }
          }
        );
        // 经纬度转为地址
        const geocoder = new qq.maps.Geocoder({
          complete: (result) => {
            const addressComponents = result.detail.addressComponents;
            $scope.address = addressComponents.district + addressComponents.streetNumber;
            $scope.$digest();
          },
        });
        const coord = new qq.maps.LatLng(latitude, longitude);
        geocoder.getAddress(coord);
      },
    });
  });

  $scope.forcast = '';
  $scope.tab = 'rain';
  $scope.tabOption = {
    tempe: {
      min: 18,
      max: 38,
      title: '温度(摄氏度)',
      color: ['#F6EBDB', '#F3E5D2', '#F3CFDB', '#F3C5D6', '#F3ADA9', '#F39B9F', '#F3969B', '#F77F7F', '#FA7482', '#FC6985'],
    },
    rain: {
      min: 0,
      max: 1.75,
      title: '降雨量(毫米)',
      color: ['#E2EEF8', '#D6E6F5', '#CAE0F4', '#B7D9F6', '#A6D1F6', '#97C6F0', '#86BDEE'],
    },
    wind_speed: {
      min: 0,
      max: 5,
      title: '风俗(米/秒)',
      color: ['#F3F6E1', '#E9EFC3', '#E4EDC1', '#E4EAC0', '#D6E5AD', '#CFE7A4', '#CAE69D', '#BFDF8F', '#A3D686', '#9BCE81'],
    },
  };
  const mapOption = {
    geo: {
      map: '上海',
      itemStyle: {
        normal: {
          areaColor: '#F6EBDB',
          borderColor: '#FFF',
          borderWidth: 1,
        },
      },
      left: 10,
      right: -50,
      top: 0,
      bottom: 0,
      silent: true,
    },
    visualMap: {
      min: 18,
      max: 38,
      splitNumber: 10,
      inRange: {
        color: ['#F6EBDB', '#F3E5D2', '#F3CFDB', '#F3C5D6', '#F3ADA9', '#F39B9F', '#F3969B', '#F77F7F', '#FA7482', '#FC6985'],
      },
      textStyle: {
        color: '#fff',
      },
      show: false,
    },
    series: [{
      name: 'AQI',
      type: 'heatmap',
      coordinateSystem: 'geo',
      data: [],
      blurSize: 30,
    }],
  };

  const datas = [];
  let maxRain;
  $http.get('http://61.152.122.112:8080/api/v1/qpfs/locate?appid=bFLKk0uV7IZvzcBoWJ1j&appkey=mXwnhDkYIG6S9iOyqsAW7vPVQ5ZxBe&lon=121.834&lat=30.123', {
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .success((data) => {
      console.log(data.data.list);
      const list = data.data.list;

      for (let i = 0; i < list.length; i++) {
        if (i === 0) {
          datas.push(parseInt(list[0].d, 1));
        } else {
          datas.push(list[i].d - list[i - 1].d);
        }
      }
      maxRain = list[10].d;
      // console.log("datas",datas,maxRain);

      drawChart('nt-canvas', 'nt-canvas-dashed', '#86BDEE', datas, 2 / 5, -35, 'nextRain');
    }
  );
};

export default nextRainCtrl;
