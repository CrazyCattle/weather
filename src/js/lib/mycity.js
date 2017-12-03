import MapLib from './map';

export default function initialize(id, arr1, arr2) {
  const map = MapLib.initialize(id);
  var localCoordinate = window.localStorage;
  const locationArr = arr1;
  const userStation = arr2;
  console.log(userStation);
  let name = '';
  let tempe = '';
  let rain = '';
  let dir = '';
  let spe = '';
  let tipTemp = '';
  let tipRain = '';
  let tipDir = '';
  let tipSpe = '';
  let winduv = '';
  let rainpress = '';
  let dirwet = '';

  const point = new BMap.Point(121.48789949, 31.24916171); // 创建点坐标 (121.48789949,31.24916171)为经,纬度
  map.centerAndZoom(point, 13); // 初始化地图，设置中心点坐标和地图级别1-18
  map.enableDragging();

  function SquareOverlay(center, length, color, location) {
    this._center = center;
    this._length = length;
    this._color = color;
    this._location = location;
  }

  // 继承API的BMap.Overlay
  SquareOverlay.prototype = new BMap.Overlay();
  // 实现初始化方法

    // 实现绘制方法
  SquareOverlay.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器
    const position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = `${position.x - this._length / 2}px`;
    this._div.style.top = `${position.y - this._length / 2}px`;
  };

  SquareOverlay.prototype.initialize = function (m) {
    // 保存map对象实例
    this._map = m;
    // 创建div元素，作为自定义覆盖物的容器
    const div = document.createElement('div');
    tipTemp = '温度';
    if (this._location.site_name && (this._location.tempe || Number(this._location.tempe) === 0)) {
      name = `${this._location.site_name}气象站`;
      tipRain = '雨量';
      tipDir = '风向';
      tipSpe = '风速';
      rainpress = 'iconfont icon-rainicon';
      dirwet = 'iconfont icon-windicon';
      winduv = 'iconfont icon-windyicon';
      tempe = (this._location.tempe === 99999 ? '无数据' : `${this._location.tempe}℃`);
      rain = (Number(this._location.rain) === 99999 ? '无数据' : this._location.rain);
      dir = (this._location.wind_dir === '99999' ? '无数据' : this._location.wind_dir);
      spe = (this._location.wind_spe === '99999级' ? '无数据' : this._location.wind_spe);
    } else {
      name = '有1人为此地报天气';
      tipRain = '气压';
      tipDir = '湿度';
      tipSpe = 'UV';
      rainpress = 'iconfont1 icon1-pressure';
      dirwet = 'iconfont1 icon1-wet';
      winduv = 'iconfont1 icon1-uv';
      tempe = (this._location.temp === '99999' ? '无数据' : `${this._location.temp}℃`);
      rain = (this._location.pres === '99999' ? '无数据' : `${this._location.pres}Hpa`);
      dir = (this._location.humi === '99999' ? '无数据' : `${this._location.humi}%`);
      spe = (this._location.uvIn === '99999' ? '无数据' : this._location.uvIn);
    }

    div.innerHTML = '<div class="weather_station">'+
                      '<div>' +
                        '<b class="l_location_icon iconfont icon-location"></b>' + name +
                      '</div>' +
                    '</div>' +
                    '<div class="mycity_weather_info">' +
                      '<ul>' +
                        '<li>' +
                          '<div><b class="iconfont icon-tempicon"></b></div>' +
                          '<div>' + tipTemp + '：' + tempe + '</div>' +
                        '</li>' +
                        '<li>' +
                          '<div><b class="' + rainpress + '"></b></div>' +
                          '<div>' + tipRain + '：' + rain + '</div>' +
                        '</li>' +
                        '<li>' +
                          '<div><b class="' + dirwet + '"></b></div>' +
                          '<div>' + tipDir + '：' + dir + '</div>' +
                        '</li>' +
                        '<li>' +
                          '<div><b class="' + winduv + '"></b></div>' +
                          '<div>' + tipSpe + '：' + spe + '</div>' +
                        '</li>' +
                      '</ul>' +
                    '</div>';
    div.style.position = 'absolute';
    div.setAttribute('id', 'popb');
    div.style.display = 'none';
    div.style.width = `${$('.inquire').width()}px`;
    div.style.background = this._color;
    div.className = 'mycity_info';
    m.getPanes().markerPane.appendChild(div);
    this._div = div;
    return div;
  };
  let locationInfo;
  // 定义自定义覆盖物的构造函数
  function addMarker(point) {
    // 创建图标对象
    const myIcon = new BMap.Icon('/img/GDZ1.png', new BMap.Size(35, 50), {
      offset: new BMap.Size(35, 50),
    });
    // 创建标注对象并添加到地图
    const marker = new BMap.Marker(point, {
      icon: myIcon,
    });
    let zIndex;
    marker.addEventListener('click', (e) => {
      map.removeOverlay(locationInfo);
      for (let i = 0; i < locationArr.length; i++) {
        if ((locationArr[i].lat == marker.getPosition().lat) && (locationArr[i].lon == marker.getPosition().lng)) {
          const pt = new BMap.Point(locationArr[i].lon, locationArr[i].lat);
          locationInfo = new SquareOverlay(pt, $('.inquire').width(), '#ff', locationArr[i]);
          map.panTo(pt); // 缓慢移动到当前点
          map.addOverlay(locationInfo);
          $('#popb').show(100);
        }
      }
    });
    map.addOverlay(marker);
  }

  function addMarker1(point) {
    // 创建图标对象
    const myIcon = new BMap.Icon('/img/YHZ1.png', new BMap.Size(50, 50), {
      offset: new BMap.Size(50, 50),
    });
    // 创建标注对象并添加到地图
    const marker1 = new BMap.Marker(point, {
      icon: myIcon,
    });
    marker1.addEventListener('click', (e) => {
      map.removeOverlay(locationInfo);
      // document.getElementById('popb').style.display = 'none';
      for (let i = 0; i < userStation.length; i++) {
        if ((userStation[i].lat == marker1.getPosition().lat) && (userStation[i].lon == marker1.getPosition().lng)) {
          var pt = new BMap.Point(userStation[i].lon, userStation[i].lat);
          locationInfo = new SquareOverlay(pt, $('.inquire').width(), '#fff', userStation[i]);
          map.panTo(pt); // 缓慢移动到当前点
          map.addOverlay(locationInfo);
          $('#popb').show(100);
        }
      }
    });
    map.addOverlay(marker1);
  }
  // 创建标注
  for (let i = 0; i < locationArr.length; i++) {
    const pt = new BMap.Point(locationArr[i].lon, locationArr[i].lat);
    addMarker(pt);
  }
  for (let i = 0; i < userStation.length; i++) {
    const pt = new BMap.Point(userStation[i].lon, userStation[i].lat);
    addMarker1(pt);
  }

  // 当前所在位置定位
  const geoc = new BMap.Geocoder();
  let innerHTML;
  let marker;
  function myFun(result) {
    const cityName = result.name;
    const ppp = new BMap.Point(result.center.lng, result.center.lat);
    if (window.location.href === 'http://tempe.daguchuangyi.com/#/searchcity') {
      map.addEventListener("dragend", function showInfo(){
        var cp = map.getCenter();
        localCoordinate.value = cp.lng+"," + cp.lat;
      });
      // marker = new BMap.Marker(ppp);        // 创建标注
      // map.addOverlay(marker);
      // marker.enableDragging();
      // marker.addEventListener("dragend", function(e){
      //   localCoordinate.value = e.point.lng+","+e.point.lat;
      // })
      // function showInfoP(e){
      //   map.removeOverlay(marker);
      //   map.removeOverlay(markerS);
      //   localCoordinate.value = e.point.lng+","+e.point.lat;
      //   const pppp = new BMap.Point(e.point.lng, e.point.lat);
      //   marker = new BMap.Marker(pppp);
      //   map.addOverlay(marker);
      //   marker.enableDragging();
      //   marker.addEventListener("dragend", function(e){
      //     localCoordinate.value = e.point.lng+","+e.point.lat;
      //   })
      // }
      // map.addEventListener("click", showInfoP);
    }
    geoc.getLocation(ppp, (rs) => {
      const addComp = rs.addressComponents;
      innerHTML = `${addComp.city},${addComp.district},${addComp.street},${addComp.streetNumber}`;
    });
    map.setCenter(cityName);
  }
  const myCity = new BMap.LocalCity();
  myCity.get(myFun);

  // 百度地图 搜索功能
  function G(id) {
    return document.getElementById(id);
  }
  const ac = new BMap.Autocomplete({// 建立一个自动完成的对象
    'input': 'searchCity',
    'location': map,
    onSearchComplete : function(data){
      const html = `<td id="td_title"><div class="td_title_container"><div></div><div class="td_location"><div>当前定位</div><div>${innerHTML}</div></div></div></td>`;
      $('.tangram-suggestion-main>div:last-child>table>tbody').prepend(html);
    },
  });

  //  鼠标放在下拉列表上的事件
  ac.addEventListener('onhighlight', function(e) {
    let str = '';
    let value = e.fromitem.value;
    if (e.fromitem.index > -1) {
      value = `${value.province}${value.city}${value.district}${value.street}${value.business}`;
    }
    str = `FromItem<br />index = ${e.fromitem.index}<br />value = ${value}`;

    value = '';
    if (e.toitem.index > -1) {
      value = e.toitem.value;
      value = `${value.province}${value.city}${value.district}${value.street}${value.business}`;
    }
    str += `<br />ToItem<br />index = ${e.toitem.index}<br />value = ${value}`;
    G('Searchresult').innerHTML = str;
  });

  let myValue;
  // var markerS;
  ac.addEventListener('onconfirm', function(e) {    // 鼠标点击下拉列表后的事件
    const value = e.item.value;
    myValue = `${value.province}${value.city}${value.district}${value.street}${value.business}`;
    G('Searchresult').innerHTML = 'onconfirm<br/>index= '+`${e.item.index}`+'<br/>myValue= '+`${myValue}`;
    var myGeo = new BMap.Geocoder();
    myGeo.getPoint(myValue, (p) => {
      if (point) {
        localCoordinate.value = `${p.lng},${p.lat}`;
      }
    }, '上海市');

    setPlace();
  });
  function setPlace() {
    // map.clearOverlays(); 清除地图 上绘制的marker
    function myFun(){
      // if (markerS) {
      //   map.removeOverlay(markerS);
      // }
      var pp = local.getResults().getPoi(0).point;
      map.centerAndZoom(pp, 13);
      // map.removeOverlay(marker);
      // markerS = new BMap.Marker(pp);
      // map.addOverlay(markerS);
      // markerS.enableDragging();
      // markerS.addEventListener("dragend", function(e){
      //   localCoordinate.value = e.point.lng+","+e.point.lat;
      // })
      $('#searchCity').blur();
    }
    var local = new BMap.LocalSearch(map, {
      onSearchComplete: myFun
    });
    local.search(myValue);
  }
}
