// import baidumap from './baidumap.js';
import typhoon from './typhoon.js';
import mycity from './mycity.js';


const HomeController = ($scope) => {
  $scope.name = 'test';
  typhoon();
  // myevn();
};

const mycityController = ($scope) => {
  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      slidesPerView: 'auto',
      paginationClickable: true,
      spaceBetween: 30
  });
  mycity();
}

// const myevcController = ($scope) => {
//
// }

export default HomeController;
export default mycityController;
// export default parentController;
