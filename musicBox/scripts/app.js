async function api(type, page, input, filter) {
  console.log({
    type: type, //qq wy _
    page: page,
    input: input,
    filter: filter //id url name
  })
  let res = await $http.request({
    method: "POST",
    url: "http://www.jbsou.cn/",
    header: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: {
      type: type, //qq wy _
      page: page,
      input: input,
      filter: filter //id url name
    }
  });
  return res.data;
}

module.exports = {
  api: api
};
