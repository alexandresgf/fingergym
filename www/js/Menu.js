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

		// add tap label
		var style = { font: 'italic 14px BackTo1982', fill: '#fff' };
		var lblTap = this.game.add.text(this.game.width / 2, this.game.height / 2, 'TAP to continue', style);
		lblTap.anchor.set(0.5);

		// blink tap label
		this.game.add.tween(lblTap).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 500, true);

		// tap to start
		this.input.onTap.add(function () {
			this.game.state.start('MenuRoom');
		}, this);
	};

	return Menu;
});