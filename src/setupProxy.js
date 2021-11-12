const {createProxyMiddleware} = require('http-proxy-middleware');
const morgan = require('morgan');

// Does not have to be imported anywhere, but is automatically handled by react-scripts

module.exports = (app) => {
    app.use(
        '/covers',
        createProxyMiddleware({
            target: 'http://localhost:8090',
            changeOrigin: true,
            // pathRewrite: {
            //     '^/api': '', // Remove the /api prefix
            // },
        })
    );

    // Proxy logging
    app.use(morgan('combined'));
};
