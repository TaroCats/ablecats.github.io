const debugMode = true
const
    icon = {
        srt: "https://ablecats.github.io/icon/SRT.jpg",
        surge: "https://ablecats.github.io/icon/Surge.jpg"
    },
    SCW = $device.info.screen.width,
    SCH = $device.info.screen.height

const
    ChooseView = {
        type: "view",
        props: {
            radius: 20,
            id: "ChooseView",
            bgcolor: $rgba(255, 255, 255, 0.7),
        },
        layout: function (make, view) {
            make.top.inset(SCH)
            make.bottom.inset(40)
            make.left.right.inset(10)
        },
        views: [{
            type: "label",
            props: {
                alpha: 0.8,
                align: $align.center,
                text: "更多选择(打开即为代理)",
                font: $font("bold", 15),
                bgcolor: $color("clear"),
            },
            layout: function (make, view) {
                make.top.left.right.inset(10)
            },
        }, {
            type: "view",
            layout: function (make, view) {
                make.bottom.inset(10)
                make.left.right.inset(10)
                make.top.equalTo(view.prev.bottom).offset(5)
            },
            views: [{
                type: "button",
                props: {
                    radius: 10,
                    title: "下一步"
                },
                layout: function (make, view) {
                    make.left.right.bottom.inset(0)
                },
                events: {
                    tapped(sender) {
                        function srt() {
                            MRule = MRule.replace(/🍃 Proxy/g, "PROXY")
                            MRule = MRule.replace(/🍂 Domestic/g, "DIRECT")
                            $ui.menu({
                                items: ["Apple线路 代理", "Apple线路 直连"],
                                handler: function (title, idx) {
                                    MRule = MRule.replace(/🍎 Only/g, idx ? "DIRECT" : "PROXY")
                                },
                                finished: function (cancelled) {
                                    cancelled ? MRule = MRule.replace(/🍎 Only/g, "PROXY") : 0
                                    $ui.menu({
                                        items: ["全局线路 代理", "全局线路 直连"],
                                        handler: function (title, idx) {
                                            MRule = MRule.replace(/☁️ Others,dns-failed/g, idx ? "DIRECT" : "PROXY")
                                        },
                                        finished: function (cancelled) {
                                            cancelled ? MRule = MRule.replace(/☁️ Others,dns-failed/g, "DIRECT") : 0
                                            $share.sheet(["lhie1.conf", $data({ "string": MRule })])
                                        }
                                    })
                                }
                            })
                        }
                        Rule.ss ? srt() : $share.sheet(["lhie1.conf", $data({ "string": MRule })]);
                    }
                }
            }, {
                type: "view",
                layout: function (make, view) {
                    make.top.left.right.inset(0)
                    make.bottom.equalTo(view.prev.top).offset(-5)
                },
                views: [{
                    type: "view",
                    layout: function (make, view) {
                        make.top.inset(5)
                        make.height.equalTo(30)
                        make.left.right.inset(20)
                    },
                    views: [{
                        type: "switch",
                        props: {
                            on: true,
                            id: "youtube"
                        },
                        layout: function (make, view) {
                            make.top.right.bottom.inset(0)
                        },
                        events: {
                            changed: function (sender) {
                                sender.on ? $ui.menu({
                                    items: ["代理", "直连"],
                                    handler: function (title, idx) {
                                        MRule = MRule.replace(/(USER-AGENT,YouTube*,|DOMAIN-SUFFIX,youtube.com,|DOMAIN-SUFFIX,youtube-nocookie.com,)[^,]+/g, idx ? "DIRECT" : "🍃 Proxy")
                                    }
                                }) : 0
                            }
                        }
                    }, {
                        type: "label",
                        props: {
                            text: "YouTube 代理",
                            align: $align.left,
                            font: $font("bold", 15),
                        },
                        layout: function (make, view) {
                            make.top.left.inset(0)
                            make.right.equalTo(view.prev.left).offset(-5)
                        }
                    }]
                }, {
                    type: "view",
                    layout: function (make, view) {
                        make.height.equalTo(30)
                        make.left.right.inset(20)
                        make.top.equalTo(view.prev.bottom).offset(5)
                    },
                    views: [{
                        type: "switch",
                        props: {
                            on: true,
                            id: "google"
                        },
                        layout: function (make, view) {
                            make.top.right.bottom.inset(0)
                        },
                        events: {
                            changed: function (sender) {
                                sender.on ? $ui.menu({
                                    items: ["代理", "直连"],
                                    handler: function (title, idx) {
                                        MRule = MRule.replace(/(DOMAIN-KEYWORD,google,)[^,]+/g, idx ? "DIRECT" : "🍃 Proxy")
                                    }
                                }) : 0
                            }
                        }
                    }, {
                        type: "label",
                        props: {
                            text: "Google 代理",
                            align: $align.left,
                            font: $font("bold", 15),
                        },
                        layout: function (make, view) {
                            make.top.left.inset(0)
                            make.right.equalTo(view.prev.left).offset(-5)
                        }
                    }]
                }, {
                    type: "view",
                    layout: function (make, view) {
                        make.height.equalTo(30)
                        make.left.right.inset(20)
                        make.top.equalTo(view.prev.bottom).offset(5)
                    },
                    views: [{
                        type: "switch",
                        props: {
                            on: false,
                            id: "netflix"
                        },
                        layout: function (make, view) {
                            make.top.right.bottom.inset(0)
                        },
                        events: {
                            changed: function (sender) {
                                sender.on ? $ui.menu({
                                    items: ["代理", "直连"],
                                    handler: function (title, idx) {
                                        MRule = MRule.replace(/(USER-AGENT,Argo\*,|DOMAIN-SUFFIX,netflix.com,|DOMAIN-SUFFIX,netflix.net,|DOMAIN-SUFFIX,nflxext.com,|DOMAIN-SUFFIX,nflximg.com,|DOMAIN-SUFFIX,nflximg.net,|DOMAIN-SUFFIX,nflxvideo.net,)[^,]+/g, idx ? "DIRECT" : "🍃 Proxy")
                                    }
                                }) : 0
                            }
                        }
                    }, {
                        type: "label",
                        props: {
                            text: "Netflix 代理",
                            align: $align.left,
                            font: $font("bold", 15),
                        },
                        layout: function (make, view) {
                            make.top.left.inset(0)
                            make.right.equalTo(view.prev.left).offset(-5)
                        }
                    }]
                }, {
                    type: "view",
                    layout: function (make, view) {
                        make.height.equalTo(30)
                        make.left.right.inset(20)
                        make.top.equalTo(view.prev.bottom).offset(5)
                    },
                    views: [{
                        type: "switch",
                        props: {
                            on: false,
                            id: "spotify"
                        },
                        layout: function (make, view) {
                            make.top.right.bottom.inset(0)
                        },
                        events: {
                            changed: function (sender) {
                                sender ? $ui.menu({
                                    items: ["代理", "直连"],
                                    handler: function (title, idx) {
                                        MRule = MRule.replace(/(DOMAIN-SUFFIX,spoti.fi,|DOMAIN-KEYWORD,spotify,)[^,]+/g, idx ? "DIRECT" : "🍃 Proxy")
                                    }
                                }) : 0
                            }
                        }
                    }, {
                        type: "label",
                        props: {
                            text: "Spotify 代理",
                            align: $align.left,
                            font: $font("bold", 15),
                        },
                        layout: function (make, view) {
                            make.top.left.inset(0)
                            make.right.equalTo(view.prev.left).offset(-5)
                        }
                    }]
                }, {
                    type: "view",
                    layout: function (make, view) {
                        make.height.equalTo(30)
                        make.left.right.inset(20)
                        make.top.equalTo(view.prev.bottom).offset(5)
                    },
                    views: [{
                        type: "switch",
                        props: {
                            on: false,
                            id: "mytv"
                        },
                        layout: function (make, view) {
                            make.top.right.bottom.inset(0)
                        },
                        events: {
                            changed: function (sender) {
                                sender.on ? $ui.menu({
                                    items: ["代理", "直连"],
                                    handler: function (title, idx) {
                                        MRule = MRule.replace(/(DOMAIN-KEYWORD,nowtv100,|DOMAIN-KEYWORD,rthklive,|DOMAIN-SUFFIX,mytvsuper.com,|DOMAIN-SUFFIX,tvb.com,)[^,]+/g, idx ? "DIRECT" : "🍃 Proxy")
                                    }
                                }) : 0
                            }
                        }
                    }, {
                        type: "label",
                        props: {
                            text: "MyTVSUPER 代理",
                            align: $align.left,
                            font: $font("bold", 15),
                        },
                        layout: function (make, view) {
                            make.top.left.inset(0)
                            make.right.equalTo(view.prev.left).offset(-5)
                        }
                    }]
                }]
            }]
        }]
    },
    ProxysView = {
        type: "view",
        props: {
            radius: 20,
            id: "ProxysView",
            bgcolor: $rgba(255, 255, 255, 0.7),
        },
        layout: function (make, view) {
            make.top.inset(SCH)
            make.bottom.inset(40)
            make.left.right.inset(10)
        },
        views: [{
            type: "label",
            props: {
                alpha: 0.8,
                align: $align.center,
                text: "PROXY 线路填写",
                font: $font("bold", 15),
                bgcolor: $color("clear"),
            },
            layout: function (make, view) {
                make.top.left.right.inset(10)
            },
        }, {
            type: "view",
            layout: function (make, view) {
                make.bottom.inset(10)
                make.left.right.inset(10)
                make.top.equalTo(view.prev.bottom).offset(5)
            },
            views: [{
                type: "button",
                props: {
                    radius: 10,
                    title: "下一步"
                },
                layout: function (make, view) {
                    make.left.right.bottom.inset(0)
                },
                events: {
                    tapped(sender) {
                        $ui.animate({
                            duration: 0.4,
                            animation: function () {
                                $("ProxysView").updateLayout(function (make) {
                                    make.top.inset(SCH)
                                })
                                $("ProxysView").relayout()
                            },
                            completion: function () {
                                $ui.animate({
                                    duration: 0.4,
                                    animation: function () {
                                        $("RulesView").updateLayout(function (make) {
                                            make.top.inset(SCH * 0.5)
                                        })
                                        $("RulesView").relayout()
                                    }
                                })
                            }
                        })
                        $file.write({
                            data: $data({ "string": $("proxys").text }),
                            path: "Proxys"
                        })
                        splitProxys($("proxys").text)
                        MRule = MRule.replace(/Proxys/g, $("proxys").text)
                    }
                }
            }, {
                type: "text",
                props: {
                    id: "proxys",
                    radius: 20,
                    font: $font(15),
                    textColor: $color("#abb2bf"),
                    bgcolor: $rgba(255, 255, 255, 0.3),
                    text: $file.read("Proxys") ? $file.read("Proxys").string : "例子：\n🇺🇸 US = custom,us.com,1234,rc4-md5,password,http://omgib13x8.bkt.clouddn.com/SSEncrypt.module\n🇭🇰 HK = custom,hk.com,1234,rc4-md5,password,http://omgib13x8.bkt.clouddn.com/SSEncrypt.module\n(⚠️ 填写的时候请全部替换该输入框所有文本)"
                },
                layout: function (make, view) {
                    make.top.left.right.inset(0)
                    make.bottom.equalTo(view.prev.top).offset(-5)
                },
            }]
        }]
    },
    RulesView = {
        type: "view",
        props: {
            radius: 20,
            id: "RulesView",
            bgcolor: $rgba(255, 255, 255, 0.7),
        },
        layout: function (make, view) {
            make.top.inset(SCH)
            make.bottom.inset(40)
            make.left.right.inset(10)
        },
        views: [{
            type: "label",
            props: {
                alpha: 0.8,
                align: $align.center,
                text: "自定义 Rule 填写",
                font: $font("bold", 15),
                bgcolor: $color("clear"),
            },
            layout: function (make, view) {
                make.top.left.right.inset(10)
            },
        }, {
            type: "view",
            layout: function (make, view) {
                make.bottom.inset(10)
                make.left.right.inset(10)
                make.top.equalTo(view.prev.bottom).offset(5)
            },
            views: [{
                type: "button",
                props: {
                    radius: 10,
                    title: "下一步"
                },
                layout: function (make, view) {
                    make.left.right.bottom.inset(0)
                },
                events: {
                    tapped(sender) {
                        $ui.animate({
                            duration: 0.4,
                            animation: function () {
                                $("RulesView").updateLayout(function (make) {
                                    make.top.inset(SCH)
                                })
                                $("RulesView").relayout()
                            },
                            completion: function () {
                                $ui.animate({
                                    duration: 0.4,
                                    animation: function () {
                                        $("HostsView").updateLayout(function (make) {
                                            make.top.inset(SCH * 0.5)
                                        })
                                        $("HostsView").relayout()
                                    }
                                })
                            }
                        })
                        $file.write({
                            data: $data({ "string": $("rules").text }),
                            path: "Rules"
                        })
                        MRule = MRule.replace(/# Custom/g, $("rules").text)
                    }
                }
            }, {
                type: "text",
                props: {
                    id: "rules",
                    radius: 20,
                    font: $font(15),
                    textColor: $color("#abb2bf"),
                    bgcolor: $rgba(255, 255, 255, 0.3),
                    text: $file.read("Rules") ? $file.read("Rules").string : ""
                },
                layout: function (make, view) {
                    make.top.left.right.inset(0)
                    make.bottom.equalTo(view.prev.top).offset(-5)
                },
            }]
        }]
    },
    HostsView = {
        type: "view",
        props: {
            radius: 20,
            id: "HostsView",
            bgcolor: $rgba(255, 255, 255, 0.7),
        },
        layout: function (make, view) {
            make.top.inset(SCH)
            make.bottom.inset(40)
            make.left.right.inset(10)
        },
        views: [{
            type: "label",
            props: {
                alpha: 0.8,
                align: $align.center,
                text: "自定义 Host 填写",
                font: $font("bold", 15),
                bgcolor: $color("clear"),
            },
            layout: function (make, view) {
                make.top.left.right.inset(10)
            },
        }, {
            type: "view",
            layout: function (make, view) {
                make.bottom.inset(10)
                make.left.right.inset(10)
                make.top.equalTo(view.prev.bottom).offset(5)
            },
            views: [{
                type: "button",
                props: {
                    radius: 10,
                    title: "下一步"
                },
                layout: function (make, view) {
                    make.left.right.bottom.inset(0)
                },
                events: {
                    tapped(sender) {
                        $ui.animate({
                            duration: 0.4,
                            animation: function () {
                                $("HostsView").updateLayout(function (make) {
                                    make.top.inset(SCH)
                                })
                                $("HostsView").relayout()
                            },
                            completion: function () {
                                !Rule.ss ? $ui.animate({
                                    duration: 0.4,
                                    animation: function () {
                                        $("MiTMView").updateLayout(function (make) {
                                            make.top.inset(SCH * 0.5)
                                        })
                                        $("MiTMView").relayout()
                                    }
                                }) : $ui.animate({
                                    duration: 0.4,
                                    animation: function () {
                                        $("ChooseView").updateLayout(function (make) {
                                            make.top.inset(SCH * 0.5)
                                        })
                                        $("ChooseView").relayout()
                                    },
                                    completion: function () {
                                        MRule = MRule.replace(/#MITM/g, "enable = true")
                                    }
                                })
                            }
                        })

                    }
                }
            }, {
                type: "text",
                props: {
                    id: "hosts",
                    radius: 20,
                    font: $font(15),
                    textColor: $color("#abb2bf"),
                    bgcolor: $rgba(255, 255, 255, 0.3),
                    text: $file.read("Hosts") ? $file.read("Hosts").string : ""
                },
                layout: function (make, view) {
                    make.top.left.right.inset(0)
                    make.bottom.equalTo(view.prev.top).offset(-5)
                },
            }]
        }]
    },
    MiTMView = {
        type: "view",
        props: {
            radius: 20,
            id: "MiTMView",
            bgcolor: $rgba(255, 255, 255, 0.7),
        },
        layout: function (make, view) {
            make.top.inset(SCH)
            make.bottom.inset(40)
            make.left.right.inset(10)
        },
        views: [{
            type: "label",
            props: {
                alpha: 0.8,
                align: $align.center,
                text: "自定义 MiTM 填写",
                font: $font("bold", 15),
                bgcolor: $color("clear"),
            },
            layout: function (make, view) {
                make.top.left.right.inset(10)
            },
        }, {
            type: "view",
            layout: function (make, view) {
                make.bottom.inset(10)
                make.left.right.inset(10)
                make.top.equalTo(view.prev.bottom).offset(5)
            },
            views: [{
                type: "button",
                props: {
                    radius: 10,
                    title: "下一步"
                },
                layout: function (make, view) {
                    make.left.right.bottom.inset(0)
                },
                events: {
                    tapped(sender) {
                        $ui.animate({
                            duration: 0.4,
                            animation: function () {
                                $("MiTMView").updateLayout(function (make) {
                                    make.top.inset(SCH)
                                })
                                $("MiTMView").relayout()
                            },
                            completion: function () {
                                $ui.animate({
                                    duration: 0.4,
                                    animation: function () {
                                        $("ChooseView").updateLayout(function (make) {
                                            make.top.inset(SCH * 0.5)
                                        })
                                        $("ChooseView").relayout()
                                    }
                                })
                            }
                        })
                        $file.write({
                            data: $data({ "string": $("MiTM").text }),
                            path: "MiTM"
                        })
                        MRule = MRule.replace(/#MITM/g, $("MiTM").text ? $("MiTM").text : Surge.MITM)
                    }
                }
            }, {
                type: "text",
                props: {
                    id: "MiTM",
                    radius: 20,
                    font: $font(15),
                    textColor: $color("#abb2bf"),
                    bgcolor: $rgba(255, 255, 255, 0.3),
                    text: $file.read("MiTM") ? $file.read("MiTM").string : ""
                },
                layout: function (make, view) {
                    make.top.left.right.inset(0)
                    make.bottom.equalTo(view.prev.top).offset(-5)
                },
            }]
        }]
    },
    loadingView = {
        type: "blur",
        props: {
            style: 1,
            id: "loadingView"
        },
        layout: $layout.fill,
        views: [{
            type: "spinner",
            props: {
                on: true,
                loading: true
            },
            layout: function (make, view) {
                make.center.equalTo(view.super)
            }
        }, {
            type: "label",
            props: {
                id: "loadingText",
                text: "正在初始化中...",
                align: $align.center
            },
            layout: function (make, view) {
                make.centerX.equalTo(view.super)
                make.top.equalTo(view.prev.bottom).offset(5)
            }
        }]
    }
var
    MRule = null,
    Surge = {
        Header: "https://raw.githubusercontent.com/lhie1/Surge/master/Surge/General.conf",
        Groups: "https://raw.githubusercontent.com/lhie1/Surge/master/Surge/Groups.conf",
        Frame: "https://raw.githubusercontent.com/lhie1/Surge/master/Surge/Prototype.conf",
        MITM: "https://raw.githubusercontent.com/lhie1/Surge/master/Surge/MiTM",
    },
    Srt = {
        Header: "https://raw.githubusercontent.com/lhie1/Surge/master/Shadowrocket/General.conf",
    },
    Rule = {
        ss: null,
        Apple: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/Apple.conf",
        DIRECT: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/DIRECT.conf",
        PROXY: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/PROXY.conf",
        REJECT: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/REJECT.conf",
        VREJECT: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/VIDEO%20REJECT.conf",
        HOST: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/HOST.conf",
        UREJECT: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/URL%20REJECT.conf",
        UREWRITE: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/URL%20REWRITE.conf",
        HREWRITE: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/HEADER%20REWRITE.conf",
        HOSTNAME: "https://raw.githubusercontent.com/lhie1/Surge/master/Auto/hostName"
    }
//函数开始

async function getUrlData(url) {
    return new Promise(resolve => {
        $http.get({
            url: url,
            handler: function (resp) {
                resolve(resp.data)
            }
        })
    });
}

async function initRuleMaker() {

    MRule = await getUrlData(Surge.Frame);
    Surge.Header = await getUrlData(Surge.Header) + "\n";
    Surge.Groups = await getUrlData(Surge.Groups) + "\n";
    Surge.MITM = await getUrlData(Surge.MITM) + "\n";
    Srt.Header = await getUrlData(Srt.Header) + "\n";
    Rule.Apple = await getUrlData(Rule.Apple) + "\n";
    Rule.PROXY = await getUrlData(Rule.PROXY) + "\n";
    Rule.VREJECT = await getUrlData(Rule.VREJECT) + "\n";
    Rule.REJECT = await getUrlData(Rule.REJECT) + "\n";
    Rule.DIRECT = await getUrlData(Rule.DIRECT) + "\n";
    Rule.HOST = await getUrlData(Rule.HOST) + "\n";
    Rule.UREJECT = await getUrlData(Rule.UREJECT) + "\n";
    Rule.UREWRITE = await getUrlData(Rule.UREWRITE) + "\n";
    Rule.HREWRITE = await getUrlData(Rule.HREWRITE) + "\n";
    Rule.HOSTNAME = await getUrlData(Rule.HOSTNAME) + "\n";

    MRule = MRule.replace(/# AllRules/g, Rule.Apple + Rule.PROXY + Rule.VREJECT + Rule.REJECT + Rule.DIRECT)
    MRule = MRule.replace(/# URL REJECT/g, Rule.UREJECT)
    MRule = MRule.replace(/# URL REWRITE/g, Rule.UREWRITE)
    MRule = MRule.replace(/# HEADER REWRITE/g, Rule.HREWRITE)
    MRule = MRule.replace(/#HostName/g, "hostname = " + Rule.HOSTNAME.split("\n").join(","))

    $("loadingText").text = "开始享受吧~"
    $ui.animate({
        duration: 1.0,
        animation: function () {
            $("loadingView").alpha = 0
        },
        completion: function () {
            $("loadingView").remove()
            $ui.menu({
                items: ["Surge 2.X", "Surge 3.X", "Shadowrocket"],
                handler: function (title, idx) {
                    switch (idx) {
                        case 2:
                            Rule.ss = true;
                            MRule = Srt.Header + MRule;
                            $("bgimage").src = icon.srt;
                            break;
                        default:
                            Rule.ss = false;
                            $ui.toast("你选择了 " + title);
                            MRule = Surge.Header + Surge.Groups + MRule;
                            MRule = idx ? MRule.replace(/,REJECT/g, ",REJECT-TINYGIF") : MRule.replace(/,dns-failed/g, "");
                            break;
                    }
                },
                finished: function (cancelled) {
                    cancelled ? exit(2, "你选择了取消,脚本 2 秒后自动关闭...") : $ui.animate({
                        duration: 0.4,
                        animation: function () {
                            $("ProxysView").updateLayout(function (make) {
                                make.top.inset(SCH * 0.5)
                            })
                            $("ProxysView").relayout()
                        }
                    })
                }
            })
        }
    })
}

function splitProxys(params) {
    let proxys = []
    let data = params.split("\n")
    for (const temp of data) {
        proxys.push(temp.split("=", 1))

    }
    MRule = MRule.replace(/ProxyHeader/g, proxys.join(","))
}

function console(params) {
    debugMode ? $console.log(params) : 0;
}

function initUi() {
    initRuleMaker()
    $ui.render({
        props: {
            title: "RuleMaker",
            bgcolor: $color("#dddddd")
        },
        views: [{
            type: "view",
            props: {
                id: "MainUI"
            },
            layout: $layout.fill,
            views: [{
                type: "image",
                props: {
                    id: "bgimage",
                    src: icon.surge
                },
                layout: $layout.center
            }, {
                type: "blur",
                props: {
                    style: 1
                },
                layout: $layout.fill
            }, {
                type: "label",
                props: {
                    align: $align.center,
                    text: "lhie1 & AbleCats",
                    textColor: $color("#abb2bf"),
                },
                layout: function (make, view) {
                    make.height.equalTo(20)
                    make.left.right.bottom.inset(15)
                }
            }, ChooseView, ProxysView, RulesView, HostsView, MiTMView, loadingView]
        }],
        events: {
            tapped(sender) {
                $("proxys").blur()
                $("MiTM").blur()
                $("Rules").blur()
                $("hosts").blur()
            }
        }
    })
}

function exit(sec, title) {
    $ui.toast(title)
    $delay(sec, function () {
        $app.close()
    })
}

initUi()
$app.autoKeyboardEnabled = true
