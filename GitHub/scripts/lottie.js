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
          src: `assets/${name}.json`
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
          align: $align.center
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
  $("lottie").stop();
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
  animationOfLottie: animationOfLottie,
  lottieStop: lottieStop,
  addLottie: addLottie,
  lottie: lottie,
  wait: () => addLottie("MainView", "loading", "Please Wait..."),
  fill: () => addLottie("MainView", "loading", "Please Wait...", 0, 1, $layout.fill)

};
