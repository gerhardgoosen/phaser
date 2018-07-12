'use strict';
myPhaserApp.mygame = angular.module('myPhaserApp.mygame', ['ngRoute']);

myPhaserApp.mygame.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/mygame', {
        templateUrl: 'pages/mygame/mygame.html',
        controller: 'MyGameCtrl'
    });
}]);

myPhaserApp.mygame.controller('MyGameCtrl', [function() {
    scope.$on('$destroy', function() {
        game.destroy(); // Clean up the game when we leave this scope
    });

    console.log('MyGame Control Ready ==>');
    var music;
    var scaleRatio = window.devicePixelRatio / 4;

    //Create a new game instance and assign it to the 'gameArea' div
    var width = (window.innerWidth * window.devicePixelRatio) - 20;
    var height = ((window.innerHeight * window.devicePixelRatio) - 100 *
        window.devicePixelRatio);

    //Create a new game instance and assign it to the 'gameArea' div
    game = new Phaser.Game(width, height, Phaser.AUTO, 'gamearea');

    game.state.add('boot', game_boot);
    game.state.add('preload', game_preload);
    game.state.add('menu', game_menu);
    game.state.add('the_game', the_game);
    game.state.start('boot');

}]);
