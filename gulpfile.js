var gulp = require('gulp'),
    webpack = require('webpack'),
    connect = require('gulp-connect-php'),
    browserSync = require('browser-sync');

var webpackConfig = {
    mode: 'development',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react']
                }
            }
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    entry: './src',
    output: {
        filename: '../app/bundle.js'
    }
};

gulp.task('serve', function() {
    connect.server({base: 'app', port: 8010, keepalive: true});
    browserSync({
        proxy: '127.0.0.1:8010'
    });
    webpack(webpackConfig, () => {
        gulp.watch('src/*.*').on('change', function () {
            webpack(webpackConfig, () => {
                browserSync.reload();
            });
        });
    });
});

gulp.task('default', gulp.series('serve'));
