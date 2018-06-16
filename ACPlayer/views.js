const bgImageView = {
    type: "image",
    props: {
        id: "bgimg",
        bgcolor: $color("clear")
    },
    layout: $layout.fill,
}

const appBottomView = {
    type: "view",
    props: {
        id: "tbv",
        bgcolor: $color("clear")
    },
    layout: function (make, view) {
        make.bottom.inset(5);
        make.left.right.inset(0);
        make.centerX.equalTo(view.super);
        make.top.equalTo($("lrcView").bottom).offset(5);
    },
    views: [{
            type: "view",
            props: {
                hidden: isToday,
                bgcolor: $color("clear")
            },
            layout: function (make, view) {
                make.top.inset(0);
                make.left.right.inset(20);
                make.height.equalTo(isToday ? 0 : view.super).multipliedBy(0.3);
            },
            views: [{
                type: "slider",
                props: {
                    value: 0,
                    max: 1.0,
                    min: 0.0,
                    hidden: true,
                },
                layout: $layout.fill,
                events: {
                    changed: function (sender) {
                        $audio.seek(sender.value);
                    }
                }
            }]
        },
        {
            type: "view",
            props: {
                bgcolor: $color("clear")
            },
            layout: function (make, view) {
                make.left.right.inset(10);
                make.bottom.inset(isToday ? 0 : 5);
                isToday ? make.top.inset(0) : make.height.equalTo(view.super).multipliedBy(0.6);
            },
            views: [{
                    type: "button",
                    props: {
                        id: "pos",
                        info: false,
                        bgcolor: $color("clear"),
                        src: "assets/play.png"
                    },
                    layout: function (make, view) {
                        make.center.equalTo(view.super);
                        make.width.equalTo(view.super.height);
                        make.height.equalTo(view.super.height);
                    },
                    events: {
                        tapped: async function (sender) {
                            sender.info = !sender.info;
                            let u = $("bgimgBlur").info[$("albumimg").info].url;
                            let s = sender.info ? "stop" : "play";
                            sender.src = `assets/${s}.png`;

                            if ($audio.status == 2 && s == "play") $audio.pause();
                            else if ($audio.status == 0 && s == "stop") {
                                $audio.resume();
                                !control.t ? control.setTimer() : 0;
                                let d = $("bgimgBlur").info[$("albumimg").info];
                                if (!$audio.status && s == "stop") await control.play(file.get().lf ? d.flac ? d.flac : d.url : d.url);
                            }
                        }
                    }
                },
                {
                    type: "button",
                    props: {
                        id: "left",
                        bgcolor: $color("clear"),
                        src: "assets/left.png"
                    },
                    layout: function (make, view) {
                        make.centerY.equalTo(view.prev);
                        make.centerX.equalTo($("pos")).multipliedBy(0.5);
                        make.width.equalTo(view.super.height).multipliedBy(0.5);
                        make.height.equalTo(view.super.height).multipliedBy(0.5);
                    },
                    events: {
                        tapped: function (sender) {
                            $("bgimgBlur").info.length < 2 ? $ui.toast("你的列表只有一首歌,不可能有上一首...") : control.fowardSongs();
                        }
                    }
                },
                {
                    type: "button",
                    props: {
                        id: "right",
                        bgcolor: $color("clear"),
                        src: "assets/right.png"
                    },
                    layout: function (make, view) {
                        make.centerY.equalTo(view.prev);
                        make.centerX.equalTo($("pos")).multipliedBy(1.5);
                        make.width.equalTo(view.super.height).multipliedBy(0.5);
                        make.height.equalTo(view.super.height).multipliedBy(0.5);
                    },
                    events: {
                        tapped: function (sender) {
                            $("bgimgBlur").info.length < 2 ? $ui.toast("你的列表只有一首歌,不可能有下一首...") : control.nextSongs();
                        }
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "sTime",
                        hidden: true,
                        text: "00:00",
                        font: $font(14),
                        align: $align.center,
                        textColor: $color("white")
                    },
                    layout: function (make, view) {
                        make.left.inset(20);
                        make.centerY.equalTo(view.prev);
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "eTime",
                        hidden: true,
                        text: "00:00",
                        font: $font(14),
                        align: $align.center,
                        textColor: $color("white")
                    },
                    layout: function (make, view) {
                        make.right.inset(20);
                        make.centerY.equalTo(view.prev);
                    }
                }
            ]
        }
    ]
}

const bgimgBlurView = {
    type: "blur",
    props: {
        style: 2,
        id: "bgimgBlur",
    },
    layout: $layout.fill,
    views: [{
            type: "image",
            props: {
                id: "albumimg",
                bgcolor: $color("clear")
            },
            layout: function (make, view) {
                Animation.shadow(view);
                make.left.inset(20);
                make.width.equalTo(125);
                make.height.equalTo(125);
                make.centerY.equalTo(view.super);
            },
            views: [loading.views("albumimgLoading", 1, ' ')]
        }, {
            type: "list",
            props: {
                id: "lrcView",
                rowHeight: 125 / 3,
                selectable: true,
                separatorHidden: true,
                bgcolor: $color("clear"),
                template: {
                    props: {
                        bgcolor: $color("clear"),
                    },
                    views: [{
                        type: "label",
                        props: {
                            lines: 2,
                            id: "lrc",
                            radius: 2,
                            font: $font(14),
                            autoFontSize: 1,
                            align: $align.center,
                            bgcolor: $color("clear"),
                            textColor: $color("white")
                        },
                        layout: function (make, view) {
                            make.left.right.inset(2);
                            make.center.equalTo(view.super);
                        }
                    }]
                },
            },
            layout: function (make, view) {
                make.right.inset(20);
                make.height.equalTo(125);
                make.centerY.equalTo(view.super);
                make.left.equalTo(view.prev.right).offset(20);
            },
            events: {
                didSelect: function (tableView, indexPath, data) {
                    $audio.seek(tableView.object(indexPath).index);
                }
            }
        }, {
            type: "view",
            props: {
                id: "titleBar"
            },
            layout: function (make, view) {
                make.height.equalTo(40);
                make.left.right.inset(50);
                make.top.inset(isToday ? 5 : 40);
            },
            views: [{
                    type: "label",
                    props: {
                        id: "songName",
                        autoFontSize: true,
                        align: $align.center,
                        font: $font("bold", 18),
                        bgcolor: $color("clear"),
                        textColor: $color("white")
                    },
                    layout: function (make, view) {
                        make.top.inset(0);
                        make.height.equalTo(20);
                        make.left.right.inset(30);
                    }
                },
                {
                    type: "label",
                    props: {
                        alpha: 0.5,
                        id: "songSinger",
                        font: $font(12),
                        align: $align.center,
                        bgcolor: $color("clear"),
                        textColor: $color("white")
                    },
                    layout: function (make, view) {
                        make.left.right.inset(30);
                        make.top.equalTo(view.prev.bottom).offset(2);
                    }
                }
            ],
        },
        {
            type: "button",
            props: {
                id: "close",
                hidden: isToday,
                src: "assets/close.png",
                bgcolor: $color("clear"),

            },
            layout: function (make, view) {
                make.left.inset(10);
                make.centerY.equalTo(view.prev);
                make.size.equalTo($size(30, 30));
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
                id: "more",
                src: "assets/add.png",
                bgcolor: $color("clear"),
            },
            layout: function (make, view) {
                make.right.inset(10);
                make.centerY.equalTo(view.prev);
                make.size.equalTo($size(30, 30));
            },
            events: {
                tapped: function (sender) {
                    function add() {
                        if (isToday) {
                            if ($("listControl").alpha) {
                                Animation.hide($("listControl"));
                            } else {
                                Animation.show($("listControl"));
                            }
                        } else {
                            let d = file.get();
                            $("playControl").add(settingView);

                            $("s").text = d.s;
                            $("lf").on = d.lf;
                            $("df").on = d.df;
                            Animation.show($("settingView"));

                        }
                    }
                    debug ? console.open() : add();
                }
            }
        }, {
            type: "button",
            props: {
                id: "down",
                hidden: isToday,
                src: "assets/donate.png",
                bgcolor: $color("clear"),

            },
            layout: function (make, view) {
                make.right.inset(50);
                make.centerY.equalTo(view.prev);
                make.size.equalTo($size(30, 30));
            },
            events: {
                tapped: function (sender) {
                    Animation.show($("donateView"));
                }
            }
        },
        appBottomView
    ]
}

const searchView = {
    type: "blur",
    props: {
        alpha: 0,
        style: 1,
        id: "searchView",
    },
    views: [{
        type: "label",
        props: {
            font: $font(12),
            text: "热门推荐：",
            align: $align.left,
            textColor: $color("white")
        },
        layout: function (make, view) {
            make.left.inset(6);
            make.top.inset(isToday ? 5 : 40);
        }
    }, {
        type: "matrix",
        props: {
            columns: 4,
            spacing: 5,
            itemHeight: 80,
            bgcolor: $color("clear"),
            template: {
                props: {},
                views: [{
                    type: "spinner",
                    props: {
                        loading: true
                    },
                    layout: function (make, view) {
                        make.center.equalTo(view.super);
                    }
                }, {
                    type: "image",
                    props: {
                        radius: 5,
                        id: "plistImg",
                        bgcolor: $color("clear"),
                    },
                    views: [{
                        type: "gradient",
                        props: {
                            colors: [$color("black"), $color("clear")],
                            locations: [0.0, 1.0],
                            startPoint: $point(0, 1),
                            endPoint: $point(0, 0)
                        },
                        layout: $layout.fill,
                        views: [{
                            type: "label",
                            props: {
                                id: "plistName",
                                font: $font(12),
                                align: $align.center,
                                bgcolor: $color("clear"),
                                textColor: $color("lightGray"),
                            },
                            layout: function (make, view) {
                                make.width.equalTo(20);
                                make.left.right.inset(0);
                                make.bottom.equalTo(view.super.bottom);
                            }
                        }]
                    }],
                    layout: $layout.fill
                }]
            }
        },
        events: {
            pulled: async function (sender) {
                sender.data = await deal.recommend();
            },
            didSelect: async function (tableView, indexPath, data) {
                $("searchWord").blur();
                deal.search(`http://music.163.com/playlist?id=${tableView.object(indexPath).plistId}`, 0);
            }
        },
        layout: function (make, view) {
            make.bottom.inset(5);
            make.left.right.inset(0);
            make.top.equalTo(view.prev.bottom);
        }
    }],
    layout: $layout.fill
}

const settingView = {
    type: "blur",
    props: {
        style: 1,
        alpha: 0,
        id: "settingView",
    },
    layout: $layout.fill,
    views: [{
        type: "view",
        props: {
            bgcolor: $color("#F9F9F9")
        },
        layout: function (make, view) {
            make.top.inset(0);
            make.height.equalTo(70);
            make.left.right.inset(0);
        },
        views: [{
            type: "button",
            props: {
                bgcolor: $color("clear"),
                src: "assets/close_b.png"
            },
            layout: function (make, view) {
                make.right.inset(15);
                make.bottom.inset(5);
                make.size.equalTo($size(30, 30));
            },
            events: {
                tapped(sender) {
                    Animation.remove($("settingView"));
                    file.set($("s").text, $("lf").on, $("df").on);
                }
            }
        }]
    }, {
        type: "list",
        props: {
            data: [{
                title: "默认搜索内容",
                rows: [{
                    type: "input",
                    props: {
                        id: "s",
                        text: file.get().s,
                        darkKeyboard: true,
                        type: $kbType.search,
                        bgcolor: $color("clear")
                    },
                    layout: function (make) {
                        make.top.bottom.inset(5);
                        make.left.right.inset(10);
                    },
                    events: {
                        returned: function (sender) {
                            sender.blur();
                        }
                    }
                }]
            }, {
                title: "其他设置",
                rows: [{
                    type: "view",
                    props: {
                        bgcolor: $color("clear")
                    },
                    layout: $layout.fill,
                    views: [{
                        type: "label",
                        props: {
                            bgcolor: $color("clear"),
                            text: "优先试听无损歌曲",
                            align: $align.center
                        },
                        layout: function (make, view) {
                            make.left.inset(15);
                            make.centerY.equalTo(view.super);
                        }
                    }, {
                        type: "switch",
                        props: {
                            id: "lf",
                            on: file.get().lf
                        },
                        layout: function (make, view) {
                            make.right.inset(15);
                            make.centerY.equalTo(view.super);
                        }
                    }]
                }, {
                    type: "view",
                    props: {
                        bgcolor: $color("clear")
                    },
                    layout: $layout.fill,
                    views: [{
                        type: "label",
                        props: {
                            bgcolor: $color("clear"),
                            text: "优先下载无损歌曲",
                            align: $align.center
                        },
                        layout: function (make, view) {
                            make.left.inset(15);
                            make.centerY.equalTo(view.super);
                        }
                    }, {
                        type: "switch",
                        props: {
                            id: "df",
                            on: file.get().df
                        },
                        layout: function (make, view) {
                            make.right.inset(15)
                            make.centerY.equalTo(view.super)
                        }
                    }]
                }]
            }]
        },
        layout: function (make, view) {
            make.left.right.bottom.inset(0);
            make.top.equalTo(view.prev.bottom);
        }
    }]
}

const donateView = {
    type: "blur",
    props: {
        style: 1,
        alpha: 0,
        id: "donateView",
        bgcolor: $color("white"),
    },
    layout: $layout.fill,
    views: [{
        type: "view",
        props: {
            bgcolor: $color("white")
        },
        layout: function (make, view) {
            make.top.inset(0);
            make.height.equalTo(70);
            make.left.right.inset(0);
        },
        views: [{
            type: "button",
            props: {
                bgcolor: $color("white"),
                src: "assets/close_b.png"
            },
            layout: function (make, view) {
                make.right.inset(15);
                make.bottom.inset(5);
                make.size.equalTo($size(30, 30));
            },
            events: {
                tapped(sender) {
                    Animation.hide($("donateView"));
                }
            }
        }]
    }, {
        type: "image",
        props: {
            circular: 1,
            bgcolor: $color("white"),
            src: "https://ablecats.github.io/ACPlayer/AbleCats"
        },
        layout: function (make, view) {
            make.centerX.equalTo(view.super);
            make.top.equalTo(view.prev.bottom);
            make.size.equalTo($size(120, 120));
        }
    }, donate.make()]
}

const listView = {
    type: "list",
    props: {
        id: "sreachList",
        template: {
            props: {
                bgcolor: $color("clear")
            },
            views: [{
                type: "label",
                props: {
                    id: "num",
                    font: $font(15),
                    align: $align.center,
                    textColor: isToday ? $color("white") : $color("darkGray"),
                },
                layout: function (make, view) {
                    make.top.left.bottom.inset(0);
                    make.width.equalTo(view.super.height);
                }
            }, {
                type: "button",
                props: {
                    id: "videoBtn",
                    hidden: !isToday,
                    bgcolor: $color("clear"),
                    src: "assets/video-play.png"
                },
                layout: function (make, view) {
                    let s = isToday ? 0 : 20;
                    make.right.inset(s)
                    make.size.equalTo($size(s, s))
                    make.centerY.equalTo(view.super)
                },
                events: {
                    tapped(sender) {
                        $("videoView") ? $("videoView").remove() : 0;
                        $("playControl").add({
                            type: "view",
                            props: {
                                style: 1,
                                alpha: 0,
                                id: "videoView",
                                bgcolor: $color("black"),
                            },
                            views: [{
                                type: "video",
                                props: {
                                    src: sender.info,
                                    transparent: true,
                                    bgcolor: $color("clear"),
                                },
                                layout: function (make, view) {
                                    make.bottom.inset(10)
                                    make.left.right.inset(0)
                                    make.height.equalTo(view.super.height).multipliedBy(0.7)
                                }
                            }, {
                                type: "button",
                                props: {
                                    id: "close",
                                    hidden: isToday,
                                    src: "assets/close.png",
                                    bgcolor: $color("clear"),
                                },
                                layout: function (make, view) {
                                    make.left.inset(10)
                                    make.size.equalTo($size(30, 30))
                                    make.bottom.equalTo(view.prev.top).offset(-10)
                                },
                                events: {
                                    tapped: function (sender) {
                                        $("video").pause()
                                        Animation.remove($("videoView"))
                                    }
                                }
                            }],
                            layout: $layout.fill
                        });
                        $ui.animate({
                            duration: 0.4,
                            animation: function () {
                                $("videoView").alpha = 1
                            },
                            completion: function () {
                                $("video").play()
                            }
                        });
                    }
                }
            }, {
                type: "label",
                props: {
                    id: "title",
                    font: $font(15),
                    align: $align.left,
                    textColor: isToday ? $color("white") : $color("black"),
                },
                layout: function (make, view) {
                    make.top.inset(5);
                    make.left.equalTo($("num").right).offset(0);
                    make.right.equalTo($("videoBtn").left).offset(-10);
                }
            }, {
                type: "label",
                props: {
                    id: "singer",
                    font: $font(13),
                    align: $align.left,
                    textColor: $color("lightGray"),
                },
                layout: function (make, view) {
                    make.bottom.inset(5);
                    make.left.equalTo($("num").right).offset(0);
                    make.right.lessThanOrEqualTo($("videoBtn").left).offset(-25);
                }
            }, {
                type: "image",
                props: {
                    id: "isPath",
                    src: "assets/path.png",
                    bgcolor: $color("clear")
                },
                layout: function (make, view) {
                    make.bottom.inset(5);
                    make.size.equalTo($size(15, 15));
                    make.left.equalTo(view.prev.right).offset(2);
                }
            }]
        },
        header: {
            type: "view",
            props: {
                bgcolor: $color("clear")
            },
            layout: function (make, view) {
                make.left.right.inset(0);
                make.center.equalTo(view.super);
            },
            views: [{
                type: "input",
                props: {
                    radius: 20,
                    id: "searchWord",
                    darkKeyboard: true,
                    type: $kbType.search,
                    align: $align.center,
                    bgcolor: $rgba(191, 191, 191, .1),
                    placeholder: "请输入搜索内容或指令",
                },
                layout: function (make, view) {
                    make.left.right.inset(5);
                    make.top.bottom.inset(2);
                    make.center.equalTo(view.super);
                },
                events: {
                    returned: function (sender) {
                        sender.blur();
                        if (sender.text.indexOf("$qq ") != -1) {
                            sender.text = sender.text.replace("$qq ", "");
                            deal.search(sender.text, 1);
                        } else if (sender.text.indexOf("$xm ") != -1) {
                            sender.text = sender.text.replace("$xm ", "");
                            deal.search(sender.text, 2);
                        } else deal.search(sender.text, 0);
                        !isToday ? Animation.hide($("searchView")) : 0;
                    },
                    didEndEditing: function (sender) {
                        !isToday ? Animation.hide($("searchView")) : 0;
                    },
                    didBeginEditing: async function (sender) {
                        if (!isToday) {
                            Animation.show($("searchView"));
                            $("matrix").data = await deal.recommend();
                        }
                    }
                }
            }]
        },
        actions: [{
            title: "下载",
            color: $color("blue"),
            handler: async function (sender, indexPath) {
                let data = await deal.action(indexPath)
                let ddata = await $http.download({
                    url: data.url,
                    showsProgress: true,
                    progress: function (bytesWritten, totalBytes) {
                        let value = bytesWritten * 1.0 / totalBytes;
                    }
                })
                if (ddata.response.statusCode == 403) {
                    $ui.toast("error 403 ,歌曲缓冲失败...")
                } else {
                    $file.write({
                        data: ddata.data,
                        path: `${file.path}/${data.name}`
                    })
                    $ui.toast("歌曲缓冲完成...")
                }
            }
        }, {
            title: "delete",
            handler: async function (sender, indexPath) {
                let data = await deal.action(indexPath)
                $ui.toast($file.delete(`${file.path}/${data.name}`) ? "歌曲删除成功..." : "errorCode(911) ,歌曲删除失败...")
            }
        }, {
            title: "导出",
            handler: async function (sender, indexPath) {
                let data = await deal.action(indexPath)
                $share.sheet({
                    items: [data.name, $file.read(`${file.path}/${data.name}`)], 
                    handler: function (success) {
                        $ui.toast(success ? "歌曲导出成功..." : "errorCode(908) ,歌曲导出失败...")
                    }
                })
            }
        }]
    },
    events: {
        pulled: function (sender) {
            deal.search($("searchWord").text ? $("searchWord").text : null, platform);
        },
        didSelect: async function (tableView, indexPath, data) {
            deal.assignment(indexPath.row);
            let d = $("bgimgBlur").info[$("albumimg").info];
            await control.play(file.get().lf ? d.flac ? d.flac : d.url : d.url);
        }
    },
    layout: $layout.fill,
}
