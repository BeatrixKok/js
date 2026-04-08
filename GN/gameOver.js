class gameOverScene extends Phaser.Scene {

    constructor() {
        super({ key: "gameOverScene" });
    }

    preload() {
        // Load the GameOver image
        this.load.image('gameOverImg', 'assets/GameOver.jpg');
    }

    create() {

        this.scene.stop("UIScene");

        this.cameras.main.setBackgroundColor("#000000");

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;


        this.add.image(centerX, centerY, 'gameOverImg');


        this.add.text(centerX, this.cameras.main.height - 80, "Press SPACE to main menu", {
            fontFamily: "Determination", // Using your consistent font
            fontSize: "20px",
            fill: "#ffffaa",
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // 3. Input Logic
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.space.on("down", () => {
            // Reset GameManager stats before going back to title
            let gm = this.registry.get("gameManager");
            if (gm) {
                gm.hearts = 3;
                gm.inventory = [];
            }
            this.scene.start("titleScene");
        });
    }
}