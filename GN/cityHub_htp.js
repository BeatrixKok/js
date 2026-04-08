class cityHub_htp extends Phaser.Scene {

    constructor() {
        super({ key: "cityHub_htp" });
    }

    preload() {
        this.load.image("cityHubHTP_BG", "assets/CityHub_htp.jpg");
    }

    create() {
        this.scene.stop("UIScene");
        
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Background
        this.add.image(centerX, centerY, "cityHubHTP_BG");

        // Title
        this.add.text(centerX, 113, "CITY HUB : Grocery Escort", {
            fontFamily: "Determination",
            fontSize: "32px",
            fill: "#ffffff"
        }).setOrigin(0.5);

        // Goal
        this.add.text(centerX, 180, "Goal:  Find Market together with grandma", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffaa"
        }).setOrigin(0.5);

        // Instructions
        this.add.text(540, 403, "I only remember how the market look like...'", {
            fontFamily: "Determination",
            fontSize: "14px",
            fill: "#4b3228"
        });
        
        this.add.text(482, 222, 
            "1.  Find  'MARKET'  from Grandma's memory\n" +
            "2.  Lead grandma there, she follows you\n" +
            "3.  Stay close! Don't let her fall behind\n" +
            "     Enter together + \n                 Correct Shop   >   Level Complete", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#ffffff",
            lineSpacing: 10
        });


        // Footer
        this.add.text(880, 520, "Press SPACE to Start", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#00ffff" 
        }).setOrigin(1);

        // Controls
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.on("down", () => {
            // Change "city_hub_level" to the actual key of your city level
            this.scene.start("cityHub");
        });
    }
}