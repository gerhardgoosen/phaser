var the_game = function(game) {

};



var stars;
var baddies;
var lazers;
var player;
var cursors;
var fireButton;
var bulletTime = 0;
var frameTime = 0;
var frames;
var prevCamX = 0;



the_game.prototype = {
    preload: function() {
        console.log("%cStarting my awesome game", "color:white; background:green");

        this.game.load.image('player', 'game/assets/defender/ship.png');
        this.game.load.image('baddie', 'game/assets/sprites/space-baddie.png');
        game.load.spritesheet('invader', 'game/assets/invaders/invader32x32x4.png', 32, 32);

        this.game.load.image('star', 'game/assets/demoscene/star2.png');
        this.game.load.atlas('lazer', 'game/assets/defender/laser.png',
            'game/assets/defender/laser.json');
        this.game.load.spritesheet('kaboom',
            'game/assets/invaders/explode.png', 128, 128);
    },
    create: function() {
        //var loading = this.game.add.sprite(this.game.world.centerX - 10, this.game.world.centerY - 10, 'loading');
        //loading.animations.add('walk');
        //loading.animations.play('walk', 50, true);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.world.setBounds(0, 0, 800 * 4, 600);

        frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
        frames.unshift('frame02');

        stars = this.game.add.group();

        for (var i = 0; i < 512; i++) {
            stars.create(this.game.world.randomX, this.game.world.randomY, 'star');
        }

        baddies = this.game.add.group();
        baddies.enableBody = true;
        baddies.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 16; i++) {
            baddies.create(this.game.world.randomX,
                this.game.world.randomY, 'invader');

            // baddies.anchor.setTo(0.5, 0.5);
      //  baddies.animations.add('fly', [0, 1, 2, 3], 20, true);
        //    baddies.play('fly');
            //baddies.body.moves = false;
        }

        lazers = this.game.add.group();

        player = this.game.add.sprite(100, 300, 'player');
        player.anchor.x = 0.5;

        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);

        cursors = this.game.input.keyboard.createCursorKeys();
        fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        prevCamX = this.game.camera.x;
    },
    update: function() {
        if (cursors.left.isDown) {
            player.x -= 8;
            player.scale.x = -1;
        } else if (cursors.right.isDown) {
            player.x += 8;
            player.scale.x = 1;
        }

        if (cursors.up.isDown) {
            player.y -= 8;
        } else if (cursors.down.isDown) {
            player.y += 8;
        }

        if (fireButton.isDown) {
            fireBullet(this.game);
        }

        lazers.forEachAlive(updateBullets, this);

        prevCamX = this.game.camera.x;
    }
}



function updateBullets(lazer) {

    // if (game.time.now > frameTime)
    // {
    //     frameTime = game.time.now + 500;
    // }
    // else
    // {
    //     return;
    // }

    //  Adjust for camera scrolling
    var camDelta = game.camera.x - prevCamX;
    lazer.x += camDelta;

    if (lazer.animations.frameName !== 'frame30') {
        lazer.animations.next();
    } else {
        if (lazer.scale.x === 1) {
            lazer.x += 16;

            if (lazer.x > (game.camera.view.right - 224)) {
                lazer.kill();
            }
        } else {
            lazer.x -= 16;

            if (lazer.x < (game.camera.view.left - 224)) {
                lazer.kill();
            }
        }
    }

}

function fireBullet(game) {

    if (game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        lazer = lazers.getFirstDead(true,
            player.x + 24 * player.scale.x, player.y + 8, 'lazer');

        lazer.animations.add('fire', frames, 60);
        lazer.animations.frameName = 'frame02';

        lazer.scale.x = player.scale.x;

        if (lazer.scale.x === 1) {
            // lazer.anchor.x = 1;
        } else {
            // lazer.anchor.x = 0;
        }

        //  Lazers start out with a width of 96 and expand over time
        // lazer.crop(new Phaser.Rectangle(244-96, 0, 96, 2), true);

        bulletTime = game.time.now + 250;
    }

}
