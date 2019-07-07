async function api(plat, page, word) {
  let res = await $http.request({
    method: "POST",
    url: "http://192.168.50.2:3000/search",
    header: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: {
      plat: plat, //qq wy _
      page: page,
      word: word,
    }
  });
  console.log(res.data)
  return res.data;
}

module.exports = {
  api: api
};
