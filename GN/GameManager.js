class GameManager {
    constructor(scene) {
        this.scene = scene; // Points to current active level
        this.gameStarted = true;
        this.hearts = 3;
        this.inventory = [];
        this.timeLeft = 0;
        this.timerEvent = null;
    }

    // --- Restart Setup ---
    resetStats() {
        this.hearts = 3;
        this.inventory = [];
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }
    }

    startGame() {
        this.gameStarted = true;
        console.log("Game Manager: System Started");
    }

    preloadAssets() {
        this.scene.load.image("Lv1_Complete", "assets/Lv1_Complete.png");
        this.scene.load.image("Lv2_Complete", "assets/Lv2_Complete.png");
        this.scene.load.image("Lv3_Complete", "assets/Lv3_Complete.png");
        this.scene.load.image("TaskFail", "assets/TaskFail.png");
    }

    // --- TIMER LOGIC ---
    startTimer(seconds) {
        let ui = this.scene.scene.get("UIScene");

        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }

        if (seconds <= 0) {
            if (ui) {
                ui.timerText.setVisible(false);
                ui.timerUI.setVisible(false);
            }
            return;
        }

        this.timeLeft = seconds;
        if (ui) {
            ui.timerText.setVisible(true);
            ui.timerUI.setVisible(true);
        }

        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.tick,
            callbackScope: this,
            loop: true
        });

        this.updateTimerUI();
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateTimerUI();
        } else {
            this.showFail();
        }
    }

    updateTimerUI() {
        let ui = this.scene.scene.get("UIScene");
        if (ui && ui.timerText) {
            let mins = Math.floor(this.timeLeft / 60);
            let secs = this.timeLeft % 60;
            let timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            ui.timerText.setText(timeString);
        }
    }

    addItem(item) {
        this.inventory.push(item);
        this.updateInventoryUI();
    }

    loseHeart() {
        this.hearts = Math.max(0, this.hearts - 1);
        this.updateUI(); 
        if (this.hearts === 0) {
            this.scene.scene.start("gameOverScene");
        }
    }

    addHeart() {
        this.hearts = Math.min(3, this.hearts + 1);
        this.updateUI();
    }

    updateUI() {
        let ui = this.scene.scene.get("UIScene");
        if (ui) ui.updateHearts(this.hearts);
    }

    updateInventoryUI() {
        let ui = this.scene.scene.get("UIScene");
        if (ui) ui.renderInventory(this.inventory);
    }

    // --- SUCCESS & FAIL SCREENS ---
    showSuccess(levelNumber, nextScene) {
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }

        let ui = this.scene.scene.get("UIScene");
        if (ui) {
            const textureKey = `Lv${levelNumber}_Complete`;
            let winImg = ui.add.image(512, 288, textureKey).setDepth(5000).setScale(0);
            
            let prompt = ui.add.text(512, 550, "Press SPACE to Continue", {
                fontFamily: "Determination", fontSize: "24px", fill: "#ffffff"
            }).setOrigin(0.5).setDepth(5001).setAlpha(0);

            ui.tweens.add({
                targets: winImg,
                scale: 1,
                duration: 500,
                ease: 'Back.easeOut',
                onComplete: () => {
                    prompt.setAlpha(1);
                    ui.tweens.add({ targets: prompt, alpha: 0, duration: 800, yoyo: true, loop: -1 });
                }
            });

            this.scene.input.keyboard.once("keydown-SPACE", () => {
                winImg.destroy();
                prompt.destroy();
                this.scene.scene.start(nextScene, { inventory: this.inventory });
            });
        }
    }

    showFail() {
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }

        let ui = this.scene.scene.get("UIScene");
        if (ui) {
            let failImg = ui.add.image(512, 300, "TaskFail").setDepth(5000).setAlpha(0);
            
            let prompt = ui.add.text(512, 550, "Press SPACE to Try Again", {
                fontFamily: "Determination", fontSize: "24px", fill: "#ff0000"
            }).setOrigin(0.5).setDepth(5001).setAlpha(0);

            ui.tweens.add({
                targets: [failImg, prompt],
                alpha: 1,
                scale: 1,
                duration: 400,
                onComplete: () => {
                    ui.tweens.add({ targets: prompt, alpha: 0.3, duration: 500, yoyo: true, loop: -1 });
                }
            });

            this.scene.input.keyboard.once("keydown-SPACE", () => {
                failImg.destroy();
                prompt.destroy();
                this.loseHeart(); 
                if (this.hearts > 0) {
                    this.inventory = []; 
                    this.scene.scene.restart();
                }
            });
        }
    }
}