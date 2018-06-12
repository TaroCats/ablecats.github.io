async function fowardSongs() {
  let index = $("albumimg").info--;
  let count = $("bgimgBlur").info.length - 1;

  assignment(index < 0 ? count : index)
  await cache($("bgimgBlur").info[index].url)
}

async function nextSongs() {
  let index = $("albumimg").info++;
  let count = $("bgimgBlur").info.length - 1;

  assignment(index++ > count ? 0 : index)
  await cache($("bgimgBlur").info[$("albumimg").info].url)
}

async function cache(url) {
  $audio.stop()
  let name = getFileName(url)
  $("pos").userInteractionEnabled = false
  if ($file.exists(`songs/${name}`)) {
    $audio.play({
      path: `songs/${name}`
    });
    $ui.toast("发现缓冲文件,正在读取...")
  } else {
    loading.add($("albumimg"), 1, ' ')
    $ui.toast("歌曲正在缓冲,请稍等...")
    $audio.play({
      url: url
    });
  }

  $("pos").info = true;
  timer == null ? setTimer() : 0;
  $("pos").src = "assets/stop.png";
  $("pos").userInteractionEnabled = true;
}

async function init(url, t) {

  async function word() {
    let res = await $http.get(`https://ablecats.github.io/ACPlayer/Sreach`)
    return res.data;
  }

  loading.add($("MainView"));
  let woq = t ? '&t=qq' : '';
  let key = $text.URLEncode(url ? url : await word());
  let res = await $http.get(`${mhosts}music/?id=${key}${woq}`);
  loading.remove();

  filesExit();
  log(res.data.data);
  dealData(res.data.count, res.data.data);
  !$audio.status ? assignment(0) : 0;
}

async function getPlist() {
  let array = []
  let res = await $http.get(`${mhosts}netease/plist.php`);
  let arr = await $http.get('http://ablecats.github.io/ACPlayer/recommend');
  array.push(arr.data)
  for (let i in res.data.playlists) {
    if (i < 19) {
      let v = res.data.playlists[i]
      array.push({
        plistId: v.id,
        plistImg: {
          src: v.coverImgUrl,
        },
        plistName: {
          text: v.name
        },
      })
    }
  }
  $("matrix").endRefreshing()
  return array
}

async function addSearchView() {
  $("playControl").add(searchView)
  loading.add($("searchView"))
  $ui.animate({
    duration: 0.4,
    animation: function () {
      $("searchView").alpha = 1
    }
  })
  $("matrix").data = await getPlist()
  loading.remove()
}

function removeSearchView() {
  $ui.animate({
    duration: 0.4,
    animation: function () {
      $("searchView") ? $("searchView").alpha = 0 : 0;
    },
    completion: function () {
      $("searchView") ? $("searchView").remove() : 0;
    }
  })
}

function filesExit() {
  if (!$file.exists("songs")) {
    if (!$file.mkdir("songs")) {
      $ui.alert({
        title: "子文件夹创建失败",
        message: "可能会导致播放错误\n请自行手动在根目录下创建songs文件夹",
      })
    }
  }
}

function setTimer() {
  function transTime(value) {
    function formatTime(value) {
      var time = "";
      var s = value.split(':');
      var i = 0;
      for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
      }
      time += s[i].length == 1 ? ("0" + s[i]) : s[i];

      return time;
    }

    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
      time = formatTime(h + ":" + m + ":" + s);
    } else {
      time = formatTime(m + ":" + s);
    }

    return time;
  }

  timer = $timer.schedule({
    interval: 0.1,
    handler: function () {
      let data = $("lrcView").data
      let offset = String($audio.offset.toFixed(0))

      if ($audio.status == 2) {
        loading.remove();
        if (data != null) {
          for (const key in data) {
            if (offset == data[key].index) {
              $("lrcView").scrollTo({
                indexPath: $indexPath(0, key),
                position: 2,
                animated: true
              })
            }
          }
        }

        $("slider").max = $audio.duration
        $("slider").value = $audio.offset
        $('sTime').text = transTime($audio.offset)
        $('eTime').text = transTime($audio.duration)
        $("slider").hidden = $('sTime').hidden = $('eTime').hidden = false;
        if (transTime($audio.offset) == transTime($audio.duration)) nextSongs();
      } else killTimer();
    }
  })
}

function killTimer() {
  if (timer) {
    $("slider").hidden = true;
    $('sTime').hidden = true;
    $('eTime').hidden = true;
    if (!$audio.status) {
      timer.invalidate();
      timer = null;
    }
  }
}

function getFileName(u) {
  return `${$("songName").text}_${$("songSinger").text}.${u.split('.')[u.split('.').length - 1].split('?')[0]}`
}

function assignment(i) {
  let d = $("bgimgBlur").info[i]

  log(d)
  getLrc(d.lrc)

  $("albumimg").info = i
  $("bgimg").src = d.img
  $("albumimg").src = d.img
  $("songName").text = d.title
  $("songSinger").text = d.singer
}

function dealData(c, d) {
  let array = []
  let listData = []

  for (let i = 0; i < c; i++) {
    let v = d[i]

    array.push({
      id: v.id,
      url: v.url,
      img: v.pic,
      ape: v.ape,
      lrc: v.lrc,
      flac: v.flac,
      mvurl: v.mvurl,
      title: v.title,
      singer: `${v.singer} - ${v.Album}`
    })

    listData.push({
      id: {
        text: v.id
      },
      num: {
        text: (i + 1).toString()
      },
      url: {
        text: v.url
      },
      img: {
        text: v.pic
      },
      ape: {
        text: v.ape
      },
      lrc: {
        text: v.lrc
      },
      flac: {
        text: v.flac
      },
      title: {
        text: v.title
      },
      videoBtn: {
        info: v.mvurl,
        hidden: v.mvurl ? false : true
      },
      singer: {
        text: `${v.singer} - ${v.Album}`
      }
    })
  }

  $("bgimgBlur").info = array
  $("sreachList").data = listData
  $("sreachList").endRefreshing()
}

function shadow(view) {
  var layer = view.runtimeValue().invoke("layer")
  layer.invoke("setCornerRadius", 10)
  layer.invoke("setShadowOffset", $size(3, 3))
  layer.invoke("setShadowColor", $color("gray").runtimeValue().invoke("CGColor"))
  layer.invoke("setShadowOpacity", 0.3)
  layer.invoke("setShadowRadius", 5)
}

function getLrc(url) {
  function parseLyric(lrc) {
    let LRC = []
    var lrcObj = {};
    var lyrics = lrc.split("\n");
    for (var i = 0; i < lyrics.length; i++) {
      var lyric = decodeURIComponent(lyrics[i]);
      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      var clause = lyric.replace(timeReg, '');
      for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
        var t = timeRegExpArr[k];
        var min = Number(String(t.match(/\[\d*/i)).slice(1)),
          sec = Number(String(t.match(/\:\d*/i)).slice(1));
        var time = min * 60 + sec;
        if (clause)
          lrcObj[time] = clause;
      }
    }
    if (lrcObj) {
      for (let i in lrcObj) {
        LRC.push({
          index: i,
          lrc: {
            text: lrcObj[i]
          }
        })
      }
    }

    $("lrcView").info = LRC
    $("lrcView").data = LRC
  }

  $http.get({
    url: url,
    handler: function (res) {
      parseLyric(res.data)
    }
  })
}

function log(s) {
  debug ? console.log(s) : 0;
}
