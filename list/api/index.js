const axios = require('axios')
const headers = {
  host: 'vip.itwusun.com',
  token: 'ee90de6060a7d750cd0fdeb7ba00d78d'
}

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://vip.itwusun.com/music'
axios.interceptors.request.use(
  config => {
    config.headers = headers
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

function formatJSON(platform, info) {
  var list = []
  for (const i of info) {
    list.push({
      id: i.songId,
      pic: i.picUrl,
      ape: i.apeUrl,
      url: i.copyUrl,
      flac: i.flacUrl,
      mvurl: i.mvHdUrl,
      title: i.songName.replace('"', '*'),
      Album: i.albumName.replace('"', '*'),
      singer: i.artistName.replace('"', '*'),

      lrc: info.lrcUrl ? info.lrcUrl : 'https://ablecats.github.io/ACPlayer/default.lrc'
    })
  }
  return JSON.stringify({
    p: platform,
    data: list,
    count: info.length
  })
}

async function getSong(platform, id) {
  let { data } = await axios.get('/song', {
    params: {
      id: id,
      t: platform
    }
  })
  return formatJSON(platform, data)
}

async function getSongList(id) {
  let { data } = await axios.get('/collect', {
    params: {
      p: 2,
      s: 999,
      t: 'wy',
      id: id
    }
  })
  return formatJSON('wy', data)
}

async function getSongWord(platform, s) {
  let { data } = await axios.get('/search', {
    params: {
      k: s,
      p: 1,
      s: 50,
      t: platform,
    }
  })
  return formatJSON(platform, data)
}

async function Identification(s, id) {
  if (s.search(/playlist/g) != -1) {
    if (s.search(/playlist\?id=/g) != -1) s = s.match(/[1-9][0-9]{5,}/g)[0];
    else if (s.search(/playlist\/(.*?)\//g) != -1) s = s.match(/playlist\/(.*?)\//g)[0].match(/[1-9][0-9]{5,}/g)[0];
    data = await getSongList(encodeURI(s));
  }
  else if (s.search(/song/g) != -1 || id.match(/[1-9][0-9]{5,}/g)[0]) {
    if (s.search(/song\?id=/g) != -1) s = s.match(/[1-9][0-9]{5,}/g)[0];
    else if (s.search(/song\/(.*?)\//g) != -1) s = s.match(/song\/(.*?)\//g)[0].match(/[1-9][0-9]{5,}/g)[0];
    data = await getSong('wy', encodeURI(s));
  }
  else data = await getSongWord('wy', encodeURI(s));
  return data;
}

async function requist(ctx) {
  let { s, p, id } = ctx.request.method === "GET" ? ctx.request.query : ctx.request.body;
  try {
    switch (p) {
      case 'wy':
        Identification(s, id)
        break;
      case 'qq':
        ctx.body = await getSongWord('qq', encodeURI(s));
        break;
      default:
        ctx.body = id ? await getSong('wy', encodeURI(id)) : await getSongWord('wy', encodeURI(s));
        break;
    }
  } catch (error) {
    ctx.body = '<h1>404！！！ o(╯□╰)o</h1>';
  }
}



module.exports = {
  requist,
  getSong,
  getSongList,
  getSongWord
}
