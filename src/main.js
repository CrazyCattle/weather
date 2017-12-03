import WeatherController from 'js/weather';
import MyCityController from 'js/mycity';
import searchCityController from 'js/searchCityCtrl';
import EnvController from 'js/myEnv';
import PhotographController from 'js/PhotographCtrl';
import UploadPhotoController from 'js/uploadPhotoCtrl';
import FriendEnvController from 'js/friendEnv';
import FriendListController from 'js/friendList';
import StoreController from 'js/storeCtrl';
import ConsumeController from 'js/consumeCtrl';
import BroadcastController from 'js/broadcastCtrl';
import RankinglistController from 'js/rankinglistCtrl';
import SignupController from 'js/signupCtrl';
import AirqualityController from 'js/airquality';
import bindSemdController from 'js/bindSemdCtrl';
import LoginController from 'js/LoginCtrl';
import MeasureController from 'js/measureCtrl';
import IndexOfLivingController from 'js/indexOfLivingCtrl';
import ActivityController from 'js/activityCtrl';
import NextRainController from 'js/nextRainCtrl';
import HistoryworkCtrl from 'js/historyworkCtrl';
import photoActivityCtrl from 'js/photoActivCtrl';
import reportActivityCtrl from 'js/reportActivCtrl';
import InputBarDirective from 'js/directive/input';

import WeatherService from 'js/service/weatherService';
import UploadService from 'js/service/uploadService';
import StoreService from 'js/service/storeService';
import WechatService from 'js/service/wechatService';
import UserService from 'js/service/userService';

import 'less/main.less';

angular.module('demo', ['ng', 'ui.router', 'ngResource', 'swipe'])
  .run(($http, $resource, userService) => {
    if (userService.token) {
      $http.defaults.headers.common.Authorization = `Bearer ${userService.token}`;
    } else {
      $http.defaults.headers.common.Authorization = 'Bearer jgdsSTLPkzbrc3VJqU2znmZjNPfkAL';
    }
    FastClick.attach(document.body);
  })
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('weather', {
        url: '/weather',
        templateUrl: 'templates/weather.html',
        controller: 'WeatherController as Weather',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController as Login',
      })
      .state('measure', {
        url: '/measure',
        abstract: true,
        templateUrl: 'templates/measure.html',
        controller: 'MeasureController as Measure',
      })
      .state('measure.mycity', {
        url: '/mycity',
        templateUrl: 'templates/parent.mycity.html',
        controller: 'MyCityController as MyCity',
      })
      .state('searchcity', {
        url: '/searchcity',
        templateUrl: 'templates/searchcity.html',
        controller: 'searchCityController as searchCity',
      })
      .state('photoActivity', {
        url: '/photoactivity',
        templateUrl: 'templates/photoactivity.html',
        controller: 'photoActivityCtrl as photoActivity',
      })
      .state('measure.friend', {
        url: '/friend',
        templateUrl: 'templates/parent.cef.html',
        controller: 'FriendListController as FriendList',
      })
      .state('measure.env', {
        url: '/env',
        templateUrl: 'templates/parent.myevc.html',
        controller: 'EnvController as Env',
      })
      .state('measure.activity', {
        url: '/activity',
        templateUrl: 'templates/parent.activity.html',
        controller: 'ActivityController as Activity',
      })
      .state('measure.bindSemd', {
        url: '/bindSemd',
        templateUrl: 'templates/bindSemd.html',
        controller: 'bindSemdController as bindSemd',
      })
      .state('myfriendevc', {
        url: '/myfriendevc',
        templateUrl: 'templates/myfriendevc.html',
        controller: 'FriendEnvController as FriendEnv',
      })
      .state('aq', {
        url: '/aq',
        templateUrl: 'templates/airquality.html',
        controller: 'AirqualityController as AqiCtrl',
      })
      .state('photograph', {
        url: '/photograph',
        templateUrl: 'templates/photograph.html',
        controller: 'PhotographController as Photograph',
      })
      .state('photographHighlight', {
        url: '/photograph/:index',
        templateUrl: 'templates/photograph.html',
        controller: 'PhotographController as Photograph',
      })
      .state('uploadPhoto', {
        url: '/uploadPhoto/:localIds',
        templateUrl: 'templates/upload-photo.html',
        controller: 'UploadPhotoController as UploadPhoto',
      })
      .state('historywork', {
        url: '/hw',
        templateUrl: 'templates/historywork.html',
        controller: 'HistoryworkCtrl as Historywork',
      })
      .state('record', {
        url: '/myrecord',
        templateUrl: 'templates/myrecord.html',
      })
      .state('store', {
        url: '/store',
        templateUrl: 'templates/store.html',
        controller: 'StoreController as Store',
      })
      .state('consume', {
        url: '/consume',
        templateUrl: 'templates/consume.html',
        controller: 'ConsumeController as Consume',
      })
      .state('broadcast', {
        url: '/broadcast',
        templateUrl: 'templates/broadcast.html',
        controller: 'BroadcastController as Broadcast',
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupController as Signup',
      })
      .state('signuprecord', {
        url: '/signuprecord',
        templateUrl: 'templates/signuprecord.html',
        controller: 'SignupController as Signuprecord',
      })
      .state('reportactivity', {
        url: '/reportactivity',
        templateUrl: 'templates/reportactivity.html',
        controller: 'reportActivityCtrl as reportactivity',
      })
      .state('rank', {
        url: '/rank',
        templateUrl: 'templates/rankinglist.html',
        controller: 'RankinglistController as Rankinglist',
      })
      .state('nextRain', {
        url: '/nextrain',
        templateUrl: 'templates/nextrain.html',
        controller: 'NextRainController as NextRain',
      })
      .state('character', {
        url: '/character',
        templateUrl: 'templates/indexOfLiving.html',
        controller: 'IndexOfLivingController as IndexOfLiving',
      });
    $urlRouterProvider.otherwise('/weather');
  })
  .controller('WeatherController', WeatherController)
  .controller('MyCityController', MyCityController)
  .controller('EnvController', EnvController)
  .controller('PhotographController', PhotographController)
  .controller('UploadPhotoController', UploadPhotoController)
  .controller('FriendEnvController', FriendEnvController)
  .controller('FriendListController', FriendListController)
  .controller('StoreController', StoreController)
  .controller('searchCityController', searchCityController)
  .controller('ConsumeController', ConsumeController)
  .controller('BroadcastController', BroadcastController)
  .controller('RankinglistController', RankinglistController)
  .controller('SignupController', SignupController)
  .controller('AirqualityController', AirqualityController)
  .controller('bindSemdController', bindSemdController)
  .controller('LoginController', LoginController)
  .controller('MeasureController', MeasureController)
  .controller('IndexOfLivingController', IndexOfLivingController)
  .controller('ActivityController', ActivityController)
  .controller('NextRainController', NextRainController)
  .controller('HistoryworkCtrl', HistoryworkCtrl)
  .controller('photoActivityCtrl', photoActivityCtrl)
  .controller('reportActivityCtrl', reportActivityCtrl)
  .directive('inputBar', () => new InputBarDirective)

  .service('weatherService', WeatherService)
  .service('uploadService', UploadService)
  .service('storeService', StoreService)
  .service('wechatService', WechatService)
  .service('userService', UserService);
moment.locale('zh-cn');
