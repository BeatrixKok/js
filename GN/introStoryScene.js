class introStoryScene extends Phaser.Scene {

    constructor() {
        super({ key: "introStoryScene" })
    }

    preload() {
        this.load.image("introStoryBG", "assets/introStory.jpg");
    }

    create() {

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.add.image(centerX, centerY, "introStoryBG");

        this.add.text(212, 91, "Grandma :", {
            fontFamily: "Determination",
            fontSize: "24px",
            fill: "#ffffff"
        });


        this.add.text(216, 155,
            "Thank you for taking the tasks !\nThe Family messages group been very quiet lately...\nI think... they forget me already...",
            {
                fontFamily: "Determination",
                fontSize: "16px",
                fill: "#4b3228",
                lineSpacing: 4,
                wordWrap: { width: 500 }
            }
        );


        this.add.text(410, 352,
            "Grandma wants to invite everyone for dinner.\nBut things are not easy anymore...",
            {
                fontFamily: "Determination",
                fontSize: "18px",
                fill: "#ffffff",
                lineSpacing: 4
            }
        ).setOrigin(0.5);

        this.add.text(421, 428,
            "Your role: \nBe her helper for today.\nHelp her finish simple tasks to gather the family.",
            {
                fontFamily: "Determination",
                fontSize: "17px",
                fill: "#ffffaa",
            }
        ).setOrigin(0.5);


        this.add.text(481, 488, "Press SPACE to continue", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "hsl(183, 100%, 50%)"
        }).setOrigin(0.5);

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.on("down", () => {
            this.scene.start("howToPlayScene");
        });
    }
}