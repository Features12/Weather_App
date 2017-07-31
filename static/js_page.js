;
var app = new Marionette.Application();
app.addRegions({
  mainRegion: '#main-region'
});
app.RootModel = Backbone.Model.extend({
  root: '//127.0.0.1:8000/api/weather/',
  fetch: function(options) {
    this.url = this.root + encodeURIComponent(this.get('q')) + '/';
    return Backbone.Model.prototype.fetch.call(this, options);
  }
});
app.StaticView = Marionette.ItemView.extend({
  template: '#static-template',
  ui: {
    search: '.js-search-btn',
    query: '.js-query-fld',
    temp: '.js-temp',
    condition: '.js-condition',
    wind: '.js-wind',
    wind_power: '.js-wind-power',
    pressure: '.js-pressure',
    humidity: '.js-humidity',
    icon: '.js-icon',
    location: '.js-location',
    error: '.js-error-block',
    errorTitle: '.js-error-title',
    result: '.js-result-block',
  },
  events: {
    'click @ui.search': 'search'
  },
  timer: null,
  refresh: function() {
    var current = this.model.get('current');
    var location = this.model.get('location');
    var address = location.name + ', ' + location.country;
    // температура
    var temp = current.temp_c;
    // погода
    var condition = current.condition.text;
    // погода
    var icon = current.condition.icon;
    // ветер
    var wind_dir = current.wind_dir;
    // ветер сила
    var wind_power = current.wind_kph;
    // давление
    var pressure = current.pressure_mb;
    // влажность
    var humidity = current.humidity;
    // размещение текста в элементах представления
    this.ui.icon.attr('src', icon);
    this.ui.temp.text(temp + " Co");
    this.ui.condition.text(condition);
    this.ui.wind.text(wind_dir);
    this.ui.wind_power.text(wind_power + " km/h");
    this.ui.pressure.text(pressure + " mb");
    this.ui.humidity.text(humidity + " %");
    this.ui.location.text(address);
  },
  fetch: function() {
    var that = this;
    this.model.fetch({
      success: function() {
        that.ui.result.removeClass('dnone');
        that.ui.error.addClass('dnone');

        that.refresh();
      },
      error: function(model, json) {
        that.ui.errorTitle.text(json.statusText);
        that.ui.error.removeClass('dnone');
        that.ui.result.addClass('dnone');
      }
    });
  },
  search: function() {
    var that = this;
    var query = transl(this.ui.query.val());
    this.model.set('q', query);
    if (this.timer) clearInterval(this.timer);
    this.fetch();
    this.timer = setInterval(function() {
      that.fetch();
    }, 1000*60);
  }
});
app.on('start', function() {
  var staticView = new app.StaticView({
    model: new app.RootModel({
      key: '78f26cd450d44500953134819172807',
      q: 'Minsk',
      id: 1
    })
  });
  app.mainRegion.show(staticView);
});
$(function() {
  app.start();
});

