define(['phaser'], function (Phaser) {
	'use strict';

	function MenuRoom (game) {
		// code me!
	}

	MenuRoom.prototype.constructor = MenuRoom;

	MenuRoom.prototype.preload = function () {
		// load shopping items
		this.game.load.json('shop', 'assets/items.json');
	};

	MenuRoom.prototype.init = function () {
		// tab index selector
		this._tabSelector = 0;

		// player setup
		this._player = JSON.parse(localStorage.getItem('player')) || {
				initStr: 100,
				str: 1,
				balance: 0,
				health: 100,
				wallet: 0,
				score: 0,
				recordWeight: 0,
				maxHealth: 100,
				maxStr: 100
			};

		// challenge setup
		this._challenge = JSON.parse(localStorage.getItem('challenge')) || {
				weight: 5,
				timeLeft: 0
			};

		// quantity of items to show
		this._shopItemsShow = 3;

		// quantity of pages to paginate
		this._shopListPages = 0;

		// shop current page
		this._shopCurrPage = 1;
	};

	MenuRoom.prototype.create = function () {
		// add the backscreen color
		this.game.stage.backgroundColor = '#000';

		// add background
		this.game.add.sprite(0, 0, 'bg_room');

		// add buttons
		this._btnHealth = this.game.add.button(80, 105, 'icon_health', this.tabHealth, this);
		this._btnStatus = this.game.add.button(80, 145, 'icon_info', this.tabStatus, this);
		this._btnShop = this.game.add.button(80, 185, 'icon_shop', this.tabShop, this);
		this._btnPlay = this.game.add.button(80, 225, 'icon_play', this.tabPlay, this);

		// setup buttons
		this._btnHealth.anchor.set(0.5);
		this._btnStatus.anchor.set(0.5);
		this._btnShop.anchor.set(0.5);
		this._btnPlay.anchor.set(0.5);

		// create tab groups
		this._tabs = [];
		this._tabs[0] = this.game.add.group(); // tab health
		this._tabs[1] = this.game.add.group(); // tab status
		this._tabs[2] = this.game.add.group(); // tab shop
		this._tabs[3] = this.game.add.group(); // tab play

		// font style
		var style = { font: '12px BackTo1982', fill: '#fff' };
		var styleBar = { font: '12px BackTo1982', fill: '#fff', stroke: '#000', strokeThickness: 1 };
		var styleTable = { font: '12px BackTo1982', fill: '#fff', tabs: [150] };
		var styleTitle = { font: '16px BackTo1982', fill: '#fff' };
		var styleText = { font: '16px BackTo1982', fill: '#f00'};
		var styleItemList = { font: '12px BackTo1982', fill: '#000', tabs: [130] };

		// tab health
		var iconStr = this.game.add.sprite(200, 120, 'icon_str');
		iconStr.anchor.set(0.5);

		var lblStr = this.game.add.text(200, 150, 'Strength', style);
		lblStr.anchor.set(0.5);

		var iconHealth = this.game.add.sprite(200, 200, 'icon_health');
		iconHealth.anchor.set(0.5);

		var lblHealth = this.game.add.text(200, 230, 'Health', style);
		lblHealth.anchor.set(0.5);

		var strengthBarBg = this.game.add.graphics(0, 0);
		strengthBarBg.beginFill(0xffffff);
		strengthBarBg.drawRect(iconStr.right + 50, iconStr.bottom - iconStr.height / 2, 160, iconStr.height);
		strengthBarBg.alpha = 0.5;
		strengthBarBg.endFill();

		var strengthBar = this.game.add.graphics(0, 0);
		strengthBar.beginFill(0xffffff);
		strengthBar.drawRect(
				iconStr.right + 50,
				iconStr.bottom - iconStr.height / 2,
				(this._player.str * 160) / this._player.maxStr,
				iconStr.height
		);
		strengthBar.alpha = 1;
		strengthBar.endFill();

		var lblStrengthBar = this.game.add.text(
			iconStr.right + 130,
			iconStr.bottom,
			this._player.str + '%',
			styleBar
		);
		lblStrengthBar.anchor.set(0.5);

		var healthBarBg = this.game.add.graphics(0, 0);
		healthBarBg.beginFill(0xffffff);
		healthBarBg.drawRect(iconHealth.right + 50, iconHealth.bottom - iconHealth.height / 2, 160, iconHealth.height);
		healthBarBg.alpha = 0.5;
		healthBarBg.endFill();

		var healthBar = this.game.add.graphics(0, 0);
		healthBar.beginFill(0xffffff);
		healthBar.drawRect(
				iconHealth.right + 50,
				iconHealth.bottom - iconHealth.height / 2,
				(this._player.health * 160) / this._player.maxHealth,
				iconHealth.height
		);
		healthBar.alpha = 1;
		healthBar.endFill();

		var lblHealthBar = this.game.add.text(
			iconHealth.right + 130,
			iconHealth.bottom,
			this._player.health + '%',
			styleBar
		);
		lblHealthBar.anchor.set(0.5);

		this._lblStrengthBar = lblStrengthBar;
		this._lblHealthBar = lblHealthBar;
		this._strengthBar = strengthBar;
		this._healthBar = healthBar;
		this._iconHealth = iconHealth;
		this._iconStr = iconStr;

		this._tabs[0].add(iconStr);
		this._tabs[0].add(lblStr);
		this._tabs[0].add(iconHealth);
		this._tabs[0].add(lblHealth);
		this._tabs[0].add(lblStrengthBar);
		this._tabs[0].add(strengthBar);
		this._tabs[0].add(strengthBarBg);
		this._tabs[0].add(healthBar);
		this._tabs[0].add(healthBarBg);
		this._tabs[0].add(lblHealthBar);

		// tab status
		var content = [
			['Wallet', '$' + this._player.wallet],
			['Record Weight', this._player.recordWeight + ' kg'],
			['Score', this._player.score + ' pts']
		];
		var table = this.game.add.text(190, 120, '', styleTable);

		table.parseList(content);

		this._statusContent = content;
		this._statusTable = table;

		this._tabs[1].add(table);

		// tab shop
		var y = 40;

		this._shop = this.game.cache.getJSON('shop');
		this._shopListPages = Math.round(this._shop.items.length / 3);
		this._shopItems = this.game.add.group();
		this._shopItems.name = 'ShopItems';

		this._shop.items.forEach(function (item, index) {
			var sprCanBuy = (this._player.wallet >= item.cost) ? 'bg_list' : 'bg_list_not';
			var button = this.game.add.button(157, 90 + y * index, sprCanBuy);
			var content = [[item.name, '$' + item.cost]];
			var table = this.game.add.text(35, button.height / 2, '', styleItemList);

			table.anchor.setTo(0, 0.5);
			table.parseList(content);
			button.addChild(this.game.add.sprite(2, 2, item.icon));
			button.addChild(table);
			button.events.onInputUp.add(this.useItem, this, 0, item);

			if (index > 2)
				button.visible = false;

			this._shopItems.add(button);
		}, this);

		var btnNext = this.game.add.button(157, 210, 'btn_next', this.listNext, this);
		var btnPrev = this.game.add.button(btnNext.right + 4, 210, 'btn_prev', this.listPrev, this);

		this._tabs[2].add(this._shopItems);
		this._tabs[2].add(btnNext);
		this._tabs[2].add(btnPrev);

		// tab play
		var lblTitle = this.game.add.text(200, 110, 'NEXT CHALLENGE', styleTitle);
		var lblChallenge = this.game.add.text(
			lblTitle.x + lblTitle.width / 2,
			lblTitle.y + 50,
			this._challenge.weight + ' kg',
			styleText
		);

		lblChallenge.anchor.set(0.5);

		var btnGo = this.game.add.button(
			lblChallenge.x,
			lblChallenge.y + 50,
			'btn_go',
			this.play,
			this
		);

		btnGo.anchor.set(0.5);

		this._tabs[3].add(lblTitle);
		this._tabs[3].add(lblChallenge);
		this._tabs[3].add(btnGo);

		// init tabs
		this._tabs[0].visible = true;
		this._tabs[1].visible = false;
		this._tabs[2].visible = false;
		this._tabs[3].visible = false;
	};

	MenuRoom.prototype.tabSelector = function (index) {
		this._tabs[this._tabSelector].visible = false;
		this._tabs[index].visible = true;
		this._tabSelector = index;
	};

	MenuRoom.prototype.tabHealth = function () {
		this.tabSelector(0);
	};

	MenuRoom.prototype.tabStatus = function () {
		this.tabSelector(1);
	};

	MenuRoom.prototype.tabShop = function () {
		this.tabSelector(2);
	};

	MenuRoom.prototype.tabPlay = function () {
		this.tabSelector(3);
	};

	MenuRoom.prototype.updateTabs = function () {
		// update tab health
		this._lblStrengthBar.setText(this._player.str + '%');

		this._strengthBar.clear();
		this._strengthBar.beginFill(0xffffff);
		this._strengthBar.drawRect(
			this._iconStr.right + 50,
			this._iconStr.bottom - this._iconStr.height / 2,
			(this._player.str * 160) / this._player.maxStr,
			this._iconStr.height
		);
		this._strengthBar.alpha = 1;
		this._strengthBar.endFill();

		this._lblHealthBar.setText(this._player.health + '%');

		this._healthBar.clear();
		this._healthBar.beginFill(0xffffff);
		this._healthBar.drawRect(
			this._iconHealth.right + 50,
			this._iconHealth.bottom - this._iconHealth.height / 2,
			(this._player.health * 160) / this._player.maxHealth,
			this._iconHealth.height
		);
		this._healthBar.alpha = 1;
		this._healthBar.endFill();

		// update tab status
		this._statusContent[0][1] = '$' + this._player.wallet;
		this._statusTable.parseList(this._statusContent);

		// update tab shop
		this._shop.items.forEach(function (item, index) {
			var listItem = this._shopItems.getAt(index);

			if (this._player.wallet < item.cost)
				listItem.loadTexture('bg_list_not');
			else
				listItem.loadTexture('bg_list');
		}, this);
	};

	MenuRoom.prototype.useItem = function (button, pointer, param, item) {
		if (this._player.wallet >= item.cost) {
			this._player.health -= Math.round(this._player.health * item.damage);
			this._player.wallet -= item.cost;
			this._player.balance = (100 - this._player.health) / 1000;
			localStorage.setItem('playerContext', JSON.stringify(this._player));
			this._player.str += this._player.str * item.mod;
			this.updateTabs();
		}
	};

	MenuRoom.prototype.listNext = function () {
		this._tabs[2].iterate('name', 'ShopItems', Phaser.Group.RETURN_CHILD, function (shop) {
			var y = 120;

			shop.children.forEach(function (item, index) {
				if (this._shopCurrPage < this._shopListPages) {
					if (item.visible)
						item.visible = false;

					if (index >= this._shopCurrPage * this._shopItemsShow
							&& index < (this._shopCurrPage + 1) * this._shopItemsShow)
						item.visible = true;

					item.y -= y;
				}
			}, this);

			this._shopCurrPage++;

			if (this._shopCurrPage > this._shopListPages)
				this._shopCurrPage = this._shopListPages;
		}, this);
	};

	MenuRoom.prototype.listPrev = function () {
		this._tabs[2].iterate('name', 'ShopItems', Phaser.Group.RETURN_CHILD, function (shop) {
			var y = 120;

			this._shopCurrPage--;

			shop.children.forEach(function (item, index) {
				if (this._shopCurrPage >= 1) {
					if (item.visible)
						item.visible = false;

					if (index >= (this._shopCurrPage - 1) * this._shopItemsShow
							&& index < this._shopCurrPage * this._shopItemsShow)
						item.visible = true;

					item.y += y;
				}
			}, this);

			if (this._shopCurrPage < 1)
				this._shopCurrPage = 1;
		}, this);
	};

	MenuRoom.prototype.play = function () {
		// update player balance
		var balance = this._player.maxHealth - this._player.health;
		this._player.balance = (balance === 0) ? 0.01 : balance / 100;

		// save data
		localStorage.setItem('player', JSON.stringify(this._player));
		localStorage.setItem('challenge', JSON.stringify(this._challenge));

		// start game
		this.game.state.start('Game');
	};

	return MenuRoom;
});