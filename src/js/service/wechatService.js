class wechatService {
  constructor($http) {
    this.http = $http;
    //this.state = location.href.split('#')[1];
  }
  config() {
    const url = location.href.split('#')[0];
    this.http.post('http://wechatapi.oneband.life/signatureTest', { url })
      .success((data) => {
        wx.config({
          debug: false,
          appId: data.appId, // 必填，公众号的唯��?标识
          timestamp: data.timestamp, // 必填，生成签名的时间��?
          nonceStr: data.nonceStr, // 必填，生成签名的随机��?
          signature: data.signature, // 必填，签名，见附��?1
          jsApiList: [
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'onVoicePlayEnd',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getLocation',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
          ], // 必填，需要使用的JS接口列表，所有JS接口列表见附��?2
        });
      });
  }

  share(title, content, image, link) {
    wx.ready(function () {
      wx.onMenuShareTimeline({
        title:  title,
        link: link,
        imgUrl: image,
        success: function () {
        },
        cancel: function () {
        }
      });

      wx.onMenuShareAppMessage({
        title: title,
        desc: content,
        link: link,
        imgUrl: image,
        type: '',
        dataUrl: '',
        success: function () {
        },
        cancel: function () {
        }
      });
    });
  }
}

export default wechatService;
