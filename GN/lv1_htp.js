class lv1_htp extends Phaser.Scene {

    constructor() {
        super({ key: "lv1_htp" });
    }

    preload() {
        // Loading the Level 1 specific background
        this.load.image("lv1HTP_BG", "assets/Lv1_htp.jpg");
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        
        this.add.image(centerX, centerY, "lv1HTP_BG");

    
        this.add.text(centerX, 113, "LEVEL 1: Send Invitations", {
            fontFamily: "Determination",
            fontSize: "32px",
            fill: "#ffffff"
        }).setOrigin(0.5);

        
        this.add.text(centerX, 180, "Goal: Help Grandma send dinner message", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffaa"
        }).setOrigin(0.5);

    
        this.add.text(173, 200, "Find:", {
            fontFamily: "Determination",
            fontSize: "20px",
            fill: "#ffffff"
        });

        this.add.text(242, 268, "Phone\nGlasses\nCorrect password note", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff",
            lineSpacing: 36
        });

        this.add.text(572, 280, "Wrong note  >  -1 Hearts", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        }).setOrigin(0, 0.5);

        this.add.text(570, 340, "Correct note  >  Unlock phone", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        }).setOrigin(0, 0.5);

        // 6. Navigation
        this.add.text(880, 520, "Press SPACE to Start", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#00ffff" 
        }).setOrigin(1);

        // Input logic
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.on("down", () => {
            this.scene.start("grandmahouse_lv1");
        });
    }
}