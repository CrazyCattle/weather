export default function initialize() {
  
  const map = new BMap.Map('map'); // 创建地图实例
  const point = new BMap.Point(121.48789949, 31.24916171); // 创建点坐标 (121.48789949,31.24916171)为经,纬度
  map.centerAndZoom(point, 13); // 初始化地图，设置中心点坐标和地图级别1-18

  // map.addControl(new BMap.NavigationControl());               //地图内容缩放控件

  // 定义自定义覆盖物的构造函数
  function SquareOverlay(center, length, color) {
    this._center = center;
    this._length = length;
    this._color = color;
  }

  // 继承API的BMap.Overlay
  SquareOverlay.prototype = new BMap.Overlay();
  // 实现初始化方法
  SquareOverlay.prototype.initialize = function(map) {
      // 保存map对象实例
      this._map = map;
      // 创建div元素，作为自定义覆盖物的容器
      const div = document.createElement("div");
      div.style.position = "absolute";
      // 可以根据参数设置元素外观
      div.style.width = this._length + "px";
      div.style.height = this._length + "px";
      div.style.background = this._color;
      div.className = 'typhoon';
      div.innerHTML = '<img src="img/typhoon.png" />'
        // 将div添加到覆盖物容器中
      map.getPanes().markerPane.appendChild(div);
      // 保存div实例
      this._div = div;
      // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
      // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
      return div;
    }
    // 实现绘制方法
  SquareOverlay.prototype.draw = function() {
    // 根据地理坐标转换为像素坐标，并设置给容器
    const position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - this._length / 2 + "px";
    this._div.style.top = position.y - this._length / 2 + "px";
  }

  // 添加自定义覆盖物
  const mySquare = new SquareOverlay(map.getCenter(), 100);
  map.addOverlay(mySquare);

  // 修改地图的界面样式
  const myStyleJson = [{
    "featureType": "land",
    "elementType": "all",
    "stylers": {
      "color": "#fcfaf7",
      "visibility": "on"
    }
  }, {
    "featureType": "green",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#e1ecbe"
    }
  }, {
    "featureType": "arterial",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#fff2d9"
    }
  }, {
    "featureType": "highway",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#f3d2a4"
    }
  }, {
    "featureType": "railway",
    "elementType": "all",
    "stylers": {
      "visibility": "off"
    }
  }, {
    "featureType": "highway",
    "elementType": "geometry.stroke",
    "stylers": {
      "color": "#e6c099",
      "weight": "1",
      "visibility": "on"
    }
  }, {
    "featureType": "arterial",
    "elementType": "geometry.stroke",
    "stylers": {
      "color": "#eae1c3"
    }
  }, {
    "featureType": "water",
    "elementType": "all",
    "stylers": {
      "color": "#dde8e8"
    }
  }, {
    "featureType": "subway",
    "elementType": "all",
    "stylers": {
      "color": "#ff8888",
      "visibility": "off"
    }
  }, {
    "featureType": "boundary",
    "elementType": "all",
    "stylers": {
      "color": "#f9d4d4"
    }
  }, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": {}
  }, {
    "featureType": "local",
    "elementType": "geometry.stroke",
    "stylers": {
      "color": "#ececeb",
      "visibility": "on"
    }
  }, {
    "featureType": "local",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#ffffff",
      "visibility": "on"
    }
  }, {
    "featureType": "building",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#f0ece4"
    }
  }, {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": {
      "visibility": "off"
    }
  }, {
    "featureType": "railway",
    "elementType": "labels",
    "stylers": {}
  }, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": {
      "color": "#fbf9f4"
    }
  }, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#b7b09b"
    }
  }, {
    "featureType": "label",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#b7b09b"
    }
  }, {
    "featureType": "label",
    "elementType": "labels.text.stroke",
    "stylers": {
      "color": "#fbf9f4"
    }
  }, {
    "featureType": "manmade",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#f2eee8"
    }
  }];
  map.setMapStyle({
    styleJson: myStyleJson
  });
}
