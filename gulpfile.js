import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import concat from 'gulp-concat';
import sync from 'browser-sync';
const browserSync = sync.create();
import uglify from 'gulp-uglify';
import  nunjucksRender from 'gulp-nunjucks-render';
import  rename from 'gulp-rename';
import del from 'del';
import autoprefixer from 'gulp-autoprefixer';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const scss = gulpSass(dartSass);

function browsersync() {
   browserSync.init({
      server: {
         baseDir: 'app/'
      },
      notify: false,
   })
}

function nunjucks(){
   return gulp.src('app/*.njk')
       .pipe(nunjucksRender())
       .pipe(gulp.dest('app'))
       .pipe(browserSync.stream())
}

function styles() {
   return gulp.src("app/scss/*.scss")
      .pipe(scss({ outputStyle: "compressed" }))
      // .pipe(concat())
       .pipe(rename({
          suffix: '.min'
       }))
      .pipe(
         autoprefixer({
            overrideBrowserslist: ["last 10 versions"],
            grid: true,
         })
      )
      .pipe(gulp.dest("app/css"))
      .pipe(browserSync.stream())
}

function images() {
   return gulp.src('app/images/**/*.*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/images/'))
}

function scripts() {
   return gulp.src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/@fancyapps/ui/dist/fancybox.umd.js',
      'node_modules/rateyo/src/jquery.rateyo.js',
      'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
      'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
      "app/js/main.js"])
      .pipe(concat("main.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest('app/js'))
      .pipe(browserSync.stream())
}

function build() {
   return gulp.src([
      'app/**/*.html',
      'app/css/style.min.css',
      'app/js/main.min.js'
   ], { base: 'app' }).pipe(gulp.dest('dist'))
}

function cleanDist() {
   return del('dist')
}

function watching() {
   gulp.watch(["app/**/*.scss"], styles);
   gulp.watch(["app/*.njk"], nunjucks);
   gulp.watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
   gulp.watch(['app/**/*.html']).on('change', browserSync.reload)
}



export const stylesRun = styles;
export const scriptsRun = scripts;
export const browsersyncRun = browsersync;
export const watchRun = watching;
export const imagesRun = images;
export const nunjucksRun = nunjucks;
export const cleanDistRun = cleanDist;
export const buildRun = gulp.series(cleanDistRun, imagesRun, build)


export const defaultrun = gulp.parallel(nunjucksRun, styles, scripts, browsersyncRun, watching)