define(function(require, exports, module) {
	$('head')
			.append(
					'<link rel="stylesheet" type="text/css" href="https://a.alipayobjects.com/amui/dpl/9.0.0.2/view/city-select.css">');

	StationList.prototype.cache = {
		curCity : {
			adcode : null,
			name : null
		},
		dataForDrw : {},
		cities : {},
		lines : {},
		stations : {},
		stationsInfo : {},
		stationspoi : {},
		offset : {}
	};
	function StationList() {

	}
	module.exports = StationList;

	StationList.prototype.init = function(target, adcode, adcodeName) {
		function removeAllSpace(str) {
			return str.replace(/\s+/g, "");
		}
		$('#station_city').html(adcodeName);
		var that = this;
		this.loadData(adcode, function(drwData) {
			console.log("drwData: " + drwData);
			var stData = {};
			var lines = drwData.lines;
			for ( var line in lines) {
				var stArray = lines[line].st;
				for ( var i in stArray) {
					if (stData[stArray[i].poiid] && stData[stArray[i].poiid].l.indexOf(lines[line].kn) == -1) {
						stData[stArray[i].poiid].l.push(lines[line].kn);
						stData[stArray[i].poiid].lines.push(lines[line]);
					} else {
						stData[stArray[i].poiid] = {
							name : stArray[i].n,
							poiid : stArray[i].poiid,
							sp : removeAllSpace(stArray[i].sp),
							l : [ lines[line].kn ],
							lines : [ lines[line] ]
						};
					}
				}
			}
			console.log("stData: " + stData);
			var stDataGroupHeads = [];
			var stDataGroup = {};
			for ( var key in stData) {
				var c = stData[key].sp[0].toUpperCase();
				if (!stDataGroup[c]) {
					stDataGroup[c] = [ stData[key] ];
					stDataGroupHeads.push(c);
				} else {
					stDataGroup[c].push(stData[key]);
				}
			}
			stDataGroupHeads.sort();
			var stationListHtml = '';
			for ( var i in stDataGroupHeads) {
				stationListHtml += '<div class="am-city-select-group" group="' + stDataGroupHeads[i]
						+ '"><div class="am-city-select-order">' + stDataGroupHeads[i]
						+ '</div><ul class="am-city-select-list">';
				var stations = stDataGroup[stDataGroupHeads[i]];
				for ( var j in stations) {
					var _st = stations[j];
					var _stView = '<div class="fn-right">';
					if (_st.l.length > 1) {
						_st.lines.sort(that.sortLines);
						for ( var i in _st.lines) {
							_stView += '<span class="am-travel-icon" style="background-color:#'+_st.lines[i].cl+';" am-cl="' + _st.lines[i].cl + '" am-value="'
									+ _st.lines[i].kn + '">' + _st.lines[i].kn + '</span>';
						}
					}
					_stView +='</div>';
					
					stationListHtml += '<li class="fn-clear"><div class="fn-left"><a sp="' + stations[j].sp + '">' + stations[j].name + '</a></div>'
							+ _stView + '</li>';
				}
				stationListHtml += '</ul></div>';
			}

			$('#stationList').html(stationListHtml);

			$('#stationSearch').bind('keyup.DT search.DT input.DT paste.DT cut.DT', function() {
				that._fnThrottle(that.search, 200);
			});

		});

		$('#stationList .am-city-select-group li').on('click', function(e) {
			$(target + ' .am-list-control .adcode').html($(this).find('a').html());
			$('section').hide();
			$('#index').show();
		});
	}
	
	StationList.prototype.sortLines = function (a,b){
		return a.kn - b.kn;
	}

	StationList.prototype.search = function() {
		var stGroupArray = $("#stationList .am-city-select-group");
		var searchValue = $('#stationSearch').val();
		for (var i = 0; i < stGroupArray.length; i++) {
			var sts = $(stGroupArray[i]).find('li a');
			var showFlag = false;
			for (var j = 0; j < sts.length; j++) {
				if ($(sts[j]).attr('sp').indexOf(searchValue) == -1) {
					$(sts[j]).hide();
				} else {
					$(sts[j]).show();
					showFlag = true;
				}
			}
			if (showFlag) {
				$(stGroupArray[i]).show();
			} else {
				$(stGroupArray[i]).hide();
			}
		}
	}

	StationList.prototype._fnThrottle = function(fn, freq) {
		var frequency = freq !== undefined ? freq : 200, last, timer;

		var that = this, now = +new Date(), args = arguments;

		if (last && now < last + frequency) {
			clearTimeout(timer);

			timer = setTimeout(function() {
				last = undefined;
				fn.apply(that, args);
			}, frequency);
		} else {
			last = now;
			fn.apply(that, args);
		}
	}
	StationList.prototype.fileNameData = {
		'1100' : 'beijing',
		'3100' : 'shanghai',
		'4401' : 'guangzhou',
		'4403' : 'shenzhen',
		'4201' : 'wuhan',
		'1200' : 'tianjin',
		'3201' : 'nanjing',
		'8100' : 'xianggang',
		'5000' : 'chongqing',
		'3301' : 'hangzhou',
		'2101' : 'shenyang',
		'2102' : 'dalian',
		'5101' : 'chengdu',
		'2201' : 'changchun',
		'3205' : 'suzhou',
		'4406' : 'foshan',
		'5301' : 'kunming',
		'6101' : 'xian',
		'4101' : 'zhengzhou',
		'2301' : 'haerbin',
		'4301' : 'changsha',
		'3302' : 'ningbo',
		'3202' : 'wuxi'
	};

	StationList.prototype.loadData = function(adcode, callback) {
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
				if (data.l[i].su == '1') {
					var _coords = data.l[i].c;
					for (var q = 0; q < _coords.length; q++) {
						var _c = _coords[q].split(' ');
						_coords[q] = (Number(_c[0]) + _x) + ' ' + (Number(_c[1]) + _y);
					}
					data.l[i].c = _coords;
					for (var j = 0; j < data.l[i].st.length; j++) {
						var _p = data.l[i].st[j].p.split(' ');
						data.l[i].st[j].p = (Number(_p[0]) + _x) + ' ' + (Number(_p[1]) + _y);
						if (data.l[i].st[j].su == '1') {
							that.cache.cities[data.i].stations.push(data.l[i].st[j]);
							that.cache.stations[data.l[i].st[j].si] = data.l[i].st[j];
							that.cache.stationspoi[data.l[i].st[j].poiid] = data.l[i].st[j];
						}
					}

					var _lpo = data.l[i].lp;
					if (_lpo) {
						for (var s = 0; s < _lpo.length; s++) {
							var _lp = _lpo[s].split(' ');
							_lpo[s] = (Number(_lp[0]) + _x) + ' ' + (Number(_lp[1]) + _y);
						}
						data.l[i].lp = _lpo;
					}
					that.cache.cities[data.i].linesNamePos[data.l[i].ls] = data.l[i].lp;
					that.cache.cities[data.i].lines.push(data.l[i]);
					that.cache.lines[data.l[i].ls] = data.l[i]; // 写入line
				}

			}
			// self.toCache(data, info_data);
			callback(that.cache.cities[city_code]);
			that.cache.curCity.adcode = city_code;
			that.cache.curCity.name = that.cache.cities[city_code].name;
		}, function() {
			alert('数据加载失败！');
		});
	}
});