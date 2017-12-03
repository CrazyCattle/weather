class userService {
  constructor($http, $resource, $location) {
    this.token = $location.search().token;
    this.http = $http;
    this.resource = $resource;
    this.s_token = '';
    this.url = {
      'vali': 'http://wechatapi.daguchuangyi.com/user/info',
      'bind': 'http://wechatapi.daguchuangyi.com/user/bind',
      'getfriendlist': 'http://139.196.210.102:8083/v1/get/freinds',
    };
  }
  validateUrl($state) {
    return this.http.get(this.url.vali, {
      'headers': {
        'Content-Type': 'multipart/form-data',
        // 'Authorization': 'Bearer pAB4dHdjFTE5kcEgKVmxOiMOwBDvFv',
      },
    }).success((data, status, headers, config) => {
      if (data.user.s_token === '') {
        $state.go('measure.bindSemd');
      } else {
        this.s_token = data.user.s_token;
      }
    }).error((data) => {
      $state.go('measure.bindSemd');
    });
  }
  getfriendlist() {
    return this.http.get(this.url.getfriendlist, {
      'headers': {
        'Authorization': this.s_token,
      },
    });
  }
  bind($state, token) {
    this.s_token = token;
    return this.http.post(this.url.bind, {
      's_token': `Token ${this.s_token}`,
    }, {
      // 'headers': {
      //   'Authorization': 'Bearer pAB4dHdjFTE5kcEgKVmxOiMOwBDvFv',
      // },
    }).success((data) => {
      $state.go('measure.env');
    }).error((data) => {
      console.log(data);
    });
  }
}
export default userService;
