var gulp = require('gulp'),
    webpack = require('webpack'),
    connect = require('gulp-connect-php'),
    browserSync = require('browser-sync');

gulp.task('serve', function() {
    connect.server({base: 'src', port: 8010, keepalive: true});
    browserSync({
        proxy: '127.0.0.1:8010'
    });
    gulp.watch('src/*.*').on('change', function () {
        webpack({
            mode: 'development',
            module: {
                rules: [{
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react']
                        }
                    }
                }]
            },
            resolve: {
                extensions: ['*', '.js', '.jsx']
            },
            entry: './src',
            output: {
                filename: '../app/bundle.js'
            }
        }, () => {
            browserSync.reload();
        });
    });
});

gulp.task('default', gulp.series('serve'));
