
var game_menu = function(game){

};

game_menu.prototype = {
	preload: function(){ 	console.log("%cdoing menu...", "color:white; background:green"); }
  ,create: function(){

        var world = game.world;
        var background = game.add.tileSprite(0, 0, world.width, world.height, 'starfield');
        background.autoScroll(-50, -20);

        var textPadding = 5;
        var logo = game.add.sprite(world.width - 150, 10, 'logo');

        // var bmpText = game.make.bitmapText(32, 64, 'desyrel', 'Bitmap Text in the Group', 64);

        var newGameBtn = game.add.text(world.centerX - 50, world.centerY - 50, 'New Game', {
            font: "20px Arial",
            fill: "#ffffff",
            align: "left"
        });
        newGameBtn.inputEnabled = true;
        newGameBtn.events.onInputOver.add(overNewgame, this);
        newGameBtn.events.onInputOut.add(outNewgame, this);
        newGameBtn.events.onInputDown.add(onNewgameDown, this);

        function outNewgame() {
            game.add.tween(newGameBtn.scale)
                .to({
                        x: 1.0,
                        y: 1.0
                    },
                    300,
                    Phaser.Easing.Exponential.Out, true);
                    stopAudio();
        };

        function startAudio() {
            music.fadeIn(3000);
        };
        function stopAudio() {
            music.destroy();
            //game.cache.removeSound('wizball');
        };

        function overNewgame() {
            game.add.tween(newGameBtn.scale)
                .to({ x: 1.3, y: 1.3 },
                    300,
                    Phaser.Easing.Exponential.Out, true);

            music = game.add.audio('intro');
            music.onDecoded.add(startAudio, this);

        };

        function onNewgameDown() {
            game.add.tween(newGameBtn.scale)
                .to({
                        x: 1.7,
                        y: 1.7
                    },
                    300,
                    Phaser.Easing.Exponential.Out, true);
            console.log('===> NEW GAME ==>');
            stopAudio();
            this.game.state.start("the_game");

        };
	}
}
