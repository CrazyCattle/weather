export default function rotate() {
  var rotate;

  rotate = function() {
    return $('.content_broadcast:first-child').fadeOut(400, 'swing', function() {
      return $('.content_broadcast:first-child').appendTo('#broadcast_container').hide();
    }).fadeIn(400, 'swing');
  };

  // timeline = setInterval(rotate, 1200);

  // $('body').hover(function() {
  //   return clearInterval(timeline);
  // });

  $('.content_broadcast').click(function() {
    return rotate();
  });
}
