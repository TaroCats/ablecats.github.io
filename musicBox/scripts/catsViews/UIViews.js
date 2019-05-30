/** 
 * 定义：
 * 
 * id 需要指定的ID 在loading用到
 * mviews 需要添加views的ID
 * cviews views的代码
 * viewsid views的ID 例如 $("web")
 * iconColor 图标颜色
 * blurid 模糊层ID
 * blurAlpha 模糊层透明度
 * viewsBGColor views的背景色
 * iconSize 图案大小
 * loadingText 载入提示显示的文字
 * layout 自定义方位
 * handler 回调函数
 * radius 圆角
 * 
 * 函数：
 * 
 * add: addViewWithAnimatiom,  // (mviews, cviews, viewsid, completion)
 * zoom: zoomAnimation,  // (viewsid, viewsSize, viewsBGColor, blurid, blurAlpha, completion)
 * show: showViewsWithAnimatiom,  // (viewsid, completion) 
 * hide: hideViewsWithAnimatiom,  // (viewsid, completion) 
 * video: videoView,  // (id, videoUrl, videoPic, layout)
 * toast: showToastView,  // (viewsid, iconColor, text, duration)
 * shadow: viewsAddShadows,  // (view, radius)
 * remove: removeViewWithAnimatiom,  // (viewsid) 
 * loading: loadingView,  // (id, iconSize, loadingText, canTouch)
 * addLoading: addLoadingView,  // (mviews, iconSize, loadingText)
 * rainbowText: rainbowText,  // (id, text, layout, canTouch, textFont, textFontWidth)
 * removeLoading: removeLoadingView,  // 配合addLoading使用 无参数传递
 * uploadInstall: uploadInstall,  // (appVersion, appId, appKey) 
 * installNumber: installNumber,  // (appId, appKey, handler) 
 * Analysis: Analysis  // (appId, appKey) this is a class, eg: let Analysis = new Analysis(appId, appKey); Analysis.upload(appVersion);
 * 
*/

const host = "192.168.123.2";
const file = $file.read('scripts/catsViews/socketLogger.js');
const path = $file.read("scripts/catsViews/version.json").string;

$app.info.version >= "1.29.0" && host && file ? require('./socketLogger').init(host, '44555', true, true) : 0;

function viewsAddShadows(view, radius) { //在layout中使用即可 给Views添加阴影
    var layer = view.runtimeValue().invoke("layer");
    layer.invoke("setShadowRadius", 5);
    layer.invoke("setShadowOpacity", 0.3);
    layer.invoke("setShadowOffset", $size(3, 3));
    layer.invoke("setCornerRadius", radius ? radius : 10);
    layer.invoke("setShadowColor", $color("gray").runtimeValue().invoke("CGColor"));
}
function addViewWithAnimatiom(mviews, cviews, viewsid, completion) {
    mviews.add(cviews);
    $delay(0.1, () => {
        $ui.animate({
            duration: 0.4,
            animation: function () {
                viewsid ? viewsid.alpha = 1 : 0;
            },
            completion: completion ? completion : () => {

            }
        })
    });
}
function removeViewWithAnimatiom(viewsid) {
    $ui.animate({
        duration: 0.4,
        animation: function () {
            viewsid ? viewsid.alpha = 0 : 0;
        },
        completion: function () {
            viewsid ? viewsid.remove() : 0;
        }
    })
}
function showViewsWithAnimatiom(viewsid, completion) {
    $ui.animate({
        duration: 0.4,
        animation: function () {
            viewsid ? viewsid.alpha = 1 : 0;
        },
        completion: completion ? completion : () => {

        }
    })
}
function hideViewsWithAnimatiom(viewsid, completion) {
    $ui.animate({
        duration: 0.4,
        animation: function () {
            viewsid ? viewsid.alpha = 0 : 0;
        },
        completion: completion ? completion : () => {

        }
    })
}
function zoomAnimation(viewsid, viewsSize, viewsBGColor, blurid, blurAlpha, completion) {
    viewsid.updateLayout(make => {
        make.size.equalTo(viewsSize);
    });
    viewsid.bgcolor = $color(viewsBGColor);
    $ui.animate({
        duration: 1, damping: 0.9, velocity: 0.6,
        animation: () => {
            blurid ? blurid.alpha = blurAlpha : 0;
            viewsid.relayout();
        },
        completion: completion ? completion : () => {

        }
    })
}
function videoView(id, videoUrl, videoPic, layout) {
    let html = $file.read("scripts/catsViews/video/index.html").string;

    html = videoUrl ? html.replace("*.mp4", videoUrl) : html;
    html = videoPic ? html.replace("*.png", videoPic) : html;
    html = videoPic ? html.replace("*.jpg", videoPic) : html;

    return {
        type: "web",
        props: {
            id: id,
            html: html,
            bounces: 0,
            transparent: 1,
            scrollEnabled: 0,
            inlineMedia: true,
            showsProgress: false,
        },
        layout: layout
    }
}
function rainbowText(id, text, layout, canTouch, textFont, textFontWidth) {
    let org = $file.read("scripts/CatsViews/rainbowText.html").string;

    org = text ? org.replace("rainbow", text) : org;
    org = textFont ? org.replace("Helvetica Neue", textFont) : org;
    org = textFontWidth ? org.replace("normal", textFontWidth) : org;

    return {
        type: "web",
        props: {
            id: id,
            html: org,
            bounces: 0,
            transparent: 1,
            scrollEnabled: 0,
            userInteractionEnabled: canTouch ? canTouch : 1
        },
        layout: layout
    }
}
function loadingView(id, iconSize, loadingText, canTouch) {
    return {
        type: "blur",
        props: {
            id: id,
            alpha: 0,
            style: 1,
            userInteractionEnabled: canTouch ? canTouch : 1
        },
        layout: $layout.fill,
        views: [{
            type: "web",
            props: {
                bounces: 0,
                transparent: 1,
                scrollEnabled: 0,
                html: $file.read("scripts/CatsViews/loading.html").string
            },
            layout: (make, view) => {
                make.center.equalTo(view.super)
                make.size.equalTo($size(iconSize, iconSize))
            }
        }, {
            type: "label",
            props: {
                id: "tips",
                text: loadingText ? loadingText : "LOADING..."
            },
            layout: function (make, view) {
                make.centerX.equalTo(view.super)
                make.centerY.equalTo(view.super).offset(80)
            }
        }]
    }
}
function addLoadingView(mviews, iconSize, loadingText) { // 注意： 函数已指定loading的ID为loadingView 搭配remove使用即可
    $("loadingView") ? 0 : mviews.add(loadingView("loadingView", iconSize, loadingText));
    $ui.animate({
        duration: 0.4,
        animation: function () {
            $("loadingView") ? $("loadingView").alpha = 1 : 0;
        }
    })
}
function removeLoadingView() {
    removeViewWithAnimatiom($("loadingView"))
}
function showToastView(viewsid, iconColor, text, duration) {
    let time = new Date().getTime()
    let topInset = viewsid.frame.height / 10
    let textSize = $text.sizeThatFits({
        text: text,
        width: viewsid.width,
        font: $font(15),
    })
    if (duration === undefined) {
        duration = text.length / 5
    }
    if ($("toastView") != undefined) {
        $("toastView").remove()
    }

    viewsid.add({
        type: "view",
        props: {
            id: "toastView",
            bgcolor: $color("clear"),
            alpha: 0,
            userInteractionEnabled: false,
            info: time,
        },
        layout: function (make, view) {
            make.centerX.equalTo(view.super)
            make.top.inset(topInset)
            make.width.equalTo(textSize.width + 60)
            make.height.equalTo(30)
        },
        views: [{
            type: "blur",
            props: {
                style: 1, // 0 ~ 5
                radius: 5,
            },
            layout: $layout.fill
        }, {
            type: "image",
            props: {
                icon: $icon("009", $color(iconColor), $size(16, 16)),
                bgcolor: $color("clear"),
            },
            layout: function (make, view) {
                make.centerY.equalTo(view.super)
                make.size.equalTo($size(16, 16))
                make.left.inset(10)
            }
        }, {
            type: "view",
            layout: function (make, view) {
                make.centerY.equalTo(view.super)
                make.left.equalTo(view.prev.right).inset(0)
                make.right.inset(10)
                make.height.equalTo(view.super)
            },
            views: [{
                type: "label",
                props: {
                    text: text,
                    bgcolor: $color("clear"),
                    textColor: $color("#303032"),
                    font: $font(15),
                },
                layout: function (make, view) {
                    make.center.equalTo(view.super)
                },
            }]
        }]
    })

    $delay(0.05, function () {
        let fView = $("toastView")
        if (fView == undefined) {
            return 0
        }
        fView.updateLayout(function (make) {
            make.top.inset(topInset + 20)
        })
        $ui.animate({
            duration: 0.4,
            animation: function () {
                fView.alpha = 1.0
                fView.relayout()
            },
            completion: function () {
                $delay(duration, function () {
                    let fView = $("toastView")
                    if (fView == undefined) {
                        return 0
                    } else if (fView.info != time) {
                        return 0
                    }
                    fView.updateLayout(function (make) {
                        make.top.inset(topInset)
                    })
                    $ui.animate({
                        duration: 0.4,
                        animation: function () {
                            fView.alpha = 0.0
                            fView.relayout()
                        },
                        completion: function () {
                            if (fView != undefined) {
                                fView.remove()
                            }
                        }
                    })
                })
            }
        })
    })
}

(async function () {
    async function record(n) {
        let res = await download(`https://raw.githubusercontent.com/AbleCats/ablecats.github.io/master/catsViews/${n}?t=${date()}`);
        res.data ? writeFiles(res.data, `scripts/CatsViews/${n}`) : false;
    }
    async function download(url) {
        return await $http.download({
            url: url,
            showsProgress: 0
        });
    }
    async function checkCallBack() {
        ready();
    }

    function writeFiles(s, path) {
        $file.write({
            data: s,
            path: path
        })
    }
    function clearCache() {
        var date = $objc('NSDate').invoke('dateWithTimeIntervalSince1970', 0)
        $objc('NSURLCache').invoke('sharedURLCache').invoke('removeCachedResponsesSinceDate', date)

        var types = $objc('NSMutableSet').invoke('set')

        types.invoke('addObject', 'WKWebsiteDataTypeDiskCache')
        types.invoke('addObject', 'WKWebsiteDataTypeMemoryCache')
        types.invoke('addObject', 'WKWebsiteDataTypeOfflineWebApplicationCache')

        var handler = $block("void, void", async function () {

        })

        $objc('WKWebsiteDataStore').invoke('defaultDataStore').invoke('removeDataOfTypes:modifiedSince:completionHandler:', types, date, handler)
    }
    function parse(s) {
        return JSON.parse(s);
    }
    function ready() {
        let path = 'scripts/CatsViews/video'
        $file.exists(path) ? 0 : $file.mkdir(path);
    }

    ready();
    clearCache();

    console.warn(`catsViews has been required.`);
    let object = await download(`https://raw.githubusercontent.com/AbleCats/ablecats.github.io/master/catsViews/version.json?t=${date()}`);
    if (object.data) {
        let string = object.data.string;
        if (parse(string).app > parse(path).app) {
            console.warn(`has newVer: ${parse(string).app}`);
            for (let o of parse(string).scripts) {
                record(o)
            }
            writeFiles(object.data, "scripts/catsViews/version.json");
            console.warn("CatsViews更新完成...");
            checkCallBack();
        }
    }
})();

module.exports = {
    add: addViewWithAnimatiom,  // (mviews, cviews, viewsid)
    zoom: zoomAnimation,  // (viewsid, viewsSize, viewsBGColor, blurid, blurAlpha)
    show: showViewsWithAnimatiom,  // (viewsid) 
    hide: hideViewsWithAnimatiom,  // (viewsid) 
    video: videoView,  // (id, videoUrl, videoPic, layout)
    toast: showToastView,  // (viewsid, iconColor, text, duration)
    shadow: viewsAddShadows,  // (view, radius)
    remove: removeViewWithAnimatiom,  // (viewsid) 
    loading: loadingView,  // (id, iconSize, loadingText, canTouch)
    addLoading: addLoadingView,  // (mviews, iconSize, loadingText)
    rainbowText: rainbowText,  // (id, text, layout, canTouch, textFont, textFontWidth)
    removeLoading: removeLoadingView,  // 配合addLoading使用 无参数传递
}
