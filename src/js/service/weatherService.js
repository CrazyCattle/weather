class weatherService {
  constructor($resource, $http) {
    this.http = $http;
    this.resource = $resource;
    this.coordinate = '?lon=121&lat=31.23444';
    this.url = {
      'tenday': 'http://139.196.210.102:8083/v1/weather/forecast',
      '10区县自动站实时': 'http://61.152.122.112:8080/api/v1/auto_stations/master?appid=bFLKk0uV7IZvzcBoWJ1j&appkey=mXwnhDkYIG6S9iOyqsAW7vPVQ5ZxBe',
      'realtime': `http://139.196.210.102:8083/v1/weather/live${this.coordinate}`,
      'aqifornow': 'http://139.196.210.102:8083/v1/weather/aq/live',
      'aqihistory': 'http://139.196.210.102:8083/v1/weather/aq/last12h',
      'aqiforcast': 'http://139.196.210.102:8083/v1/weather/aq/forecast',
      'lifeStatus': 'http://139.196.210.102:8083/v1/weather/indexOfLiving',
      'aqiAvg': 'http://222.66.83.20:9090/aqi_avg_hours/shanghai',
      'tempeHistory': 'http://139.196.210.102:8083/v1/weather/station/history',
      'windHistory': 'http://139.196.210.102:8083/v1/weather/station/history?type=wind',
      'rainHistory': 'http://139.196.210.102:8083/v1/weather/station/history?type=rain',
      'yesterdayTemp': 'http://139.196.210.102:8083/v1/weather/yesterday/temp',
    };
  }
  getTenDayWeather() {
    const url = this.url.tenday;
    return this.resource(url).get().$promise;
  }
  setCoordinate(coordinate) {
    this.coordinate = coordinate;
  }
  getCoordinate() {
    return this.coordinate;
  }
  getCurrentWeather() {
    return this.resource(this.url.realtime).save().$promise;
  }
  getAqiAvg() {
    return this.http.get(this.url.aqiAvg, {
      'headers': {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  getCurrentAqi() {
    return this.resource(this.url.aqifornow).get().$promise;
  }
  getAqiForcast() {
    return this.resource(this.url.aqiforcast).get().$promise;
  }
  getAqiHistory() {
    return this.resource(this.url.aqihistory).get().$promise;
  }
  getLifeStatus() {
    return this.resource(this.url.lifeStatus).get().$promise;
  }
  getTempeHistory() {
    return this.resource(this.url.tempeHistory).get().$promise;
  }
  getWindHistory() {
    return this.resource(this.url.windHistory).get().$promise;
  }
  getRainHistory() {
    return this.resource(this.url.rainHistory).get().$promise;
  }
  getTempYesterday() {
    return this.resource(this.url.yesterdayTemp).get().$promise;
  }
}

export default weatherService;
