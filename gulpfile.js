const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const del = require("del");

function browsersync() {
	browserSync.init({
		server: {
			baseDir: "app/",
		},
		notify: false,
	});
}

function styles() {
	return src("app/scss/style.scss")
		.pipe(scss({ outputStyle: "expanded" }))
		.pipe(concat("style.min.css"))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 15 versions"],
				grid: true,
			})
		)
		.pipe(dest("app/css"))
		.pipe(browserSync.stream());
}

function scripts() {
	return src("app/js/main.js").pipe(dest("app/js")).pipe(browserSync.stream());
}

function images() {
	return src("app/img/**/*.*")
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest("docs/img"));
}

function build() {
	return src(["app/**/*.html", "app/css/style.min.css", "app/js/main.js"], { base: "app" }).pipe(dest("docs/"));
}

function cleanDist() {
	return del("docs/");
}

function watching() {
	watch(["app/scss/**/*.scss"], styles).on("change", browserSync.reload);
	watch(["app/js/**/*.js"], scripts);
	watch(["app/**/*.html"]).on("change", browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.browsersync = browsersync;
exports.cleanDist = cleanDist;
exports.watching = watching;
exports.build = series(cleanDist, images, build);

exports.default = parallel(styles, scripts, browsersync, watching);
