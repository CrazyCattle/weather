const initialize = (container) => {
  const map = new BMap.Map(container, {
    enableHighResolution: true,
  }); // 创建地图实例
  const myStyleJson = [{
    'featureType': 'land',
    'elementType': 'all',
    'stylers': {
      'color': '#fcfaf7',
      'visibility': 'on',
    },
  }, {
    'featureType': 'green',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#e1ecbe',
    },
  }, {
    'featureType': 'arterial',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#fff2d9',
    },
  }, {
    'featureType': 'highway',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#f3d2a4',
    },
  }, {
    'featureType': 'railway',
    'elementType': 'all',
    'stylers': {
      'visibility': 'off',
    },
  }, {
    'featureType': 'highway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#e6c099',
      'weight': '1',
      'visibility': 'on',
    },
  }, {
    'featureType': 'arterial',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#eae1c3',
    },
  }, {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': {
      'color': '#dde8e8',
    },
  }, {
    'featureType': 'subway',
    'elementType': 'all',
    'stylers': {
      'color': '#ff8888',
      'visibility': 'off',
    },
  }, {
    'featureType': 'boundary',
    'elementType': 'all',
    'stylers': {
      'color': '#f9d4d4',
    },
  }, {
    'featureType': 'poi',
    'elementType': 'all',
    'stylers': {},
  }, {
    'featureType': 'local',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#ececeb',
      'visibility': 'on',
    },
  }, {
    'featureType': 'local',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#ffffff',
      'visibility': 'on',
    },
  }, {
    'featureType': 'building',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#f0ece4',
    },
  }, {
    'featureType': 'poi',
    'elementType': 'labels',
    'stylers': {
      'visibility': 'off',
    },
  }, {
    'featureType': 'railway',
    'elementType': 'labels',
    'stylers': {},
  }, {
    'featureType': 'road',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'color': '#fbf9f4',
    },
  }, {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': {
      'color': '#b7b09b',
    },
  }, {
    'featureType': 'label',
    'elementType': 'labels.text.fill',
    'stylers': {
      'color': '#b7b09b',
    },
  }, {
    'featureType': 'label',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'color': '#fbf9f4',
    },
  }, {
    'featureType': 'manmade',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#f2eee8',
    },
  }];
  map.setMapStyle({
    styleJson: myStyleJson,
  });
  return map;
};

export default {
  initialize,
};
