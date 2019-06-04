function lottie(name, label, style, layout) {
  return {
    type: "blur",
    props: {
      alpha: layout ? 1 : 0,
      style: style ? style : 1,
      id: "Lottie"
    },
    views: [
      {
        type: "lottie",
        props: {
          loop: 1,
          src: `assets/Lottie/${name}.json`
        },
        layout: (make, view) => {
          make.size.equalTo($size(200, 200));
          make.center.equalTo(view.super);
        }
      },
      {
        type: "label",
        props: {
          text: label,
          id: "lottieLabel",
          align: $align.center,
        },
        layout: (make, view) => {
          make.centerX.equalTo(view.super);
          make.top.equalTo(view.prev.bottom).offset(20);
        }
      }
    ],
    layout: layout ? layout : (make, view) => {
      make.top.inset(0);
      make.left.right.inset(0);
      make.bottom.equalTo($("LG").top);
    }
  };
}

function fixLabel(text) {
  $("lottieLabel").text = text;
}

function addLottie(ui, name, label, once, style, layout) {
  $(ui).add(lottie(name, label, style, layout));
  animationOfLottie(1);
  if (once) $("lottie").loop = 0;

  $("lottie").play({
    handler: finished => {
      animationOfLottie(0);
    }
  });
}

function lottieStop() {
  $("lottie") ? $("lottie").stop() : 0;
}

function animationOfLottie(alpha) {
  $ui.animate({
    duration: 0.4,
    animation: () => {
      $("Lottie").alpha = alpha;
    },
    completion: () => {
      if (!alpha) $("Lottie").remove();
    }
  });
}

module.exports = {
  lottie: lottie,
  fixLabel: fixLabel,
  addLottie: addLottie,
  lottieStop: lottieStop,
  animationOfLottie: animationOfLottie,
  wait: (view) => addLottie(view, "scan", "资源搜索中..."),
  fill: (view) => addLottie(view, "scan", "资源搜索中...", 0, 1, $layout.fill)
};
