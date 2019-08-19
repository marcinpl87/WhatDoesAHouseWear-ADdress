var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    webpack = require('webpack'),
    connect = require('gulp-connect-php'),
    browserSync = require('browser-sync');

var sassCompile = (callback) => {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('./app'))
        .on('end', callback);
}

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

gulp.task('serve', () => {
    connect.server({base: 'app', port: 8010, keepalive: true});
    browserSync({
        proxy: '127.0.0.1:8010'
    });
    sassCompile(() => {
        webpack(webpackConfig, () => {
            gulp.watch('./src/**/*.js').on('change', () => {
                webpack(webpackConfig, browserSync.reload);
            });
            gulp.watch('./sass/**/*.scss').on('change', () => {
                sassCompile(browserSync.reload);
            });
            gulp.watch('./app/**/*.php').on('change', () => {
                browserSync.reload();
            });
        });
    });
});

gulp.task('default', gulp.series('serve'));
