const historyworkCtrl = ($scope, $http, $sce, $interval) => {
  $scope.date = '';
  $scope.author = '';
  // wechatapi.daguchuangyi.com/record/list?name=321&date=2016-07-21&page=1&size=10&sort=1
  $scope.$watch('date', () => {
  console.log($scope.date);
    $scope.filter(1);
    $scope.activeMask = false;
  });

  $scope.filter = (sort) => {
    $scope.sort = sort;
    $scope.author = $scope.author ? $scope.author : null;
    $http.get(`http://wechatapi.daguchuangyi.com/record/list?${($scope.author ? `name=${$scope.author}&` : '')}`+($scope.date?('date='+moment($scope.date).format('YYYY-MM-DD')+'&'):'')+`page=1&size=10&sort=${$scope.sort}`)
      .success((data) => {
        $scope.records = data.records;
        angular.forEach($scope.records, (record) => {
          record.audioUrl = $sce.trustAsResourceUrl(`http://wechatapi.daguchuangyi.com${record.url}`);
          // record.audio = document.getElementById(`audio-${record.id}`);
          record.isPlay = false;
          record.isLike = 2 - record.is_recommend;
          record.recommend_count = parseInt(record.recommend_count, 10);
          const duration = generateTime(parseInt(record.play_times, 10));
          record.duration = `${duration.minute}:${duration.second}`;
        });
      });
  };
  const generateTime = (record) => {
    let second = parseInt(record % 60, 10);
    let minute = parseInt(record / 60, 10);
    second = (second < 10) ? '0' + second : second;
    minute = (minute < 10) ? '0' + minute : minute;
    return { minute, second }
  }
  let lastIndex = 0;
  $scope.playAudio = (index) => {
    const lastAudio = document.getElementById('audio-'+ $scope.records[lastIndex].id);
    const currentAudio = document.getElementById('audio-'+ $scope.records[index].id);
    if (lastIndex === index) {
      if (currentAudio.paused) {
        currentAudio.play();
        $scope.records[index].isPlay = true;
        updateprogress(currentAudio, index);
      } else {
        $scope.records[index].isPlay = false;
        currentAudio.pause();
        $interval.cancel(t);
      }
    } else {
      $interval.cancel(t);
      updateprogress(currentAudio, index);
      lastAudio.pause();
      currentAudio.play();
      $scope.records[index].isPlay = true;
      $scope.records[lastIndex].isPlay = false;
    }
    lastIndex = index;
  };
  let t;
  const updateprogress = (audio, index) => {
    t = $interval(() => {
      if (audio.ended) {
        audio.pause();
        $scope.records[index].isPlay = false;
        $interval.cancel(t);
      }
    }, 10);
  };
  $scope.filter(1);
  $scope.like = (index) => {
    event.stopPropagation();
    $scope.records[index].isLike = 1 - $scope.records[index].isLike;
    if ($scope.records[index].isLike) {
      $scope.records[index].recommend_count++;
    } else {
      $scope.records[index].recommend_count--;
    }
    $http.post('http://wechatapi.daguchuangyi.com/record/recommend', { record_id: $scope.records[index].id })
      .success((data) => {
        console.log(data);
      });
  };
};

export default historyworkCtrl;
