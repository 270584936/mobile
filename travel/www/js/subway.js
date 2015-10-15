define(function(require, exports, module) {
	function Subway() {

	}
	module.exports = Subway;

	Subway.prototype.init = function(travelActionName,adcode,travelAction) {
		$('head').append('<link rel="stylesheet" type="text/css" href="../subway/css/style.css">');
		SW.swInit();
		SW.travelActionName=travelActionName;
		SW.travelAction=travelAction;
		SW.defaultAdcode=adcode;
	}
	
	//subway  main
	window.amapCache = window.amapCache || {};
	(function(window, undefined) {
	    var enabledLocalstorage = false,
	        defaultOption = {},
	        cacheFileListName = {},
	        cacheDomListName = {},
	        cacheFileListObj = {},
	        storage;

	    //to see if we can use localStorage
	    try {
	        storage = window.localStorage;
	        storage.setItem('TEST', 'TEST');
	        storage.getItem('TEST');
	        storage.removeItem('TEST');
	        enabledLocalstorage = true;
	    } catch (e) {
	        enabledLocalstorage = false;
	    }

	    // clear localStorage that not fetch to the file list from server
	    var _clearLocalStorage = function() {
	        for (var i = storage.length - 1; i >= 0; i--) {
	            var key = storage.key(i);
	            var subway_key = key.split("/")[0];
	            if(subway_key == 'data'){
	                if (!cacheFileListName[key]) {
	                    storage.removeItem(key);
	                }
	            }
	        }
	    };

	    // load the newest file list from server
	    var _loadNewestVersion = function(callback) {
	        $.get(defaultOption.versionPath, function(data) {
	            cacheFileListObj = data;
	            window.amapCache.cacheFileListObj = data;
	            window.amapCache.newestVersion = data;
	            var key;
	            for (key in window.amapCache.newestVersion) {
	                if (window.amapCache.newestVersion.hasOwnProperty(key)) {
	                    var dom_key = key.split('/')[1].split('_')[0];
	                    cacheFileListName[key + '_' + window.amapCache.newestVersion[key]] = true;
	                    // if(key.split('/')[1].split('_')[1] == 'drw'){
	                    //     cacheFileListName[dom_key + '_dom_' + window.amapCache.newestVersion[key]] = true;
	                    // }
	                }
	            }
	            _clearLocalStorage();
	            callback && callback();
	        }, 'json');
	    };

	    var _init = function(option) {
	        if (enabledLocalstorage) {
	            defaultOption.versionPath = option.versionPath || '../subway/data/version/version.json';
	            _loadNewestVersion(option.complete);
	        } else {
	            option.complete();
	        }
	    };
	    window.amapCache.init = _init;

	    // load data from server or localStorage
	    var _loadDataFromServer = function(url, callback, error) {
	        // $.get(url, callback);
	        $.ajax({
	            url: url,
	            type: 'get',
	            method: 'get',
	            dataType: 'json',
	            success: callback,
	            error: error
	        });
	    };
	    
	    var _loadData = function(filePath, callback, error) {
	        var fileMD5 = cacheFileListObj[filePath];
	        if (enabledLocalstorage) {
	            var storageKey = filePath + '_' + cacheFileListObj[filePath];
	            var subwayData = storage.getItem(storageKey);
	            if (subwayData) {
	                if(Object.prototype.toString.call(subwayData) == '[object String]'){
	                    callback(JSON.parse(subwayData));
	                } else {
	                    callback(subwayData);
	                }
	            } else {
	                _loadDataFromServer(filePath, function(data) {
	                    if(Object.prototype.toString.call(data) == '[object String]'){
	                        data = JSON.parse(data);
	                    }
	                    storage.setItem(storageKey, JSON.stringify(data));
	                    callback(data);
	                }, error);
	            }
	        } else {
	            _loadDataFromServer(filePath, function(data) {
	                if(Object.prototype.toString.call(data) == '[object String]'){
	                    data = JSON.parse(data);
	                }
	                callback(data);
	            }, error);
	        }
	    };
	    window.amapCache.loadData = _loadData;
	    window.amapCache.cacheFileListObj = cacheFileListObj;
	    window.amapCache.enabledLocalstorage = enabledLocalstorage;
	}(window));;var SW = {
		travelActionName: "start",
		travelAction: "travelAction",
		defaultAdcode: '1100',
		cache: {
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
		},
		datas: [],
		info_datas: [],
		// 从adcode前四位读取文件名称
		fileNameData: {
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
		},
		cityname:{
			'1100': '\u5317\u4eac',//北京,
			'3100': '\u4e0a\u6d77',//上海,
			'4401': '\u5e7f\u5dde',//广州,
			'4403': '\u6df1\u5733',//深圳,
			'4201': '\u6b66\u6c49',//武汉,
			'1200': '\u5929\u6d25',//天津,
			'3201': '\u5357\u4eac',//南京,
			'8100': '\u9999\u6e2f',//香港,
			'5000': '\u91cd\u5e86',//重庆,
			'3301': '\u676d\u5dde',//杭州,
			'2101': '\u6c88\u9633',//沈阳,
			'2102': '\u5927\u8fde',//大连,
			'5101': '\u6210\u90fd',//成都,
			'2201': '\u957f\u6625',//长春,
			'3205': '\u82cf\u5dde',//苏州,
			'4406': '\u4f5b\u5c71',//佛山,
			'5301': '\u6606\u660e',//昆明,
			'6101': '\u897f\u5b89',//西安,
			'4101': '\u90d1\u5dde',//郑州,
			'2301': '\u54c8\u5c14\u6ee8',//哈尔滨,
			'4301': '\u957f\u6c99',//长沙
			'3302': '\u5b81\u6ce2',//宁波
			'3202': '\u65e0\u9521'//无锡
		},
		swInit: function() {
			var self = this;
			FastClick.attach(document.body);
			amapCache.init({
				complete: function() {
					
					self.initCity(); //根据缓存加载相应城市
					tip.init();
				}
			});
		},
		initCity: function() {
			var self = this;
			self.changeCity();
			// 通过监听hashchange来更改城市
			$(window).on('hashchange', function() {
				self.changeCity();
			});
		},
		changeCity: function() {
			var self = this;
			var hash = window.location.hash.replace(/^\#/, '');
			var param = self.param2json(hash);
			// var search = window.location.search.replace(/^\?/, '');
			// var param = self.param2json(search);
			// console.log('search',search);
			// console.log('param',param);
			if(!param){
				return
			}
			var adcode = param.city.substr(0, 4);
			// var lnglat = param.lnglat? param.lnglat : '';
			// var detail = param.detail? param.detail : 'false';
			// var poiid = param.poiid? param.poiid : '';
			$("#subway-svg,#infowindow-content,#tip-content,.line-caption").remove();
			if(adcode != ''){
				if (!self.fileNameData[adcode]) {
					//adcode错误默认北京
					adcode = self.defaultAdcode;
				} else {
					adcode = adcode;
				}
			}else{
				adcode = self.defaultAdcode;
			}
			// 此城市有地铁
			var ua = navigator.userAgent;
			if(/Android/i.test(ua)) {
				self.loading();
				self.loadData(adcode, function(drwData) {
					self.loadingOver();
					drwSw.draw(drwData, param);
				});
			}else{
				self.loadData(adcode, function(drwData) {
					drwSw.draw(drwData, param);
				});
			}	
		},
		loadDom: function(adcode){
			var dom_key = adcode + '_dom_' + amapCache.cacheFileListObj['../subway/data/' + adcode + '_drw_' + SW.adcode + '.json'];
	        if(amapCache.enabledLocalstorage) {
	            window.localStorage.getItem(dom_key);
	        }
		},

		loadData: function(adcode, callback) {
			var self = this;
			var city_code = adcode;
			var city_name = self.fileNameData[adcode];
			if (SW.cache.cities[city_code]) {
				callback(SW.cache.cities[city_code]);
				SW.cache.curCity.adcode = city_code;
				SW.cache.curCity.name = SW.cache.cities[city_code].name;
			} else {
				var requestUrl = "../subway/data/" + city_code + "_drw_" + city_name + ".json";
				amapCache.loadData(requestUrl, function(data) {
					SW.cache.dataForDrw[data.i] = data;
					SW.cache.cities[data.i] = SW.cache.cities[data.i] || {};
					SW.cache.cities[data.i].name = data.s;
					SW.cache.cities[data.i].id = data.i;
					SW.cache.cities[data.i].offset = data.o;
					SW.cache.cities[data.i].lines = [];
					SW.cache.cities[data.i].linesNamePos = {};
					SW.cache.cities[data.i].stations = [];
					SW.cache.cities[data.i].zolines = {};
					SW.cache.cities[data.i].zostations = [];
					var _offset = data.o.split(',');
					SW.cache.offset[data.i] = SW.cache.offset[data.i] || {};
					var _x = 1000 - Number(_offset[0]);
					var _y = 1000 - Number(_offset[1]);
					SW.cache.offset[data.i].x = _x;
					SW.cache.offset[data.i].y = _y
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
									SW.cache.cities[data.i].stations.push(data.l[i].st[j]);
									SW.cache.stations[data.l[i].st[j].si] = data.l[i].st[j];
									SW.cache.stationspoi[data.l[i].st[j].poiid] = data.l[i].st[j];
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
							SW.cache.cities[data.i].linesNamePos[data.l[i].ls] = data.l[i].lp;
							SW.cache.cities[data.i].lines.push(data.l[i]);
							SW.cache.lines[data.l[i].ls] = data.l[i]; //写入line
						}
						
					}
					// self.toCache(data, info_data);
					callback(SW.cache.cities[city_code]);
					SW.cache.curCity.adcode = city_code;
					SW.cache.curCity.name = SW.cache.cities[city_code].name;
				}, function () {
					alert('数据加载失败！');
				});

				requestUrl = "../subway/data/" + city_code + "_info_" + city_name + ".json";
				amapCache.loadData(requestUrl, function(info_data) {
					for (var k = 0; k < info_data.l.length; k++) {
						for (var l = 0; l < info_data.l[k].st.length; l++) {
							SW.cache.stationsInfo[info_data.l[k].st[l].si] = info_data.l[k].st[l];
						}
					}
				});
			}
		},
		loading: function(){

			$('.loading-outer').css('position','fixed');
	    	$('.loading-bg').css({
	    		'position': 'fixed',
	    		'display': 'block'
	    	});
	    	$('.loading-bg .loading').css('top','-30px');
	    },
	    loadingOver: function(){
	    	$('.loading-bg').css('display','none');
	    },
	    param2json: function (str) {
	    	var json = {};
	    	if(/^[0-9]*$/.test(str)){
	    		json.city = str;
	    		return json
	    	}else{
	    		var strArr = str.split('&');
	    	
		    	if(strArr.length > 0){
		    		for(var i = 0; i < strArr.length; i++){
		    			var item = strArr[i].split('=');
		    			var key = item[0];
		    			var value = item[1];
		    			json[key]= value; 
		    		}
		    		return json
		    	}else{  
		    		return false
		    	}
	    	}
	    }
	};;var drwSw = {
		currLines: {},
		w: $(window).width(),
		h: $(window).height(),
		t_top: 0,
		t_left: 0,
		moveX: 0,
		moveY: 0,
		font_size: 12,
		nearHightLight: 14,
		isNearTip: false,
		label_angle: {
			'0': [0, -1],
			'1': [1, -1],
			'2': [1, 0],
			'3': [1, 1],
			'4': [0, 1],
			'5': [-1, 1],
			'6': [-1, 0],
			'7': [-1, -1]
		},
		curOffset: {},
		sortline: null,
		isAndroid2Ver: false,
		ns_svg: "http://www.w3.org/2000/svg",
		isAndroid2: function() {
			var self = this;
			var version;
			var ua = navigator.userAgent;
			if (/Android (\d+\.\d+)/.test(ua)) {
				version = parseFloat(RegExp.$1);
			}
			if (version < 3.0) {
				self.isAndroid2Ver = true;
			} else {
				self.isAndroid2Ver = false;
			}
		},
		initDraw: function(drwData, param) {
			var self = this;
			self.t_left = 0;
			self.t_top = 0;
			self.isAndroid2();
			var screenX = parseInt(self.w / 2),
				screenY = parseInt(self.h / 2),
				originX,
				originY,
				ox,
				oy,
				lightStation = {},
				adcode = drwData.id,
				detail = param.detail;
			if(detail == 'true'){
				var detailStation = self.getDetailStation(drwData, param);
				lightStation.id = detailStation;
				lightStation.detail = true;
				if(detailStation){
					var offset = SW.cache.stations[detailStation].p;
					ox = parseInt(offset.split(' ')[0]);
					oy = parseInt(offset.split(' ')[1]);
				}else{
					ox = 1000;
					oy = 1000;
				}
			}else{
				//'4401':广州
				//'2102':大连
				//'3205':苏州
				var nearStation = self.getNearStation(drwData, param);
				lightStation.id = nearStation;
				lightStation.detail = false;
				if(nearStation){
					var offset = SW.cache.stations[nearStation].p;
					ox = parseInt(offset.split(' ')[0]);
					oy = parseInt(offset.split(' ')[1]);
				}else{
					ox = 1000;
					oy = 1000;
				}
			}
			
			originX = ox;
			originY = oy;
			var moveX = originX - screenX;
			var moveY = originY - screenY;
			self.deletInProgress(drwData);
			if (self.isAndroid2Ver) {
				self.drawCanvasSubway(drwData,lightStation);
			} else {
				self.drawSvgSubway(drwData,lightStation);
			}
			// setTimeout(function() {
				window.scrollTo(moveX, moveY);
			// }, 200);
		},
		draw: function(drwData, param) {
			this.currLines = {};
			this.initDraw(drwData, param);
		},
		drawCanvasSubway: function(drwData,station) {
			var self = this;
			$('#subwayCanvas').css('display', 'block');
			$('.station-out-box').css('display', 'block');
			$('#subwaySvg').css('display', 'none');
			self.setCanvasTrans(drwData);
			self.drawCanvas(drwData,station);
		},
		drawSvgSubway: function(drwData,station) {
			var self = this;
			$('#subwayCanvas').css('display', 'none');
			$('.station-out-box').css('display', 'none');
			$('#subwaySvg').css('display', 'block');
			var adcode = drwData.id;
			// var dom_key = adcode + '_dom_' + amapCache.cacheFileListObj['data/' + adcode + '_drw_' + SW.fileNameData[adcode] + '.json'];
			// if (amapCache.enabledLocalstorage) {
			// 	if (window.localStorage.getItem(dom_key)) {
			// 		var svg_dom = window.localStorage.getItem(dom_key);
			// 		$('#subwaySvg').html(svg_dom);
			// 	} else {
			// 		self.drwSwBox(drwData);
			// 		self.drawSvg(drwData, dom_key);
			// 	}
			// } else {
			self.drwSwBox(drwData);
			self.drawSvg(drwData,station);
			// }
		},
		drwSwBox: function(drwData) {
			var self = this;
			var subway_svg = document.getElementById("subwaySvg");
			var subway_content = document.createElementNS(self.ns_svg, 'svg');
			subway_content.setAttribute("class", "subway-content");
			subway_content.setAttribute("id", "subway-svg");
			subway_content.setAttribute("adcode", drwData.id);
			subway_content.setAttribute("viewBox", "0 0 2000 2000");
			subway_content.style.width = "2000px";
			subway_content.style.height = "2000px";
			subway_svg.appendChild(subway_content);
			var subway_box = document.createElementNS(self.ns_svg, 'g');
			subway_box.setAttribute("id", "subway-box");
			subway_content.appendChild(subway_box);
			var svg_g = document.createElementNS(self.ns_svg, 'g');
			svg_g.setAttribute("id", "svg-g");
			var top, left;
			top = self.t_top;
			left = self.t_left;
			svg_g.setAttribute("transform", "translate(" + left + "," + top + ") scale(1)");
			svg_g.setAttribute("pointer-events", "suto");
			subway_box.appendChild(svg_g);
		},
		setCanvasTrans: function(drwData) {
			var self = this;
			var canvas = document.getElementById("subwayCanvas");
			var context = canvas.getContext("2d");
			canvas.setAttribute('adcode', drwData.id);
			var top, left;
			top = self.t_top;
			left = self.t_left;
			_translate = [left, top];
			context.translate(_translate[0], _translate[1]);
		},
		deletInProgress: function(drwData) {
			var self = this;
			var j = 0;
			for (var i = 0; i < drwData.lines.length; i++) {
				if (drwData.lines[i].su != "3") {
					self.currLines[drwData.lines[i].ls] = drwData.lines[i];
				}
			}
		},
		lineSort: function(){
			var self = this;
			self.sortline = [];
			for (id in self.currLines) {
				var index = parseInt(self.currLines[id].x);
				var line_id = self.currLines[id].ls;
				self.sortline[index - 1] = line_id;
			}
		},
		addCaption: function(drwData) {
			var self = this;
			var subway_caption = $('#subway-caption');
			for(var i = 0; i < self.sortline.length; i++){
				var caption_item = $('<div class="line-caption"></div>');
				var la = SW.cache.lines[self.sortline[i]].la;
				var html = '';
				if(!la || la == ''){
					html = SW.cache.lines[self.sortline[i]].ln;
				}else{
					html = SW.cache.lines[self.sortline[i]].ln + '<div class="caption_la">( '+ SW.cache.lines[self.sortline[i]].la +' )</div>'
				}
				caption_item.html(html);
				caption_item.attr('id','caption-' + self.sortline[i]);
				caption_item.attr('lineid', self.sortline[i]);
				caption_item.css('background','#' + SW.cache.lines[self.sortline[i]].cl);
				subway_caption.append(caption_item);
			}
		},
		drawSvg: function(drwData, station, dom_key) {
			var self = this;
			var status = 'normal';
			self.lineSort();
			self.drwSwLines(self.currLines,status);
			self.drwSwStations(drwData,status,station);
			self.drwSwStationsName(drwData, status, 12, 20); //缩小为0.5，第二个参数为24
			self.drawBg(self.currLines);
			self.drwSwLinesName(drwData);
			self.addCaption(self.currLines);
			// self.drawSelectLine(SW.cache.lines['110002']);
			// var dom = $('#subwaySvg').html();
			// window.localStorage.setItem(dom_key, dom);
		},
		drawBg: function () {
			var self = this;
			var svg_g = document.getElementById("svg-g");
			var subway_bg = document.createElementNS(self.ns_svg, 'g');
			subway_bg.setAttribute("id", "g-bg");
			svg_g.appendChild(subway_bg);	
			var bg_rect = document.createElementNS(self.ns_svg, 'rect');
			bg_rect.setAttribute('id','select_bg');
			bg_rect.setAttribute('x',0);
			bg_rect.setAttribute('y',0);
			bg_rect.setAttribute('width',2000);
			bg_rect.setAttribute('height',2000);
			subway_bg.appendChild(bg_rect);
		},
		drawSelectLine: function (drwData) {
			var self = this;
			var status = 'select';
			var svg_g = document.getElementById("svg-g");
			var subway_select_g = document.createElementNS(self.ns_svg, 'g');
			subway_select_g.setAttribute("id", "g-select");
			svg_g.appendChild(subway_select_g);
			self.drwSwLines(drwData, status);
			self.drwSwStations(drwData,status);
			self.drwSwStationsName(drwData, status, 12, 20); //缩小为0.5，第二个参数为24
		},
		drawCanvas: function(drwData,lightstation) {
			var self = this;
			var canvas = document.getElementById("subwayCanvas");
			var context = canvas.getContext("2d");
			
			var adcode = drwData.id;
			$.each(self.currLines, function(key, line) {
				// 画线路
				self.cDrawLine(line, context);
				// 画线路名
				self.cDrawLineName(line, context);
			});
			// 画文字和站点圆圈
			$.each(drwData.stations, function(key, station) {
				// 画站点圆
				self.cDrawStationCircle(station, context);
				// 添加站点dom
				self.cCreateStationOut(station, adcode, lightstation);
				// 画文字
				self.cDrawStationText(station, context);
			});
			if(lightstation){
				self.cDrawHeightlightCircle(lightstation, context);
			}
		},
		// 绘制地铁线路
		drwSwLines: function(drwData,status) {
			var self = this;
			var svg_g = document.getElementById("svg-g");
			var subway_line = document.createElementNS(self.ns_svg, 'g');
			subway_line.setAttribute("id", "g-line-" + status );
			if(status == 'normal'){
				svg_g.appendChild(subway_line);
				for (var id in drwData) {
					var dataset_line_arr = drwData[id].c;
					var node_first = 'M' + dataset_line_arr[0].split(' ').join(',');
					var path = node_first + 'L' + dataset_line_arr.join('L');
					var line_path = document.createElementNS(self.ns_svg, 'path');
					line_path.setAttribute("id", "line-" + drwData[id].ls);
					line_path.setAttribute("name", drwData[id].ls);
					line_path.setAttribute("stroke", "#" + drwData[id].cl);
					line_path.setAttribute("d", path);
					subway_line.appendChild(line_path);
				}
			}else if(status == 'select'){
				var svg_select =  document.getElementById("g-select");
				svg_select.appendChild(subway_line);
				var dataset_line_arr = drwData.c;
				var node_first = 'M' + dataset_line_arr[0].split(' ').join(',');
				var path = node_first + 'L' + dataset_line_arr.join('L');
				var line_path = document.createElementNS(self.ns_svg, 'path');
				line_path.setAttribute("id", "line-" + drwData.ls);
				line_path.setAttribute("name", drwData.ls);
				line_path.setAttribute("stroke", "#" + drwData.cl);
				line_path.setAttribute("d", path);
				subway_line.appendChild(line_path);
			}
			
		},
		//绘制地铁线路名
		drwSwLinesName: function(drwData) {
			var self = this;
			var data = drwData.linesNamePos;
			var svg_g = document.getElementById("svg-g");
			var subway_line_name = document.createElementNS(self.ns_svg, 'g');
			subway_line_name.setAttribute("id", "g-line-name");
			svg_g.appendChild(subway_line_name);
			for (id in data) {
				if (data[id] != null) {
					for (var i = 0; i < data[id].length; i++) {
						var line_name = SW.cache.lines[id].ln;
						var line_name_w = line_name.length * self.font_size + 6;
						var line_name_h = 20;
						var line_color = SW.cache.lines[id].cl;
						var line_name_x = parseInt(data[id][i].split(" ")[0]);
						var line_name_y = parseInt(data[id][i].split(" ")[1]) - 15;
						var _line_name = document.getElementById("g-line-name");
						var line_name_g = document.createElementNS(self.ns_svg, 'g');
						line_name_g.setAttribute('transform','translate(' + line_name_x + ',' + line_name_y + ')');
						line_name_g.setAttribute('class','line_name');
						line_name_g.setAttribute("lineid", id);
						var line_namr_bg = document.createElementNS(self.ns_svg, 'rect');
						line_namr_bg.setAttribute("rx", 3);
						line_namr_bg.setAttribute("ry", 3);
						line_namr_bg.setAttribute("width", line_name_w);
						line_namr_bg.setAttribute("height", line_name_h);
						line_namr_bg.setAttribute("fill", "#" + line_color);
						line_name_g.appendChild(line_namr_bg);
						var line_name_text = document.createElementNS(self.ns_svg, 'text');
						line_name_text.setAttribute("class", "line_name_txt");
						line_name_text.setAttribute("lineid", id);
						line_name_text.setAttribute("height", 20);
						line_name_text.setAttribute("x", line_name_w/2);
						line_name_text.setAttribute("y", line_name_h/2);
						line_name_text.setAttribute("dy", 4);
						line_name_text.setAttribute("fill", "#fff");
						line_name_text.setAttribute("text-anchor", "middle");
						line_name_text.textContent = line_name;
						line_name_g.appendChild(line_name_text);
						subway_line_name.appendChild(line_name_g);
					}
				}
			}
		},
		// 绘制地铁站点
		drwSwStations: function(drwData, status, lightstation) {
			var self = this;
			var svg_g = document.getElementById("svg-g");
			var subway_station_g = document.createElementNS(self.ns_svg, 'g');
			subway_station_g.setAttribute("id", "g-station-" + status);
			if(status == 'normal'){
				svg_g.appendChild(subway_station_g);
			}else if(status == 'select'){
				var svg_select =  document.getElementById("g-select");
				svg_select.appendChild(subway_station_g);
			}
			var station = drwData.stations || drwData.st;
			for (var i = 0; i < station.length; i++) {
				if(station[i].su == "1"){
					var subway_circle_g = document.createElementNS(self.ns_svg, 'g');
					subway_circle_g.setAttribute("id", "g-" + station[i].si);
					subway_circle_g.setAttribute("class", "g-station");
					subway_station_g.appendChild(subway_circle_g);

					if (station[i].t == "0") {

						var subway_station = document.createElementNS(self.ns_svg, 'circle');
						subway_station.setAttribute("cx", parseInt(station[i].p.split(" ")[0]));
						subway_station.setAttribute("cy", parseInt(station[i].p.split(" ")[1]));
						subway_station.setAttribute("r", 7);
						subway_station.setAttribute("fill", "#FFF");
						subway_station.setAttribute("stroke-width", 2);
						subway_station.setAttribute("stroke", "#000");
						subway_circle_g.appendChild(subway_station);
					} else if ((station[i].t == "1")) {
						var subway_station_transfer = document.createElementNS(self.ns_svg, 'image');
						subway_station_transfer.setAttribute("x", parseInt(station[i].p.split(" ")[0]) - 13);
						subway_station_transfer.setAttribute("y", parseInt(station[i].p.split(" ")[1]) - 13);
						subway_station_transfer.setAttribute("width", 26);
						subway_station_transfer.setAttribute("height", 26);
						subway_station_transfer.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", "../subway/img/transfer-station.png");
						subway_circle_g.appendChild(subway_station_transfer);
					}
					//高亮显示站点
					var lightId = lightstation && lightstation.id;
					if(station[i].si == lightId){
						var data = SW.cache.stations[lightId];
						var subway_station = document.createElementNS(self.ns_svg, 'circle');
						subway_station.setAttribute("id","near-" + lightId);
						subway_station.setAttribute("class","near-station");
						subway_station.setAttribute("cx", parseInt(data.p.split(" ")[0]));
						subway_station.setAttribute("cy", parseInt(data.p.split(" ")[1]));
						subway_station.setAttribute("r", 14);
						subway_station.setAttribute("fill", "#007aff");
						subway_station.setAttribute("fill-opacity", 0.4);
						subway_circle_g.appendChild(subway_station);
						if(!lightstation.detail){
							if(!($("#tip-content").length > 0)){
								self.nearTip(lightId);
								$("#tip-content").addClass("open");
							}
						}
					}
					var subway_station_out = document.createElementNS(self.ns_svg, 'circle');
					subway_station_out.setAttribute("cx", parseInt(station[i].p.split(" ")[0]));
					subway_station_out.setAttribute("cy", parseInt(station[i].p.split(" ")[1]));
					subway_station_out.setAttribute("line_id", station[i].r.split("|")[0]);
					subway_station_out.setAttribute("station_id", station[i].si);
					subway_station_out.setAttribute("station_poiid", station[i].poiid);
					subway_station_out.setAttribute("r", 13);
					subway_station_out.setAttribute("fill", "#FFF");
					subway_station_out.setAttribute("fill-opacity", "0");
					subway_circle_g.appendChild(subway_station_out);
				}
			}
		},

		// 绘制地铁站点名称
		drwSwStationsName: function(drwData, status, fontSize, h) {
			var self = this;
			var data = drwData.stations || drwData.st || drwData;
			var svg_g = document.getElementById("svg-g");
			var subway_station_name_g = document.createElementNS(self.ns_svg, 'g');
			subway_station_name_g.setAttribute("id", "g-station-name-" + status);
			if(status == 'normal'){
				svg_g.appendChild(subway_station_name_g);
			}else if(status == 'select'){
				var svg_select =  document.getElementById("g-select");
				svg_select.appendChild(subway_station_name_g);
			}
			var subway_station_name = document.createElementNS(self.ns_svg, 'g');
			subway_station_name.setAttribute("id", "g-name");
			subway_station_name_g.appendChild(subway_station_name);

			for (var i = 0; i < data.length; i++) {
				if(data[i].su == "1"){
					if (data[i].t != "2") {
						var station_name = document.createElementNS(self.ns_svg, 'text');
						station_name.style.fontSize = fontSize + "px";
						station_name.setAttribute("id", "name-" + data[i].si);
						station_name.setAttribute("name", data[i].n);
						station_name.textContent = data[i].n;
						var direct = data[i].lg,
							text_anchor, x, y;
						if (direct == "0" || direct == "4") {
							text_anchor = "middle";
						} else {
							text_anchor = "left";
						}
						station_name.setAttribute("text-anchor", text_anchor);
						if (direct == "0" || direct == "4") {
							x = parseInt(data[i].p.split(" ")[0]);
						} else if (direct == "5" || direct == "6" || direct == "7") {
							x = parseInt(data[i].p.split(" ")[0]) - data[i].n.length * fontSize - 10;
						} else if (direct == "1" || direct == "2" || direct == "3") {
							x = parseInt(data[i].p.split(" ")[0]) + 10;
						}
						if (direct == "2" || direct == "6") {
							y = parseInt(data[i].p.split(" ")[1]) + 5;
						} else if (direct == "0" || direct == "1" || direct == "7") {
							y = parseInt(data[i].p.split(" ")[1]) - 10;
						} else if (direct == "3" || direct == "4" || direct == "5") {
							y = parseInt(data[i].p.split(" ")[1]) + h; //缩小为最小级别是为30，其他为20
						}
						station_name.setAttribute("x", x);
						station_name.setAttribute("y", y);
						subway_station_name.appendChild(station_name);
					}
				}
			}
		},
		//canvas绘制线路
		cDrawLine: function(line, context) {
			var self = this;
			// 线宽度 
			context.lineWidth = 7;
			var firstLocation = line.c[0].split(/\s+/);
			var FirstX = parseFloat(firstLocation[0]);
			var FirstY = parseFloat(firstLocation[1]);
			context.beginPath();
			context.moveTo(FirstX, FirstY);
			$.each(line.c, function(key, item) {
				var location = item.split(/\s+/);
				var x = parseFloat(location[0]);
				var y = parseFloat(location[1]);
				context.lineTo(x, y);
			});

			// 线路颜色
			context.strokeStyle = "#" + line.cl;
			context.stroke();
		},
		//canvas绘制站点
		cDrawStationCircle: function(station, context) {
			var self = this;
			var location = station.p.split(/\s+/);
			var x = parseFloat(location[0]);
			var y = parseFloat(location[1]);
			if (station.t == '0') {
				// 线宽度 
				context.lineWidth = 4;
				// 圆圈颜色
				context.strokeStyle = "#000000";
				// 圆圈填充颜色
				context.fillStyle = "#FFFFFF";
				context.beginPath();
				context.arc(x, y, 6, 0, 2 * Math.PI);
				context.stroke();
				context.fill();
			} else if (station.t == '1') {
				var img = document.getElementById("transfer-img");
				context.drawImage(img, x - 13, y - 13, 26, 26);
			}
		},
		cDrawHeightlightCircle: function(lightstation, context) {
			var id = lightstation.id;
			var self = this;
			if(id){
				var location = SW.cache.stations[id].p.split(/\s+/);
				var x = parseFloat(location[0]);
				var y = parseFloat(location[1]);
				// 圆圈填充颜色
				context.fillStyle = "#007aff";
				context.globalAlpha = "0.4";
				context.beginPath();
				context.arc(x, y, 14, 0, 2 * Math.PI);
				context.fill();
			}
		},
		//绘制线路名
		cDrawLineName: function(line, context) {
			var self = this;
			var data = line.lp;
			var line_name = line.ln;
			var line_color = line.cl;
			var w = line_name.length * self.font_size + 6;
			var h = 20;
			var r = 5;
			if (data) {
				for (var i = 0; i < data.length; i++) {
					var x = parseInt(data[i].split(" ")[0]);
					var x1 = parseInt(data[i].split(" ")[0]) + w/2;
					var y = parseInt(data[i].split(" ")[1]) - 15;
					var y1 = parseInt(data[i].split(" ")[1]);
					context.beginPath(); 
					context.moveTo(x + r, y); 
					context.lineTo(x + w - r, y); 
					context.quadraticCurveTo(x + w, y, x + w, y + r); 
					context.lineTo(x + w, y + h - r); 
					context.quadraticCurveTo(x + w, y + h, x + w - r, y+ h); 
					context.lineTo(x + r, y + h); 
					context.quadraticCurveTo(x, y + h, x, y + h - r); 
					context.lineTo(x, y + r); 
					context.quadraticCurveTo(x, y, x + r, y); 	
					context.fillStyle = "#" + line_color;
					context.fill();
					context.fillStyle = "white";
					context.textAlign = "center";
					context.font = self.font_size + 'px Microsoft YaHei';
					context.fillText(line_name, x1, y1);
				}	
			}
		},
		//生成a标签
		cCreateStationOut: function(station, adcode, lightstation) {
			var self = this;
			var station_out_box = $('.station-out-box');
			var location = station.p.split(/\s+/);
			var x, y;
			var station_out;
			x = parseFloat(location[0]) - 13;
			y = parseFloat(location[1]) - 13;
			var lightId = lightstation && lightstation.id;
			if(station.si == lightId){
				station_out= $('<a class="station-out near-station" id="near-'+ lightId +'" line_id=' + station.r.split('|')[0] + ' station_id=' + station.si + ' station_poiid='+ station.poiid +' station_name=' + station.n + '></a>');
				setTimeout(function(){
					if(!lightstation.detail){
						if(!($("#tip-content").length > 0)){
							self.nearTip(lightId);
							$("#tip-content").addClass("open");
						}
					}
				},100);	
			}else{
				station_out= $('<a class="station-out" line_id=' + station.r.split('|')[0] + ' station_id=' + station.si + ' station_poiid='+ station.poiid +' station_name=' + station.n + '></a>');
			}
			station_out.css({
				'display:': 'block',
				'width': '26px',
				'height': '26px',
				'position': 'absolute',
				'top': y,
				'left': x
			});
			station_out_box.append(station_out);
		},
		//canvas绘制站点名
		cDrawStationText: function(station, context) {
			var self = this;
			// 文字基线
			context.textBaseline = 'middle';
			context.textAlign = 'center';

			// 计算站点名称偏移量
			var fontWidth = station.n.length * self.font_size,
				fontHeight = self.font_size;
			var offsetX = self.label_angle[station.lg][0] * (fontWidth / 2 + 10),
				offsetY = self.label_angle[station.lg][1] * (fontHeight / 2 + 10);

			var location = station.p.split(/\s+/);
			var x = parseFloat(location[0]) + offsetX;
			var y = parseFloat(location[1]) + offsetY;

			context.fillStyle = "#000000";
			context.font = self.font_size + 'px Microsoft YaHei';
			context.lineWidth = 0.5;
			context.fillText(station.n, x, y);
		},
		//离我最近TIP
	    nearTip: function(id){
	        var self = this;
	        //生成窗体
	        var subway_box = $('#subway');
	        var type;
	        var tip_w = 172, tip_h = 73;
	        var obj = $("#near-" + id);
	        var obj_left = obj.offset().left, obj_top = obj.offset().top;
	        var tip_left,tip_top;
	        if(obj_left < 60 || (obj_top < 60 && obj_left < 60) || (obj_top < 60 && (obj_left > 60 && obj_left < 1880))){
	            type = 'l'
	        }else if(obj_left > 1880 || (obj_top < 60 && obj_left > 1880)){
	            type = 'r'
	        }else{
	            type = 't'
	        } 
	        var tip_content = $('<div class="tip-content" id="tip-content"><div class="tip-near tip-' + type + '"><img class="near-img" src="../subway/img/near_' + type + '.png"/></div></div>');
	        subway_box.append(tip_content);
	        if(type == 'l'){
	        	tip_left = obj_left;
	        	tip_top = obj_top;
	        }else if(type == 'r'){
	        	tip_left = obj_left;
	        	tip_top = obj_top;
	        }else{
	        	tip_left = obj_left + self.nearHightLight;
	        	tip_top = obj_top;
	        }
	        $('.tip-content').css({
	            top: tip_top + 'px',
	            left: tip_left + 'px'
	        });
	        self.isNearTip = true;
	    },
		//getDistance 获得两点的距离
		getDistance: function(a, b) {//a是当前位置
			var self = this;
			var R = 6378137, // earth radius in meters
				d2r = Math.PI / 180,
				dLat = (b.lat - a.lat) * d2r,
				dLon = (b.lng - a.lng) * d2r,
				lat1 = a.lat * d2r,
				lat2 = b.lat * d2r,
				sin1 = Math.sin(dLat / 2),
				sin2 = Math.sin(dLon / 2);
			var c = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);
			return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
		},
		toLnglat: function(param){
			var self = this;
			if(!param){
				return false;
			}
			var tmp = param.split(',');
			var lng = tmp[0];
			var lat = tmp[1];

			return {
				lng: lng,
				lat: lat
			}
		},
		getDetailStation: function (drwData, param) {
			var self = this,
				poiid = param.poiid,
				lnglat = param.lnglat,
				station = SW.cache.stationspoi[poiid];
			if(station){
				return station.si;
			}else{
				return self.getNearStation(drwData, param);
			}
		},
		getNearStation: function(drwData, param){
			var self = this;
			var lnglat = param.lnglat;
			var minDistance = -1, curDistance = 0;
			var stations = drwData.stations;
			var curPos = self.toLnglat(lnglat), stationPos;
			var minId, curId;
			for(var i = 0; i < stations.length; i++){
				stationPos = self.toLnglat(stations[i].sl);
				curId = stations[i].si;
				if(stations[i].sl != ''){
					curDistance = self.getDistance(curPos, stationPos);
				}else{
					curDistance = 100000
				}
				if(minDistance == -1 || curDistance <  minDistance){
					minDistance = curDistance;
					minId = curId;
				}
			}
			if(minDistance < 10000){
				return minId;
			}else{
				return false;
			}
		}
	};;function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
	};
	var tip = {
	    isHighlight: false,
	    isInfoShow: false,
	    stationsInfo: SW.cache.stationsInfo,
	    stations: SW.cache.stations,
	    lines: SW.cache.lines,
	    station_w: 26,
	    init: function() {
	        this.bindEvent();
	    },
	    bindEvent: function() {
	        var self = this;
	        var font_size = 12;
	        $('#subway').on('click','.line-caption',function () {
	            var line_id = $(this).attr('lineid');
	            $('#g-select').remove();
	            $('#g-bg').css('display','block');
	            drwSw.drawSelectLine(SW.cache.lines[line_id]);
	        });
	        $('#subway').on('click','g',function () {
	            if($(this).hasClass('line_name')){
	                var line_id = $(this).attr('lineid');
	                $('#g-select').remove();
	                $('#g-bg').css('display','block');
	                drwSw.drawSelectLine(SW.cache.lines[line_id]);
	            }
	        });
	        $('#subway').on('click','#g-bg',function () {
	            $('#g-select').remove();
	            $('#g-bg').css('display','none');
	        });
	        $('#subway').on('click','circle',function(e){
	            e.stopPropagation();
	            e.preventDefault();
	            var obj = $(this);
	            self.openInfowindow(obj);
	            if($(this).closest('.g-station').find(".near-station").length > 0){
	                self.closeNearTip();
	            }
	        });
//	        $('#subway').on('mouseenter','circle',function(e){
//	            e.stopPropagation();
//	            e.preventDefault();
//	            var obj = $(this);
//	            self.openInfowindow(obj);
//	            if($(this).closest('.g-station').find(".near-station").length > 0){
//	                self.closeNearTip();
//	            }
//	        });
	        $('#subway').on('click','.travel-action-name',function(e){
	        	e.stopPropagation();
	            e.preventDefault();
	            SW.travelAction.apply(window,[$("#info-title #station-name").html()]);
	        });
	        
	        $('.station-out-box').on('click','.station-out', function(e){
	            e.stopPropagation();
	            e.preventDefault();
	            var obj = $(this);
	            self.openInfowindow(obj);
	            if($(this).hasClass("near-station")){
	                self.closeNearTip();
	            }
	        });
	        $('.station-out-box').on('touchstart','.station-out', function(e){
	            e.stopPropagation();
	            // e.preventDefault(); 
	        });
	        $("#subway").on("click", ".close_info_btn", function(e){
	            self.closeInfoWindow(e);
	        });
	        $(document).on('click',function(e){
	            self.closeInfoWindow(e);
	        });
	        $("#subway").on('click', '#infowindow-content', function(e) {
	            e.stopPropagation();
	            // e.preventDefault();
	        });
	        $("#subway").on('touchstart', '#infowindow-content', function(e) {
	            e.stopPropagation();
	            // e.preventDefault();
	        });
	    },
	    closeInfoWindow: function(e){
	        var self = this;
	        // e.stopPropagation;
	        $("#infowindow-content").remove();
	        if($("#tip-content").length > 0){
	            $("#tip-content").css("display","block").addClass("open");
	        }
	    },
	    closeNearTip: function(){
	        var self = this;
	        var obj = $(".tip-content");
	        if(drwSw.isNearTip){
	            if(obj.hasClass('open')){
	                obj.css("display","none").removeClass("open");
	            }
	        }
	    },
	    openInfowindow: function(obj){
	        var self = this;
	        //设置站点的id和名称及关联线路id
	        var select_ref_line_id = obj.attr("line_id");
	        var select_station_id = obj.attr("station_id");
	        var select_station_name = obj.attr("station_name");
	        //移除当前打开的infowindow
	        $('#infowindow-content').remove();
	        //生成infowindow
	        var type = self.setInfowindowType(obj);
	        self.createInfowindow(type);
	        //写首发时间数据
	        self.loadinfo(select_ref_line_id, select_station_id);
	        //设置infowindow的位置，保证生成infowindow后获取宽高信息
	        self.setInfowindowPos(type, obj);
	        self.updateTravelActionName();
	    },
	    setInfowindowType: function(object){
	        var left = object.offset().left;
	        var top = object.offset().top;
	        var type;
	        if(left < 160 || (top < 160 && left < 160) || (top < 160 && (left > 160 && left < 1680))){
	            type = 'r'
	        }else if(left > 1680 || (top < 160 && left > 1680)){
	            type = 'l'
	        }else{
	            type = 't'
	        }
	        return type;
	    },
	    updateTravelActionName:function(){
	    	if(SW.travelActionName == 'end'){
	    		$('#infowindow-content .travel-action-name').html('到这去');
	    	} else {//start
	    		$('#infowindow-content .travel-action-name').html('从这出发');
	    	}
	    },
	    createInfowindow: function(type){
	        var self = this;
	        var subway_box = $('#subway');
	        var infowin_content = $('<div class="infowindow-content" id="infowindow-content">');
	        var html = '';
	        subway_box.append(infowin_content);
	        if(type == 't'){
	            html = '<div class="info-window-top-out"><div class="info-window"><h3 id="info-title"><a href="javascript:void(0)" class="travel-action-name" style="float:left; font-size: 14px;height: 34px;line-height: 34px;color: #fff;"></a><span id="station-name"></span><a href="javascript:void(0)" class="close_info_btn">×</a></h3><div id="info-content"><div class="info-detail-content info-content-item info-time"></div></div></div><div class="info-window-bottom"><div class="arrow-bg"><i class="arrow"></i></div></div></div>';
	        }else if(type == 'r'){
	            html = '<div class="info-window-left-out"><div class="info-window-left"><div class="arrow-bg"><i class="arrow"></i></div></div><div class="info-window"><h3 id="info-title"><span id="station-name"></span><a href="javascript:void(0)" class="close_info_btn">×</a></h3><div id="info-content"><div class="info-detail-content info-content-item info-time"></div></div></div></div>';
	        }else if(type == 'l'){
	            html = '<div class="info-window-right-out"><div class="info-window"><h3 id="info-title"><span id="station-name"></span><a href="javascript:void(0)" class="close_info_btn">×</a></h3><div id="info-content"><div class="info-detail-content info-content-item info-time"></div></div></div><div class="info-window-right"><div class="arrow-bg"><i class="arrow"></i></div></div></div>';
	        }
	        infowin_content.append(html);
	    },
	    setInfowindowPos: function(type, obj){
	    	var _top = 34, _left=10;//地图div的偏移量
	        var self = this;
	        var info_win = $('.info-window'), info_content = $('#infowindow-content');
	        var info_win_w = info_win.width(), info_win_h = info_win.height();
	        var obj_left = obj.offset().left - _left, obj_top = obj.offset().top - _top;
	        var infowindow_left, infowindow_top;
	        if(type == 't'){
	            infowindow_left = obj_left + self.station_w / 2;
	            infowindow_top = obj_top;
	        }else if(type == 'l'){
	            infowindow_left = obj_left;
	            infowindow_top = obj_top;
	        }else if(type == 'r'){
	            infowindow_left = obj_left;
	            infowindow_top = obj_top;
	        }
	        info_content.css({
	            top: infowindow_top + 'px',
	            left: infowindow_left + 'px'
	        });
	    },
	    
	    loadinfo: function(lineId, nodeId) {        
	        var self = this;
	        var select_station_dpt_time = [],
	            select_station_name, select_station_ref_line = [],
	            infowHtml = [];
	        select_station_dpt_time = self.stationsInfo[nodeId].d;
	        select_station_name = self.stations[nodeId].n;
	        select_station_ref_line = self.stations[nodeId].r.split("|");
	        var current_station = {};
	        for (var i = 0, len = select_station_dpt_time.length; i < len; i++) {
	            var item = select_station_dpt_time[i];
	            if (!current_station[item.ls]) {
	                current_station[item.ls] = [];
	            }
	            current_station[item.ls].push(item);
	        }
	        $("#info-title #station-name").html(select_station_name);
	        var lineid = '';
	        for (lineid in current_station) {
	            if (current_station.hasOwnProperty(lineid)) {
	                if(self.lines[lineid]){
	                    var line_sub_name = self.lines[lineid].la;
	                    if(line_sub_name == ''){

	                    }else{
	                        line_sub_name = '(' + line_sub_name + ')';
	                    }
	                    infowHtml.push("<div class=\"time-item\">");
	                    infowHtml.push("<h4 class=\"time-item-title\" style=\"border-bottom:1px solid #" + self.lines[lineid].cl + "\"><label class=\"line-label\" style=\"background-color:#" + self.lines[lineid].cl + ";\">地铁" + self.lines[lineid].ln + "</label><label class=\"line-sub-label\">" +  line_sub_name + "</label></h4>");
	                    infowHtml.push("<ul class=\"time-item-main\">");
	                    for (var j = 0; j < 2; j++) {
	                        if (current_station[lineid][j]) {
	                            var first_time = current_station[lineid][j].ft;
	                            var last_time = current_station[lineid][j].lt;
	                            // if(^([0-1]\d|2[0-3]):[0-5]\d$)
	                            if(first_time.split(':')[0] != '--' && last_time.split(':')[0] != '--'){
	                                infowHtml.push("<li class=\"time-item-detail\">");
	                                infowHtml.push("<div class=\"train-direct fl\"><label class=\"direct-label\">开往</label><span class=\"direct-name\">" + self.stations[current_station[lineid][j].n].n + "</span></div>"); //下一站名，表示方向
	                                infowHtml.push("<div class=\"train-time fl\">");
	                                infowHtml.push("<div class=\"start-time time-box fl\"><label class=\"time-label\">首</label><span class\"time\">" + first_time + "</span></div>"); //首发
	                                infowHtml.push("<div class=\"last-time time-box fl\"><label class=\"time-label\">末</label><span class=\"time\">" + last_time + "</span></div>"); //末发
	                                infowHtml.push("</div>");
	                                infowHtml.push("</li>");
	                            }
	                        }
	                    }
	                    infowHtml.push("</ul>");
	                    infowHtml.push("</div>");
	                }
	                
	            }
	        }
	        $(".info-time").html(infowHtml.join(""));
	    }
	};
});