class titleScene extends Phaser.Scene {

    constructor() {
        super({ key: "titleScene" })
    }

    create() {
        // Background
        this.cameras.main.setBackgroundColor("#000000")

        // Main title
        this.add.text(512, 200, "Grandchild Wanted", {
            fontFamily: "Determination",
            fontSize: "68px",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(512, 300, "A Helper Needed\nA small help can mean a lot", {
            fontFamily: "Determination",
            fontSize: "24px",
            fill: "#dddddd",
            align: "center"
        }).setOrigin(0.5);

        // Instruction
        this.add.text(512, 420, "Press SPACE to Start", {
            fontFamily: "Determination",
            fontSize: "22px",
            fill: "#ffffaa"
        }).setOrigin(0.5)

        // Debug Instructions (Optional: Remove before final submission)
        this.add.text(512, 500, "[Debug] Press 1, 2, or 3 to Skip Levels", {
            fontFamily: "Determination",
            fontSize: "14px",
            fill: "#555555"
        }).setOrigin(0.5);

        // --- KEYS SETUP ---

        // Normal Start
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.on("down", () => {
            this.scene.start("introStoryScene");
        });

        // Skip to Level 1 HTP
        this.input.keyboard.on("keydown-ONE", () => {
            console.log("Debug: Jumping to Level 1");
            this.scene.start("lv1_htp");
        });

        // Skip to Level 2 HTP
        this.input.keyboard.on("keydown-TWO", () => {
            console.log("Debug: Jumping to Level 2");
            this.scene.start("lv2_htp");
        });

        // Skip to Level 3 HTP
        this.input.keyboard.on("keydown-THREE", () => {
            console.log("Debug: Jumping to Level 3");
            this.scene.start("lv3_htp");
        });
    }
}