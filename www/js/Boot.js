define(
	[
		'phaser',
		'Preloader',
		'Menu',
		'GlobalRanking',
		'MenuRoom',
		'Game',
		'GameOver',
		'Ads'
	],

	function (Phaser, Preloader, Menu, GlobalRanking, MenuRoom, Game, GameOver, Ads) {
	    'use strict';

	    function Boot (game) {
	        // use init method!
	    }

	    Boot.prototype.constructor = Boot;

	    Boot.prototype.init = function () {
		    // verify votes
		    var bootUp = JSON.parse(localStorage.getItem('bootUp')) || { openCount: 1, voted: false };

		    if ((bootUp.openCount === 2 || !(bootUp.openCount % 5)) && !bootUp.voted) {
			    navigator.notification.confirm(
				    'Would you like to rate this game?!',

				    function (index) {
					    switch (index) {
						    case 1:
							    bootUp.openCount++;
							    break;

						    case 2:
							    bootUp.voted = true;
							    window.open(
								    'https://play.google.com/store/apps/details?id=com.brofistcorp.fingergym',
								    '_system'
							    );
							    break;

						    case 3:
							    bootUp.voted = true;
							    break;

					    }

					    localStorage.setItem('bootUp', JSON.stringify(bootUp));
				    },

				    'VOTE!',

				    ['Later', 'VOTE!', 'No']
			    );
		    } else {
			    bootUp.openCount++;
			    localStorage.setItem('bootUp', JSON.stringify(bootUp));
		    }

		    // setup screen
	        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	        this.scale.pageAlignHorizontally = true;
	        this.scale.pageAlignVertically = true;

		    // let animations smooth
		    this.game.forceSingleUpdate = true;
	    };

	    Boot.prototype.create = function () {
		    // start analytics
		    window.analytics.startTrackerWithId('UA-70227806-3');

	        // start admob
	        if (AdMob) {
		        AdMob.prepareInterstitial({
			        adId: 'ca-app-pub-7403543083567100/5797683477',
			        autoShow: false,
			        isTesting: false,
			        overlap: true
		        });
	        }

		    // setup counters to show admob
		    localStorage.setItem('showAdsCounter', this.game.rnd.integerInRange(1, 3));
		    localStorage.setItem('newGameCounter', 0);

		    // setup game states
	        this.game.state.add('Preloader', Preloader);
		    this.game.state.add('Menu', Menu);
		    this.game.state.add('GlobalRanking', GlobalRanking);
		    this.game.state.add('MenuRoom', MenuRoom);
	        this.game.state.add('Game', Game);
		    this.game.state.add('GameOver', GameOver);
		    this.game.state.add('Ads', Ads);
	        this.game.state.start('Preloader');
	    };

	    return Boot;
	}
);