export default function (elementID, DashedID, upDistance, downDistance, data, color) {
  const c = document.getElementById(elementID);
  const cDashed = document.getElementById(DashedID);

  data.push([random(-2,2)+data[data.length-1][0],random(-2,2)+data[data.length-1][1]]);

  if (c.getContext) {
    //might regulate attribute
    //*****************************************************************************************//
    //test data  ↓↓↓↓
    //var weatherArray = [[-12, 2],[-12, 2],[-12, 2],[-12, 2],[-12, 2],[-12, 2],[-12, 2],[-12, 2],[-12, 2],[-12, 2]];
    //var weatherArray = [[-2, 12],[-3, 5],[-5, 11],[3, 8],[2, 7],[8, 12],[-6, 4],[0, 8],[-2, 6],[-3, 10]];

    var weatherArray = data;
    var pointColor = color;  //the color of the point
    var bezierColor = color; //The color of the bezier curve
    var bgColor = color;  //The top of the gradient color
    var bgColor2 = color; //The top of the gradient color
    var textColor = color; //the color of the text
    var dashedColor = color; //the color of the dashed
    var textSize = "26px regular"; //text size tip:can add text font behind of the "14px ==>(here)"
    var aim = 0;
    var smooth = 1;
    var cha = 20;
    // *****************************************************************************************//
    var maxY = 40; //max y coordinate
    var minY = 0;  //min y coordinate
    var cxt = c.getContext("2d");
    var cxtDashed = cDashed.getContext("2d");

    var width = c.clientWidth;

    var height = c.clientHeight;
    c.width = width;
    c.height = height;
    cDashed.width = width;
    cDashed.height = height;
    getYScope();

    cxt.fillStyle="#F9F9FA";
    cxt.fillRect(0,0,width,height);

    var oneX = width / (weatherArray.length-2);
    var oneY = height / ((maxY - minY) + (maxY - minY) * upDistance) / 2;

    var testArray = [];
    var testArray1 = [];
    for (var i = 0; i < weatherArray.length; i++) {
      if (i == 0) {
        testArray.push([oneX * i, (maxY - weatherArray[i][1]) * oneY*2/3 + (maxY - minY) * upDistance * oneY - downDistance]);
        testArray1.push([oneX * i, (maxY - weatherArray[i][0]) * oneY*2/3 + (maxY - minY) * upDistance * oneY - downDistance-cha]);
      }else {
        testArray.push([oneX * i-oneX/2, (maxY - weatherArray[i][1]) * oneY*2/3 + (maxY - minY) * upDistance * oneY - downDistance]);
        testArray1.push([oneX * i-oneX/2, (maxY - weatherArray[i][0]) * oneY*2/3 + (maxY - minY) * upDistance * oneY - downDistance-cha]);
      }
    }

    var dashed = {
      startX: 30,
      startY: 30,
      stopx: 80,
      stopY: 80,
      vy: 1,
      aim: aim,
      draw: function (cxt) {
        var dashedLength = dashed.stopY - dashed.startY;
        var draw = true;
        var pointLength = 3;
        // /2 is 2px
        cxtDashed.clearRect(0, 0, width, height);
        if(aim==1){
          drawDashed(cxt, finalData[aim][0]-30, finalData[aim][1], testArray1[aim][1]);
          drawPoint(cxt, pointColor, finalData[aim][0]-30, finalData[aim][1]+3, false);
          drawPoint(cxt, pointColor, finalData[aim][0]-30, testArray1[aim][1], true);
        }else if(aim==2||aim==3){
          drawDashed(cxt, finalData[aim][0], finalData[aim][1], testArray1[aim][1]);
          drawPoint(cxt, pointColor, finalData[aim][0], finalData[aim][1]+3, false);
          drawPoint(cxt, pointColor, finalData[aim][0], testArray1[aim][1], true);
        }else{
          drawDashed(cxt, finalData[aim][0], finalData[aim][1], testArray1[aim][1]);
          drawPoint(cxt, pointColor, finalData[aim][0], finalData[aim][1], false);
          drawPoint(cxt, pointColor, finalData[aim][0], testArray1[aim][1], true);
        }

      }
    };


    //*************************************************************************
    var controlSmooth = 20;
    function test(array) {
      var s;
      var AbstractInterpolator, CubicInterpolator, Enum, LinearInterpolator, NearestInterpolator, PI, SincFilterInterpolator, Smooth, clipClamp, clipMirror, clipPeriodic, defaultConfig, getColumn, getType, isValidNumber, k, makeLanczosWindow, makeScaledFunction, makeSincKernel, normalizeScaleTo, shallowCopy, sin, sinc, v, validateNumber, validateVector,
        __hasProp = Object.prototype.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

      clipClamp = function(i, n) {
        return Math.max(0, Math.min(i, n - 1));
      };

      clipPeriodic = function(i, n) {
        i = i % n;
        if (i < 0) i += n;
        return i;
      };

      clipMirror = function(i, n) {
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

      AbstractInterpolator = (function() {

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

        AbstractInterpolator.prototype.getClippedInput = function(i) {
          if ((0 <= i && i < this.length)) {
            return this.array[i];
          } else {
            return this.clipHelper(i);
          }
        };

        AbstractInterpolator.prototype.clipHelperClamp = function(i) {
          return this.array[clipClamp(i, this.length)];
        };

        AbstractInterpolator.prototype.clipHelperZero = function(i) {
          return 0;
        };

        AbstractInterpolator.prototype.clipHelperPeriodic = function(i) {
          return this.array[clipPeriodic(i, this.length)];
        };

        AbstractInterpolator.prototype.clipHelperMirror = function(i) {
          return this.array[clipMirror(i, this.length)];
        };

        AbstractInterpolator.prototype.interpolate = function(t) {
          throw 'Subclasses of AbstractInterpolator must override the interpolate() method.';
        };

        return AbstractInterpolator;

      })();

      NearestInterpolator = (function(_super) {

        __extends(NearestInterpolator, _super);

        function NearestInterpolator() {
          NearestInterpolator.__super__.constructor.apply(this, arguments);
        }

        NearestInterpolator.prototype.interpolate = function(t) {
          return this.getClippedInput(Math.round(t));
        };

        return NearestInterpolator;

      })(AbstractInterpolator);

      LinearInterpolator = (function(_super) {

        __extends(LinearInterpolator, _super);

        function LinearInterpolator() {
          LinearInterpolator.__super__.constructor.apply(this, arguments);
        }

        LinearInterpolator.prototype.interpolate = function(t) {
          var k;
          k = Math.floor(t);
          t -= k;
          return (1 - t) * this.getClippedInput(k) + t * this.getClippedInput(k + 1);
        };

        return LinearInterpolator;

      })(AbstractInterpolator);

      CubicInterpolator = (function(_super) {

        __extends(CubicInterpolator, _super);

        function CubicInterpolator(array, config) {
          this.tangentFactor = 1 - Math.max(0, Math.min(1, config.cubicTension));
          CubicInterpolator.__super__.constructor.apply(this, arguments);
        }

        CubicInterpolator.prototype.getTangent = function(k) {
          return this.tangentFactor * (this.getClippedInput(k + 1) - this.getClippedInput(k - 1)) / 2;
        };

        CubicInterpolator.prototype.interpolate = function(t) {
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

      sinc = function(x) {
        if (x === 0) {
          return 1;
        } else {
          return sin(PI * x) / (PI * x);
        }
      };

      makeLanczosWindow = function(a) {
        return function(x) {
          return sinc(x / a);
        };
      };

      makeSincKernel = function(window) {
        return function(x) {
          return sinc(x) * window(x);
        };
      };

      SincFilterInterpolator = (function(_super) {

        __extends(SincFilterInterpolator, _super);

        function SincFilterInterpolator(array, config) {
          SincFilterInterpolator.__super__.constructor.apply(this, arguments);
          this.a = config.sincFilterSize;
          if (!config.sincWindow) throw 'No sincWindow provided';
          this.kernel = makeSincKernel(config.sincWindow);
        }

        SincFilterInterpolator.prototype.interpolate = function(t) {
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

      getColumn = function(arr, i) {
        var row, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          row = arr[_i];
          _results.push(row[i]);
        }
        return _results;
      };

      makeScaledFunction = function(f, baseScale, scaleRange) {
        var scaleFactor, translation;
        if (scaleRange.join === '0,1') {
          return f;
        } else {
          scaleFactor = baseScale / (scaleRange[1] - scaleRange[0]);
          translation = scaleRange[0];
          return function(t) {
            return f(scaleFactor * (t - translation));
          };
        }
      };

      getType = function(x) {
        return Object.prototype.toString.call(x).slice('[object '.length, -1);
      };

      validateNumber = function(n) {
        if (isNaN(n)) throw 'NaN in Smooth() input';
        if (getType(n) !== 'Number') throw 'Non-number in Smooth() input';
        if (!isFinite(n)) throw 'Infinity in Smooth() input';
      };

      validateVector = function(v, dimension) {
        var n, _i, _len;
        if (getType(v) !== 'Array') throw 'Non-vector in Smooth() input';
        if (v.length !== dimension) throw 'Inconsistent dimension in Smooth() input';
        for (_i = 0, _len = v.length; _i < _len; _i++) {
          n = v[_i];
          validateNumber(n);
        }
      };

      isValidNumber = function(n) {
        return (getType(n) === 'Number') && isFinite(n) && !isNaN(n);
      };

      normalizeScaleTo = function(s) {
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

      shallowCopy = function(obj) {
        var copy, k, v;
        copy = {};
        for (k in obj) {
          if (!__hasProp.call(obj, k)) continue;
          v = obj[k];
          copy[k] = v;
        }
        return copy;
      };

      Smooth = function(arr, config) {
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
        smoothFunc = (function() {
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
              return function(t) {
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
              interpolators = (function() {
                var _results;
                _results = [];
                for (i = 0; 0 <= dimension ? i < dimension : i > dimension; 0 <= dimension ? i++ : i--) {
                  _results.push(new interpolatorClass(getColumn(arr, i), config));
                }
                return _results;
              })();
              return function(t) {
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
        method: Smooth.METHOD_LINEAR  ,
        clip: Smooth.CLIP_PERIODIC,
        cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
      });
    };
    var topArray =[];
    var topTip=[];
    var dataLocation=[];
    var finalData = [];
    function getMaxMinPoint(array,topArray,topTip){

      for(var i = 0;i<array.length;i++){
        if (i == 0) {
          topArray.push(array[0]);
          topTip.push("0");
          dataLocation.push(i);
        }else{
          if (array[i][1] - array[i - 1][1] < 0) {
            topTip.push("1");
          }else if(array[i][1] - array[i - 1][1] == 0){
            topTip.push("0");
          }else{
            topTip.push("-1");
          }
        }

      }

      for(var i = 2;i<topTip.length-1;i++){
        if (topTip[i + 1] == topTip[i + 2]&&topTip[i + 1] != topTip[i]||Math.abs(array[i][1]-array[i-1][1])>controlSmooth) {
          topArray.push(array[i]);
          dataLocation.push(i);
        }

      }
      topArray.push(array[array.length-1]);
      dataLocation.push(i);
      topTip.push("0");

      var loseData=[];
      for(var i = 1;i<dataLocation.length;i++){
        loseData.push(dataLocation[i]-dataLocation[i-1]);
      }



      var paths = test(topArray);
      for(var i = 0;i<loseData.length;i++){
        for(var j = 0;j<loseData[i];j++){
          finalData.push(paths(i+j*(1/loseData[i])));
        }

      }
      finalData.push(testArray[testArray.length-1]);
    };
    getMaxMinPoint(testArray,topArray,topTip,finalData);
    //**************************************************************************
    cDashed.addEventListener('click', function (e) {
      getEventPosition(e);

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
      aim = Math.round(x / ((width / 2) /(testArray.length-1)/2)) ;
      if(aim==1){

      }else if(aim==testArray.length*2-1){
        aim = aim-1;
      }else{
        if(aim%2!=0&&aim<=9){
          aim = aim+1;
          aim=aim/2;
        }else if(aim%2!=0&&aim>9){
          if(aim>=21){
            aim = aim+1;
            aim=aim/2;
            aim-=1;
          }else{
            aim = aim+1;
            aim=aim/2;
          }
        }else{

          aim=aim/2;
        }
      }
      if(screen.width>375){
        aim = aim-1;
      }else if(screen.width<375){
        aim = aim+1;
      }
      if(aim!=0&&aim!=testArray.length-1) {
        dashed.draw(cxtDashed);
      }
      return {x: x, y: y};
    }


    aim = 2;
    dashed.draw(cxtDashed);



    drawBg(cxt, topArray, bgColor,1);
    drawBg(cxt, testArray1, bgColor2,0.7);


    for (var i = 0; i < topArray.length; i++) {
      if (i < topArray.length - 1) {
        drawBezier(cxt, bezierColor, topArray[i][0], topArray[i][1], topArray[i + 1][0], topArray[i + 1][1], i);
      }
    }
    for (var i = 0; i < finalData.length; i++) {
      if (i != 0&&i != finalData.length - 1) {
        if(i==1){
          drawText(cxt, weatherArray[i][0] + "°", finalData[i][0] - 43, testArray1[i][1], false);
          drawText(cxt, weatherArray[i][1] + "°", finalData[i][0] -43, finalData[i][1], true);
        }else if(i==2){
          drawText(cxt, weatherArray[i][0] + "°", finalData[i][0] - 20, testArray1[i][1], false);
          drawText(cxt, weatherArray[i][1] + "°", finalData[i][0] -20, finalData[i][1], true);
        }else{
          drawText(cxt, weatherArray[i][0] + "°", finalData[i][0] - 10, testArray1[i][1], false);
          drawText(cxt, weatherArray[i][1] + "°", finalData[i][0] - 10, finalData[i][1], true);
        }
      }
    }

  } else {
    // canvas-unsupported code here
  }
  function getYScope() {
    maxY = weatherArray[0][1];
    minY = weatherArray[0][0];
    for (var i = 0; i < weatherArray.length - 1; i++) {
      if (minY > weatherArray[i + 1][0]) {
        minY = weatherArray[i + 1][0];
      }
      if (maxY < weatherArray[i + 1][0]) {
        maxY = weatherArray[i + 1][0];
      }

    }


  }

  //draw point
  function drawPoint(cxt, color, drawX, drawY, isSolid) {

    cxt.fillStyle = color;
    if (!isSolid) {
      cxt.beginPath();
      cxt.arc(drawX, drawY, 12, 0, Math.PI * 2, true);
      cxt.fill();
      cxt.closePath();
      cxt.beginPath();
      cxt.fillStyle = "#ffffff";
      cxt.arc(drawX, drawY, 6, 0, Math.PI * 2, true);
      cxt.fill();
    } else {
      cxt.beginPath();
      cxt.fillStyle = color;
      cxt.arc(drawX, drawY, 8, 0, Math.PI * 2, true);
      cxt.fill();
    }
    cxt.closePath();
  }

  //draw text
  function drawText(cxt, text, drawX, drawY, isUpInfo) {
    cxt.beginPath();
    cxt.fillStyle = textColor;
    cxt.shadowOffsetX = 0;
    cxt.shadowOffsetY = 0;
    cxt.shadowBlur = 0; // 模糊尺寸
    cxt.font = textSize;
    if (isUpInfo) {
      cxt.fillText(text, drawX, drawY - 25);
    } else {
      cxt.fillText(text, drawX, drawY + 45);
    }
    cxt.closePath();
  }

  //draw bezierLine
  function drawBezier(cxt, color, startX, startY, stopX, stopY, aim) {


    cxt.beginPath();
    //line color
    //var gradient = cxt.createLinearGradient(startX, startY, stopX, stopY);
    //if(aim==0){
    //  gradient.addColorStop("0", getColor(data[aim][1]));
    //  gradient.addColorStop("1.0",getColor(data[aim][1]));
    //}else{
    //  gradient.addColorStop("0", getColor(data[aim-1][1]));
    //  gradient.addColorStop("1.0",getColor(data[aim][1]));
    //}
    //cxt.strokeStyle = gradient;

    cxt.strokeStyle = color;
    cxt.shadowOffsetX = 0;
    cxt.shadowOffsetY = 4;
    cxt.shadowBlur = 4; // 模糊尺寸
    cxt.shadowColor = hexToRgba(color,0.3); // 颜色
    cxt.lineWidth = 6;
    cxt.moveTo(startX, startY);

    cxt.bezierCurveTo((stopX - startX)/2 + startX, startY, (stopX - startX)/2 + startX, stopY, stopX, stopY);


    //var Xc = stopX - startX;
    //var Yc = Math.abs(stopY - startY);
    //var pyX = ((1 - (Math.pow(1 / 2, (Yc / Xc * smooth)))) * 0.8 + 0.2) * Xc;
    //cxt.bezierCurveTo(startX + pyX, startY, stopX - pyX, stopY, stopX, stopY);


    cxt.stroke();
    cxt.closePath();
  }

  //draw bg
  function drawBg(cxt, array, startColor,x) {
    cxt.beginPath();
    var my_gradient = cxt.createLinearGradient(0, 0, 0, height);
    //bg gradient color
    my_gradient.addColorStop(0, hexToRgba(startColor,0.3));
    my_gradient.addColorStop(1, hexToRgba(startColor,0));
    cxt.fillStyle = my_gradient;
    cxt.moveTo(testArray[testArray.length - 1][0], height + 4);
    cxt.lineTo(0, height + 4);
    cxt.lineTo(array[0][0], array[0][1]);
    //cxt.lineTo(array[array.length-1][0],array[array.length-1][1]);
    for (var i = 0; i < array.length; i++) {
      if (i == array.length - 1) {

      } else {
        //cxt.bezierCurveTo((array[i + 1][0] - array[i][0]) / 2 + array[i][0], array[i][1],
        //  (array[i + 1][0] - array[i][0]) / 2 + array[i][0], array[i + 1][1],
        //  array[i + 1][0], array[i + 1][1]);

        var Xc = array[i + 1][0] - array[i][0];
        var Yc = Math.abs(array[i + 1][1] - array[i][1]);
        var pyX = ((1 - (Math.pow(1 / 2, (Yc / Xc * smooth)))) * 0.8 + 0.2) * Xc;
        cxt.bezierCurveTo(array[i][0] + pyX, array[i][1], array[i + 1][0] - pyX, array[i + 1][1], array[i + 1][0], array[i + 1][1]);

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
    var pointLength = 8;
    // /2 is 2px
    for (var i = 0; i < dashedLength / pointLength; i++) {

      if (draw) {
        cxt.beginPath();
        cxt.strokeStyle = dashedColor;
        cxt.lineWidth = 6;
        cxt.moveTo(startX, startY + pointLength * i);
        cxt.lineTo(startX, startY + pointLength + pointLength * i);
        cxt.stroke();
        cxt.closePath();
        draw = false;
      } else {
        draw = true;
      }
    }

  }

  function getColor(temp) {
    var colorLibrary = [
      {temp: 45, color: "rgb(237,103,192)"},
      {temp: 44.5, color: "rgb(236,85,173)"},
      {temp: 44, color: "rgb(222,70,147)"},
      {temp: 43.5, color: "rgb(206,50,128)"},
      {temp: 43, color: "rgb(186,35,97)"},
      {temp: 42.5, color: "rgb(165,25,79)"},
      {temp: 42, color: "rgb(142,20 ,63)"},
      {temp: 41.5, color: "rgb(123,16 ,54)"},
      {temp: 41, color: "rgb(113,10 ,10)"},
      {temp: 40.5, color: "rgb(144,16 ,23)"},
      {temp: 40, color: "rgb(175,24 ,35)"},
      {temp: 39.5, color: "rgb(212,31 ,51)"},
      {temp: 39, color: "rgb(244,44 ,63)"},
      {temp: 38.5, color: "rgb(252,92 ,66)"},
      {temp: 38, color: "rgb(249,117, 67)"},
      {temp: 37.5, color: "rgb(253,135, 67)"},
      {temp: 37, color: "rgb(251,157, 76)"},
      {temp: 36.5, color: "rgb(255,173, 100)"},
      {temp: 36, color: "rgb(255,187, 79)"},
      {temp: 35.5, color: "rgb(251,204, 38)"},
      {temp: 35, color: "rgb(249,222, 0)"},
      {temp: 34.5, color: "rgb(251,231, 94)"},
      {temp: 34, color: "rgb(253,245, 143)"},
      {temp: 33.5, color: "rgb(255,250, 184)"},
      {temp: 33, color: "rgb(244,245, 177)"},
      {temp: 32.5, color: "rgb(224,236, 166)"},
      {temp: 32, color: "rgb(212,232, 162)"},
      {temp: 31.5, color: "rgb(192,224, 153)"},
      {temp: 31, color: "rgb(192,224, 153)"},
      {temp: 30.5, color: "rgb(169,216, 143)"},
      {temp: 30, color: "rgb(169,216, 143)"},
      {temp: 29.5, color: "rgb(139,198, 106)"},
      {temp: 29, color: "rgb(139,198, 106)"},
      {temp: 28.5, color: "rgb(116,186, 76)"},
      {temp: 28, color: "rgb(116,186, 76)"},
      {temp: 27.5, color: "rgb(94,172,77)"},
      {temp: 27, color: "rgb(94,172,77)"},
      {temp: 26.5, color: "rgb(72,158,77)"},
      {temp: 26, color: "rgb(72,158,77)"},
      {temp: 25.5, color: "rgb(47,147,94)"},
      {temp: 25, color: "rgb(47,147,94)"},
      {temp: 24.5, color: "rgb(62,150,142)"},
      {temp: 24, color: "rgb(62,150,142)"},
      {temp: 23.5, color: "rgb(64,175,177)"},
      {temp: 23, color: "rgb(64,175,177)"},
      {temp: 22.5, color: "rgb(80,193,202)"},
      {temp: 22, color: "rgb(80,193,202)"},
      {temp: 21.5, color: "rgb(102, 210, 218)"},
      {temp: 21, color: "rgb(102, 210, 218)"},
      {temp: 20.5, color: "rgb(134, 219, 232)"},
      {temp: 20, color: "rgb(134, 219, 232)"}
    ];
    for (let i = 0; i < colorLibrary.length; i++) {
      if (colorLibrary[i].temp == temp) {
        return colorLibrary[i].color;
      }
    }
    return "rgb(0,0,0)"
  }

  function hexToRgba(hex,opacity){
    return "rgba("+parseInt("0x"+hex.slice(1,3))+","+parseInt("0x"+hex.slice(3,5))+","+parseInt("0x"+hex.slice(5,7))+","+opacity+")";
  }

  function rgbToRgba(rgb,opacity){
    return "rgba"+rgb.slice(3,-1)+","+opacity+")";
  }

  //creat random Number
  function random(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }

}
