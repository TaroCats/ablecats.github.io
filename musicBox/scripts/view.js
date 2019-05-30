let c = 0;
let env = $app.env;
let app = require("./app.js");
let phone = $device.isIphoneX;
let platform = ["qq", "netease", "kugou", "kuwo", "xiami"];

const filter = {
  type: "matrix",
  props: {
    alpha: 1,
    columns: 5,
    spacing: 5,
    id: "filter",
    info: "qq",
    itemHeight: 35,
    scrollEnabled: 0,
    bgcolor: $color("clear"),
    template: {
      props: {
        radius: 10,
        bgcolor: $color("clear")
      },
      views: [
        {
          type: "view",
          views: [
            {
              type: "label",
              props: {
                id: "label",
                font: $font(15),
                align: $align.center,
                textColor: $color("gray")
              },
              layout: $layout.center
            }
          ],
          layout: (make, view) => {
            make.width.equalTo(100);
            make.center.equalTo(view.super);
          }
        }
      ]
    },
    data: ["腾讯", "网易", "酷狗", "酷我", "虾米"].map(item => {
      return {
        label: {
          text: "" + item
        }
      };
    })
  },
  layout: (make, view) => {
    make.height.equalTo(50);
    make.left.right.inset(5);
    make.top.equalTo(view.prev.bottom).offset(5);
  },
  events: {
    didSelect: async (sender, indexPath, data) => {
      sender.info = platform[indexPath.row];
      makeDate();
    }
  }
};
const songList = {
  type: "matrix",
  props: {
    alpha: 1,
    columns: 1,
    spacing: 5,
    selectable: 0,
    id: "songList",
    itemHeight: 110,
    scrollEnabled: 1,
    bgcolor: $color("clear"),
    showsVerticalIndicator: 0,
    template: {
      props: {
        radius: 0
      },
      views: [
        {
          type: "view",
          props: {
            id: "canTouch",
            bgcolor: $rgba(192, 192, 192, 0.3)
          },
          views: [
            {
              type: "image",
              props: {
                id: "pic",
                bgcolor: $color("gray")
              },
              layout: (make, view) => {
                make.top.left.inset(0);
                make.size.equalTo($size(100, 100));
              }
            },
            {
              type: "label",
              props: {
                id: "title",
                font: $font("bold", 15),
                align: $align.left,
                textColor: $color("gray")
              },
              layout: (make, view) => {
                make.height.equalTo(20);
                make.top.right.inset(10);
                make.left.equalTo(view.prev.right).offset(10);
              }
            },
            {
              type: "label",
              props: {
                id: "author",
                font: $font(12),
                align: $align.left,
                textColor: $color("gray")
              },
              layout: (make, view) => {
                make.height.equalTo(20);
                make.left.equalTo(view.prev);
                make.top.equalTo(view.prev.bottom).offset(5);
              }
            },
            {
              type: "image",
              props: {
                id: "play",
                bgcolor: $color("clear"),
                icon: $icon("049", $color("gray"), $size(20, 20))
              },
              layout: (make, view) => {
                make.bottom.right.inset(10);
              },
              events: {
                tapped: (sender) => {
                  let i = sender.info;
                  let s = `{url: '${i.url}', name: '${i.title}',artist: '${i.author}',cover: '${i.pic}',lrc: ${JSON.stringify(i.lrc)}}`;
                  player(`if(!i['${i.url}']) ap.list.add([${s}]); `, () => { //$notify(\"test\",{text: i});
                    animateOfthrView(1);
                    $("bgimage").src = i.pic;
                    player("ap.list.switch(ap.list.audios.length-1);ap.play();");
                    player("for (const d of ap.list.audios) {i[d.url] = true;};");
                  });
                }
              }
            },
            {
              type: "image",
              props: {
                id: "addList",
                bgcolor: $color("clear"),
                icon: $icon("104", $color("gray"), $size(20, 20))
              },
              layout: (make, view) => {
                make.bottom.inset(10);
                make.right.equalTo(view.prev.left).offset(-10);
              },
              events: {
                tapped: (sender) => {
                  let i = sender.info;
                  let s = `{url: '${i.url}', name: '${i.title}',artist: '${i.author}',cover: '${i.pic}',lrc: ${JSON.stringify(i.lrc)}}`;
                  player(`if(!i['${i.url}']) ap.list.add([${s}]);`, () => {
                    player("for (const d of ap.list.audios) {i[d.url] = true;};");
                  });
                }
              }
            },
          ],
          layout: (make, view) => {
            make.height.equalTo(90);
            make.top.left.right.inset(5);
          }
        }
      ]
    }
  },
  layout: (make, view) => {
    make.left.right.inset(10);
    make.top.inset(phone ? 90 : 60);
    make.bottom.inset(phone ? 50 : 40);
  },
  events: {
    didReachBottom: async (sender) => {
      let count = sender.data.length;
      if (count % 10 == 0) await makeDate((count / 10) + 1);
    }
  }
};
const searchBar = {
  type: "view",
  props: {
    radius: 20,
    id: "searchBar",
    bgcolor: $rgba(192, 192, 192, 0.3)
  },
  layout: (make, view) => {
    make.height.equalTo(40);
    make.left.right.inset(20);
    make.top.inset(phone ? 40 : 20);
  },
  views: [
    {
      type: "view",
      props: {
        opaque: 1,
        circular: 1,
        bgcolor: $rgba(192, 192, 192, 0.3)
      },
      layout: (make, view) => {
        make.height.equalTo(40);
        make.top.left.right.inset(0);
      },
      views: [
        {
          type: "image",
          props: {
            icon: $icon("023", $color("gary"), $size(20, 20))
          },
          layout: (make, view) => {
            make.left.inset(10);
            make.centerY.equalTo(view.super);
          }
        },
        {
          type: "input",
          props: {
            type: $kbType.search,
            bgcolor: $color("clear")
          },
          layout: (make, view) => {
            make.right.inset(10);
            make.top.bottom.inset(5);
            make.centerY.equalTo(view.super);
            make.left.equalTo(view.prev.right);
          },
          events: {
            didBeginEditing: async sender => {
              animateOfSearchBar(1);
              let count = sender.text.length;
              $("inputDisable").hidden = count ? 1 : 0;
            },
            didEndEditing: sender => {
              animateOfSearchBar(0);
              $("inputDisable").hidden = 1;
            },
            changed: sender => {
              let count = sender.text.length;
              $("inputDisable").hidden = count ? 1 : 0;
            },
            returned: sender => {
              makeDate();
              let count = sender.text.length;
              $("inputDisable").hidden = count ? 1 : 0;
            },
          }
        },
        {
          type: "label",
          props: {
            hidden: 1,
            text: "取消",
            id: "inputDisable",
            bgcolor: $color("clear"),
            textColor: $color("gray")
          },
          layout: (make, view) => {
            make.right.inset(10);
            make.width.equalTo(40);
            make.centerY.equalTo(view.super);
          },
          events: {
            tapped: sender => {
              sender.hidden = 0;
              $("input").blur();
            }
          }
        }
      ]
    },
    filter
  ]
};
const logView = {
  type: "view",
  props: {
    alpha: 0,
    id: "logView",
    bgcolor: $color("white")
  },
  layout: (make, view) => {
    make.top.equalTo(0);
    make.height.equalTo(40);
    make.left.right.inset(40);
    viewsAddShadows(view, $size(3, 3));
  },
  views: [{
    type: "image",
    props: {
      bgcolor: $color("clear"),
      icon: $icon("009", $color("gray"), $size(20, 20))
    },
    layout: (make, view) => {
      make.left.inset(10);
      make.height.equalTo(20);
      make.centerY.equalTo(view.super);
    }
  }, {
    type: "label",
    props: {
      id: "log",
      font: $font(14),
      align: $align.center,
      bgcolor: $color("clear"),
      textColor: $color("gray"),
    },
    layout: (make, view) => {
      make.right.inset(10);
      make.height.equalTo(20);
      make.centerY.equalTo(view.super);
      make.left.equalTo(view.prev.right).offset(10);
    }
  }]
}
const subView = {
  type: "view",
  props: {
    info: 0,
    id: "subView",
    bgcolor: $color("white")
  },
  layout: (make, view) => {
    make.bottom.inset(0);
    viewsAddShadows(view, $size(0, 6));
    make.edges.equalTo($insets(0, 0, 0, 0));
  },
  views: [
    {
      type: "image",
      props: {
        id: "bgimage"
      },
      views: [
        {
          type: "blur",
          props: {
            style: 5 // 0 ~ 5
          },
          layout: $layout.fill
        }
      ],
      layout: $layout.fill
    },
    songList,
    searchBar,
    {
      type: "button",
      props: {
        id: "subViewTurn",
        bgcolor: $color("clear"),
        icon: $icon("048", $color("black"), $size(25, 25))
      },
      layout: (make, view) => {
        make.centerX.equalTo(view.super);
        make.bottom.inset(phone ? 20 : 10);
      },
      events: {
        tapped: sender => animateOfthrView()
      }
    }
  ]
};
const thrView = {
  type: "web",
  props: {
    id: "player",
    scrollEnabled: 0,
    html: $file.read("assets/index.html").string
  },
  layout: (make, view) => {
    make.height.equalTo(200);
    make.left.right.inset(0);
    make.centerX.equalTo(view.super);
    make.bottom.inset(phone ? 20 : 10);
  },
  events: {
    log: (res) => {
      c = res.count;
      animateOflogView(`正在播放： ${res.text}`);
    },
    test: (object) => {
      console.log(object.text)
    }
  }
};

async function makeDate(page) {
  $("input").blur();
  if (!$("input").text) return;
  $("inputDisable").hidden = 1;
  animateOflogView("数据加载中...");

  let history = $cache.get("history");
  let res = await app.api($("filter").info, page ? page : 1, $("input").text, "name");

  let data = deal(res.data);
  $("songList").endFetchingMore();
  $("songList").data = history == $("input").text ? $("songList").data.concat(data) : data;
};

function deal(data) {
  animateOflogView("数据加载完成...");
  $cache.set("history", $("input").text);
  return data.map(item => {
    return {
      pic: {
        src: item.pic
      },
      title: {
        text: item.title
      },
      author: {
        text: item.author
      },
      play: {
        info: item,
        alpha: item.url ? 1 : 0.4,
        userInteractionEnabled: item.url ? 1 : 0
      },
      addList: {
        info: item,
        alpha: item.url ? 1 : 0.4,
        userInteractionEnabled: item.url ? 1 : 0
      },
      player: item
    };
  });
}
function player(script, handle) {
  $("player").eval({
    script: script,
    handler: handle ? handle : () => { }
  });
}
function animateOflogView(log) {
  $("log").text = log;
  let h = $("subView").info;
  $("logView").animator.makeY(0)
    .moveY(h ? 40 : 85).makeOpacity(1)
    .thenAfter(1.0).wait(1.2)
    .moveY(h ? -40 : -85).makeOpacity(0)
    .animate(0.6);
}
function animateOfthrView(s) {
  if (s & ($("subView").info == 1)) return;
  let turn = ($("subView").info = !$("subView").info);
  $("subView")
    .animator.moveY(turn ? -230 : 230)
    .animate(0.4);
  if (phone) {
    $("songList")
      .animator.moveY(turn ? 170 : -170)
      .moveHeight(turn ? -160 : 160)
      .anchorTop
      .animate(0.4);
    $("subViewTurn")
      .animator.moveY(turn ? 10 : -10)
      .animate(0.4);
  }
  else
    $("songList")
      .animator.moveY(turn ? 140 : -140)
      .moveHeight(turn ? -130 : 130)
      .anchorTop
      .animate(0.4);

}
function animateOfSearchBar(s) {

  let h = s ? 60 : -60;
  $("searchBar")
    .animator.moveHeight(h)
    .anchorTop.animateWithCompletion({
      duration: 0.4,
      completion: () => {
        $("filter").relayout();
      }
    });
}
function viewsAddShadows(view, size) {
  //在layout中使用即可 给Views添加阴影
  var layer = view.runtimeValue().invoke("layer");
  layer.invoke("setShadowRadius", 10);
  layer.invoke("setCornerRadius", 10);
  layer.invoke("setShadowOpacity", 0.3);
  layer.invoke("setShadowOffset", size);
  layer.invoke(
    "setShadowColor",
    $color("gray")
      .runtimeValue()
      .invoke("CGColor")
  );
}

if (env == $env.app) {
  $ui.render({
    props: {
      id: "mainView",
      statusBarStyle: 0,
      navBarHidden: true
    },
    views: [thrView, subView, logView]
  });
  $cache.remove("history");
  $delay(0.3, () => {
    animateOflogView("初始化完成!");
  });
};
