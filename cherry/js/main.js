// jQuery UI draggable 适配移动端
var moveFlag = 0; // 是否移动的flag

(function ($) {
    var proto = $.ui.mouse.prototype, _mouseInit = proto._mouseInit;
    $.extend(proto, {
        _mouseInit: function () {
            this.element.bind("touchstart." + this.widgetName, $.proxy(this, "_touchStart"));
            _mouseInit.apply(this, arguments);
        }, _touchStart: function (event) {
            this.element.bind("touchmove." + this.widgetName, $.proxy(this, "_touchMove")).bind("touchend." + this.widgetName, $.proxy(this, "_touchEnd"));
            this._modifyEvent(event);
            $(document).trigger($.Event("mouseup"));
            //reset mouseHandled flag in ui.mouse
            this._mouseDown(event);
            //console.log(this);
            //return false;

            //--------------------touchStart do something--------------------
            // console.log("i touchStart!");

        }, _touchMove: function (event) {
            moveFlag = 1;
            this._modifyEvent(event);
            this._mouseMove(event);

            //--------------------touchMove do something--------------------
            // console.log("i touchMove!");

        }, _touchEnd: function (event) {
            // 主动触发点击事件
            if (moveFlag == 0) {
                var evt = document.createEvent('Event');
                evt.initEvent('click', true, true);
                // this.handleElement[0].dispatchEvent(evt);
            }
            this.element.unbind("touchmove." + this.widgetName).unbind("touchend." + this.widgetName);
            this._mouseUp(event);
            moveFlag = 0;

            //--------------------touchEnd do something--------------------
            // console.log("i touchEnd!");

        }, _modifyEvent: function (event) {
            event.which = 1;
            var target = event.originalEvent.targetTouches[0];
            event.pageX = target.clientX;
            event.pageY = target.clientY;
        }
    });
})(jQuery);

// 图片上传 
function BaseImage() {//图片1上传的函数方法      

    //获取上传的图片文件 
    // var f = imgFile.files[0];

    var filereader = new FileReader();//新建一个图片对象
    filereader.onload = function () {//图片加载完成后执行的函数      
        var srcpath = base64;
        //这里获取图片的路径（图片会被转为base6格式）   
        $("#baseimg").attr("src", srcpath);//将获取的图片使用jquery的attr()方法插入到id为baseimg的图片元素里    
    };

    //ndata为base64格式地址
    var ndata = base64;

    let arr = ndata.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    let f = new Blob([u8arr], { type: mime })

    filereader.readAsDataURL(f);//读取图片（将插入的图片读取显示出来）
}

function StyleImage(imgFile) { //图片2上传的函数方法（原理同上）    

    var filereader = new FileReader();
    filereader.onload = function (event) {
        var srcpath = event.target.result;
    };

    var reader = new FileReader();
    reader.readAsDataURL(imgFile.files[0]);
    reader.onload = function(){

        var str = String(reader.result).substring(23);
        // var str = String(reader.result);

        $.ajax({
            //请求方式
            type: "POST",
            //请求地址
            url: "http://39.108.73.181/yinghua/test/bodySeg",
            xhrFields: {
                withCredentials: true
            },
            data: str,
            //请求成功
            success: function (result) {

                var returnStr = result.data;

                var seStr = "data:image/jpg;base64," + returnStr;
    
                $("#styleimg").attr("src", seStr);
    
                let arr = seStr.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                let f = new Blob([u8arr], { type: mime })
    
                filereader.readAsDataURL(f);
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    };

}

$(function () {

    $(".drg").draggable();//这里使用jquery ui的拖拽方法  draggable()；作用是可以让图片2进行拖拽 
    $(".drg").resizable();//这里使用jquery ui的缩放方法  resizable()；作用是可以让图片2进行缩放
})

function down() {//这个函数是点击下载执行的方法      
    html2canvas($(".whole"), { //这是使用了html2canvas这个插件的方法，将class为whole的整个节点绘制成画布       
        onrendered: function (canvas) {  //画布绘制完成后执行下面内容，function内的canvas这个参数就是已经被绘制成画布          
            var link = document.createElement('a');//创建一个a标签        
            link.download = 'cherry.jpg';//a标签增加一个download属性，属性值（my-image-name.jpg）就是合成下载后的文件名       
            link.href = canvas.toDataURL();//canvas.toDataURL()就是画布的路径，将路径赋给a标签的href         
            link.click();//模拟a标签被点击，这样就可以下载了       
        },
    })
}