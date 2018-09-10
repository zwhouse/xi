const path = require("path");

module.exports = {
    entry: "./src/main",
    mode: "development",
    //mode: "production",
    module: {
        rules: [
            { test: /\.tsx?$/, use: "ts-loader" }
        ]
    },
    resolve: {
        extensions: [".ts"]
    },
    output: {
        filename: "xi.js",
        path: path.resolve(__dirname, './dist'),
        libraryTarget: 'var',
        library: 'xi'
    }
};
