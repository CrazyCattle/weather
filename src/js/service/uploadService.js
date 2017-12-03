class uploadService {
  constructor($resource) {
    this.resource = $resource;
    this.media_id = {};
    this.name = {};
    this.phone = {};
    this.sex = {};
  }
  setUserInfo(name, phone, sex) {
    this.name = name;
    this.phone = phone;
    this.sex = sex;
  }
  getUserInfo() {
    return [this.name, this.phone, this.sex];
  }
  upload(media, time) {
    this.media_id = media;
    return this.resource('http://wechatapi.oneband.life/record/upload', { media_id: this.media_id, name: this.name, phone: this.phone, sex: this.sex, play_times: time }, (data) => {
      console.log(data);
    }).save().$promise;
  }
}

export default uploadService;
