gulp-aspnet-k
=============

Gulp plugin for ASP.NET vNext. You can use this plugin to integrate ASP.NET vNext build, package restore and run available commands inside you project.json file.

## Installation

You can install gulp-aspnet-k plugin through npm:

    npm install gulp-aspnet-k

Preferably, you can save this as dev dependency:

    npm install gulp-aspnet-k --save-dev

## Usage

    var gulp = require('gulp'),
        aspnetk = require("gulp-aspnet-k");

    gulp.task('default', function(cb) {
        return gulp.start('aspnet-run');
    });

    gulp.task('aspnet-run', aspnetk());

The default function restores the packages according to your project.json file and runs the web command inside the project.json file. You can pass a few options to this to choose what's actually going to run:

    // the default options
    var options = {
        restore: true,
        build: false,
        run: true,
        loop: true,
        quiet: true,
        kCommand: 'web'
	};

    gulp.task('aspnet-run', aspnetk(options));

The first three options indicate which commands to execute:

* `restore`: Runs the `kpm restore` command.
* `build`: Runs the `kpm build` command.
* `run`: Runs the `k --watch <kCommand>` command.

The last three options control execution:

* `loop`: When true, the selected commands are run in a loop so that the server can be re-started when `--watch` terminates the process. Used with the default `loop: true` option, this allows new packages to be restored when `project.json` is changed.
* `quiet`: Adds the `--quiet` option to the `restore` and `build` commands, useful for removing noise from your console.
* `kCommand`: Indicates the command to pass to `k` when running.

There are also shorthand methods for specific tasks:

    // only restores the packages
    gulp.task('aspnet-restore', aspnetk.restore());

    // only builds the project
    gulp.task('aspnet-build', aspnetk.build());

    // restores the packages and builds the project
    gulp.task('aspnet-restore-build', aspnetk.restoreBuild());

gulp-aspnet-k also integrates with `k --watch` to run your commands. So, it will restart your server when you change a code file.