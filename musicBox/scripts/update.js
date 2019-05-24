let isCheck = false;
let appName = "musicBox";

async function checkLog() {
    let res = await $http.get(`https://ablecats.github.io/Releases/${appName}Log?t=${date()}`);
    return res.data
}

async function checkVersion() {
    let res = await $http.get(`https://ablecats.github.io/Releases/${appName}Version?t=${date()}`);
    return res.data
}

async function update() {
    let log = await checkLog();
    let res = await checkVersion();

    if ($file.exists("Version")) {
        let fileData = $file.read("Version");
        if (fileData.string) {
            let file = JSON.parse(fileData.string);
            console.log(`New Update Check : ${file.md5 != res.data}`);
            if (file.md5 != res.data) foundNewVer(log);
        }
    }
    else writeMD5(res.data)
}

function writeMD5(text) {
    $file.write({
        data: $data({ "string": JSON.stringify({ "md5": text }, null, 2) }),
        path: "Version"
    })
}

function foundNewVer(log) {
    $("mainView").add({
        type: "blur",
        props: {
            id: "ud",
            style: 1,
            alpha: 0,
        },
        views: [{
            type: "view",
            props: {
                id: "md",
                alpha: 0,
                bgcolor: $color("white")
            },
            layout: (make, view) => {
                shadows(view);
                make.top.inset(100);
                make.left.right.inset(10);
                make.height.equalTo(view.width).multipliedBy(1);

            },
            views: [{
                type: "markdown",
                props: {
                    radius: 20,
                    scrollEnabled: 0,
                    content: `<h1 style="text-align:center">${appName}</h1>`
                },
                layout: (make, view) => {
                    make.top.inset(0);
                    make.height.equalTo(75);
                    make.left.right.inset(0);
                }
            }, {
                type: "markdown",
                props: {
                    radius: 20,
                    content: log
                },
                layout: (make, view) => {
                    make.bottom.inset(130);
                    make.left.right.inset(0);
                    make.top.equalTo(view.prev.bottom);
                }
            }, {
                type: "markdown",
                props: {
                    radius: 20,
                    scrollEnabled: 0,
                    content: `<h2 align="center">Whether to Upgrade</h2>`
                },
                layout: (make, view) => {
                    make.bottom.inset(50);
                    make.height.equalTo(65);
                    make.left.right.inset(0);
                }
            }, {
                type: "matrix",
                props: {
                    columns: 3,
                    spacing: 1,
                    waterfall: true,
                    scrollEnabled: 0,
                    template: {
                        views: [{
                            type: "label",
                            props: {
                                id: "label",
                                bgcolor: $color("clear"),
                                align: $align.center,
                                font: $font("bold", 20),
                            },
                            layout: $layout.fill
                        }]
                    },
                    data: ["Yes", "|", "No"].map(v => { return { label: { text: v } } })
                },
                layout: (make, view) => {
                    make.height.equalTo(50);
                    make.left.right.bottom.inset(0);
                },
                events: {
                    itemSize: (sender, indexPath) => {
                        return $size(100, 40);
                    },
                    didSelect: (sender, indexPath, data) => {
                        switch (indexPath.row) {
                            case 0:
                                sender.selectable = 0;
                                $http.download({
                                    url: `https://raw.githubusercontent.com/AbleCats/ablecats.github.io/master/Releases/${appName}.box`,
                                    handler: function (resp) {
                                        if (!isCheck) {
                                            isCheck = true;
                                            $addin.save({
                                                name: $addin.current.name,
                                                data: resp.data,
                                                handler: function (success) {
                                                    $device.taptic(2);
                                                    if (success) $file.delete("Version");
                                                    $ui.alert({
                                                        title: "Success",
                                                        actions: [{
                                                            title: "OK",
                                                            handler: () => {
                                                                $addin.restart();
                                                            }
                                                        }]
                                                    });
                                                }
                                            })
                                        }
                                    }
                                });
                                break;
                            case 2:
                                animate(0)
                                break;
                        }
                    }
                }
            }]
        }],
        layout: $layout.fill
    });
    animate(1);
}

function animate(alpha) {
    alpha ? $("ud").animator.makeOpacity(1).animateWithCompletion({
        duration: 0.4,
        completion: () => $("md").animator.moveY(50).makeOpacity(1).animate(0.4)
    }) : $("md").animator.moveY(-50).makeOpacity(0).animateWithCompletion({
        duration: 0.4,
        completion: () => {
            $("ud").animator.makeOpacity(0).animateWithCompletion({
                duration: 0.4,
                completion: () => {
                    $("ud").remove();
                }
            });
        }
    });
}

function shadows(view) {
    //在layout中使用即可 给Views添加阴影
    var layer = view.runtimeValue().invoke("layer");
    layer.invoke("setShadowRadius", 10);
    layer.invoke("setCornerRadius", 20);
    layer.invoke("setShadowOpacity", 0.3);
    layer.invoke("setShadowOffset", $size(3, 3));
    layer.invoke(
        "setShadowColor",
        $color("black")
            .runtimeValue()
            .invoke("CGColor")
    );
}

function date() {
    return new Date().getTime();
}

module.exports = {
    update: update,
};