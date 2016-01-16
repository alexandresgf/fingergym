define(['phaser', 'jquery'], function (Phaser, $) {
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
		this._btnRanking = this.game.add.button(this._btnNewGame.x + this._btnNewGame.width / 2 + 30, this._btnNewGame.y, 'btn_ranking', this.ranking, this);

		// setup buttons
		this._btnNewGame.anchor.set(0.5);
		this._btnContinue.anchor.set(0.5);
		this._btnRanking.anchor.set(0.5);

		// check if already has a game on
		if (localStorage.getItem('player') == null) {
			this._btnContinue.visible = false;
		}
	};

	Menu.prototype.showDialogRegister = function () {
		navigator.notification.prompt(
			'Type your nickname for global ranking',
			function (result) {
				var nickname = result.input1;
				var regex = new RegExp('^[a-z0-9]+$', 'gi');

				if (regex.test(nickname)) {
					window.plugins.sim.getSimInfo(
						function (result) {
							var currPlayer = JSON.parse(localStorage.getItem('player'));
							var bestScore = localStorage.getItem('bestScore');
							var recordWeight = localStorage.getItem('recordWeight');
							var globalRanking = {
								nickname: nickname,
								weight: 0,
								score: 0,
								deviceId: result.deviceId
							};
							var url;

							if (bestScore != null && recordWeight != null) {
								globalRanking.weight = recordWeight;
								globalRanking.score = bestScore;
							} else if (currPlayer != null) {
								globalRanking.weight = currPlayer.recordWeight;
								globalRanking.score = currPlayer.score;
							}

							url = 'https://fingergym-server.herokuapp.com/save/';
							url += JSON.stringify(globalRanking);

							$.ajax({
								url: url,
								method: 'POST',
								success: function (data, textStatus, jqXHR) {
									data = JSON.parse(data);

									if (data.result) {
										localStorage.setItem('globalRanking', JSON.stringify(globalRanking));
										navigator.notification.alert('Successfully registered!', null, 'Success');
									} else {
										navigator.notification.alert('Your nickname has already taken!', null, 'Fail');
									}
								},
								error: function (jqXHR, textStatus, errorThrown) {
									navigator.notification.alert(textStatus, null, 'Server Connection Fail');
								}
							});
						},
						function (result) {
							navigator.notification.alert('Error on trying to get device info!', null, 'Fail');
						}
					);
				} else {
					navigator.notification.alert('Just type numbers and letters without space!', null, 'Fail');
				}
			},
			'Registration',
			['Submit']
		);
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
			if (currChallenge.weight > recordWeight) {
				localStorage.setItem('recordWeight', currChallenge.weight);
			}
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

	Menu.prototype.ranking = function () {
		if (localStorage.getItem('globalRanking') == null) {
			navigator.notification.alert(
				'You are not registered in the global ranking, continue to complete the registration.',
				this.showDialogRegister,
				'Global Ranking'
			);
		} else {
			localStorage.setItem('backState', 0);
			this.game.state.start('GlobalRanking');
		}
	};

	return Menu;
});