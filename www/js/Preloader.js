define(['phaser'], function (Phaser) {
    'use strict';
    
    function Preloader (game) {
        // use init method!
    }
    
    Preloader.prototype.constructor = Preloader;
    
    Preloader.prototype.preload = function () {
	    // load images
        this.load.image('bar', 'assets/bar.png');
	    this.load.image('bg_globalranking', 'assets/bg_globalranking.png');
	    this.load.image('bg_menu', 'assets/bg_menu.png');
	    this.load.image('bg_room', 'assets/bg_room.png');
	    this.load.image('bg_list', 'assets/bg_list.png');
	    this.load.image('bg_list_not', 'assets/bg_list_not.png');
	    this.load.image('bg_trans', 'assets/bg_trans.png');
	    this.load.image('icon_health', 'assets/icon_health.png');
	    this.load.image('icon_info', 'assets/icon_info.png');
	    this.load.image('icon_play', 'assets/icon_play.png');
	    this.load.image('icon_str', 'assets/icon_str.png');
	    this.load.image('icon_shop', 'assets/icon_shop.png');
	    this.load.image('icon_bottle', 'assets/icon_bottle.png');
	    this.load.image('icon_herbs', 'assets/icon_herbs.png');
	    this.load.image('icon_inject', 'assets/icon_inject.png');
	    this.load.image('icon_medkit', 'assets/icon_medkit.png');
	    this.load.image('icon_pills', 'assets/icon_pills.png');
	    this.load.image('icon_load', 'assets/icon_load.png');
	    this.load.image('btn_hand_left', 'assets/btn_hand_left.png');
	    this.load.image('btn_hand_right', 'assets/btn_hand_right.png');
	    this.load.image('btn_go', 'assets/btn_go.png');
	    this.load.image('btn_exit', 'assets/btn_exit.png');
	    this.load.image('btn_retry', 'assets/btn_retry.png');
	    this.load.image('btn_continue', 'assets/btn_continue.png');
	    this.load.image('btn_newgame', 'assets/btn_newgame.png');
	    this.load.image('btn_ranking', 'assets/btn_ranking.png');
	    this.load.image('btn_top5', 'assets/btn_top5.png');
	    this.load.image('btn_me', 'assets/btn_me.png');
	    this.load.image('btn_back', 'assets/btn_back.png');
	    this.load.image('btn_prev', 'assets/btn_prev.png');
	    this.load.image('btn_next', 'assets/btn_next.png');
	    this.load.image('btn_dlg_use', 'assets/btn_dlg_use.png');
	    this.load.image('btn_dlg_cancel', 'assets/btn_dlg_cancel.png');
	    this.load.image('liftbar', 'assets/liftbar.png');
	    this.load.image('meter', 'assets/meter.png');
	    this.load.image('dialog_item', 'assets/dialog_item.png');

	    // load spritesheets
	    this.load.spritesheet('spr_icon_health', 'assets/spr_icon_health.png', 32, 32);
	    this.load.spritesheet('spr_icon_info', 'assets/spr_icon_info.png', 32, 32);
	    this.load.spritesheet('spr_icon_play', 'assets/spr_icon_play.png', 32, 32);
	    this.load.spritesheet('spr_icon_shop', 'assets/spr_icon_shop.png', 32, 32);

	    // load audio
	    this.load.audio('sfx_counter', 'assets/sfx_counter.ogg');
	    this.load.audio('sfx_no_money', 'assets/sfx_no_money.ogg');
	    this.load.audio('sfx_use_item', 'assets/sfx_use_item.ogg');
    };
    
    Preloader.prototype.create = function () {
        this.game.state.start('Menu');
    };
    
    return Preloader;
});