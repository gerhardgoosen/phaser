'use strict';
var playerhealth = 10;


var EnemyTank = function(index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    var style = {
        font: "15px Arial",
        fill: "#ffffff"
    };
    this.label_name = this.game.add.text(20, 20, 'Enemy :' + index.toString(), style);
    this.tank.addChild(this.label_name);

    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

};
EnemyTank.prototype.kill = function() {
    this.shadow.kill();
    this.tank.kill();
    this.turret.kill();
    return true;
}

EnemyTank.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0) {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();

        return true;
    }

    return false;

}

EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

    if (playerhealth > 0) {
        if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300) {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;

                var bullet = this.bullets.getFirstDead();

                bullet.reset(this.turret.x, this.turret.y);

                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
            }
        }
    }

};



angular.module('myPhaserApp.tanks', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/tanks', {
        templateUrl: 'pages/tanks/tanks.html',
        controller: 'TanksCtrl'
    });
}])

.controller('TanksCtrl', [function() {
    // scope.$on('$destroy', function() {
    //     game.destroy(); // Clean up the game when we leave this scope
    // });

    console.log('Tanks Control Ready ==>');

    var scaleRatio = window.devicePixelRatio / 4;

    //Create a new game instance and assign it to the 'gameArea' div
    var width = (window.innerWidth * window.devicePixelRatio) - 20;
    var height = ((window.innerHeight * window.devicePixelRatio) - 100 *
        window.devicePixelRatio);
    //Create a new game instance and assign it to the 'gameArea' div
    var game = new Phaser.Game(width, height, Phaser.AUTO, 'tanks', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    function preload() {
        game.load.atlas('tank', 'pages/tanks/assets/tanks/tanks.png', 'pages/tanks/assets/tanks/tanks.json');
        game.load.atlas('enemy', 'pages/tanks/assets/tanks/enemy-tanks.png', 'pages/tanks/assets/tanks/tanks.json');
        game.load.image('logo', 'pages/tanks/assets/tanks/logo.png');
        game.load.image('bullet', 'pages/tanks/assets/tanks/bullet.png');
        game.load.image('mybullet', 'game/assets/sprites/purple_ball.png');
        game.load.image('earth', 'pages/tanks/assets/tanks/scorched_earth.png');
        game.load.spritesheet('kaboom', 'pages/tanks/assets/tanks/explosion.png', 64, 64, 23);

    }


    var land;

    var shadow;
    var tank;

    var turret;

    var enemies;
    var enemyBullets;
    var enemiesTotal = 0;
    var enemiesAlive = 0;
    var explosions;

    var logo;

    var currentSpeed = 0;
    var cursors;

    var bullets;
    var fireRate = 100;
    var nextFire = 0;

    var stateText;

    function create() {

        //  Resize our game world to be a 2000 x 2000 square
        game.world.setBounds(-1000, -1000, 2000, 2000);

        //  Our tiled scrolling background
        // land = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'earth');
        land = game.add.tileSprite(0, 0, width, height, 'earth');
        land.fixedToCamera = true;
        //  Game State Text
        stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
            font: '84px Arial',
            fill: '#fff'
        });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

        buildPlayerTank();
        buildEnemyTanks();
        buildExplosions();

        tank.bringToTop();
        turret.bringToTop();

        logo = game.add.sprite(width / 2 - 400, 20, 'logo');
        logo.fixedToCamera = true;
        game.input.onDown.add(removeLogo, this);

        game.camera.follow(tank);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);

        cursors = game.input.keyboard.createCursorKeys();

    }

    function buildExplosions() {
        //  Explosion pool
        explosions = game.add.group();
        for (var i = 0; i < 10; i++) {
            var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('kaboom');
        }
    }

    function buildPlayerTank() {
        //  The base of our tank
        tank = game.add.sprite(0, 0, 'tank', 'tank1');
        tank.anchor.setTo(0.5, 0.5);
        tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

        //  This will force it to decelerate and limit its speed
        game.physics.enable(tank, Phaser.Physics.ARCADE);
        tank.body.drag.set(0.2);
        tank.body.maxVelocity.setTo(400, 400);
        tank.body.collideWorldBounds = true;

        //  Finally the turret that we place on-top of the tank body
        turret = game.add.sprite(0, 0, 'tank', 'turret');
        turret.anchor.setTo(0.3, 0.5);

        //  A shadow below our tank
        shadow = game.add.sprite(0, 0, 'tank', 'shadow');
        shadow.anchor.setTo(0.5, 0.5);
        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(10, 'mybullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
    }

    function buildEnemyTanks() {
        //  The enemies bullet group
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(100, 'bullet');

        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 0.5);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  Create some baddies to waste :)
        enemies = [];

        enemiesTotal = 20;
        enemiesAlive = 20;

        for (var i = 0; i < enemiesTotal; i++) {
            enemies.push(new EnemyTank(i, game, tank, enemyBullets));
        }

    }

    function removeLogo() {
        game.input.onDown.remove(removeLogo, this);
        logo.kill();
    }

    function update() {
        game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
        enemiesAlive = 0;
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].alive) {
                enemiesAlive++;
                game.physics.arcade.collide(tank, enemies[i].tank);
                game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
                enemies[i].update();
            }
        }


        if (enemiesAlive == 0) {
            stateText.text = " You Won, \n Click to restart";
            stateText.visible = true;
            //the "click to restart" handler
            game.input.onTap.addOnce(restart, this);
        } else {


            if (cursors.left.isDown) {
                tank.angle -= 4;
            } else if (cursors.right.isDown) {
                tank.angle += 4;
            }

            if (cursors.up.isDown) {
                //  The speed we'll travel at
                currentSpeed = 300;
            } else {
                if (currentSpeed > 0) {
                    currentSpeed -= 4;
                }
            }

            if (currentSpeed > 0) {
                game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
            }

            land.tilePosition.x = -game.camera.x;
            land.tilePosition.y = -game.camera.y;

            //  Position all the parts and align rotations
            shadow.x = tank.x;
            shadow.y = tank.y;
            shadow.rotation = tank.rotation;

            turret.x = tank.x;
            turret.y = tank.y;

            turret.rotation = game.physics.arcade.angleToPointer(turret);
            if (playerhealth > 0) {
                if (game.input.activePointer.isDown) {
                    //  Boom!
                    fire();
                }
            }
        }

    }

    function bulletHitPlayer(tank, bullet) {

        bullet.kill();

        playerhealth--;

        if (playerhealth == 0) {
            console.log('Game Over...');
            tank.kill();
            turret.kill();
            shadow.kill();
            stateText.text = " GAME OVER \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(restart, this);

        }

    }

    function bulletHitEnemy(tank, bullet) {
        console.log(enemies);
        bullet.kill();

        var destroyed = enemies[tank.name].damage();

        if (destroyed) {
            var explosionAnimation = explosions.getFirstExists(false);
            explosionAnimation.reset(tank.x, tank.y);
            explosionAnimation.play('kaboom', 30, false, true);
        }


    }

    function fire() {

        if (game.time.now > nextFire && bullets.countDead() > 0) {
            nextFire = game.time.now + fireRate;

            var bullet = bullets.getFirstExists(false);

            bullet.reset(turret.x, turret.y);

            // bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000);
        }

        if (game.time.now > nextFire && bullets.countDead() > 0) {
            nextFire = game.time.now + fireRate;
            var bullet = bullets.getFirstDead();
            bullet.reset(sprite.x - 8, sprite.y - 8);
            game.physics.arcade.moveToPointer(bullet, 300);
        }

    }

    function render() {
        game.debug.text('Health: ' + playerhealth, 32, 32);
        game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 48);
        game.debug.text('Active Bullets: ' +
            bullets.countLiving() + ' / ' + bullets.length, 32, 64);


        for (var x = 0; x < enemies.length; x++) {
            if (enemies[x].health > 0) {
                game.debug.text('Enemy ' + enemies[x].tank.name + 'health [' + enemies[x].health + ']', 32, (80 + ((x + 1) * 15)));
            } else {
                game.debug.text('Enemy ' + enemies[x].tank.name + '[DEAD]', 32, (80 + ((x + 1) * 15)), 'yellow');

            }

        }
    }


    function restart() {
        tank.kill();
        turret.kill();
        explosions.removeAll();
        bullets.removeAll();
        enemyBullets.removeAll();
        for (var i = 0; i < enemiesTotal; i++) {
            enemies[i].kill();
        }
        //  A new level starts
        playerhealth = 10;
        buildPlayerTank();
        buildEnemyTanks();
        buildExplosions();

        tank.bringToTop();
        turret.bringToTop();

        //hides the text
        stateText.visible = false;

    }


}]);
