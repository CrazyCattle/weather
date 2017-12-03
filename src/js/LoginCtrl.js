
const LoginCtrl = ($scope, $http, $state, userService) => {
  // userService.bind();
  const reg1 = /^[1][3-57-9][0-9]{9}$/;
  const reg2 = /^[0-9a-zA-Z]{6,12}$/;
  $scope.submit = () => {
    const user = {
      username: $scope.name,
      password: $scope.pwd,
    };
    $http({
      method: 'POST',
      url: 'http://139.196.210.102:8083/v1/login',
      data: user,
    }).success((data) => {
      if (data.mesg && data.mesg === '用户名输入错误!' || data.mesg === '密码输入错误!') {
        alert('用户名或密码输入错误!');
      } else if (data.mesg === '登录成功') {
        userService.bind($state, data.data.token);
      }
    }).error((data) => {
      alert('账号或密码不对，请重新输入');
    });
  };
};

export default LoginCtrl;
