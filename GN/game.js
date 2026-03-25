var config = {
    type: Phaser.AUTO,

    width: 32 * 32,
    height: 32 * 18,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    backgroundColor: '#000000',
    pixelArt: true,
    scene: [
        main,             
        titleScene,     
        introStoryScene,
        howToPlayScene,
        UIScene,
        lv1_htp,
        grandmahouse_lv1,
        cityHub,
        lv2_htp,
        market_lv2,
        lv3_htp,
        grandmahouse_lv3,
        endingScene,
        familyDinnerScene,
        WinScene,
        gameOverScene
    ]

};

var game = new Phaser.Game(config);