function init() {
  $cache.removeAsync({
    key: "td",
    handler: function() {
      $cache.remove("tu")
      $timer.schedule({
        interval: 1,
        handler: function() {
          var type = $device.networkType
          var ifa_data = $network.ifa_data
          
          switch (type) {
            case 0:
              break;
            case 1:
              dealText(ifa_data.en0)
              break;
            case 2:
              dealText(ifa_data.pdp_ip0, ifa_data.bridge100)
              break;
          }
        }
      })
    }
  })
}

function dealText(d, b) {
  let n, temp, upload, download

  temp = $cache.get("tu")
  n = b ? d.sent + b.sent : d.sent
  $cache.set("tu", n)
  upload = `↾ ${((n - temp) >= 1024) ? ((n - temp) / 1024 >= 1024) ? `${((n - temp) / 1024 / 1024).toFixed(2)} Mb/s` : `${(n - temp) / 1024} Kb/s` : `${temp == undefined ? 0 : (n - temp)} b/s`}`

  temp = $cache.get("td")
  n = b ? d.received + b.received : d.received
  $cache.set("td", n)
  download = `⇃ ${((n - temp) >= 1024) ? ((n - temp) / 1024 >= 1024) ? `${((n - temp) / 1024 / 1024).toFixed(2)} Mb/s` : `${(n - temp) / 1024} Kb/s` : `${temp == undefined ? 0 : (n - temp)} b/s`}`

  $("netSpeed").text = `${download}      |      ${upload}`
}


module.exports = {
  init: init
}
