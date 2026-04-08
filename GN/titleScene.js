class titleScene extends Phaser.Scene {

    constructor() {
        super({ key: "titleScene" })
    }

    preload() {
        // 1. Load the MP4 file
        this.load.video('coverVideo', 'assets/Cover.mp4');
    }

    create() {
        
        let gm = this.registry.get("gameManager");
        if (gm) gm.updateScene(this);

        let ui = this.scene.get("UIScene");
        if (ui) {
            ui.setInventoryMode(0); // Mode 0 hides hearts, inventory, and timer
            ui.hideDialogue();      // Ensure no dialogue box is stuck
        }

        this.cameras.main.setBackgroundColor("#000000");
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        
        // 1. Create the video but don't play yet
        let video = this.add.video(centerX, centerY, 'coverVideo');

        //Project info
        this.creditsText = this.add.text(22, this.scale.height - 96, 
    "Beatrix Kok\nMultimedia Authoring-1\nJan 2026", {
    fontFamily: "Determination",
    fontSize: "14px",
    fill: "#ffffff",
    stroke: '#000000',
    strokeThickness: 4,
    lineSpacing: 6
});

        // 2. Mute it (Crucial for Chrome/Edge/Safari to allow autoplay)
        video.setMute(true);

        // 3. Wait for the 'locked' or 'ready' state
        video.on('locked', () => {
            console.log("Video is locked by browser. Waiting for interaction.");
        });

        // Use the 'complete' or 'play' event to trigger after load
        this.time.delayedCall(100, () => {
            video.play(true); // Loop = true
        });



        // --- 2. INPUT LOGIC ---
        this.input.keyboard.once("keydown-SPACE", () => {
            if (gm) {
                gm.startBGM(); 
            }
            this.scene.start("introStoryScene");
        });

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

        // Skip to City Hub HTP
        this.input.keyboard.on("keydown-FOUR", () => {
            console.log("Debug: Jumping to City Hub");
            this.scene.start("cityHub_htp");
        });

       // Skip to Win Page (Slideshow)
        this.input.keyboard.on("keydown-FIVE", () => {
            console.log("Debug: Jumping to Win Scene");
            // Reset state before jumping to win screen if needed
            if (gm) {
                gm.hearts = 3;
                gm.inventory = [];
            }
            this.scene.start("WinScene");
        });

        // Skip to Game Over Page
        this.input.keyboard.on("keydown-SIX", () => {
            console.log("Debug: Jumping to Game Over Scene");
            if (video) video.stop();
            this.scene.start("gameOverScene");
        });

    }
}