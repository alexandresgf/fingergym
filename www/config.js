require.config({
    baseUrl: 'js/',
    paths: {
        phaser: '../lib/phaser.min',
        jquery: '../lib/jquery-2.2.0.min'
    },
    shim: {
        'phaser': {
            exports: 'Phaser'
        }
    }
});

requirejs(['Main']);