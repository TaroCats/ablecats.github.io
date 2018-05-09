var header = readToken()

var lastPage = []
var lastName = []

const userUrl = "https://api.github.com/user"
const reposUrl = "https://api.github.com/repos"

const loginView = {
  type: "view",
  props: {
    alpha: 0,
    id: "TokenView",
    bgcolor: $color("white")
  },
  layout: $layout.fill,
  views: [{
    type: "input",
    props: {
      id: "Token",
      align: $align.center,
      type: $kbType.search,
      placeholder: "请输入Token"
    },
    layout: function(make, view) {
      make.top.inset(30)
      make.height.equalTo(32)
      make.left.right.inset(10)
    },
    events: {
      returned: function(sender) {
        sender.blur()
      }
    }
  }, {
    type: "button",
    props: {
      title: "验证"
    },
    layout: function(make, view) {
      make.left.right.inset(40)
      make.center.equalTo(view.super)
    },
    events: {
      tapped: function(sender) {
        header = {
          Authorization: "token " + $("Token").text,
        }
        testToken(userUrl)
      }
    }
  }]
}
const reposView = {
  type: "view",
  props: {
    id: "ReposView"
  },
  layout: $layout.fill,
  views: [{
    type: "button",
    props: {
      id: "reposChoose",
      title: "选择仓库",
      bgcolor: $rgba(0, 0, 0, .3)
    },
    layout: function(make, view) {
      make.top.left.right.inset(10)
      make.centerX.equalTo(view.super)
    },
    events: {
      tapped: async function(sender) {
        $("reposChoose").title = "仓库加载中..."
        $picker.data({
          props: {
            items: await makeItems()
          },
          handler: async function(data) {
            lastPage = []
            lastName = []
            $("reposChoose").title = data[0]
            dealData(`${reposUrl}/${$cache.get("user")}/${data[0]}/contents/`)
          }
        })
      }
    }
  }, {
    type: "list",
    props: {
      data: [],
      rowHeight: 60,
      smoothRadius: 10,
      id: "reposDataList",
      template: {
        props: {
          bgcolor: $color("clear")
        },
        views: [{
          type: "label",
          props: {
            id: "reposName",
            align: $align.left,
          },
          layout: function(make, view) {
            make.top.left.inset(10)
          }
        }, {
          type: "label",
          props: {
            font: $font(12),
            id: "reposInfo",
            align: $align.center,
            textColor: $color("#666666"),
          },
          layout: function(make, view) {
            make.left.bottom.inset(10)
          }
        }]
      },
      actions: [{
          title: "删除",
          handler: async function(sender, indexPath) {
            let data = sender.object(indexPath)
            let body = {
              sha: data.reposSHA,
              path: data.reposPathURL,
              message: "deleteAt Github JSBox"
            }
            let d = await getURL(data.reposPathURL, "DELETE", header, body)
            $ui.toast(d.data.content == null ? "删除成功" : "删除失败")
          }
        },
        {
          title: "链接",
          handler: async function(sender, indexPath) {
            let data = sender.object(indexPath)
            let d = await getURL(data.reposPathURL, "GET")
            $ui.toast(d.data.download_url ? "链接已经复制到剪贴板" : "请求失败")
            $clipboard.text = d.data.download_url;
          }
        }
      ],
    },
    layout: function(make, view) {
      make.bottom.inset(70)
      make.left.right.inset(10)
      make.centerX.equalTo(view.super)
      make.top.equalTo(view.prev.bottom).offset(10)
    },
    events: {
      didSelect: async function(sender, indexPath, data) {
        let temp = data
        if (temp.reposInfo.text == "dir") {
          dealData(temp.reposPathURL)
          $("reposChoose").title = temp.bottomName
        } else if (temp.reposInfo.text == "file") {
          let d = await getURL(temp.reposPathURL, "GET")
          $http.download({
            url: d.data.download_url,
            handler: function(resp) {
              addbrowseView(resp.data)
            }
          })
        }
      }
    }
  }, {
    type: "view",
    props: {

    },
    layout: function(make, view) {
      make.left.right.bottom.inset(0)
      make.centerX.equalTo(view.super)
      make.top.equalTo(view.prev.bottom).offset(10)
    },
    views: [{
      type: "label",
      props: {
        id: "return",
        text: "返回",
        hidden: true,
        smoothRadius: 10,
        align: $align.center,
        bgcolor: $color("tint"),
        textColor: $color("white"),
      },
      layout: function(make, view) {
        make.height.equalTo(50)
        make.left.bottom.inset(10)
        make.width.equalTo(view.super.width).dividedBy(3.5)
      },
      events: {
        tapped: function(sender) {
          let index = lastPage.length - 2
          dealData(lastPage[index])
          $("reposChoose").title = lastName[index]
          deleteLastPage()
        }
      }
    }, {
      type: "label",
      props: {
        text: "上传",
        id: "upload",
        hidden: true,
        smoothRadius: 10,
        align: $align.center,
        bgcolor: $color("tint"),
        textColor: $color("white")
      },
      layout: function(make, view) {
        make.height.equalTo(50)
        make.right.bottom.inset(10)
        make.width.equalTo(view.super.width).dividedBy(3.5)
      },
      events: {
        tapped: async function(sender) {
          let index = lastPage.length - 1
          uploadFile(lastPage[index])
        }
      }
    }]
  }]
}

const lodingView = {
  type: "blur",
  props: {
    style: 1,
    alpha: 0,
    id: "lodingView"
  },
  layout: $layout.fill,
  views: [{
    type: "spinner",
    props: {
      style: 0,
      loading: true,
      color: $color("")
    },
    layout: function(make, view) {
      make.center.equalTo(view.super)
      make.size.equalTo($size(100, 100))
    }
  }]
}

async function getURL(u, m, h, b) {
  addLodingView()
  let d = await $http.request({
    url: u,
    method: m,
    body: b ? b : {},
    header: h == "NULL" ? {} : header,
  })
  removeLoadingView()
  return d
}

async function uploadFile(p) {
  p ? "" : $ui.toast("未完成上传...")
  let u = p.replace("?ref=master", "")
  let body = {
    path: `${u}/${$context.data.fileName}`,
    message: "updataAt Github JSBox",
    content: $text.base64Encode($context.data),
  }
  let d = await getURL(body.path, "PUT", header, body)
  $ui.toast("上传成功,稍后刷新查看...")
}

async function testToken(userUrl) {

  async function succeed(t) {
    $cache.set("user", t.login)
    $ui.toast(t.login + " 欢迎回来")
    $cache.set("reposUrl", t.repos_url)
    $ui.animate({
      duration: 0.4,
      animation: function() {
        $("TokenView").alpha = 0
      },
      completion: function() {
        $file.write({
          data: $data({ string: JSON.stringify(header) }),
          path: "Token"
        })
        $("TokenView").remove()
      }
    })
  }

  function failed() {
    $ui.toast("登录失败")
    $("Main").add(loginView)
    $ui.animate({
      duration: 0.4,
      animation: function() {
        $("TokenView").alpha = 1
      },
      completion: function() {
        $file.delete("GitHub/Token")
      }
    })
  }

  let t = await getURL(userUrl, "GET")
  t.data.login ? succeed(t.data) : failed();
}

async function makeItems(url) {
  let num = 1;
  let reposData = [];
  do {
    let repos = await getURL(`${userUrl}/repos?page=${num}`, "GET");
    for (let value of repos.data) {
      if (value) {
        reposData.push({
          title: `${value.name}`
        })
      }
    }
    num++
  }
  while (reposData.length % 30 == 0)
  return reposData;
}

async function dealData(url) {
  let reposData = []
  let d = await getURL(url, "GET")

  for (let v of d.data) {
    if (v) {
      reposData.push({
        reposName: { text: v.name },
        reposInfo: { text: v.type },
        reposSHA: v.sha,
        reposPath: v.path,
        reposPathURL: v.url,
        bottomName: `${$("reposChoose").title}${v.type == "dir" ? `/${v.name}` : ""}`
      })
    }
  }
  $("reposDataList").data = reposData
  saveLastPage(url)
  $("return").hidden = lastPage.length >= 2 ? false : true;
  $("upload").hidden = $context.data && lastPage.length >= 2 ? false : true
  console.log(lastPage)
}

function addLodingView() {
  $("Main").add(lodingView)
  $ui.animate({
    duration: 0.4,
    animation: function() {
      $("lodingView").alpha = 1
    },
    completion: function() {

    }
  })
}

function removeLoadingView() {
  $ui.animate({
    duration: 0.4,
    animation: function() {
      $("lodingView").alpha = 0
    },
    completion: function() {
      $("lodingView").remove()
    }
  })
}

function addbrowseView(data) {

  let browseViewBlur = {
    type: "blur",
    props: {
      style: 1,
      alpha: 0,
      id: "browseViewBlur"
    },
    layout: $layout.fill,
    views: []
  }

  let browseView = {
    type: "view",
    props: {
      radius: 10,
      borderWidth: 1,
      id: "browseView",
      bgcolor: $color("white"),
      borderColor: $color("lightGray")
    },
    layout: function(make, view) {
      make.centerX.equalTo(view.super)
      make.top.equalTo(view.super.bottom)
      make.left.right.inset(10)
      make.height.equalTo(view.super).offset($device.info.model == "iPhone10,3" ? -30 : -20)
    },
    views: []
  }

  let textView = {
    type: "view",
    props: {
      id: "textView",
    },
    layout: $layout.fill,
    views: [{
      type: "text",
      props: {
        font: $font(15),
        text: data.string
      },
      layout: function(make, view) {
        make.bottom.inset(40)
        make.top.left.right.inset(0)
        make.center.equalTo(view.super)
      }
    }, {
      type: "button",
      props: {
        title: "关闭"
      },
      layout: function(make, view) {
        make.left.inset(20)
        make.width.equalTo(100)
        make.top.equalTo(view.prev.bottom).offset(3)
      },
      events: {
        tapped: function(sender) {
          $("browseViewBlur").remove()
        }
      }
    }, {
      type: "button",
      props: {
        title: "保存"
      },
      layout: function(make, view) {
        make.right.inset(20)
        make.width.equalTo(100)
        make.top.equalTo(view.prev.top)
      },
      events: {
        tapped: function(sender) {

        }
      }
    }]
  }

  let imageView = {
    type: "view",
    props: {

      id: "imageView",
    },
    layout: $layout.fill,
    views: [{
      type: "image",
      props: {
        data: data,
        contentMode: $contentMode.scaleAspectFit
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.edges.equalTo($insets(0, 0, 40, 0))
      }
    }, {
      type: "button",
      props: {
        title: "关闭"
      },
      layout: function(make, view) {
        make.left.inset(20)
        make.bottom.inset(3.5)
        make.width.equalTo(100)
      },
      events: {
        tapped: function(sender) {
          $("browseViewBlur").remove()
        }
      }
    }, {
      type: "button",
      props: {
        title: "下载"
      },
      layout: function(make, view) {
        make.right.inset(20)
        make.bottom.inset(3.5)
        make.width.equalTo(100)
      },
      events: {
        tapped: function(sender) {
          $photo.save({
            data: data,
            handler: function(success) {
              $ui.toast(success ? "保存成功" : "保存失败")
            }
          })

        }
      }
    }]
  }

  $("Main").add(browseViewBlur)

  $ui.animate({
    duration: 0.4,
    animation: function() {
      $("browseViewBlur").alpha = 1
    },
    completion: function() {
      $("browseViewBlur").add(browseView)
      data.image != undefined ? $("browseView").add(imageView) : 0;
      data.string != undefined ? $("browseView").add(textView) : 0;
      $thread.main({
        delay: 0.1,
        handler: () => $("browseView").animator.moveY($("browseView").super.frame.height * -1 + 10).easeOutBack.animate(1)
      })
    }
  })
}

function saveLastPage(url) {
  if (lastPage.length) {
    for (let v of lastPage)
      if (v == url) return
  }
  lastPage.push(url)
  lastName.push($("reposChoose").title)
}

function deleteLastPage() {
  let index = lastPage.length - 1

  lastPage.splice(index, 1)
  lastName.splice(index, 1)
}

function readToken() {
  return $file.read("Token") ? JSON.parse($file.read("Token").string) : null
}

$ui.render({
  props: {
    id: "Main",
    title: "GitHub"
  },
  views: [reposView]
})

testToken(userUrl)
$app.autoKeyboardEnabled = true
$app.keyboardToolbarEnabled = true