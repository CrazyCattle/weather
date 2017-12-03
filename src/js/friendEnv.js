const MyfriendevcController = ($scope, $rootScope) => {
  document.title = '好友天气';
  console.log($rootScope.friendData);
  let index = 0;
  const swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: '1.3',
    speed: 600,
    centeredSlides: true,
    spaceBetween: 10,
    paginationClickable: true,
  });
};

export default MyfriendevcController;
