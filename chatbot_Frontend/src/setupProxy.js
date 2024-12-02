const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true, // Ensure the Host header is changed to match the target
      cookieDomainRewrite: "localhost", // Rewrite cookies to the target domain
      pathRewrite: { "^/api": "" }, // Remove the `/api` prefix if your backend doesn't use it
    })
  );
};
