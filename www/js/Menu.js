define(['phaser'], function (Phaser) {
	'use strict';

	function Menu (game) {
		// code me!
	}

	Menu.prototype.constructor = Menu;

	Menu.prototype.create = function () {
		// add the backscreen color
		this.game.stage.backgroundColor = '#000';

		// add background
		this.game.add.sprite(0, 0, 'bg_menu');

		// add buttons
		this._btnNewGame = this.game.add.button(this.game.width / 2, this.game.height / 2, 'btn_newgame', this.newGame, this);
		this._btnContinue = this.game.add.button(this.game.width / 2, this.game.height / 2 + 50, 'btn_continue', this.continue, this);

		// setup buttons
		this._btnNewGame.anchor.set(0.5);
		this._btnContinue.anchor.set(0.5);

		// check if already has a game on
		if (localStorage.getItem('player') == null)
			this._btnContinue.visible = false;

		// add tap label
		//var style = { font: 'italic 14px BackTo1982', fill: '#fff' };
		//var lblTap = this.game.add.text(this.game.width / 2, this.game.height / 2, 'TAP to continue', style);
		//lblTap.anchor.set(0.5);

		// blink tap label
		//this.game.add.tween(lblTap).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 500, true);

		// tap to start
		//this.input.onTap.add(function () {
		//	this.game.state.start('MenuRoom');
		//}, this);
	};

	Menu.prototype.newGame = function () {
		var currPlayer = JSON.parse(localStorage.getItem('player'));
		var currChallenge = JSON.parse(localStorage.getItem('challenge'));
		var bestScore = localStorage.getItem('bestScore');
		var recordWeight = localStorage.getItem('recordWeight');
		var player = {
			str: 1,
			strMod: 0,
			balance: 0,
			health: 100,
			wallet: 0,
			score: 0,
			recordWeight: 0,
			maxHealth: 100,
			maxStr: 100
		};
		var challenge = {
			weight: 5,
			timeLeft: 0
		};

		if (bestScore != null) {
			if (currPlayer.score > bestScore)
				localStorage.setItem('bestScore', currPlayer.score);
		} else if (currPlayer != null) {
			localStorage.setItem('bestScore', currPlayer.score);
		}

		if (recordWeight != null) {
			if (currChallenge.weight > recordWeight)
				localStorage.setItem('recordWeight', currChallenge.weight);
		} else if (currChallenge != null) {
			localStorage.setItem('recordWeight', currChallenge.weight);
		}

		localStorage.setItem('player', JSON.stringify(player));
		localStorage.setItem('challenge', JSON.stringify(challenge));
		this.continue();
	};

	Menu.prototype.continue = function () {
		this.game.state.start('MenuRoom');
	};

	return Menu;
});