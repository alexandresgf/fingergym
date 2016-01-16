define(['phaser', 'jquery'], function (Phaser, $) {
	'use strict';

	function GlobalRanking (game) {
		// use init method!
	}

	GlobalRanking.prototype.constructor = GlobalRanking;

	GlobalRanking.prototype.init = function () {
		// ranking table reference
		this._ranking = [];

		// load global ranking data
		this._globalRanking = JSON.parse(localStorage.getItem('globalRanking'));

		// load player data
		this._player = JSON.parse(localStorage.getItem('player'));

		// load best score data
		this._bestScore = Number(localStorage.getItem('bestScore'));

		// load record weight data
		this._recordWeight = Number(localStorage.getItem('recordWeight'));
	};

	GlobalRanking.prototype.create = function () {
		// add the backscreen color
		this.game.stage.backgroundColor = '#000';

		// add background
		this.game.add.sprite(0, 0, 'bg_globalranking');

		// font style
		var styleLoad = { font: '14px Arial', fill: '#fff' };
		var styleTitle = { font: '40px BackTo1982', fill: '#fff' };
		var styleTable = { font: '12px BackTo1982', fill: '#fff', tabs: [50, 130, 90] };

		// add labels
		var lblTitle = this.game.add.text(this.game.width / 2, 40, 'Ranking', styleTitle);

		// setup labels
		lblTitle.anchor.set(0.5);

		// add ranking table
		var header = [['#', 'Nickname', 'Weight', 'Score']];

		this._tblHeader = this.game.add.text(60, 75, '', styleTable);
		this._tblRanking = this.game.add.text(this._tblHeader.x, this._tblHeader.y + 35, '', styleTable);

		// show table header
		this._tblHeader.parseList(header);

		// update ranking
		this.updateRanking();

		// send ranking information to the server
		$.ajax({
			url: 'https://fingergym-server.herokuapp.com/update/' + JSON.stringify(this._globalRanking),
			method: 'POST',
			context: this,
			beforeSend: function (jqXHR, settings) {
				this._bgTransp = this.game.add.sprite(0, 0, 'bg_trans');
				this._iconLoad = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'icon_load');
				this._lblLoad = this.game.add.text(this._iconLoad.x, this._iconLoad.bottom + 10, 'Updating global ranking...', styleLoad);
				this._iconLoad.anchor.set(0.5);
				this._lblLoad.anchor.set(0.5);
			},
			success: function (data, textStatus, jqXHR) {
				data = JSON.parse(data);

				if (!data.result) {
					this.back();
					navigator.notification.alert('Invalid request', null, 'Fail');
				} else {
					// request ranking list
					$.ajax({
						url: 'https://fingergym-server.herokuapp.com/ranking',
						method: 'GET',
						context: this,
						beforeSend: function (jqXHR, settings) {
							this._bgTransp.visible = true;
							this._iconLoad.visible = true;
							this._lblLoad.visible = true;
							this._lblLoad.setText('Loading global ranking...');
						},
						success: function (data, textStatus, jqXHR) {
							data = JSON.parse(data);

							if (data.result) {
								// add buttons
								this._btnTop3 = this.game.add.button(40, this.game.height - 5, 'btn_top5', this.top5, this);
								this._btnMe = this.game.add.button(this._btnTop3.right + 5, this._btnTop3.y, 'btn_me', this.findMe, this);
								this._btnBack = this.game.add.button(this._btnMe.right + 5, this._btnMe.y, 'btn_back', this.back, this);

								// setup buttons
								this._btnTop3.anchor.setTo(0, 1);
								this._btnMe.anchor.setTo(0, 1);
								this._btnBack.anchor.setTo(0, 1);

								// save data and fill ranking table
								this._ranking = data.result;
								this.findMe();
							} else {
								this.back();
								navigator.notification.alert('Invalid request', null, 'Fail');
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							this.back();
							navigator.notification.alert(textStatus, null, 'Server Connection Fail');
						},
						complete: function (jqXHR, textStatus) {
							this._bgTransp.visible = false;
							this._iconLoad.visible = false;
							this._lblLoad.visible = false;
						}
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				this.back();
				navigator.notification.alert(textStatus, null, 'Server Connection Fail');
			},
			complete: function (jqXHR, textStatus) {
				this._bgTransp.visible = false;
				this._iconLoad.visible = false;
				this._lblLoad.visible = false;
			}
		});
	};

	GlobalRanking.prototype.updateRanking = function () {
		if (this._player != null) {
			if (this._bestScore == null && this._recordWeight == null) {
				this._globalRanking.score = this._player.score;
				this._globalRanking.weight = this._player.recordWeight;
			} else if (this._player.score > this._bestScore && this._player.recordWeight > this._recordWeight) {
				this._globalRanking.score = this._player.score;
				this._globalRanking.weight = this._player.recordWeight;
			} else if (this._player.score > this._bestScore) {
				this._globalRanking.score = this._player.score;
			} else if (this._player.recordWeight > this._recordWeight) {
				this._globalRanking.weight = this._player.recordWeight;
			} else {
				this._globalRanking.score = this._bestScore;
				this._globalRanking.weight = this._recordWeight;
			}
		}
	};

	GlobalRanking.prototype.fillTable = function (min, max) {
		var content = [];

		if (max > this._ranking.length) {
			max = this._ranking.length;
		}

		for (var i = min; i < max; i++) {
			content.push([i + 1, this._ranking[i].nickname.substring(0,10), this._ranking[i].weight + ' kg', this._ranking[i].score + ' pts']);
		}

		this._tblRanking.parseList(content);
	};

	GlobalRanking.prototype.top5 = function () {
		this.fillTable(0, 5);
	};

	GlobalRanking.prototype.findMe = function () {
		var min;
		var max;

		for (var i = 0; i < this._ranking.length; i++) {
			if (this._ranking[i].deviceId.localeCompare(this._globalRanking.deviceId) === 0) {
				min = i;
			}
		}

		max = min + 5;
		this.fillTable(min, max);
	};

	GlobalRanking.prototype.back = function () {
		var backState = Number(localStorage.getItem('backState')) || 0;

		switch (backState) {
			case 0:
				this.game.state.start('Menu');
				break;

			case 1:
				this.game.state.start('MenuRoom');
				break;
		}
	};

	return GlobalRanking;
});