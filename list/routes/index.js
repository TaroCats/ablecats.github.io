const router = require('koa-router')()
const { requist } = require('../api')

router.get('/music', async (ctx, next) => {
  await requist(ctx)
})

router.post('/music', async (ctx, next) => {
  await requist(ctx)
})

module.exports = router
