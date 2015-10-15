define(function(require, exports, module) {
	// $('head').append('<link rel="stylesheet" type="text/css"
	// href="../css/scroller.css">');
	Station.prototype.cache = {
			curCity: {
				adcode: null,
				name: null
			},
			dataForDrw: {},
			cities: {},
			lines: {},
			stations: {},
			stationsInfo: {},
			stationspoi: {},
			offset: {}
		};
	function Station() {

	}
	module.exports = Station;

	Station.prototype.init = function(target,adcode) {
		var adcodeName='';
		var Scroller = require('./scroller');
		this.loadData(adcode, function(drwData) {
			console.log("drwData: " + drwData);
			var lineData = [];
			for(var line in drwData.lines){
				lineData.push({name:drwData.lines[line].ln,value:drwData.lines[line].ls});
			}
			var lineScroller = new Scroller('#lineScroller', {
				data :lineData,
				defaultValue : 0,
				onSelect : function(value) {
					console.log(value);
					showStations(drwData.lines,value);
				}
			});
			showStations(drwData.lines,lineData[0].value);
			function showStations(lines,lineValue){
				var stData = [];
				for(var line in lines){
					if(lineValue == lines[line].ls){
						var stArray = lines[line].st;
						for(var i in stArray){
							stData.push({name : stArray[i].n,value: stArray[i].n})
						}
						break;
					}
				}
				$('#stationScroller').html('');
				adcodeName = stData[0].name;
				new Scroller('#stationScroller', {
					template : '<div class="scroller-component scroller-component-2x" data-role="component"> \
						  <div class="scroller-mask scroller-mask-2x" data-role="mask"></div> \
						  <div class="scroller-indicator scroller-indicator-2x" data-role="indicator"></div> \
						  <div class="scroller-content" data-role="content"></div> \
						</div>',
					data : stData,
					defaultValue : 0,
					onSelect : function(value) {
						console.log(value);
						adcodeName = value;
					}
				});
			}
		});

		/*
		new Scroller('#lineScroller', {
			data : [ {
				name : '1号线',
				value : 0
			}, {
				name : '2号线',
				value : 1
			},{
				name : '3号线',
				value : 1
			}, {
				name : '4号线',
				value : 1
			},{
				name : '5号线',
				value : 1
			}, {
				name : '6号线',
				value : 1
			} ],
			defaultValue : 0,
			onSelect : function(value) {
				console.log(value);
			}
		});
		new Scroller('#stationScroller', {
			template : '<div class="scroller-component scroller-component-2x" data-role="component"> \
				  <div class="scroller-mask scroller-mask-2x" data-role="mask"></div> \
				  <div class="scroller-indicator scroller-indicator-2x" data-role="indicator"></div> \
				  <div class="scroller-content" data-role="content"></div> \
				</div>',
			data : [ {
				name : '世纪大道',
				value : 0
			}, {
				name : '人民广场',
				value : 1
			},{
				name : '世纪大道',
				value : 0
			}, {
				name : '人民广场',
				value : 1
			},{
				name : '世纪大道',
				value : 0
			} ],
			defaultValue : 0,
			onSelect : function(value) {
				console.log(value);
			}
		});
		 */
		$('#stationConfirm').on('click', function() {
			//$('#startStation_select .am-list-content').text();
			$(target + ' .am-list-control .adcode').html(adcodeName)
			$('section').hide();
			$('#index').show();
		});

	}
	Station.prototype.fileNameData = {
		'1100': 'beijing',
		'3100': 'shanghai',
		'4401': 'guangzhou',
		'4403': 'shenzhen',
		'4201': 'wuhan',
		'1200': 'tianjin',
		'3201': 'nanjing',
		'8100': 'xianggang',
		'5000': 'chongqing',
		'3301': 'hangzhou',
		'2101': 'shenyang',
		'2102': 'dalian',
		'5101': 'chengdu',
		'2201': 'changchun',
		'3205': 'suzhou',
		'4406': 'foshan',
		'5301': 'kunming',
		'6101': 'xian',
		'4101': 'zhengzhou',
		'2301': 'haerbin',
		'4301': 'changsha',
		'3302': 'ningbo',
		'3202': 'wuxi'
	};
	
	Station.prototype.loadData = function (adcode, callback) {
		var that = this;
		var city_code = adcode;
		var city_name = this.fileNameData[adcode];
		var requestUrl = "../subway/data/" + city_code + "_drw_" + city_name + ".json";
		amapCache.loadData(requestUrl, function(data) {
			that.cache.dataForDrw[data.i] = data;
			that.cache.cities[data.i] = that.cache.cities[data.i] || {};
			that.cache.cities[data.i].name = data.s;
			that.cache.cities[data.i].id = data.i;
			that.cache.cities[data.i].offset = data.o;
			that.cache.cities[data.i].lines = [];
			that.cache.cities[data.i].linesNamePos = {};
			that.cache.cities[data.i].stations = [];
			that.cache.cities[data.i].zolines = {};
			that.cache.cities[data.i].zostations = [];
			var _offset = data.o.split(',');
			that.cache.offset[data.i] = that.cache.offset[data.i] || {};
			var _x = 1000 - Number(_offset[0]);
			var _y = 1000 - Number(_offset[1]);
			that.cache.offset[data.i].x = _x;
			that.cache.offset[data.i].y = _y
			for (var i = 0; i < data.l.length; i++) {
				if(data.l[i].su == '1'){
					var _coords = data.l[i].c;
					for(var q = 0; q < _coords.length; q++){
						var _c = _coords[q].split(' ');
						_coords[q] = (Number(_c[0]) + _x) + ' ' + (Number(_c[1]) + _y);
					}
					data.l[i].c = _coords;
					for (var j = 0; j < data.l[i].st.length; j++) {
						var _p = data.l[i].st[j].p.split(' ');
						data.l[i].st[j].p = (Number(_p[0]) + _x) + ' ' + (Number(_p[1]) + _y);
						if(data.l[i].st[j].su == '1'){
							that.cache.cities[data.i].stations.push(data.l[i].st[j]);
							that.cache.stations[data.l[i].st[j].si] = data.l[i].st[j];
							that.cache.stationspoi[data.l[i].st[j].poiid] = data.l[i].st[j];
						}
					}
					
					var _lpo = data.l[i].lp;
					if(_lpo){
						for(var s = 0; s < _lpo.length; s++){
							var _lp = _lpo[s].split(' ');
							_lpo[s] = (Number(_lp[0]) + _x) + ' ' + (Number(_lp[1]) + _y);
						}
						data.l[i].lp = _lpo;
					}
					that.cache.cities[data.i].linesNamePos[data.l[i].ls] = data.l[i].lp;
					that.cache.cities[data.i].lines.push(data.l[i]);
					that.cache.lines[data.l[i].ls] = data.l[i]; //写入line
				}
				
			}
			// self.toCache(data, info_data);
			callback(that.cache.cities[city_code]);
			that.cache.curCity.adcode = city_code;
			that.cache.curCity.name = that.cache.cities[city_code].name;
		}, function () {
			alert('数据加载失败！');
		});
	}
});