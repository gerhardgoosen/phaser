
var game_preload = function(game){

};

game_preload.prototype = {
	preload: function(){
          console.log("%cdoing preload...", "color:white; background:green");
          this.game.load.image('logo', 'pages/mygame/assets/mygame/phaser.png');
          this.game.load.image('starfield', 'pages/mygame/assets/mygame/starfield.png');
          this.game.load.audio('intro', 'pages/mygame/assets/mygame/audio/oedipus_ark_pandora.mp3');
	}
  ,create: function(){
    var loading = this.game.add.sprite(this.game.world.centerX-10, this.game.world.centerY-10, 'loading');
    loading.animations.add('walk');
    loading.animations.play('walk', 50, true);
    this.game.state.start("menu");
	}
}
