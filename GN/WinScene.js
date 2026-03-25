class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: "WinScene" });
    }

    create() {
       
        this.cameras.main.setBackgroundColor("#000000");

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

  
        this.add.text(centerX, centerY - 100, "MISSION ACCOMPLISHED", {
            fontFamily: "Determination",
            fontSize: "60px",
            fill: "#ffffaa"
        }).setOrigin(0.5);

      
        this.add.text(centerX, centerY, "The family dinner was a success!\nGrandma is so proud of her little helper.", {
            fontFamily: "Determination",
            fontSize: "24px",
            fill: "#ffffff",
            align: "center",
            lineSpacing: 10
        }).setOrigin(0.5);

    
        this.add.text(centerX, centerY + 100, "Even Oyen the cat is full and happy.", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#aaaaaa"
        }).setOrigin(0.5);

      
        const restartText = this.add.text(centerX, centerY + 200, "Press SPACE to Continue", {
            fontFamily: "Determination",
            fontSize: "20px",
            fill: "#00ffff"
        }).setOrigin(0.5);

        // Blink effect on instruction text
        this.tweens.add({
            targets: restartText,
            alpha: 0,
            duration: 800,
            ease: "Power1",
            yoyo: true,
            loop: -1
        });

        // 6. Input Logic
        this.input.keyboard.once("keydown-SPACE", () => {
            // Reset the GameManager hearts/inventory if needed before restarting
            let gameManager = this.registry.get("gameManager");
            if (gameManager) {
                gameManager.hearts = 3;
                gameManager.inventory = [];
            }
            this.scene.start("titleScene");
        });
    }
}