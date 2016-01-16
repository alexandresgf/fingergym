define(['phaser'], function (Phaser) {
	'use strict';

	function GameOver (game) {
		// use init method!
	}

	GameOver.prototype.constructor = GameOver;

	GameOver.prototype.init = function () {
		// load player data
		this._player = JSON.parse(localStorage.getItem('player'));

		// load challenge data
		this._challenge = JSON.parse(localStorage.getItem('challenge'));

		// load best score data
		this._bestScore = Number(localStorage.getItem('bestScore'));

		// load record weight data
		this._recordWeight = Number(localStorage.getItem('recordWeight'));

		// score
		this._score = 0;

		// money
		this._money = 0;

		// game over flag
		this._gameOver = Number(localStorage.getItem('gameOver'));

		// weight inc constant
		this.WEIGHT_INC = 5;

		// str inc constant
		this.STR_INC = 1;
	};

	GameOver.prototype.create = function () {
		// add backscreen color
		this.game.stage.backgroundColor = '#000';

		// font styles
		var styleTitle = { font: '40px BackTo1982', fill: '#fff' };
		var styleText = { font: '16px BackTo1982', fill: '#f00', align: 'center', wordWrap: true, wordWrapWidth: this.game.width };
		var styleTable = { font: '16px BackTo1982', fill: '#fff', tabs: [140] };

		// create title label
		var lblTitle = this.game.add.text(this.game.width / 2, 50, '', styleTitle);
		var lblText = this.game.add.text(this.game.width / 2, this.game.height / 2, '', styleText);
		var table = this.game.add.text(this.game.width / 2, this.game.height / 2, '', styleTable);
		var content = [
			['Time Left', this._challenge.timeLeft + ' seconds'],
			['Weight', this._challenge.weight + ' kg'],
			['Score', '0 pts'],
			['Money', '$0']
		];

		// create buttons
		var btnContinue = this.game.add.button(this.game.width / 2 - 80, this.game.height - 50, 'btn_continue', this.newGame, this);
		var btnRetry = this.game.add.button(this.game.width / 2 - 80, this.game.height - 50, 'btn_retry', this.newGame, this);
		var btnExit = this.game.add.button(this.game.width / 2 + 80, this.game.height - 50, 'btn_exit', this.exit, this);
		var btnRanking = this.game.add.button(
			this.game.width - 10,
			10,
			'btn_ranking',
			this.ranking,
			this
		);

		// load sound effects
		this._sfxCounter = this.game.add.audio('sfx_counter');

		// select if won or the type of game over
		switch (this._gameOver) {
			// the player has won
			case 0:
				lblTitle.setText('Winner');
				table.parseList(content);
				btnRetry.visible = false;
				this._score = this._challenge.timeLeft * 5;
				this._money = Math.floor(this._score / 10) * 5;
				this.countScore(table, content);
				break;

			// time is up game over
			case 1:
				lblTitle.setText('Game Over');
				table.parseList(content);
				btnContinue.visible = false;
				break;

			// bar fell game over
			case 2:
				lblTitle.setText('Game Over');
				lblText.setText('The bar turned and weights fell on your body');
				btnContinue.visible = false;
				break;

			// dead by drugs game over (perma death)
			case 3:
				lblTitle.setText('You Died');
				lblText.setText('Your liver stopped by excessive supplementation');
				btnContinue.visible = false;

				// save or update best score and/or record weight
				if (this._bestScore == null && this._recordWeight == null) {
					localStorage.setItem('bestScore', this._player.score);
					localStorage.setItem('recordWeight', this._player.recordWeight);
				} else if (this._player.score > this._bestScore && this._player.recordWeight > this._recordWeight) {
					localStorage.setItem('bestScore', this._player.score);
					localStorage.setItem('recordWeight', this._player.recordWeight);
				} else if (this._player.score > this._bestScore) {
					localStorage.setItem('bestScore', this._player.score);
				} else if (this._player.recordWeight > this._recordWeight) {
					localStorage.setItem('recordWeight', this._player.recordWeight);
				}

				// reset player
				this._player = {
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

				// reset challenge
				this._challenge = {
					weight: 5,
					timeLeft: 0
				};
				break;
		}

		// setup labels
		lblTitle.anchor.set(0.5);
		lblText.anchor.set(0.5);
		table.anchor.set(0.5);

		// setup buttons
		btnContinue.anchor.set(0.5);
		btnRetry.anchor.set(0.5);
		btnExit.anchor.set(0.5);
		btnRanking.anchor.setTo(1, 0);

		// reset str modifier
		this._player.strMod = 0;

		// save changes
		if (!this._gameOver) {
			this._player.str += this.STR_INC;
			this._player.score += this._score;
			this._player.wallet += this._money;
			this._player.recordWeight = this._challenge.weight;

			if (this._player.str > this._player.maxStr) {
				this._player.str = this._player.maxStr;
			}

			this._challenge.weight += this.WEIGHT_INC;
		}

		localStorage.setItem('player', JSON.stringify(this._player));
		localStorage.setItem('challenge', JSON.stringify(this._challenge));
	};

	GameOver.prototype.countScore = function (table, content) {
		var lblScore = content[2];
		var count = 0;

		this.game.time.events.loop(1, function () {
			this._sfxCounter.play();

			if (count < this._score) {
				count++;
				lblScore[1] = count + ' pts';
				content[2] = lblScore;
				table.parseList(content);
			} else {
				this.countMoney(table, content);
			}
		}, this);
	};

	GameOver.prototype.countMoney = function (table, content) {
		var lblMoney = content[3];
		var count = 0;

		this.game.time.removeAll();

		this.game.time.events.loop(1, function () {
			this._sfxCounter.play();

			if (count < this._money) {
				count++;
				lblMoney[1] = '$' + count;
				content[3] = lblMoney;
				table.parseList(content);
			} else {
				this.game.time.removeAll();
			}
		}, this);
	};

	GameOver.prototype.newGame = function () {
		var showAdsCounter = Number(localStorage.getItem('showAdsCounter'));
		var newGameCounter = Number(localStorage.getItem('newGameCounter'));

		if (newGameCounter === showAdsCounter) {
			localStorage.setItem('quit', 0);
			localStorage.setItem('showAdsCounter', this.game.rnd.integerInRange(1, 3));
			localStorage.setItem('newGameCounter', 0);
			this.game.state.start('Ads');
		} else {
			localStorage.setItem('newGameCounter', ++newGameCounter);
			this.game.state.start('MenuRoom');
		}
	};

	GameOver.prototype.exit = function () {
		localStorage.setItem('quit', 1);
		this.game.state.start('Ads');
	};

	GameOver.prototype.showDialogRegister = function () {
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

	GameOver.prototype.ranking = function () {
		if (localStorage.getItem('globalRanking') == null) {
			navigator.notification.alert(
				'You are not registered in the global ranking, continue to complete the registration.',
				this.showDialogRegister,
				'Global Ranking'
			);
		} else {
			localStorage.setItem('backState', 1);
			this.game.state.start('GlobalRanking');
		}
	};

	return GameOver;
});