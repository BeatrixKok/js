class lv3_htp extends Phaser.Scene { 
    constructor() {
        super({ key: "lv3_htp" }); 
        this.tasksCompleted = 0;
        this.totalTasks = 8;
        this.isFinished = false;
    }

    init(data) {
        this.playerData = data.player;
        this.inventory = data.inventory;
    }

    preload() {
        // Loading the Level 3 specific background
        this.load.image("lv3HTP_BG", "assets/Lv3_htp.jpg");
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.image(centerX, centerY, "lv3HTP_BG");

        this.add.text(centerX, 88, "LEVEL 3: Prepare The House", {
            fontFamily: "Determination",
            fontSize: "32px",
            fill: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(centerX, 146, "Goal: Finish tasks before Grandma done cooking", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffaa"
        }).setOrigin(0.5);

        this.add.text(242, 188, 
            "After arriving home, Grandma puts the groceries into the fridge and \nstarts cooking for dinner.\n" +
            "Please help her prepare the house before dinner time !", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#ffffff",
            lineSpacing: 8
        });

        this.add.text(242, 284, "Tip:", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#ffffaa"
        });

        this.add.text(242, 320, 
            "-  Try to remember what your grandparents often\n  needed help or needed to be reminded with.\n" +
            "-  Chat with Grandma\n" +
            "-  Look around carefully!", {
            fontFamily: "Determination",
            fontSize: "14px",
            fill: "#dddddd",
            lineSpacing: 8
        });

        this.add.text(330, 468, "Heart pickup   >   +10 Sec", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(713, 468, "0:00              Time out = Restart Level", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(875, 549, "Press SPACE to Start", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#00ffff" 
        }).setOrigin(1);

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.on("down", () => {
            this.scene.start("grandmahouse_lv3"); 
        });
    }
}