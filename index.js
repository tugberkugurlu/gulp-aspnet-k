var _ = require('lodash'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util');

var PLUGIN_NAME = 'aspnet-k';

var kRunner = function(options) {

    options = _.extend({
        restore: true,
        build: false,
        run: true,
        loop: true,
        quiet: true,
        kCommand: 'web'
    }, options);

    if(options.restore == false && options.build == false && options.run == false) {
        throw new gutil.PluginError(PLUGIN_NAME, 'No action has been specified')
    }

    var commands = [];

    if(options.restore === true) {
        commands.push('kpm restore' + (options.quiet? ' --quiet' : ''));
    }

    if(options.build === true) {
        commands.push('kpm build' + (options.quiet? ' --quiet' : ''));
    }

    if(options.run === true) {
        commands.push('k --watch ' + options.kCommand);
    }

    return shell.task(options.loop? wrapLoop(commands) : commands, { env: process.env });
}

var wrapLoop = function(commands) {
    return '@powershell -NoProfile -ExecutionPolicy unrestricted -Command "for(;;) { Write-Output \"Starting...\";'
    + commands.join('; ')
    + ' }"';

}

kRunner.build = function() {
    return kRunner({
        build: true,
        restore: false,
        run: false
    });
}

kRunner.restore = function() {
    return kRunner({
        restore: true,
        build: false,
        run: false
    });
}

kRunner.restoreBuild = function() {
    return kRunner({
        restore: true,
        build: true,
        run: false
    });
}

module.exports = kRunner;
