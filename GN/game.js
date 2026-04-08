var config = {
    type: Phaser.AUTO,
    width: 32 * 32, // 1024
    height: 32 * 18, // 576
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
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
        cityHub_htp,
        market_lv2,
        lv3_htp,
        grandmahouse_lv3,
        endingScene,
        WinScene,
        gameOverScene
    ]

};

var game = new Phaser.Game(config);
let globalHeart = 3