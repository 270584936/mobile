define(function (require, exports, module) {

    function Index() {
    }

    module.exports = Index;

    Index.prototype.animate = function (container, animate) {
        console.log("Index animate: " + animate);
        var clearAnimated = function () {
            $(this).removeClass(animate);
            console.log("Index removeClass: " + $(this) + " " + animate);
        };
        container.addClass('animated ' + animate).on('webkitAnimationEnd', clearAnimated).on('animationend', clearAnimated);
    }

    Index.prototype.render = function () {
        this.renderTab($($('#type_select .am-tab-item')[0]), 'fadeInDown',
            function () {
                $('#loading').hide();
            });

        var that = this;
        $('#type_select .am-tab-item').on('click', function () {
            $('#loading').show();
            that.renderTab($(this), 'fadeInDown', function () {
                $('#loading').hide();
            });
        });

        $('body').on('swipeLeft', function (e) {
            switchTab(that, 'fadeInRight');
        });
        $('body').on('swipeRight', function (e) {
            switchTab(that, 'fadeInLeft');
        });

        function switchTab(index, animate) {
            $('#loading').show();
            if ($('#index').css('display') == 'none') {
                return;
            }
            var size = $('#type_select .am-tab-item').size();
            var targetTab = $('#type_select .am-tab-item')[0];
            $('#type_select .am-tab-item').each(function (i) {
                var tab = $('#type_select .am-tab-item')[i];
                if ($(tab).data('tab') == 'selected') {
                    if ((i + 1) == size) {
                        targetTab = $('#type_select .am-tab-item')[0];
                    } else {
                        targetTab = $('#type_select .am-tab-item')[i + 1];
                    }
                    return false;
                }
            });
            index.renderTab($(targetTab), animate, function () {
                $('#loading').hide();
            });
        }
    }

    Index.prototype.renderTab = function (tab, animate, success) {
        var that = this;
        $('#indexContent').removeClass();
        $('#type_select .am-tab-item').data('tab', '');
        tab.data('tab', 'selected');
        $.ajax({
            type: 'GET',
            url: '../travel/' + tab.data('target') + '.html',
            dataType: 'text/html',
            timeout: 300,
            success: function (data) {
                $('#indexContent').html(data);
                that.animate($('#indexContent'), animate);
                success();
            },
            error: function (xhr, type) {
                alert('error!');
            }
        });
    }

    Index.prototype.bindCitySelect = function () {
    	$('#city_select .am-list-control').bind('DOMNodeInserted',function(){
    		$('#startStation_select .am-list-control .adcode').html('请选择出发站');
    		$('#endStation_select .am-list-control .adcode').html('请选择到达站');
    	});
        $('#city_select').on('click', function () {
            $('section').hide();
            $.ajax({
                type: 'GET',
                url: '../travel/city.html',
                dataType: 'text/html',
                timeout: 300,
                success: function (data) {
                    $('#city').html(data);
                    var City = require('./city');
                    var _city = new City();
                    _city.init();
                    $('#city').show();
                },
                error: function (xhr, type) {
                    alert('error!');
                    $('#index').show();
                }
            });
        });
    }

    Index.prototype.updateToMapViewport = function(){
    	var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute('content', 'width=1000, initial-scale=0.5, maximum-scale=2.0, minimum-scale=0.5');
    }
    Index.prototype.updateToDefaultViewport = function(){
    	var viewport = document.querySelector("meta[name=viewport]");
    	viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0');
    }
    
    Index.prototype.bindStationSelect = function () {
        $('#startStation_select .adcode').on('click', function () {
            $('section').hide();
            $.ajax({
                type: 'GET',
                url: '../travel/station.html',
                dataType: 'text/html',
                timeout: 300,
                success: function (data) {
                    $('#station').html(data);
                    var Station = require('./station');
                    var _station = new Station();
                    $('#station').show();
                    _station.init('#startStation_select',$('#city_select .am-list-control').attr('adcode')); //坑、scroller组件必须在station.show之后布局才能正常显示
                },
                error: function (xhr, type) {
                    alert('error!');
                    $('#index').show();
                }
            });
        });

        $('#endStation_select .adcode').on('click', function () {
            $('section').hide();
            $.ajax({
                type: 'GET',
                url: '../travel/station.html',
                dataType: 'text/html',
                timeout: 300,
                success: function (data) {
                    $('#station').html(data);
                    var Station = require('./station');
                    var _station = new Station();
                    $('#station').show();
                    _station.init('#endStation_select',$('#city_select .am-list-control').attr('adcode'));
                },
                error: function (xhr, type) {
                    alert('error!');
                    $('#index').show();
                }
            });
        });
        
    	var that = this;
        $('#startStation_select .adicon').on('click', function () {
            $('section').hide();
            $('#loading').show();
            $.ajax({
                type: 'GET',
                url: '../travel/subway.html',
                dataType: 'text/html',
                timeout: 300,
                success: function (data) {
                    $('#station').html(data);
                    var Subway = require('./subway');
                    that.updateToMapViewport();
                    var _subway = new Subway();
                    $('#station').show();
                    _subway.init("start",$('#city_select .am-list-control').attr('adcode'),function(stationName){
                    	console.log("stationName：" + stationName);
                    	$('#startStation_select .am-list-control .adcode').html(stationName);
                    	that.updateToDefaultViewport();
                    	$('section').hide();
                    	$('#index').show();
                    });
                    $('#loading').hide();
                },
                error: function (xhr, type) {
                    alert('error!');
                    $('#index').show();
                }
            });
        });
        $('#endStation_select .adicon').on('click', function () {
        	$('section').hide();
        	$('#loading').show();
            $.ajax({
                type: 'GET',
                url: '../travel/subway.html',
                dataType: 'text/html',
                timeout: 300,
                success: function (data) {
                    $('#station').html(data);
                    var Subway = require('./subway');
                    that.updateToMapViewport();
                    var _subway = new Subway();
                    $('#station').show();
                    _subway.init("end",$('#city_select .am-list-control').attr('adcode'),function(stationName){
                    	console.log("stationName：" + stationName);
                    	$('#endStation_select .am-list-control .adcode').html(stationName);
                    	that.updateToDefaultViewport();
                    	$('section').hide();
                    	$('#index').show();
                    	});
                    $('#loading').hide();
                },
                error: function (xhr, type) {
                    alert('error!');
                    $('#index').show();
                }
            });
        });
    }

});