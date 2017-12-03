export default function (elementID, dashedId, color, datas, upDistance, downDistance, type) {
  if ("aqi" == type) {
    datas.push(random(-2, 2) + datas[datas.length - 1]);
    datas.unshift(random(-2, 2) + datas[0]);
    var datalist = document.getElementById("datalist");
    if (screen.width < 375) {
      console.log(datalist);
      datalist.style.cssText="bottom: 85px;";
    }else if (screen.width > 400) {
      datalist.style.cssText="bottom: 10px;";
    } else {
      datalist.style.cssText="bottom: 30px;";
    }
    //const svgDiv = document.getElementById('Page-1');
    //const svgDadDiv = document.getElementById('canvas_svg');
    //var svgHeight = svgDiv.getBoundingClientRect().height;
    var svgHeight = ($(window).width() - 50) * 0.865;
    console.log('svgHeight', svgHeight,'123123');

  }
  const c = document.getElementById(elementID);
  const cDashed = document.getElementById(dashedId);

  if (c.getContext) {
    var weatherArray = [];
    //might regulate attribute
    //*****************************************************************************************//
    //test data  ��������
    if ("pressure" == type) {
      weatherArray = [1020, 1026, 1021, 1013, 1021, 1026, 1020];
    } else if ("wind" == type) {
      //weatherArray = [1045, 1050, 1060, 1040, 1030,1070, 1060, 1045];
      weatherArray = [45, 40, 33, 51, 33, 36, 43];

    } else if ("nextRain" == type) {
      //weatherArray = [1045, 1050, 1060, 1040, 1030,1070, 1060, 1045];
      weatherArray = datas;
      //weatherArray = [0, 0, 2, 0, 16, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0];
    } else if ("aq" == type || "aqi" == type) {
      //weatherArray = [59, 45, 66, 45, 76, 50,59];
      weatherArray = datas;

    } else {
      weatherArray = [32, 30, 25, 26, 32, 35, 30];
    }
    //var weatherArray = datas;

    var pointColor = color;  //the color of the point
    var bezierColor = color; //The color of the bezier curve
    var bgColor = color;  //The top of the gradient color
    var textColor = color; //the color of the text
    var dashedColor = color; //the color of the dashed
    var textSize = "26px regular"; //text size tip:can add text font behind of the "14px ==>(here)"
    var aim = 0; //need draw dashed location
    // *****************************************************************************************//

    var cxt = c.getContext("2d");
    var cxtDashed = cDashed.getContext("2d");
    var width = c.clientWidth;
    var height = c.clientHeight;
    var ratio = 1;
    c.width = width * ratio;
    c.height = height * ratio;
    cDashed.width = width * ratio;
    cDashed.height = height * ratio;

    cxtDashed.clearRect(0, 0, width, height);
    cxt.clearRect(0, 0, width, height);

    var firstClick = true;

    var maxY = weatherArray[0];
    var minY = weatherArray[0];
    getYScope(type);
    if ("aqi" == type) {
      maxY = svgHeight;
      minY = 0;
    }
    if ("nextRain" == type) {
      maxY = 16;
      minY = 0;
    }
    var oneX = width / (weatherArray.length - 1 );
    var oneY;
    if ("nextRain" == type) {
      var heightZoom = height*3/5;
      oneY = heightZoom / (maxY - minY); // Each of the Y ratio*
      //oneY = oneY / 4;
    } else if ("aqi" == type) {
      oneY = height / ((maxY - minY));
    } else {
      oneY = height / ((maxY - minY) + (maxY - minY) * upDistance) / 2; // Each of the Y ratio
    }

    //there test data(7true + 2false)
    var testArray = [];
    for (var i = 0; i < weatherArray.length; i++) {
      //+ ��  \\ - ��

      if ("aqi" == type) {
        if (screen.width < 375) {
          testArray.push([oneX * i, height - (weatherArray[i] * oneY/2) -(height/2-svgHeight)*2+20-10]);
        }else if (screen.width > 400) {
          testArray.push([oneX * i, height - (weatherArray[i] * oneY/1.2) -(height/2-svgHeight)*2+20-15]);
        } else {
          testArray.push([oneX * i, height - (weatherArray[i] * oneY/1.5) -(height/2-svgHeight)*2+20-20]);
        }
        console.log(height,svgHeight);
      } else if ("nextRain" == type) {
        testArray.push([oneX * i, heightZoom - (weatherArray[i]*oneY)+height/5]);
      } else {
        testArray.push([oneX * i, (maxY - weatherArray[i]) * oneY + (maxY - minY) * upDistance * oneY - downDistance]);
      }

    }
    var dashed = {
      startX: 30,
      startY: 30,
      stopY: height,
      vy: 1,
      aim: aim,
      draw: function (cxt) {
        var dashedLength;
        if (type != "aq") {
          dashedLength = dashed.stopY - dashed.startY - 110;
        } else {
          dashedLength = dashed.stopY - dashed.startY - 180;
        }
        var draw = true;
        var pointLength = 6;
        // /2 is 2px
        if ("speed" == type || "aq" == type || "aqi" == type) {
          for (var i = 0; i < dashedLength / pointLength; i++) {
            if (draw) {
              cxt.beginPath();
              cxt.strokeStyle = dashedColor;
              cxt.lineWidth = 4;
              cxt.moveTo(testArray[dashed.aim][0], testArray[dashed.aim][1] + pointLength * i);
              cxt.lineTo(testArray[dashed.aim][0], testArray[dashed.aim][1] + pointLength + pointLength * i);
              cxt.stroke();
              draw = false;
            } else {
              draw = true;
            }
          }
          cxt.closePath();
        }
        //point
        cxt.beginPath();
        cxt.arc(testArray[dashed.aim][0], testArray[dashed.aim][1], 9, 0, Math.PI * 2, true);
        cxt.fillStyle = color;
        cxt.fill();
        cxt.closePath();
        cxt.beginPath();
        cxt.arc(testArray[dashed.aim][0], testArray[dashed.aim][1], 5, 0, Math.PI * 2, true);
        cxt.fillStyle = "#ffffff";
        cxt.fill();
        cxt.closePath();
        if ("speed" == type) {
          drawText(cxt, weatherArray[dashed.aim] + "km/h", testArray[dashed.aim][0] - 30, testArray[dashed.aim][1], true);
        } else if ("pressure" == type) {
          drawText(cxt, weatherArray[dashed.aim] + "hpa", testArray[dashed.aim][0] - 30, testArray[dashed.aim][1], true);
        } else if ("wind" == type) {
          drawText(cxt, weatherArray[dashed.aim] + "m/s", testArray[dashed.aim][0] - 30, testArray[dashed.aim][1], true);
        } else if ("aq" == type || "aqi" == type) {
          drawText(cxt, weatherArray[dashed.aim], testArray[dashed.aim][0] - 15, testArray[dashed.aim][1], true);
        }
      }
    };

    if ("nextRain" == type) {
      drawLine(cxt, width, height, 4);
    }

    //*************************************************************************
    if("nextRain" == type){
      var controlSmooth = 0;
    }else if("aqi" == type){
      var controlSmooth = 5;
    }else{
      var controlSmooth = 5;
    }

    function test(array) {
      var s;
      var AbstractInterpolator, CubicInterpolator, Enum, LinearInterpolator, NearestInterpolator, PI, SincFilterInterpolator, Smooth, clipClamp, clipMirror, clipPeriodic, defaultConfig, getColumn, getType, isValidNumber, k, makeLanczosWindow, makeScaledFunction, makeSincKernel, normalizeScaleTo, shallowCopy, sin, sinc, v, validateNumber, validateVector,
        __hasProp = Object.prototype.hasOwnProperty,
        __extends = function (child, parent) {
          for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }

          ctor.prototype = parent.prototype;
          child.prototype = new ctor;
          child.__super__ = parent.prototype;
          return child;
        };

      Enum = {
        /*Interpolation methods
         */
        METHOD_NEAREST: 'nearest',
        METHOD_LINEAR: 'linear',
        METHOD_CUBIC: 'cubic',
        METHOD_LANCZOS: 'lanczos',
        METHOD_SINC: 'sinc',
        /*Input clipping modes
         */
        CLIP_CLAMP: 'clamp',
        CLIP_ZERO: 'zero',
        CLIP_PERIODIC: 'periodic',
        CLIP_MIRROR: 'mirror',
        /* Constants for control over the cubic interpolation tension
         */
        CUBIC_TENSION_DEFAULT: 0,
        CUBIC_TENSION_CATMULL_ROM: 0
      };

      defaultConfig = {
        method: Enum.METHOD_CUBIC,
        cubicTension: Enum.CUBIC_TENSION_DEFAULT,
        clip: Enum.CLIP_CLAMP,
        scaleTo: 0,
        sincFilterSize: 2,
        sincWindow: void 0
      };

      /*Index clipping functions
       */

      clipClamp = function (i, n) {
        return Math.max(0, Math.min(i, n - 1));
      };

      clipPeriodic = function (i, n) {
        i = i % n;
        if (i < 0) i += n;
        return i;
      };

      clipMirror = function (i, n) {
        var period;
        period = 2 * (n - 1);
        i = clipPeriodic(i, period);
        if (i > n - 1) i = period - i;
        return i;
      };

      /*
       Abstract scalar interpolation class which provides common functionality for all interpolators

       Subclasses must override interpolate().
       */

      AbstractInterpolator = (function () {

        function AbstractInterpolator(array, config) {
          this.array = array.slice(0);
          this.length = this.array.length;
          if (!(this.clipHelper = {
              clamp: this.clipHelperClamp,
              zero: this.clipHelperZero,
              periodic: this.clipHelperPeriodic,
              mirror: this.clipHelperMirror
            }[config.clip])) {
            throw "Invalid clip: " + config.clip;
          }
        }

        AbstractInterpolator.prototype.getClippedInput = function (i) {
          if ((0 <= i && i < this.length)) {
            return this.array[i];
          } else {
            return this.clipHelper(i);
          }
        };

        AbstractInterpolator.prototype.clipHelperClamp = function (i) {
          return this.array[clipClamp(i, this.length)];
        };

        AbstractInterpolator.prototype.clipHelperZero = function (i) {
          return 0;
        };

        AbstractInterpolator.prototype.clipHelperPeriodic = function (i) {
          return this.array[clipPeriodic(i, this.length)];
        };

        AbstractInterpolator.prototype.clipHelperMirror = function (i) {
          return this.array[clipMirror(i, this.length)];
        };

        AbstractInterpolator.prototype.interpolate = function (t) {
          throw 'Subclasses of AbstractInterpolator must override the interpolate() method.';
        };

        return AbstractInterpolator;

      })();

      NearestInterpolator = (function (_super) {

        __extends(NearestInterpolator, _super);

        function NearestInterpolator() {
          NearestInterpolator.__super__.constructor.apply(this, arguments);
        }

        NearestInterpolator.prototype.interpolate = function (t) {
          return this.getClippedInput(Math.round(t));
        };

        return NearestInterpolator;

      })(AbstractInterpolator);

      LinearInterpolator = (function (_super) {

        __extends(LinearInterpolator, _super);

        function LinearInterpolator() {
          LinearInterpolator.__super__.constructor.apply(this, arguments);
        }

        LinearInterpolator.prototype.interpolate = function (t) {
          var k;
          k = Math.floor(t);
          t -= k;
          return (1 - t) * this.getClippedInput(k) + t * this.getClippedInput(k + 1);
        };

        return LinearInterpolator;

      })(AbstractInterpolator);

      CubicInterpolator = (function (_super) {

        __extends(CubicInterpolator, _super);

        function CubicInterpolator(array, config) {
          this.tangentFactor = 1 - Math.max(0, Math.min(1, config.cubicTension));
          CubicInterpolator.__super__.constructor.apply(this, arguments);
        }

        CubicInterpolator.prototype.getTangent = function (k) {
          return this.tangentFactor * (this.getClippedInput(k + 1) - this.getClippedInput(k - 1)) / 2;
        };

        CubicInterpolator.prototype.interpolate = function (t) {
          var k, m, p, t2, t3;
          k = Math.floor(t);
          m = [this.getTangent(k), this.getTangent(k + 1)];
          p = [this.getClippedInput(k), this.getClippedInput(k + 1)];
          t -= k;
          t2 = t * t;
          t3 = t * t2;
          return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
        };

        return CubicInterpolator;

      })(AbstractInterpolator);

      sin = Math.sin, PI = Math.PI;

      sinc = function (x) {
        if (x === 0) {
          return 1;
        } else {
          return sin(PI * x) / (PI * x);
        }
      };

      makeLanczosWindow = function (a) {
        return function (x) {
          return sinc(x / a);
        };
      };

      makeSincKernel = function (window) {
        return function (x) {
          return sinc(x) * window(x);
        };
      };

      SincFilterInterpolator = (function (_super) {

        __extends(SincFilterInterpolator, _super);

        function SincFilterInterpolator(array, config) {
          SincFilterInterpolator.__super__.constructor.apply(this, arguments);
          this.a = config.sincFilterSize;
          if (!config.sincWindow) throw 'No sincWindow provided';
          this.kernel = makeSincKernel(config.sincWindow);
        }

        SincFilterInterpolator.prototype.interpolate = function (t) {
          var k, n, sum, _ref, _ref2;
          k = Math.floor(t);
          sum = 0;
          for (n = _ref = k - this.a + 1, _ref2 = k + this.a; _ref <= _ref2 ? n <= _ref2 : n >= _ref2; _ref <= _ref2 ? n++ : n--) {
            sum += this.kernel(t - n) * this.getClippedInput(n);
          }
          return sum;
        };

        return SincFilterInterpolator;

      })(AbstractInterpolator);

      getColumn = function (arr, i) {
        var row, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          row = arr[_i];
          _results.push(row[i]);
        }
        return _results;
      };

      makeScaledFunction = function (f, baseScale, scaleRange) {
        var scaleFactor, translation;
        if (scaleRange.join === '0,1') {
          return f;
        } else {
          scaleFactor = baseScale / (scaleRange[1] - scaleRange[0]);
          translation = scaleRange[0];
          return function (t) {
            return f(scaleFactor * (t - translation));
          };
        }
      };

      getType = function (x) {
        return Object.prototype.toString.call(x).slice('[object '.length, -1);
      };

      validateNumber = function (n) {
        if (isNaN(n)) throw 'NaN in Smooth() input';
        if (getType(n) !== 'Number') throw 'Non-number in Smooth() input';
        if (!isFinite(n)) throw 'Infinity in Smooth() input';
      };

      validateVector = function (v, dimension) {
        var n, _i, _len;
        if (getType(v) !== 'Array') throw 'Non-vector in Smooth() input';
        if (v.length !== dimension) throw 'Inconsistent dimension in Smooth() input';
        for (_i = 0, _len = v.length; _i < _len; _i++) {
          n = v[_i];
          validateNumber(n);
        }
      };

      isValidNumber = function (n) {
        return (getType(n) === 'Number') && isFinite(n) && !isNaN(n);
      };

      normalizeScaleTo = function (s) {
        var invalidErr;
        invalidErr = "scaleTo param must be number or array of two numbers";
        switch (getType(s)) {
          case 'Number':
            if (!isValidNumber(s)) throw invalidErr;
            s = [0, s];
            break;
          case 'Array':
            if (s.length !== 2) throw invalidErr;
            if (!(isValidNumber(s[0]) && isValidNumber(s[1]))) throw invalidErr;
            break;
          default:
            throw invalidErr;
        }
        return s;
      };

      shallowCopy = function (obj) {
        var copy, k, v;
        copy = {};
        for (k in obj) {
          if (!__hasProp.call(obj, k)) continue;
          v = obj[k];
          copy[k] = v;
        }
        return copy;
      };

      Smooth = function (arr, config) {
        var baseDomainEnd, dimension, i, interpolator, interpolatorClass, interpolators, k, n, properties, smoothFunc, v;
        if (config == null) config = {};
        properties = {};
        config = shallowCopy(config);
        properties.config = shallowCopy(config);
        if (config.scaleTo == null) config.scaleTo = config.period;
        if (config.sincFilterSize == null) {
          config.sincFilterSize = config.lanczosFilterSize;
        }
        for (k in defaultConfig) {
          if (!__hasProp.call(defaultConfig, k)) continue;
          v = defaultConfig[k];
          if (config[k] == null) config[k] = v;
        }
        if (!(interpolatorClass = {
            nearest: NearestInterpolator,
            linear: LinearInterpolator,
            cubic: CubicInterpolator,
            lanczos: SincFilterInterpolator,
            sinc: SincFilterInterpolator
          }[config.method])) {
          throw "Invalid method: " + config.method;
        }
        if (config.method === 'lanczos') {
          config.sincWindow = makeLanczosWindow(config.sincFilterSize);
        }
        if (arr.length < 2) throw 'Array must have at least two elements';
        properties.count = arr.length;
        smoothFunc = (function () {
          var _i, _j, _len, _len2;
          switch (getType(arr[0])) {
            case 'Number':
              properties.dimension = 'scalar';
              if (Smooth.deepValidation) {
                for (_i = 0, _len = arr.length; _i < _len; _i++) {
                  n = arr[_i];
                  validateNumber(n);
                }
              }
              interpolator = new interpolatorClass(arr, config);
              return function (t) {
                return interpolator.interpolate(t);
              };
            case 'Array':
              properties.dimension = dimension = arr[0].length;
              if (!dimension) throw 'Vectors must be non-empty';
              if (Smooth.deepValidation) {
                for (_j = 0, _len2 = arr.length; _j < _len2; _j++) {
                  v = arr[_j];
                  validateVector(v, dimension);
                }
              }
              interpolators = (function () {
                var _results;
                _results = [];
                for (i = 0; 0 <= dimension ? i < dimension : i > dimension; 0 <= dimension ? i++ : i--) {
                  _results.push(new interpolatorClass(getColumn(arr, i), config));
                }
                return _results;
              })();
              return function (t) {
                var interpolator, _k, _len3, _results;
                _results = [];
                for (_k = 0, _len3 = interpolators.length; _k < _len3; _k++) {
                  interpolator = interpolators[_k];
                  _results.push(interpolator.interpolate(t));
                }
                return _results;
              };
            default:
              throw "Invalid element type: " + (getType(arr[0]));
          }
        })();
        if (config.clip === 'periodic') {
          baseDomainEnd = arr.length;
        } else {
          baseDomainEnd = arr.length - 1;
        }
        config.scaleTo || (config.scaleTo = baseDomainEnd);
        properties.domain = normalizeScaleTo(config.scaleTo);
        smoothFunc = makeScaledFunction(smoothFunc, baseDomainEnd, properties.domain);
        properties.domain.sort();
        /*copy properties
         */
        for (k in properties) {
          if (!__hasProp.call(properties, k)) continue;
          v = properties[k];
          smoothFunc[k] = v;
        }
        return smoothFunc;
      };

      for (k in Enum) {
        if (!__hasProp.call(Enum, k)) continue;
        v = Enum[k];
        Smooth[k] = v;
      }

      Smooth.deepValidation = true;

      (typeof exports !== "undefined" && exports !== null ? exports : window).Smooth = Smooth;

      return Smooth(array, {
        method: Smooth.METHOD_LINEAR,
        clip: Smooth.CLIP_PERIODIC,
        cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
      });
    };
    var topArray = [];
    var topTip = [];
    var dataLocation = [];
    var finalData = [];

    function getMaxMinPoint(array, topArray, topTip) {

      for (var i = 0; i < array.length; i++) {
        if (i == 0) {
          topArray.push(array[0]);
          topTip.push("0");
          dataLocation.push(i);
        } else {
          if (array[i][1] - array[i - 1][1] < 0) {
            topTip.push("1");
          } else if (array[i][1] - array[i - 1][1] == 0) {
            topTip.push("0");
          } else {
            topTip.push("-1");
          }
        }

      }

      for (var i = 2; i < topTip.length - 1; i++) {
        if (topTip[i + 1] == topTip[i + 2] && topTip[i + 1] != topTip[i] || Math.abs(array[i][1] - array[i - 1][1]) > controlSmooth) {
          topArray.push(array[i]);
          dataLocation.push(i);
        }

      }
      topArray.push(array[array.length - 1]);
      dataLocation.push(i);
      topTip.push("0");

      var loseData = [];
      for (var i = 1; i < dataLocation.length; i++) {
        loseData.push(dataLocation[i] - dataLocation[i - 1]);
      }


      var paths = test(topArray);
      for (var i = 0; i < loseData.length; i++) {
        for (var j = 0; j < loseData[i]; j++) {
          finalData.push(paths(i + j * (1 / loseData[i])));
        }

      }
      finalData.push(testArray[testArray.length - 1]);
    };
    getMaxMinPoint(testArray, topArray, topTip, finalData);
    //**************************************************************************

    if ("speed" == type || "aq" == type || "aqi" == type) {
      //alert("ok");
      drawBg(cxt, testArray, bgColor);
    }

    for (var i = 0; i < testArray.length; i++) {
      if (i != testArray.length - 1) {
        if ("aq" == type) {
          drawBezier(cxt, bezierColor, testArray[i][0], testArray[i][1], testArray[i + 1][0], testArray[i + 1][1]);
        } else if ("aqi" == type) {
          drawBezier(cxt, aqiColor(weatherArray[i], svgHeight), testArray[i][0], testArray[i][1], testArray[i + 1][0], testArray[i + 1][1]);
          if (i != 0) {
            drawPoint(cxt, aqiColor(weatherArray[i], svgHeight), testArray[i][0], testArray[i][1], true, 6);
            drawText(cxt, weatherArray[i], testArray[i][0], testArray[i][1], true, 6);
          }
        } else {
          drawBezier(cxt, bezierColor, testArray[i][0], testArray[i][1], testArray[i + 1][0], testArray[i + 1][1]);
        }
      }
    }

  } else {
    // canvas-unsupported code here
  }


  cDashed.addEventListener('click', function (e) {
    //getEventPosition(e);

  }, false);

  //get canvas position
  function getEventPosition(ev) {
    var x, y;
    if (ev.layerX || ev.layerY == 0) {
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetY == 0) { // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }

    x = x - width / 4;
    whoAndWhere(x);
    return {x: x, y: y};
  }

  //chart click
  function whoAndWhere(x) {

    initDashed(Math.ceil(x / ((width / 2) / testArray.length)));

  }

  //remove old dashed and draw new dashed
  function initDashed(location) {
    if (!firstClick) {
      //dashed.startX = testArray[location - 1][0];
      //dashed.startY = testArray[location - 1][1];
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
      cxtDashed.clearRect(0, 0, width, height);
      dashed.startX = testArray[location - 1][0];
      dashed.startY = testArray[location - 1][1];
      dashed.aim = location - 1;
      dashed.draw(cxtDashed);
      //firstClick=false;
    }
    //cxt.clearRect(0, 0, width, height);
    //drawChart(elementID,color,parseInt(clickLocation/50)-1);
    //drawDashed(cxtDashed, testArray[clickLocation - 1][0], testArray[clickLocation - 1][1], height);
    //drawPoint(cxtDashed, pointColor, testArray[clickLocation-1][0], testArray[clickLocation-1][1], false);
    //drawText(cxtDashed, weatherArray[clickLocation-1] + "`", testArray[clickLocation-1][0] - 5, testArray[clickLocation-1][1], true);
  }

  function getYScope(itemName) {

    for (var i = 0; i < weatherArray.length - 1; i++) {
      if (minY > weatherArray[i + 1]) {
        minY = weatherArray[i + 1];
      }
      if (maxY < weatherArray[i + 1]) {
        maxY = weatherArray[i + 1];
      }

    }


  }

  //draw point
  function drawPoint(cxt, color, drawX, drawY, isSolid, size) {
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
      cxt.arc(drawX, drawY, size, 0, Math.PI * 2, true);
      cxt.fill();
    }
    cxt.closePath();
  }

  //draw text
  function drawText(cxt, text, drawX, drawY, isUpInfo) {
    cxt.beginPath();
    cxt.fillStyle = textColor;
    cxt.font = textSize;
    if (isUpInfo) {
      cxt.fillText(text, drawX, drawY - 25);
    } else {
      cxt.fillText(text, drawX, drawY + 25);
    }
    cxt.closePath();
  }

  //draw bezierLine
  function drawBezier(cxt, color, startX, startY, stopX, stopY, type) {

    cxt.beginPath();
    if (type == "dashed") {
      cxt.setLineDash([5]);
    }
    //line color
    cxt.strokeStyle = color;
    cxt.lineWidth = 6;
    cxt.moveTo(startX, startY);
    cxt.bezierCurveTo((stopX - startX) / 2 + startX, startY, (stopX - startX) / 2 + startX, stopY, stopX, stopY);
    cxt.stroke();
    cxt.closePath();
  }

  //draw bg
  function drawBg(cxt, array, startColor) {
    cxt.beginPath();
    var my_gradient = cxt.createLinearGradient(0, 0, 0, height);
    //bg gradient color 'rgba( 255, 255, 255, 0 )'
    my_gradient.addColorStop(0, startColor);
    if (type == "aqi") {
      my_gradient.addColorStop(.5, 'rgba( 255, 255, 255, 0 )');
    } else {
      my_gradient.addColorStop(.8, 'rgba( 255, 255, 255, 0 )');
    }
    cxt.fillStyle = my_gradient;
    cxt.moveTo(testArray[testArray.length - 1][0], height + 4);
    cxt.lineTo(array[0][0], height + 4);
    cxt.lineTo(array[0][0], array[0][1]);
    //cxt.lineTo(array[array.length-1][0],array[array.length-1][1]);
    for (var i = 0; i < array.length; i++) {
      if (i == array.length - 1) {

      } else {
        cxt.bezierCurveTo((array[i + 1][0] - array[i][0]) / 2 + array[i][0], array[i][1],
          (array[i + 1][0] - array[i][0]) / 2 + array[i][0], array[i + 1][1],
          array[i + 1][0], array[i + 1][1]);
      }
      //alert(array[i][0]);
    }
    cxt.lineTo(testArray[testArray.length - 1][0], height + 4);

    cxt.fill();
  }

  //draw dashed line
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

  function drawLine(cxt, width, height, num) {
    cxt.beginPath();
    cxt.strokeStyle = "#AAB4BF";
    cxt.lineWidth = 0.5;

    for (var i = num; i > 0; i--) {
      cxt.moveTo(0, height * i / (num + 1));
      cxt.lineTo(width, height * i / (num + 1));
    }
    cxt.stroke();
    cxt.closePath();
  }

  //creat random Number
  function random(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }


  function aqiColor(aqi, height) {
    var ratio = height / 7;
    ratio = 50;
    if (aqi < ratio) {
      return "#64CD00";
    } else if (aqi >= ratio && aqi < ratio * 2) {
      return "#F7E400";
    } else if (aqi >= ratio * 2 && aqi < ratio * 3) {
      return "#FD8900";
    } else if (aqi >= ratio * 3 && aqi < ratio * 4) {
      return "#E02B00";
    } else if (aqi >= ratio * 4 && aqi < ratio * 5) {
      return "#B62CBD";
    } else if (aqi >= ratio * 5 && aqi < ratio * 7) {
      return "#701775";
    } else {
      return "#000000"
    }

  }
}
