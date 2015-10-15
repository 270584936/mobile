define(function(require, exports, module) {
	$('head').append('<link rel="stylesheet" type="text/css" href="https://a.alipayobjects.com/amui/dpl/9.0.0.2/view/city-select.css">');
	var cityListData = [{
		adcode: '1100',
		cityname: '北京'
	}, {
		adcode: '3100',
		cityname: '上海'
	}, {
		adcode: '4401',
		cityname: '广州'
	}, {
		adcode: '4403',
		cityname: '深圳'
	}, {
		adcode: '4201',
		cityname: '武汉'
	}, {
		adcode: '1200',
		cityname: '天津'
	}, {
		adcode: '3201',
		cityname: '南京'
	}, {
		adcode: '8100',
		cityname: '香港'
	}, {
		adcode: '5000',
		cityname: '重庆'
	}, {
		adcode: '3301',
		cityname: '杭州'
	}, {
		adcode: '2101',
		cityname: '沈阳'
	}, {
		adcode: '2102',
		cityname: '大连'
	}, {
		adcode: '5101',
		cityname: '成都'
	}, {
		adcode: '2201',
		cityname: '长春'
	}, {
		adcode: '3205',
		cityname: '苏州'
	}, {
		adcode: '4406',
		cityname: '佛山'
	}, {
		adcode: '5301',
		cityname: '昆明'
	}, {
		adcode: '6101',
		cityname: '西安'
	}, {
		adcode: '4101',
		cityname: '郑州'
	},{
		adcode: '2301',
		cityname: '哈尔滨'
	},{
		adcode: '4301',
		cityname: '长沙'
	},{
		adcode: '3302',
		cityname: '宁波'
	},{
		adcode: '3202',
		cityname: '无锡'
	}];
	function City(){
	}
	module.exports = City;
	
	City.prototype.init = function(){
		var cityListHtm = "";
		for (var i = 0; i < cityListData.length; i++) {
			var item = cityListData[i];
			cityListHtm += '<li><a adcode="'+item.adcode+'" href="#">' + item.cityname + '</a></li>';
		}
		$('#hotCity').html(cityListHtm);
		
		$('.am-city-select-list a').on('click', function() {
			$('#city_select .am-list-control').text($(this).text());
			$('#city_select .am-list-control').attr('adcode',$(this).attr('adcode'));
			$('section').hide();
			$('#index').show();
		});
	}
});