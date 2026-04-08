class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: "WinScene" });
        // Track image
        this.currentImageIndex = 0;
        this.imageKeys = [
            'win', 'end1', 'end2', 'end3', 'end4', 'end5', 'end6', 'end7', 'end8'
        ];
    }

    preload() {
    
        this.load.image('win', 'assets/Win.jpg');
        this.load.image('end1', 'assets/EndMessage_1.jpg');
        this.load.image('end2', 'assets/EndMessage_2.jpg');
        this.load.image('end3', 'assets/EndMessage_3.jpg');
        this.load.image('end4', 'assets/EndMessage_4.jpg');
        this.load.image('end5', 'assets/EndMessage_5.jpg');
        this.load.image('end6', 'assets/EndMessage_6.jpg');
        this.load.image('end7', 'assets/EndMessage_7.jpg');
        this.load.image('end8', 'assets/EndMessage_8.jpg');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Create the image at exact size (no setDisplaySize here)
        this.displayImage = this.add.image(centerX, centerY, this.imageKeys[this.currentImageIndex]);


        const continueText = this.add.text(centerX, this.cameras.main.height - 65, "Press SPACE to Continue", {
            fontFamily: "Determination",
            fontSize: "17px",
            fill: "#ffffff",
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(100);


        // Blinking effect
        this.tweens.add({
            targets: continueText,
            alpha: 0,
            duration: 800,
            yoyo: true,
            loop: -1
        });

        // 3. Input Logic
        this.input.keyboard.on("keydown-SPACE", () => {
            this.showNextImage();
        });
    }

    showNextImage() {
        this.currentImageIndex++;

        if (this.currentImageIndex < this.imageKeys.length) {
            let nextKey = this.imageKeys[this.currentImageIndex];
            this.displayImage.setTexture(nextKey);

            // Logic: Only scale if it is the LAST image (end8)
            if (nextKey === 'end8') {
                this.displayImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
            } else {
                // For all other images, reset to exact original size
                this.displayImage.scale = 1; 
            }
            
        } else {
            let gameManager = this.registry.get("gameManager");
            if (gameManager) {
                gameManager.hearts = 3;
                gameManager.inventory = [];
            }
            this.currentImageIndex = 0;
            this.scene.start("titleScene");
        }
    }
}