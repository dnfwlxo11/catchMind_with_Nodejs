module.exports = {
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:3000/'
            },
            '/api': {
                target: 'http://localhost:3000/'
            }
        }
    }
}