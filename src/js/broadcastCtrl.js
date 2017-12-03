import blink from './lib/blink.js';
import calendar from './lib/calendar';
import rotate from './lib/cardRotate';
import swipe from './lib/swipe';

const broadcastCtrl = ($scope, $interval, $http, $sce, wechatService) => {
  wechatService.config();

  // blink();
  document.title = '报天气';
  $scope.isPlay = false;

  let canRotate = true;
  // 滑动处理
  var startX, startY;
  document.addEventListener('touchstart', function (ev) {
    event.preventDefault();
    startX = ev.touches[0].pageX;
    startY = ev.touches[0].pageY;
  }, false);
  document.addEventListener('touchend', function (ev) {
    event.preventDefault();
    var endX, endY;
    endX = ev.changedTouches[0].pageX;
    endY = ev.changedTouches[0].pageY;
    var direction = swipe().GetSlideDirection(startX, startY, endX, endY);
    switch (direction) {
    case 0:
      // console.log("没滑动");
      break;
    case 1:
      $scope.rotate($scope.records[0].id);
      break;
    case 2:
      // console.log('向下');
      break;
    case 3:
      // console.log('向左');
      break;
    case 4:
      // console.log('向右');
      break;
    default:
    }
  }, false);
  $scope.rotate = (id) => {
    if (canRotate) {
      canRotate = false;
      $('.content_broadcast:first-child').clone().appendTo('#broadcast_container');
      // $('.content_broadcast:first-child').addClass('first');
      $('.first').removeClass('first');
      $('.second').removeClass('second');
      $('.third').removeClass('third');
      $('.content_broadcast:nth-child(2)').addClass('first');
      $('.content_broadcast:nth-child(3)').addClass('second');
      $('.content_broadcast:nth-child(4)').addClass('third');

      $('.content_broadcast:first-child').addClass('fadeOut').delay(500).queue('fx', () => {
        $('.content_broadcast:first-child').removeClass('fadeOut').dequeue();
        $('.first').removeClass('first');
        $('.second').removeClass('second');
        $('.third').removeClass('third');
        $('.content_broadcast:nth-child(4)').remove();
        $scope.isPlay = false;
        canRotate = true;
      });
      setTimeout(() => {
        $scope.$apply(() => {
          $scope.records.push($scope.records.shift());
          wx.ready(() => {
            wechatService.share(`${$scope.records[0].name}的天气祝福`, `来自${$scope.records[0].name}的天气祝福，快来听一听吧！你也可以参加哦~`, 'http:/wechat.daguchuangyi.com/img/i_report.png', window.location.href);
          });
        });
      }, 500);
      // console.log($scope.records[0]);
    }
  };
  $scope.replay = (id) => {
    const audio = document.getElementById('audio-'+id);
    $scope.isPlay = false;
    audio.pause();
    audio.currentTime = 0;
  }
  $scope.like = (index) => {
    $scope.records[index].isLike = 1 - $scope.records[index].isLike;
    console.log($scope.records[index].isLike)
    if ($scope.records[index].isLike) {
      $scope.records[index].recommend_count++;
    } else {
      $scope.records[index].recommend_count--;
    }
    $http.post('http://wechatapi.daguchuangyi.com/record/recommend', { record_id: $scope.records[index].id })
      .success((data) => {
      });
  };
  $scope.play = (id) => {
    const audio = document.getElementById('audio-'+id);
      if (audio.paused) {
        audio.play();
        $scope.isPlay = true;
        updateprogress(id);
      } else {
        $scope.isPlay = false;
        audio.pause();
        clearInterval(t);
      }
  }

  let t;
  const updateprogress = (id) => {
    const audio = document.getElementById('audio-'+id);
    const play = document.getElementById('play-'+ id);
    const bar1 = document.getElementById('bar_mask-'+ id);
    const bar2 = document.getElementById('bar_ball-'+ id);
    t = $interval(() => {
      const ex = audio.currentTime / audio.duration;
      bar1.style.width = ex * 100 + '%';
      bar2.style.left = ex * 100 + '%';
      if (audio.ended) {
        bar1.style.width = '0%';
        bar2.style.left = '0%';
        audio.currentTime = 0;
        audio.pause();
        $scope.isPlay = false;
        $interval.cancel(t);
      }
    }, 10);
  };
  const generateTime = (recordTime) => {
    let second = parseInt(recordTime % 60, 10);
    let minute = parseInt(recordTime / 60, 10);
    second = (second < 10) ? '0' + second : second;
    minute = (minute < 10) ? '0' + minute : minute;
    return { minute, second }
  }
  $http.get('http://wechatapi.daguchuangyi.com/record/list')
  .success((data) => {
    console.log(data)
    $scope.records = data.records;
    console.log($scope.records)

    // $scope.rotate($scope.records[0].id)
    angular.forEach($scope.records, (record) => {
      record.audioUrl = $sce.trustAsResourceUrl(`http://wechatapi.daguchuangyi.com${record.url}`);
      // record.audio = document.getElementById(`audio-${record.id}`);
      record.isPlay = false;
      record.isLike = 2 - record.is_recommend;
      record.recommend_count = parseInt(record.recommend_count, 10);
      const duration = generateTime(parseInt(record.play_times, 10));
      record.duration = `${duration.minute}:${duration.second}`;
      const recordDate = moment(record.created_at);
      const lunarData = calendar(recordDate.year(), recordDate.month() + 1, recordDate.date());
      record.time = {
        solartime: recordDate.format('MMM Do dddd'),
        lunartime: `${lunarData.gzYear}（${lunarData.Animal}）年 ${lunarData.IMonthCn}${lunarData.IDayCn}`,
      };
    });
    wx.ready(() => {
      wechatService.share(`${$scope.records[0].name}的天气祝福`,`来自${$scope.records[0].name}的天气祝福，快来听一听吧！你也可以参加哦~`,'http:/wechat.daguchuangyi.com/img/i_report.png',window.location.href);
    });
  });
};

export default broadcastCtrl;
