var url = $clipboard.link ? $clipboard.link : `https://www.google.com.hk/search?q=${$clipboard.text?$clipboard.text:""}`

$ui.render({
    props: {
        title: "",
        bgcolor: $color("clear")
    },
    views: [{
        type: "view",
        props: {
            smoothRadius: 5,
        },
        layout: function (make, view) {
            make.top.left.right.bottom.inset(5)
        },
        views: [{
            type: "view",
            props: {
                bgcolor: $color("white")
            },
            layout: function (make, view) {
                make.top.left.right.inset(0)
                make.height.equalTo(25)
            },
            views: [{
                    type: "button",
                    props: {
                        id: "close",
                        Radius: 17 / 2,
                        bgcolor: $color("clear"),
                        src: "https://ablecats.github.io/icon/close.png"
                    },
                    layout: function (make, view) {
                        make.left.inset(5)
                        make.size.equalTo(17, 17)
                        make.centerY.equalTo(view.super)
                    },
                    events: {
                        tapped: function (sender) {
                            $app.close()
                        }
                    }
                },
                {
                    type: "button",
                    props: {
                        Radius: 17 / 2,
                        bgcolor: $color("clear"),
                        src: "https://ablecats.github.io/icon/Safari.png"
                    },
                    layout: function (make, view) {
                        make.right.inset(5)
                        make.size.equalTo(19.7, 19.7)
                        make.centerY.equalTo(view.super)
                    },
                    events: {
                        tapped: function (sender) {
                            $app.openURL($("web").url)
                        }
                    }
                }, {
                    type: "label",
                    props: {
                        font: $font(14),
                        align: $align.center
                    },
                    layout: function (make, view) {
                        make.left.right.inset(50)
                        make.centerY.equalTo(view.super)
                        make.height.equalTo(view.super.height)
                    }
                }
            ]
        }, {
            type: "progress",
            layout: function (make, view) {
                make.height.equalTo(1)
                make.left.right.inset(0)
                make.top.equalTo(view.prev.bottom)
            }
        }, {
            type: "web",
            props: {
                url: url,
                showsProgress: false,
                script: "var title = document.title;var domin = document.domain;$notify(\"getTitle\", { title : title, domin : domin})",
            },
            events: {
                getTitle: function (object) {
                    $("label").text = object.title
                },
                didStart: function (sender, navigation) {
                    var timer = $timer.schedule({
                        interval: 0.001,
                        handler: function () {
                            $("progress").value = sender.progress
                            if (sender.progress >= 1) timer.invalidate()
                        }
                    })
                },
                didFinish: function (sender, navigation) {}
            },
            layout: function (make, view) {
                make.left.right.bottom.inset(0)
                make.top.equalTo(view.prev.bottom)
            }
        }]
    }]
})


let rootViewController = $objc("UIApplication").invoke("sharedApplication").invoke("keyWindow").invoke("rootViewController");
let topNavigationController = () => rootViewController.invoke("topViewController.navigationController");
let _Nviews = topNavigationController().invoke('navigationBar').rawValue().views
for (let view of _Nviews) {
    let {
        x,
        y,
        width,
        height
    } = view.frame
    //view.frame = $rect(x, y, width, 0)
}