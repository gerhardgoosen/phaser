
var game_boot = function(game){
};
game_boot.prototype = {
	preload: function(){
     console.log("%cbooting...", "color:white; background:green");
     this.game.load.spritesheet('loading', 'pages/mygame/assets/mygame/metalslug_mummy37x45.png', 37, 45, 18);
 	}
  ,create: function(){
		        var newGameBtn = this.game.add.text(this.game.world.centerX - 50
							, this.game.world.centerY - 50,
							'Loading...', {
		            font: "20px Arial",
		            fill: "#ffffff",
		            align: "left"
		        });;
						this.game.add.tween(newGameBtn.scale)
								.to({ x: 1.3, y: 1.3 },
										300,
										Phaser.Easing.Exponential.Out, true);

    var loading = this.game.add.sprite(this.game.world.centerX-10, this.game.world.centerY-10, 'loading');
    loading.animations.add('walk');
    loading.animations.play('walk', 50, true);
    this.game.state.start("preload");
	}
}
