class lv2_htp extends Phaser.Scene {

    constructor() {
        super({ key: "lv2_htp" });
    }

    preload() {
        // Loading the Level 2 specific background
        this.load.image("lv2HTP_BG", "assets/Lv2_htp.jpg");
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

   
        this.add.image(centerX, centerY, "lv2HTP_BG");

  
        this.add.text(centerX, 113, "LEVEL 2: Grocery Time", {
            fontFamily: "Determination",
            fontSize: "32px",
            fill: "#ffffff"
        }).setOrigin(0.5);


        this.add.text(centerX, 180, "Goal: Complete Groceries list", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffaa"
        }).setOrigin(0.5);


        this.add.text(237, 220, "Grandma gives: 2 items at a time", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#ffffff"
        });
        
        this.add.text(237, 298, 
            "1.  Find Grandma to get your list\n" +
            "2.  Collect 2 items she requested\n" +
            "3.  Return to Grandma for the next tasks", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#ffffff",
            lineSpacing: 10
        });

        this.add.text(237, 256, "Loop:", {
            fontFamily: "Determination",
            fontSize: "20px",
            fill: "#ffffff"
        });

        this.add.text(648, 268, "Wrong item   >   -10 Sec", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        }).setOrigin(0, 0.5);

        this.add.text(648, 332, "Heart pickup   >   +10 Sec", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        }).setOrigin(0, 0.5);

        this.add.text(237, 406, "Tips: Be careful & remember !", {
            fontFamily: "Determination",
            fontSize: "14px",
            fill: "#dddddd"
        });

        this.add.text(880, 520, "Press SPACE to Start", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#00ffff" 
        }).setOrigin(1);

    
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.on("down", () => {
            this.scene.start("market_lv2"); 
        });
    }
}