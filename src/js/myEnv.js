const myevcController = ($scope, $http, $state, $rootScope, wechatService, userService) => {
  userService.validateUrl($state);
  wx.ready(() => {
    wechatService.share('气象众包！人人都是播报员', '来自气象爱好者测量的天气地图', 'http:/wechat.daguchuangyi.com/img/i_test.png', 'http://wechat.daguchuangyi.com/#/measure/mycity');
  });
  let index = 0;
  $rootScope.clickNum = 1;

  // 判断用户设备情况
  // $http.get('http://139.196.210.102:8083/v1/device')
  // .success((data) => {
  //   console.log(data);
  // })
  // .error((data) => {
  //   console.log(data);
  //   if (data.mesg === '用户还未购买设备!') {
  //     $state.go('measure.bindSemd');
  //   }
  // });
  userService.validateUrl().then((data) => {
    console.log(userService.s_token);
    $http.get('http://139.196.210.102:8083/v1/env/history', {
      'headers': {
        'Authorization': userService.s_token,
      },
    }).success((data) => {
      console.log(data);
      for (let i = 0; i * 4 < data.length; i++) {
        var temp = parseInt(data[i * 4].temp);
        if (data[i * 4].usefulness == 0) {
          temp = creatData(data, temp, 'temp');
          if (temp == 9999) {
            console.log("暂无您的相关历史数据");
            break;
          }
        }
        var humi = parseInt(data[i * 4].humi);
        if (data[i * 4].usefulness == 0) {
          humi = creatData(data, humi, 'humi');
        }
        var pres = parseInt(data[i * 4].pres);
        if (data[i * 4].usefulness == 0) {
          pres = creatData(data, pres, 'pres');
        }
        var uv = parseInt(data[i * 4].uvIn);
        if (data[i * 4].usefulness == 0) {
          uv = creatData(data, uv, 'uvIn');
        }
        temps[i] = temp;
        humis[i] = humi;
        press[i] = pres;
        uvs[i] = uv;
      }
      // drawChart("canvas-temperature", "canvas-temperature-dashed", "#f89ba4", temps, -5, 45, "temp");
      // drawChart("canvas-pressure", "canvas-pressure-dashed", "#D3DB68", humis, 900, 1100, "humi");
      // drawChart("canvas-humidity", "canvas-humidity-dashed", "#44D0E3", press, 1, 100, "pres");
      // drawChart("canvas-uv", "canvas-uv-dashed", "#E35287", uvs, 1, 5, "uv");
    }).error((data) => {
      console.log(data);
    });
  });

  const swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: '1.3',
    speed: 600,
    centeredSlides: true,
    spaceBetween: 10,
    paginationClickable: true,
    // paginationType : 'progress',
  });

  var temps = [];
  var humis = [];
  var press = [];
  var uvs = [];
  function drawChart(elementID, dashedId, color, datas, minY, maxY, type) {
    const c = document.getElementById(elementID);
    const cDashed = document.getElementById(dashedId);

    if (c.getContext) {
      var weatherArray = datas;
      var pointColor = color;  // the color of the point
      var bezierColor = color; // The color of the bezier curve
      var bgColor = color;  // The top of the gradient color
      var textColor = color; // the color of the text
      var dashedColor = color; // the color of the dashed
      var textSize = "14px regular"; // text size tip:can add text font behind of the "14px ==>(here)"
      var aim = 0; // need draw dashed location
      var distance = 1 / 3; // control top and  bottom distance
      var cxt = c.getContext("2d");
      var cxtDashed = cDashed.getContext("2d");
      var width = c.clientWidth;
      var height = c.clientHeight;
      c.width = width;
      c.height = height;
      cDashed.width = width;
      cDashed.height = height;

      var height = c.clientHeight;
      var firstClick = true;

      getYScope();
      var oneX = width / (weatherArray.length);
      var oneY = height / ((maxY - minY) + (maxY - minY) * distance); // Each of the Y ratio
      var testArray = [];
      for (var i = 0; i < weatherArray.length; i++) {
        testArray.push([oneX * i + oneX / 2, (maxY - weatherArray[i]) * oneY + (maxY - minY) * distance * oneY - 5]);
      }
      var dashed = {
        startX: 30,
        startY: 30,
        stopY: height,
        vy: 1,
        aim: aim,
        draw: function (cxt) {
          var dashedLength = dashed.stopY - dashed.startY;
          var draw = true;
          var pointLength = 3;
          for (var i = 0; i < dashedLength / pointLength; i++) {
            if (draw) {
              cxt.beginPath();
              cxt.strokeStyle = dashedColor;
              cxt.moveTo(testArray[dashed.aim][0], testArray[dashed.aim][1] + pointLength * i);
              cxt.lineTo(testArray[dashed.aim][0], testArray[dashed.aim][1] + pointLength + pointLength * i);
              cxt.stroke();
              draw = false;
            } else {
              draw = true;
            }
          }
          cxt.closePath();
          cxt.beginPath();
          cxt.arc(testArray[dashed.aim][0], testArray[dashed.aim][1], 4, 0, Math.PI * 2, true);
          cxt.fillStyle = color;
          cxt.fill();
          cxt.closePath();
          cxt.beginPath();
          cxt.arc(testArray[dashed.aim][0], testArray[dashed.aim][1], 2, 0, Math.PI * 2, true);
          cxt.fillStyle = "#ffffff";
          cxt.fill();
          if (type == "temp") {
            drawText(cxt, weatherArray[dashed.aim] + "°", testArray[dashed.aim][0] - 4, testArray[dashed.aim][1], true);
          } else if (type == "pres") {
            drawText(cxt, weatherArray[dashed.aim] + "", testArray[dashed.aim][0] - 4, testArray[dashed.aim][1], true);
          } else if (type == "humi") {
            drawText(cxt, weatherArray[dashed.aim] + "", testArray[dashed.aim][0] - 4, testArray[dashed.aim][1], true);
          } else if (type == "uv") {
            drawText(cxt, weatherArray[dashed.aim] + "", testArray[dashed.aim][0] - 4, testArray[dashed.aim][1], true);
          }
        }
      };
      drawBg(cxt, testArray, bgColor);
      for (var i = 0; i < testArray.length; i++) {
        if (i != testArray.length - 1) {
          drawBezier(cxt, bezierColor, testArray[i][0], testArray[i][1], testArray[i + 1][0], testArray[i + 1][1]);
        }
      }
    } else {
      // canvas-unsupported code here
    }
    cDashed.addEventListener('click', function (e) {
      getEventPosition(e);
    }, false);

    function getEventPosition(ev) {
      var x, y;
      if (ev.layerX || ev.layerY == 0) {
        x = ev.layerX;
        y = ev.layerY;
      } else if (ev.offsetX || ev.offsetY == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
      }
      whoAndWhere(x);
      return {x: x, y: y};
    }
    function whoAndWhere(x) {
      var ratio = parseInt(x / oneX);
      //console.info("|?|?|?|?|" + ratio);
      if (0 < ratio && ratio < 7) { //chart1
        initDashed(ratio);
      } else if (-6 < ratio && ratio < 1) { //chart2
        initDashed(ratio+6);
      } else if (-13 < ratio && ratio < -6) { //chart3
        initDashed(ratio+13);
      } else if (-20 < ratio && ratio < -13) { //chart4
        initDashed(ratio+20);
      }
    }

    function initDashed(location) {
      if (!firstClick) {
        var animation;
        dashed.aim = location - 1;
        function drawMyDashed() {
          cxtDashed.clearRect(0, 0, width, height);
          dashed.startX += dashed.vy;
          dashed.startY += dashed.vy;
          dashed.draw(cxtDashed);
          animation = window.requestAnimationFrame(drawMyDashed);
          if (dashed.startX = testArray[location][0]) {
            window.cancelAnimationFrame(animation);
          }
        }
        drawMyDashed();
      } else {
        if (location > 0 && location < testArray.length + 1) {
          cxtDashed.clearRect(0, 0, width * 4 / 3, height * 4 / 3);
          dashed.startX = testArray[location - 1][0];
          dashed.startY = testArray[location - 1][1];
          dashed.aim = location - 1;
          dashed.draw(cxtDashed);
        }
      }
    }

    function getYScope() {
      maxY = weatherArray[0];
      minY = weatherArray[0];
      for (var i = 0; i < weatherArray.length - 1; i++) {
        if (minY > weatherArray[i + 1]) {
          minY = weatherArray[i + 1];
        }
        if (maxY < weatherArray[i + 1]) {
          maxY = weatherArray[i + 1];
        }
      }
    }

    // draw point
    function drawPoint(cxt, color, drawX, drawY, isSolid) {
      cxt.fillStyle = color;
      if (!isSolid) {
        cxt.beginPath();
        cxt.arc(drawX, drawY, 4, 0, Math.PI * 2, true);
        cxt.fill();
        cxt.closePath();
        cxt.beginPath();
        cxt.fillStyle = "#ffffff";
        cxt.arc(drawX, drawY, 2, 0, Math.PI * 2, true);
        cxt.fill();
      } else {
        cxt.beginPath();
        cxt.fillStyle = color;
        cxt.arc(drawX, drawY, 3, 0, Math.PI * 2, true);
        cxt.fill();
      }
      cxt.closePath();
    }

    // draw text
    function drawText(cxt, text, drawX, drawY, isUpInfo) {
      cxt.beginPath();
      cxt.fillStyle = textColor;
      cxt.font = textSize;
      if (isUpInfo) {
        cxt.fillText(text, drawX, drawY - 10);
      } else {
        cxt.fillText(text, drawX, drawY + 20);
      }
      cxt.closePath();
    }

    // draw bezierLine
    function drawBezier(cxt, color, startX, startY, stopX, stopY) {
      cxt.beginPath();
      //line color
      cxt.strokeStyle = color;
      cxt.lineWidth = 2;
      cxt.moveTo(startX, startY);
      cxt.bezierCurveTo((stopX - startX) / 2 + startX, startY, (stopX - startX) / 2 + startX, stopY, stopX, stopY);
      cxt.stroke();
      cxt.closePath();
    }

    // draw bg
    function drawBg(cxt, array, startColor) {
      cxt.beginPath();
      var my_gradient = cxt.createLinearGradient(0, 0, 0, height);
      //bg gradient color
      my_gradient.addColorStop(0, startColor);
      my_gradient.addColorStop(1, 'rgba( 255, 255, 255, 0 )');
      cxt.fillStyle = my_gradient;
      cxt.moveTo(testArray[testArray.length - 1][0], height + 4);
      cxt.lineTo(oneX / 2, height + 4);
      cxt.lineTo(array[0][0], array[0][1]);
      //cxt.lineTo(array[array.length-1][0],array[array.length-1][1]);
      for (var i = 0; i < array.length; i++) {
        if (i == array.length - 1) {

        } else {
          cxt.bezierCurveTo((array[i + 1][0] - array[i][0]) / 2 + array[i][0], array[i][1],
            (array[i + 1][0] - array[i][0]) / 2 + array[i][0], array[i + 1][1],
            array[i + 1][0], array[i + 1][1]);
        }
      }
      cxt.lineTo(testArray[testArray.length - 1][0], height + 4);
      cxt.fill();
    }

    // draw dashed line
    function drawDashed(cxt, startX, startY, stopY) {
      var dashedLength = stopY - startY;
      var draw = true;
      var pointLength = 3;
      // /2 is 2px
      for (var i = 0; i < dashedLength / pointLength; i++) {
        if (draw) {
          cxt.beginPath();
          cxt.strokeStyle = dashedColor;
          cxt.moveTo(startX, startY + pointLength * i);
          cxt.lineTo(startX, startY + pointLength + pointLength * i);
          cxt.stroke();
          draw = false;
        } else {
          draw = true;
        }
      }
      cxt.closePath();
    }
  }
  userService.validateUrl().then((data) => {
    $http.get('http://139.196.210.102:8083/v1/device/person/realtime', {
      'headers': {
        'Authorization': userService.s_token,
      },
    }).success((d) => {
      console.log(d);
      if (d.status === 'success') {
        $scope.humidity = d.data.humidity;
        $scope.pressure = d.data.pressure;
        $scope.temperature = d.data.temperature;
        $scope.uvIndex = Number(d.data.uvIndex);
      } else {
        $scope.humidity = '——';
        $scope.pressure = '——';
        $scope.temperature = '——';
        $scope.uvIndex = '——';
      }
    }).error((d) => {
      console.log(d);
    });
  });
};

// creat random Number
function random(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

// if data missing
function creatData(data, item, itemName) {
  for (let j = 0; j < data.length; j++) {
    if (data[j].usefulness != 0) {
      if ("temp" == itemName) {
        item = parseInt(data[j].temp);
        item = item + random(-2, 2);
      } else if ("pres" == itemName) {
        item = parseInt(data[j].pres);
        item = item + random(-3, 3);
      } else if ("humi" == itemName) {
        item = parseInt(data[j].humi);
        item = item + random(-8, 8);
        if (item > 100) {
          item = item - 8;
        } else if (item < 0) {
          item = item + 8;
        }
      } else if ("uvIn" == itemName) {
        item = parseInt(data[j].uvIn);
        item = item + random(-1, 1);
        if (item > 5) {
          item = item - 1;
        } else if (item < 0) {
          item = item + 1;
        }
      }
      break;
    }
    if (j == data.length - 1) {
      item = 9999;
    }
  }
  if (item == 9999) {
    console.log("暂无您的历史数据!");
  }
  return item;
}
export default myevcController;
