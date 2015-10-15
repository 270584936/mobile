define(function (require, exports, module) {

    function Test() {
    }

    module.exports = Test;

    Test.prototype.render = function () {
        $('#mapImg').on('click', function (e) {
            var mapImgH = $('#mapImg').height();

            $('#point').html('<div class="circle" style="position: absolute;margin-left: ' + (e.offsetX + 100 - 6) + ';margin-top: ' + (-mapImgH - 7 + e.offsetY) + 'px;"></div>')
            $('.circle').on('click',function(e){
                e.stopPropagation();
                console.log('circle onclick');
            });
            console.log("offset " + e.offsetX + " " + e.offsetY);
        });
    }
})