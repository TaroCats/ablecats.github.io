const
  leftview = {
    type: "view",
    props: {
      id: "leftview",
    },
    layout: function (make, view) {
      make.left.inset(0)
      make.height.equalTo(view.super)
      make.width.equalTo(view.super).dividedBy(2)
    },
    views: [{
      type: "label",
      props: {
        id: "d",
        text: "⇃ 0 b/s",
        align: $align.center
      },
      layout: function (make, view) {
        make.center.equalTo(view.super)
      }
    }]
  },
  rightview = {
    type: "view",
    props: {
      id: "rightview"
    },
    layout: function (make, view) {
      make.right.inset(0)
      make.height.equalTo(view.super)
      make.width.equalTo(view.super).dividedBy(2)
    },
    views: [{
      type: "label",
      props: {
        id: "u",
        text: "↾ 0 b/s",
        align: $align.center
      },
      layout: function (make, view) {
        make.center.equalTo(view.super)
      }
    }]
  }

$ui.render({
  props: {
    title: "netSpeed"
  },
  views: [{
    type: "view",
    props: {
      id: "main"
    },
    layout: $layout.fill,
    views: [leftview, rightview]
  }]
})

function downText(n) {
  $cache.getAsync({
    key: "td",
    handler: function (temp) {
      $cache.set("td", n)
      if ((n - temp) >= 1024) {
        let d = (n - temp) / 1024
        let t = (d >= 1024) ? (d / 1024).toFixed(2) + " Mb/s" : d + " Kb/s"
        $("d").text = "⇃ " + t
      } else {
        $("d").text = "⇃ " + (n - temp) + " b/s"
      }
    }
  })
}

function upText(n) {
  $cache.getAsync({
    key: "tu",
    handler: function (temp) {
      $cache.set("tu", n)
      if ((n - temp) >= 1024) {
        let d = (n - temp) / 1024
        let t = (d >= 1024) ? (d / 1024).toFixed(2) + " Mb/s" : d + " Kb/s"
        $("u").text = "↾ " + t
      } else {
        $("u").text = "↾ " + (n - temp) + " b/s"
      }
    }
  })
}

$cache.removeAsync({
  key: "td",
  handler: function () {
    $cache.remove("tu")
    $timer.schedule({
      interval: 1,
      handler: function () {
        var type = $device.networkType
        var ifa_data = $network.ifa_data
        switch (type) {
          case 0:
            break;
          case 1:
            upText(ifa_data.en0.sent)
            downText(ifa_data.en0.received)
            break;
          case 2:
            upText(ifa_data.bridge100 ? ifa_data.pdp_ip0.sent + ifa_data.bridge100.sent : ifa_data.pdp_ip0.sent)
            downText(ifa_data.bridge100 ? ifa_data.pdp_ip0.received + ifa_data.bridge100.received : ifa_data.pdp_ip0.received)
            break;
        }
      }
    })
  }
})
