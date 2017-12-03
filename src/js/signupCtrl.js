import siriwave from 'js/lib/siriwave';
import calendar from './lib/calendar';

const signupCtrl = ($scope, weatherService, $http, uploadService, $state, wechatService) => {
  wechatService.config();
  console.log(document.getElementsByTagName('canvas'))
  let wave;
  let i = 0;
  if (document.getElementsByTagName('canvas').length === 0) {
    console.log(i++)
    wave = siriwave({
      width: $(window).width(),
      height: ($(window).width() > 330 ? 70 : 50),
      speed: 0.12,
      container: document.getElementById('siriwave'),
      autostart: false,
    });
  }
  $scope.info = {
    '姓名': undefined,
  };
  $scope.gender = 0;
  $scope.$on('inputChange', (evt, data) => {
    $scope.info[data.key] = data.value;
  });
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
  $scope.$watch('info', () => {
    let flag = true;
    angular.forEach($scope.info, (value, key) => {
      if (key !== '简单介绍下自己(选填)') {
        if (!value) {
          flag = false;
        }
      }
    });
    if (flag) {
      $scope.canSubmit = true;
    } else {
      $scope.canSubmit = false;
    }
  }, true);
  $scope.submit = () => {
    uploadService.setUserInfo($scope.info['姓名'], $scope.info['手机号码'], $scope.gender);
    $state.go('signuprecord');
  };
  $scope.showTips = false;
  weatherService.getCurrentWeather().then((data) => {
    const d = data.data;
    const datetime = moment(d.datetime);
    const lunarData = calendar(datetime.year(), datetime.month() + 1, datetime.date());
    $scope.tips = {
      date: datetime.format('YYYY年M月D日'),
      chinesedate: `${lunarData.gzYear}（${lunarData.Animal}）年${lunarData.IMonthCn}${lunarData.IDayCn}`,
      visibility: d.visibility,
      pressure: d.pressure,
      air_dir: d.wind_dir,
      air_speed: d.wind_speed,
      humi: d.humi,
    };
    $scope.showTips = true;
  }).then(() => {
    weatherService.getTenDayWeather().then((data) => {
      const d = data.data;
      $scope.tips.pic = weather[d[0].keyword];
      $scope.tips.info = d[0].weather;
      $scope.tips.tempL = d[0].tempL;
      $scope.tips.tempU = d[0].tempU;
    });
  });

  weatherService.getLifeStatus().then((data) => {
    $scope.list = data.data.list;
    $scope.listicon= ['1', 'iconbody', 'iconbody', 'iconbody', 'iconcloth', 'iconcloth', 'iconcloth', 'iconhot', 'iconhot', 'iconyinshui', 'icondry', 'iconganmao', 'iconchenlian', 'iconwash', 'iconwash', 'iconfish', 'iconhuoxian', 'iconface', 'iconcold', 'iconcold', 'iconcold', 'iconchildren', 'iconchildren', 'iconnight', 'iconwashing', 'rainicon', 'page11', 'iconuv', 'iconuv'];
    for (let i = 0; i < $scope.list.length; i++) {
      $scope.list[i].number = $scope.list[i].level.substr(0, 1);
      $scope.list[i].icon = $scope.listicon[i];
    }
    $scope.index = [$scope.list[16],$scope.list[9],$scope.list[11],$scope.list[5],$scope.list[6],$scope.list[7]];
    const hour = moment().hour();
  });
  $scope.recordStatus = 'ready';
  $scope.isPlay = false;
  $scope.show = false;
  $scope.status = 0;
  const body = angular.element(document.getElementsByTagName('body'));
  $scope.showModal = () => {
    $scope.show = true;
  };
  $scope.hide = () => {
    $scope.show = false;
  };
  wx.ready(() => {
    wx.onMenuShareTimeline({
      title: '我正在上传天气播报成为天气主播', // 分享标题
      desc: '你也快来参加吧', // 分享描述
      link: window.location.href, // 分享链接
      imgUrl: 'http://wechat.daguchuangyi.com/img/i_report.png', // 分享图标
      success: () => {

      },
      cancel: () => {
            // 用户取消分享后执行的回调函数
      },
    });
    wx.onMenuShareAppMessage({
      title: '我正在上传天气播报成为天气主播', // 分享标题
      desc: '你也快来参加吧', // 分享描述
      link: window.location.href, // 分享链接
      imgUrl: 'http://wechat.daguchuangyi.com/img/i_report.png', // 分享图标
      success: () => {

      },
      cancel: () => {
            // 用户取消分享后执行的回调函数
      },
    });

    let recordTime = 0;
    let timer;
    function startTimer() {
      recordTime = 0;
      timer = setInterval(() => {
        recordTime ++;
      }, 1000);
    }
    const generateTime = (record) => {
      let second = parseInt(record % 60, 10);
      let minute = parseInt(record / 60, 10);
      second = (second < 10) ? '0' + second : second;
      minute = (minute < 10) ? '0' + minute : minute;
      return { minute, second }
    }
    function stopTimer() {
      clearInterval(timer);
      const duration = generateTime(recordTime);
      $scope.duration = `${duration.minute}:${duration.second}`;
    }

    $scope.startRecord = () => {

      wave.start();
      wx.startRecord();
      startTimer();
      $scope.recordStatus = 'recording';
    };
    let localId;
    let serverId;
    $scope.stopRecord = () => {
      wave.stop();
      stopTimer();
      wx.stopRecord({
        success: (res) => {
          localId = res.localId;
        },
      });
      $scope.recordStatus = 'finish';
    };
    $scope.playVoice = () => {
      wave.start();
      wx.playVoice({
        localId,
      });
      $scope.isPlay = true;
    };
    $scope.pauseVoice = () => {
      wave.stop();
      wx.pauseVoice({
        localId,
      });
      $scope.isPlay = false;
    };
    wx.onVoiceRecordEnd({
      complete: (res) => {
        wave.stop();
        stopTimer();
        localId = res.localId;
        $scope.recordStatus = 'finish';
      },
    });
    wx.onVoicePlayEnd({
      success: (res) => {
        wave.stop();
        localId = res.localId;
        $scope.isPlay = false;
      },
    });


    $scope.uploadVoice = () => {
      wave.stop();
      $scope.status = 1;
      wx.uploadVoice({
        localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: (res) => {
          serverId = res.serverId; // 返回音频的服务器端ID
          uploadService.upload(serverId, recordTime).then((msg) => {
            $scope.status = 2;
          }, (error) => {
            $scope.status = 3;
          });
        },
      });
    };
    $scope.cancel = () => {
      $scope.status = 0;
      $scope.show = false;
    };
    $scope.deleteVoice = () => {
      wave.stop();
      wave._clear();
      localId = '';
      serverId = '';
      $scope.status = 0;
      $scope.isPlay = false;
      $scope.recordStatus = 'ready';
    };
    $scope.downloadVoice = () => {
      wx.downloadVoice({
        serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: (res) => {
          localId = res.localId; // 返回音频的本地ID
        },
      });
    };
  });
};

export default signupCtrl;
