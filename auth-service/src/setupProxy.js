const { createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/auth/signin',
    createProxyMiddleware({
      target: 'http://containers.prod', // Replace with the actual domain of containers.prod
      changeOrigin: true,
      secure: false, // Set this to true if using HTTPS
      cookieDomainRewrite: {
        '*': 'localhost',
      }
    })
  );
};