import map from './lib/mycity.js';

const searchCityController = ($scope, $http, $state, $rootScope) => {
  map('searchcity', [], []);

  $scope.backtophoto = ()=>{
    console.log(window.localStorage.value);
    const coord = window.localStorage.value;
    $state.go('photograph');
  }

};

export default searchCityController;
