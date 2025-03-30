const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://zupewh60yi.execute-api.ap-south-1.amazonaws.com/prod',
      changeOrigin: true,
    })
  );
};
