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
      make.size.equalTo($size(80, 80))
    }
  }, {
    type: "label",
    props: {
      text: "LOADING..."
    },
    layout: function(make, view) {
      make.centerX.equalTo(view.super)
      make.top.equalTo(view.prev.bottom)
    }
  }]
}

function addLodingView(views) {
  views.add(lodingView)
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

module.exports = {
  add: addLodingView,
  remove: removeLoadingView
}