import MapLib from './map';
const pointRadius = 16; //圆点半径
const typhoonRadius = 100; //台风半径

function SquareOverlay(center, length, color) {
  this._center = center;
  this._length = length;
  this._color = color;
}

// 定义自定义覆盖物的构造函数
function Circle(center, length, color,windSpeed) {
  this._center = center;
  this._length = length;
  this._color = color;
  this._windSpeed = windSpeed;
}

// 继承API的BMap.Overlay
SquareOverlay.prototype = new BMap.Overlay();
// 实现初始化方法
SquareOverlay.prototype.initialize = function (m) {
  // 保存map对象实例
  this._map = m;
  // 创建div元素，作为自定义覆盖物的容器
  const div = document.createElement('div');
  div.style.position = 'absolute';
  // 可以根据参数设置元素外观
  div.style.width = typhoonRadius + 'px';
  div.style.height = typhoonRadius + 'px';
  div.style.background = this._color;
  div.className = 'typhoon';
  div.innerHTML = '<img width=100% src="img/typhoon1.png" />';
  // 将div添加到覆盖物容器中
  m.getPanes().markerPane.appendChild(div);
  // 保存div实例
  this._div = div;
  // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
  // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
  return div;
};
  // 实现绘制方法
SquareOverlay.prototype.draw = function () {
  // 根据地理坐标转换为像素坐标，并设置给容器
  const position = this._map.pointToOverlayPixel(this._center);
  this._div.style.left = `${position.x - this._length / 2}px`;
  this._div.style.top = `${position.y - this._length / 2}px`;

  const img = this._div.childNodes[0];
  img.style.opacity = 1;
  this._div.style.animation = 'circle 3.5s infinite linear';
};

// 继承API的BMap.Overlay
Circle.prototype = new BMap.Overlay();
// 实现初始化方法
Circle.prototype.initialize = function (m) {
  // 保存map对象实例
  this._map = m;
  // 创建div元素，作为自定义覆盖物的容器
  const div = document.createElement('div');
  div.style.position = 'absolute';
  // 可以根据参数设置元素外观
  div.style.transition = 'opacity 0.5s';
  div.style.opacity = 0;
  div.style.width = pointRadius + 'px';
  div.style.height = pointRadius + 'px';
  div.style.background = windLevel(this._windSpeed,"color");
  div.style.borderRadius = pointRadius/2 + 'px';
  // 将div添加到覆盖物容器中
  m.getPanes().markerPane.appendChild(div);
  // 保存div实例
  this._div = div;
  // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
  // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
  return div;
};
  // 实现绘制方法
Circle.prototype.draw = function () {
  // 根据地理坐标转换为像素坐标，并设置给容器
  const position = this._map.pointToOverlayPixel(this._center);
  this._div.style.left = `${position.x - pointRadius / 2}px`;
  this._div.style.top = `${position.y - pointRadius / 2}px`;
  this._div.style.opacity = 1;
}

class typhoon {
  constructor() {
    this.map = null;
    this.forcastArr = [];
    this.locationList = [];
  }
  initialize(currentTyphoon, typhoonLocationList, typhoonForecastLocationList) {
    const arr = [];

    const map = MapLib.initialize('map');
    var that = this;

    this.map = map;
    this.locationList = typhoonLocationList;

    var typhoonpoint = undefined;
    var typhoonlist = [];
    var delayPoint = 0.15;
    var delayPointUp = 0.15;
    var delayLine = 0.15;
    const point = new BMap.Point(currentTyphoon.lon, currentTyphoon.lat); // 创建点坐标 (121.48789949,31.24916171)为经,纬度
    map.centerAndZoom(point, 6); // 初始化地图，设置中心点坐标和地图级别1-18
    map.addControl(new BMap.NavigationControl()); // 地图内容缩放控件
    // map.enableScrollWheelZoom();
    // 定义自定义覆盖物的构造函数

    var test = 0;
    var path = [];

    const polyline = new BMap.Polyline(path, {
      strokeColor: '#fff',
      strokeWeight: 7,
      strokeOpacity: 0.5,
    });
    map.addOverlay(polyline);

    var interval = null;
    var i = 0;
    var intervalFunction = function() {
      const pt = new BMap.Point(typhoonLocationList[i].lon, typhoonLocationList[i].lat);
      const mySquare = new Circle(pt, pointRadius,"#ff33ff",falseData(typhoonLocationList,typhoonForecastLocationList,i,1));
      map.addOverlay(mySquare);

      path.push(new BMap.Point(typhoonLocationList[i].lon, typhoonLocationList[i].lat));
      polyline.setPath(path);

      i ++;
      if (i === typhoonLocationList.length) {
        console.log("000000000000000000000000000000000000");
        typhoonpoint = new BMap.Point(typhoonLocationList[i - 1].lon, typhoonLocationList[i - 1].lat);
        typhoonlist.push(typhoonpoint);
        const mySquare = new SquareOverlay(typhoonpoint, typhoonRadius);
        map.addOverlay(mySquare);
        const myL = new Circle(typhoonpoint, pointRadius); //最新台风绘制
        map.addOverlay(myL);
        drawForecast();
        clearInterval(interval);
      }
    };

    interval = setInterval(intervalFunction, delayLine * 1000);

    function drawForecast() {
      for (let i = 0; i < typhoonForecastLocationList.length; i++) {
        let items = typhoonForecastLocationList[i].items;
        let pointArr = [];
        let color = undefined;
        pointArr.push(typhoonpoint);
        for (let j = 0; j < items.length; j++) {
          let pt = new BMap.Point(items[j].lon, items[j].lat);
          pointArr.push(pt);
          const myL = new Circle(new BMap.Point(items[j].lon, items[j].lat), pointRadius,"#ff33ff",falseData(typhoonLocationList,items,j,0)); //最新台风绘制
          map.addOverlay(myL);
          drawForecast();
          clearInterval(interval);
        }
      };

      interval = setInterval(intervalFunction, delayLine * 1000);

      function drawForecast() {
        for (let i = 0; i < typhoonForecastLocationList.length; i++) {
          let items = typhoonForecastLocationList[i].items;
          let pointArr = [];
          pointArr.push(typhoonpoint);
          for (let j = 0; j < items.length; j++) {
            let pt = new BMap.Point(items[j].lon, items[j].lat);
            pointArr.push(pt);
            const myL = new Circle(new BMap.Point(items[j].lon, items[j].lat), pointRadius, "#ff33ff", falseData(typhoonLocationList, items, j, 0)); //最新台风绘制
            map.addOverlay(myL);
          }
          let color = '#f77f7f';
          // 根据不同的国家名称,设置不同的虚线颜色
          if (typhoonForecastLocationList[i].name === "babj") {
            color = '#F77F7F';
          } else if (typhoonForecastLocationList[i].name === "rjtd") {
            color = '#B0D0F5';
          } else if (typhoonForecastLocationList[i].name === "bcsh") {
            color = '#F89BA4';
          } else if (typhoonForecastLocationList[i].name === "pgtw") {
            color = '#C9B6B2';
          }
          let PolylinePath = new BMap.Polyline(pointArr, {
            strokeColor: color,
            strikeWidht: 0.5,
            strokeOpacity: .5,
            strokeStyle: 'dashed',
            fillColor: 'transparent',
          });
          that.forcastArr.push({
            polyLine: PolylinePath,
            name: typhoonForecastLocationList[i].name,
            path: pointArr,
          });
          map.addOverlay(PolylinePath);
        }
      };
    }
  }

  drawForecast(a,name) {
    console.log(this.map.getOverlays());
    for( let i = 0 ;i < this.forcastArr.length; i ++) {
      if(this.forcastArr[i].name === name && a === 1) {
        this.forcastArr[i].polyLine.setPath(this.forcastArr[i].path);
      } else if (this.forcastArr[i].name === name && a === 0) {
        this.forcastArr[i].polyLine.setPath([]);
        this.forcastArr[i].polyLine.hide();
        this.forcastArr[i].polyLine.show();
        this.forcastArr[i].polyLine.strokeOpacity = 1;
        this.map.addOverlay(this.forcastArr[i].polyLine);
        this.map.zoomTo(this.map.getZoom()+1);
        this.map.zoomTo(this.map.getZoom()-1);
      }
    }
  };
}

//how wind level
function windLevel(windSpeed,want){
  var speedLevel;
  var windName;
  var windColor;
  if(windSpeed<0.3){
    speedLevel = 0;
  }else if(windSpeed<1.6){
    speedLevel = 1;
  }else if(windSpeed<3.4){
    speedLevel = 2;
  }else if(windSpeed<5.5){
    speedLevel = 3;
  }else if(windSpeed<8.0){
    speedLevel = 4;
  }else if(windSpeed<10.8){
    speedLevel = 5;
  }else if(windSpeed<13.9){
    speedLevel = 6;
  }else if(windSpeed<17.2){
    speedLevel = 7;
  }else if(windSpeed<20.8){
    speedLevel = 8;
  }else if(windSpeed<24.5){
    speedLevel = 9;
  }else if(windSpeed<28.5){
    speedLevel = 10;
  }else if(windSpeed<32.6){
    speedLevel = 11;
  }else if(windSpeed<37.0){
    speedLevel = 12;
  }else if(windSpeed<41.5){
    speedLevel = 13;
  }else if(windSpeed<46.2){
    speedLevel = 14;
  }else if(windSpeed<51.0){
    speedLevel = 15;
  }else if(windSpeed<56.1){
    speedLevel = 16;
  }else if(windSpeed<61.3){
    speedLevel = 17;
  }else if(windSpeed>=61.3){
    speedLevel = 17;
  }

  if(speedLevel< 8){
    windName = "热带低压";
    windColor = "#c8ddf5";
  }else if(speedLevel< 10){
    windName = "热带风暴";
    windColor = "#c3e6af";
  }else if(speedLevel< 12){
    windName = "强热带风暴";
    windColor = "#ffd28c";
  }else if(speedLevel< 14){
    windName = "台风";
    windColor = "#ffb6a9";
  }else if(speedLevel< 16){
    windName = "强台风";
    windColor = "#f89ba4";
  }else{
    windName = "超强台风";
    windColor = "#f77f7f";
  }
  if(want == "level"){
    return speedLevel;
  }else if(want == "name"){
    return windName;
  }else if(want == "color"){
    return windColor;
  }
}

//if data false
function falseData(list,listForecast,i,type){
  if(type==0){
    if (listForecast[i].max_wind == 9999) {
      for (let j = i; j < -1; j--) {
        if (listForecast[j].max_wind != 9999) {
          return listForecast[j].max_wind;
        }
        if (j == 0) {
          for (let k = list.length; k < -1; k--) {
            if (list[k].max_wind != 9999) {
              return list[k].max_wind;
            }
            if(k==0){
              return 0;
            }
          }
        }
      }
    } else {
      return listForecast[i].max_wind;
    }

  }
  else {
    if (list[i].max_wind == 9999) {
      for (let j = i; j < -1; j--) {
        if (list[j].max_wind != 9999) {
          return list[j].max_wind;
        }
        if (j == 0) {
          return 0;
        }
      }
    } else {
      return list[i].max_wind;
    }
  }
}

export default typhoon;
