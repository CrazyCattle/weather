const leftTopPoint = {
  lat: 31.900453,
  lon: 120.645633,
};

const windLevel = [0.2, 1.5, 3.3, 5.4, 7.9, 10.7, 13.8, 17.1, 20.7, 24.4, 28.4, 32.6, 36.9, 41.4, 46.1, 50.9, 56.0, 61.2, 80];
const windFlowRatio = 0.4;


const rightBottomPoint = {
  lat: 30.507534,
  lon: 122.366757,
};

const mainSites = ['徐家汇', '闵行', '宝山', '嘉定', '崇明', '南汇', '浦东', '青浦', '金山', '奉贤', '松江'];

const contourSetting = {
  tempe: {
    showlines: false,
    start: 20,
    end: 45,
    size: 0.5,
  },
  rain: {
    showlines: false,
    start: 0,
    end: 120,
    size: 0.1,
  },
  wind: {
    showlines: false,
    start: 0,
    end: 80,
    size: 0.1,
  },
};

const colors = {
  tempe: [
  ],
  rain: [
  ],
  wind: [
  ],
};

const xMax = 20;
const yMax = 20;
const width = $(window).width();
const height = width * 1.095;

const dealData = (data) => {
  let maxTemp = 1000;
  let minTemp = -1000;
  for (let i = 0; i < data.length - 1; i++) {
    minTemp = Math.min(minTemp, data[i + 1][2]);
    maxTemp = Math.max(maxTemp, data[i + 1][2]);
  }

  const myData = [];
  let myData2 = [];
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      myData2.push(null);
    }
    myData.push(myData2);
    myData2 = [];
  }

  for (let i = 0; i < data.length; i++) {
    myData[data[i][1]][data[i][0]] = data[i][2];
  }
  return myData;
};

class Contour {
  constructor(container) {
    this.container = container;
    this.type = 'tempe';
    this.colorScales = {
      tempe: [],
      rain: [],
      wind: [],
    };
    this.sitePoint = {
      tempe: [],
      rain: [],
      wind: [],
    };
    this.mainSitePoint = {
      tempe: [],
      rain: [],
      wind: [],
    };
    // 风力流向图
    this.windFlow = [];
  }
  initialize(type) {
    // 清空之前的图片
    Plotly.purge(this.container);
    this.type = type;
    const zData = dealData(this.sitePoint[type][0]);
    const trace = [{
      z: zData,
      zmin: 10,
      zmx: 42,
      connectgaps: true,
      type: 'contour',
      autocontour: false,
      line: {
        smoothing: 1.3,
      },
      contours: contourSetting[type],
      marker: {
        color: 'rgba(0,0,0,0)',
      },
      showscale: false,
      xtype: 'scaled',
      nticks: 3,
      colorscale: colors[type],
    }];
    const layout = {
      margin: {
        l: 0,
        b: 0,
        t: 0,
        r: 0,
      },
      width,
      height,
      showlegend: false,
      autoexpand: false,
    };

    Plotly.newPlot(this.container, trace, layout, {
      staticPlot: true,
    });
    this.getMainSitePoint(12);
  }

  reloadData(progress) {
    const zData = dealData(this.sitePoint[this.type][12 - progress]);
    Plotly.restyle(this.container, {
      z: [zData],
    });
    this.getMainSitePoint(progress);
  }

  buildTemp(json) {
    // 用来确认颜色的范围
    let maxTemp = -100;
    let minTemp = 100;

    const data = json.data;
    const sites = json.site;
    const result = [];
    for (let i = 0; i < 12; i++) {
      const points = [];
      const mainPoints = [];
      const oneDataArr = data[i].data_content;
      for (const key of Object.keys(sites)) {
        const site = sites[key];
        if (angular.isDefined(oneDataArr[key])) {
          const convert = this.gpsToPoint(site);
          const point = [convert.x, convert.y, oneDataArr[key].max_temp];
          maxTemp = Math.max(maxTemp, oneDataArr[key].max_temp);
          minTemp = Math.min(minTemp, oneDataArr[key].max_temp);
          if (point[0] >= 0 && point[0] < xMax && point[1] >= 0 && point[1] < yMax) {
            points.push(point);
            if (mainSites.indexOf(site.name) !== -1) {
              mainPoints.push({ top: convert.top, left: convert.left, value: oneDataArr[key].max_temp });
            }
          }
        }
      }
      this.mainSitePoint.tempe.push(mainPoints);
      this.sitePoint.tempe.push(points);
    }
    this.buildTempColor(Math.ceil(maxTemp), Math.floor(minTemp));
  }

  buildRain(json) {
    const timeKeys = [moment(new Date()).format('YYYY-MM-DD HH')];
    for (let i = 1; i < 12; i++) {
      timeKeys.push(moment(new Date()).add(-i, 'hours').format('YYYY-MM-DD HH'));
    }
    const result = [];
    for (let i = 0; i < 12; i++) {
      const time = timeKeys[i];
      const points = [];
      const mainPoints = [];
      for (const key of Object.keys(json)) {
        const site = json[key];
        if (angular.isDefined(site.rain_data[time])) {
          const convert = this.gpsToPoint(site);
          const point = [convert.x, convert.y, site.rain_data[time]];
          if (point[0] >= 0 && point[0] < xMax && point[1] >= 0 && point[1] < yMax) {
            points.push(point);
            if (mainSites.indexOf(site.name) !== -1) {
              mainPoints.push({ top: convert.top, left: convert.left, value: site.rain_data[time] });
            }
          }
        }
      }
      this.mainSitePoint.rain.push(mainPoints);
      this.sitePoint.rain.push(points);
    }
    this.buildRainColor();
  }

  buildWind(json) {
    // 用来判断是否有台风
    let maxWind = -100;

    const timeKeys = [moment(new Date()).format('YYYY-MM-DD HH')];
    for (let i = 1; i < 12; i++) {
      timeKeys.push(moment(new Date()).add(-i, 'hours').format('YYYY-MM-DD HH'));
    }
    const result = [];
    for (let i = 0; i < 12; i++) {
      const time = timeKeys[i];
      const points = [];
      const mainPoints = [];
      const flowPoints = [];
      for (const key of Object.keys(json)) {
        const site = json[key];
        if (angular.isDefined(site.data[time])) {
          const convert = this.gpsToPoint(site);
          const point = [convert.x, convert.y, site.data[time].h];

          maxWind = Math.max(maxWind, site.data[time].h);
          if (point[0] >= 0 && point[0] < xMax && point[1] >= 0 && point[1] < yMax) {
            points.push(point);

            if (mainSites.indexOf(site.name) !== -1) {
              // 这里需要计算一下风力等级
              let level = 0;
              while (site.data[time].h > windLevel[level] && level < 12) {
                level ++;
              }
              // 风力流向点
              const flowPoint = {
                x: convert.left,
                y: convert.top,
                px: convert.left + site.data[time].h * windFlowRatio * Math.cos(2 * Math.PI * (site.data[time].hd - 90) / 360),
                py: convert.top + site.data[time].h * windFlowRatio * Math.sin(2 * Math.PI * (site.data[time].hd - 90) / 360),
                down: true,
              };
              flowPoints.push(flowPoint);
              mainPoints.push({ top: convert.top, left: convert.left, value: level, direction: site.data[time].hd });
            }
          }
        }
      }
      this.windFlow.push(flowPoints);
      this.mainSitePoint.wind.push(mainPoints);
      this.sitePoint.wind.push(points);
    }
    this.buildWindColor(maxWind);
  }

  buildTempColor(maxTemp, minTemp) {
    // 37 度所在
    const divideIndex = 16;
    let start;
    const end = minTemp;
    let index;
    const initColors = ['500250', '6C056C', '900890', '9C1182', 'A41779', 'AD1F6F',
    'B82762', 'A41851', '8B0D40', '790735', '6F0211', '8E0B1D', 'AD1328', 'D32338', 'F54847',
    'F13044', 'F95C49', 'F95C49', 'FB874D', 'FA9D54', 'FEBA58', 'FBCB3E', 'F8DC23',
    'E3D82E', 'CDD43A', 'B5CF47', '9ECB52', '7CBB56', '61AC52', '4B9D52', '349260',
    '439688', '55ACA8', '55ACA8', '6ECAD3', '75D9E9', '6BCCE1', '63BCD8', '5AACCD',
    '4F97C0', '488AB8', '407AAE', '3669A4', '2D5698', '264990', '203C87', '172A7B',
    '0D156D', '050662', '271A83', '3C289E', '5437B9', '623FC8', '7B4FE3', '7243CE',
    '6635B5', '582498', '4D1780', '3C025C'];
    const chooseColors = [];
    const colorScales = [];

    if (maxTemp > 37) {
      start = 45;
      index = 0;
    } else if (maxTemp < 11) {
      start = 11;
      index = divideIndex;
    } else {
      start = maxTemp;
      index = divideIndex;
    }

    let i = start + 0.5;
    while (i > end) {
      i -= 0.5;
      if (i <= maxTemp && i >= minTemp) {
        colorScales.push({
          value: i,
          color: `#${initColors[index]}`,
        });
      }
      chooseColors.push(initColors[index]);
      if (i <= 30 && i > 0) {
        i -= 0.5;
        chooseColors.push(initColors[index]);
      }
      index ++;
    }

    this.colorScales.tempe = colorScales;
    contourSetting.tempe.start = end;
    contourSetting.tempe.end = start;
    colors.tempe = this.buildContourColor(start, end, chooseColors, 0.5);
  }

  buildRainColor() {
    const initValue = [0, 0.1, 1.5, 7, 15, 40, 50, 100, 120];
    const initColors = ['E6E6EA', 'C2DBF2', 'A6D1F6', '92C3F0', '75B3EA', '55A2E7', '3D8FD8', '2279C6', '0E60AA'];
    const start = 0;
    const end = 120;
    const size = 0.1;
    const chooseColors = [];
    let i = start;
    let index = 0;
    while (i <= end) {
      chooseColors.push(initColors[index]);
      if (i > initValue[index]) {
        index ++;
      }
      i += size;
    }
    this.colorScales.rain = [
      { value: '0', color: '#E6E6EA' },
      { value: '<0.1', color: '#C2DBF2' },
      { value: '0.1-1.5', color: '#A6D1F6' },
      { value: '1.5-7', color: '#92C3F0' },
      { value: '7-15', color: '#75B3EA' },
      { value: '15-40', color: '#55A2E7' },
      { value: '40-50', color: '#3D8FD8' },
      { value: '50-100', color: '#2279C6' },
      { value: '>100', color: '#0E60AA' },
    ];
    colors.rain = this.buildContourColor(end, start, chooseColors.reverse(), size);
  }

  buildWindColor(maxWind) {
    const initValue = windLevel;
    const initColors = ['E6E6EA', 'EAEEC0', 'D1E3A9', 'B8D793', '9FCC7C', '87C166', '72B854', '58AC3C',
    '3F9C82', '268BC6', '1F76B9', '1860AA', '11499C', '37339C', '54239C', '71119C', '5F0B84', '4C056C', '3D0059'];
    const start = 0;
    const end = 80;
    const size = 0.1;
    const chooseColors = [];
    let i = start;
    let index = 0;
    while (i <= end) {
      if (i > initValue[index]) {
        index ++;
      }
      chooseColors.push(initColors[index]);
      i += size;
    }
    this.colorScales.wind = [
      { value: '静风', color: '#E6E6EA' },
      { value: '1级', color: '#EAEEC0' },
      { value: '2级', color: '#D1E3A9' },
      { value: '3级', color: '#B8D793' },
      { value: '4级', color: '#9FCC7C' },
      { value: '5级', color: '#87C166' },
      { value: '6级', color: '#72B854' },
      { value: '7级', color: '#58AC3C' },
      { value: '8级', color: '#3F9C82' },
      { value: '9级', color: '#268BC6' },
      { value: '10级', color: '#1F76B9' },
      { value: '11级', color: '#1860AA' },
      { value: '12级', color: '#11499C' },
    ];
    if (maxWind >= 37) {
      this.colorScales.wind.concat([
        { value: '13级', color: '#37339C' },
        { value: '14级', color: '#54239C' },
        { value: '15级', color: '#71119C' },
        { value: '16级', color: '#5F0B84' },
        { value: '17级', color: '#4C056C' },
        { value: '18级', color: '#3D0059' },
      ]);
    }
    colors.wind = this.buildContourColor(end, start, chooseColors.reverse(), size);
  }

  buildContourColor(start, end, chooseColors, size) {
    const resultColor = [];
    const number = (start - end) / size;
    const level = 1 / number;
    for (let i = 0; i <= number; i ++) {
      resultColor.push([
        i * level, `#${chooseColors[chooseColors.length - i - 1]}`,
      ]);
    }
    return resultColor;
  }

  gpsToPoint(site) {
    const xRadio = (site.lon - leftTopPoint.lon) / (rightBottomPoint.lon - leftTopPoint.lon);
    const yRadio = (site.lat - rightBottomPoint.lat) / (leftTopPoint.lat - rightBottomPoint.lat);
    return {
      x: Math.round(xRadio * (xMax - 1)),
      y: Math.round(yRadio * (yMax - 1)),
      top: height - height * yRadio,
      left: width * xRadio,
    };
  }

  getColorScales() {
    return this.colorScales[this.type];
  }

  getWindFlowPoint(progress) {
    return this.windFlow[12 - progress];
  }

  getMainSitePoint(progress) {
    return this.mainSitePoint[this.type][12 - progress];
  }

}

export default Contour;
