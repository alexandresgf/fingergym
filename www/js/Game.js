define(['phaser'], function (Phaser) {
	'use strict';

	var global_ball;

	function Game (game) {
        // use init method!
    }

    Game.prototype.constructor = Game;

	Game.prototype.init = function () {
		// google analytics track game screen
		window.analytics.trackView('Finger Gym - Game Screen');

		// setup constants
		this.MAX_ANGLE = 10;
		this.MAX_SEC = 30;

		// load player
		this._player = JSON.parse(localStorage.getItem('player'));

		// load challenge
		this._challenge = JSON.parse(localStorage.getItem('challenge'));
	};

    Game.prototype.create = function () {
	    // start arcade physics
	    this.game.physics.startSystem(Phaser.Physics.ARCADE);

	    // set gravity on y-axis
	    this.game.physics.arcade.gravity.y = 900;

	    // add backscreen color
	    this.game.stage.backgroundColor = '#000';

	    // create bar
	    this._bar = this.game.add.sprite(this.game.width / 2, this.game.height, 'bar');

	    // add physics to the bar
	    this.game.physics.enable(this._bar, Phaser.Physics.ARCADE);

	    // setup bar
	    this._bar.anchor.set(0.5);
	    this._bar.y -= this._bar.height / 2;
	    this._bar.body.collideWorldBounds = true;

	    // create buttons
	    this._btnHandLeft = this.game.add.button(10, this.game.height - 10, 'btn_hand_left', this.upLeft, this);
	    this._btnHandRight = this.game.add.button(
			    this.game.width - 10,
			    this.game.height - 10,
			    'btn_hand_right',
			    this.upRight,
			    this
	    );

	    // setup buttons
	    this._btnHandLeft.anchor.setTo(0, 1);
	    this._btnHandRight.anchor.setTo(1, 1);

	    // create lift bar
	    this._liftBarLeft = this.game.add.sprite(
			    this._btnHandLeft.x + this._btnHandLeft.width / 2,
			    this._btnHandLeft.y - this._btnHandLeft.height - 10,
			    'liftbar'
	    );
	    this._liftBarRight = this.game.add.sprite(
			    this._btnHandRight.x - this._btnHandRight.width / 2,
			    this._btnHandRight.y - this._btnHandRight.height - 10,
			    'liftbar'
	    );

	    // setup lift bar
	    this._liftBarLeft.anchor.setTo(0.5, 1);
	    this._liftBarRight.anchor.setTo(0.5, 1);

	    // create lift meter
	    this._liftMeterLeft = this.game.add.sprite(
			    this._liftBarLeft.x,
			    this._liftBarLeft.y,
			    'meter'
	    );
	    this._liftMeterRight = this.game.add.sprite(
			    this._liftBarRight.x,
			    this._liftBarRight.y,
			    'meter'
	    );

	    // setup lift meter
	    this._liftMeterLeft.anchor.set(0.5);
	    this._liftMeterRight.anchor.set(0.5);

	    // set gap between bar and lift bar
	    this._gap = this._bar.y - this._liftBarLeft.bottom;

	    // set stopwatch
	    this._sec = this.MAX_SEC;

	    // create stopwatch bar
	    this._stopWatchBar = this.game.add.graphics(0, 0);
	    this.stopWatch();

	    // start stopwatch
	    this.game.time.events.loop(Phaser.Timer.SECOND, this.stopWatch, this);
    };

	Game.prototype.update = function () {
		this.updateLiftMeter();
		this.gameOver();
	};

	Game.prototype.gameOver = function () {
		if (this._bar.angle < -this.MAX_ANGLE || this._bar.angle > this.MAX_ANGLE) {
			localStorage.setItem('gameOver', 2);
			this.save();
		} else if (this._sec < 0) {
			localStorage.setItem('gameOver', 1);
			this.save();
		} else if (this._liftMeterLeft.y === this._liftBarLeft.top && this._liftMeterRight.y === this._liftBarRight.top) {
			localStorage.setItem('gameOver', 0);
			this.save();
		}
	};

	Game.prototype.save = function () {
		this._challenge.timeLeft = (this._sec < 0) ? 0 : this._sec;
		localStorage.setItem('challenge', JSON.stringify(this._challenge));
		this.game.state.start('GameOver');
	};

	Game.prototype.stopWatch = function () {
		var sec = this._sec / this.MAX_SEC * this.game.width;

		this._stopWatchBar.clear();

		if (this._sec > 20)
			this._stopWatchBar.beginFill(0x00ff00, 1);
		else if (this._sec <= 20 && this._sec > 10)
			this._stopWatchBar.beginFill(0xF5ED0C, 1);
		else
			this._stopWatchBar.beginFill(0xff0000, 1);

		this._stopWatchBar.drawRect(0, 0, sec, 5);
		this._stopWatchBar.endFill();

		this._sec--;
	};

	Game.prototype.upLeft = function () {
		this._bar.body.angularVelocity += (this._challenge.weight * this._player.balance) / 100;
		this.lift();
	};

	Game.prototype.upRight = function () {
		this._bar.body.angularVelocity += -(this._challenge.weight * this._player.balance) / 100;
		this.lift();
	};

	Game.prototype.lift = function () {
		var str = -(this._player.maxStr + (this._player.maxStr * ((this._player.str + this._player.strMod) / 100)));
		var weight = this._challenge.weight - (this._challenge.weight * (this._player.str / 100));

		this._bar.body.velocity.y = str + weight;
	};

	Game.prototype.updateLiftMeter = function () {
		var position = Math.sin(this._bar.body.angle);

		this._liftMeterLeft.y = ((this._bar.y - this._gap - position) / this._liftBarLeft.top) * this._liftBarLeft.top;
		this._liftMeterRight.y = ((this._bar.y - this._gap + position) / this._liftBarRight.top) * this._liftBarRight.top;

		if (this._liftMeterLeft.y < this._liftBarLeft.top)
			this._liftMeterLeft.y = this._liftBarLeft.top;

		if (this._liftMeterRight.y < this._liftBarRight.top)
			this._liftMeterRight.y = this._liftBarRight.top;
	};

    return Game;
});