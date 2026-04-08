class GameManager {
    constructor(scene) {
        this.scene = scene; 
        this.hearts = 3;
        this.inventory = [];
        this.timeLeft = 0;
        this.timerEvent = null;
        this.bgm = null;
    }

    resetStats() {
        this.hearts = 3;
        this.inventory = [];
        this.stopTimer();
    }

    stopTimer() {
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }
    }

    preloadAssets() {
        // Images
        this.scene.load.image("Lv1_Complete", "assets/Lv1_Complete.png");
        this.scene.load.image("Lv2_Complete", "assets/Lv2_Complete.png");
        this.scene.load.image("Lv3_Complete", "assets/Lv3_Complete.png");
        this.scene.load.image("TaskFail", "assets/TaskFail.png");

        // Audio Assets
        this.scene.load.audio('bgm', 'assets/Bgm.mp3');
        this.scene.load.audio('correct', 'assets/soundEffect_correctitem.mp3');
        this.scene.load.audio('wrong', 'assets/soundEffect_wrongitem.mp3');
    }
    
    startBGM() {
        // Only start if it's not already playing to prevent overlapping music
        if (!this.scene.sound.get('bgm')) {
            this.bgm = this.scene.sound.add('bgm', { volume: 0.6, loop: true });
            this.bgm.play();
        }
    }

    playSFX(key) {
    // 1. Force resume in case browser blocked it
    if (this.scene.sound.context.state === 'suspended') {
        this.scene.sound.context.resume();
    }

    // 2. Check if the sound exists in the cache
    if (this.scene.cache.audio.exists(key)) {
        this.scene.sound.play(key);
    } else {
        console.warn(`Audio key "${key}" not found in cache! Check your preload paths.`);
    }
}


    updateScene(newScene) {
        this.scene = newScene;
    }


    collectCorrect() {
        this.playSFX('correct');
    }

addHeart() {
        if (this.hearts < 3) {
            this.hearts++;
            this.playSFX('correct'); 
            let ui = this.scene.scene.get("UIScene");
            if (ui) ui.updateHearts(this.hearts);
        }
    }

    loseHeart() {
        this.hearts--;
        this.playSFX('wrong'); // Feedback for losing heart
        let ui = this.scene.scene.get("UIScene");
        if (ui) ui.updateHearts(this.hearts);
    }

    startTimer(seconds) {
        let ui = this.scene.scene.get("UIScene");
        this.stopTimer();
        this.timeLeft = seconds;
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                if (ui && ui.timerText) {
                    let mins = Math.floor(this.timeLeft / 60);
                    let secs = this.timeLeft % 60;
                    ui.timerText.setText(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                }
                if (this.timeLeft <= 0) {
                    this.stopTimer();
                    this.showFail();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    showFail() {
        this.stopTimer();
        this.playSFX('wrong'); 
        let ui = this.scene.scene.get("UIScene");
        let failImg = ui.add.image(512, 290, "TaskFail").setDepth(5000).setAlpha(0);
        ui.tweens.add({
            targets: failImg,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                let prompt = ui.add.text(512, 516, "Press SPACE to Try Again", { 
                    fontFamily: 'Determination', // Custom Typo
                    fontSize: '24px', 
                    fill: '#fff' 
                }).setOrigin(0.5).setDepth(5001);

                ui.input.keyboard.once("keydown-SPACE", () => {
                    failImg.destroy();
                    prompt.destroy();
                    this.loseHeart(); 
                    if (this.hearts > 0) {
                        this.scene.scene.restart();
                    } else {
                        this.scene.scene.stop("UIScene");
                        this.scene.scene.start("titleScene");
                    }
                });
            }
        });
    }

   showSuccess(lv, nextScene) {
        this.stopTimer();
        this.playSFX('correct'); 
        let ui = this.scene.scene.get("UIScene");
        let imgKey = `Lv${lv}_Complete`;
        
        // Add the success image to the UI Scene
        let successImg = ui.add.image(512, 288, imgKey).setDepth(5000).setAlpha(0);
        
        ui.tweens.add({
            targets: successImg,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                ui.input.keyboard.once("keydown-SPACE", () => {
                    // --- CLEANUP FIXES ---
                    
                    // 1. Destroy the image so it doesn't stay visible in the next scene
                    successImg.destroy(); 
                    
                    // 2. Wipe the inventory data so Level 2/3 starts empty
                    this.inventory = []; 
                    
                    // 3. Force the UI to clear the visible icons
                    if (ui.clearIconsOnly) ui.clearIconsOnly();
                    if (ui.hideDialogue) ui.hideDialogue();

                    // Now change the scene
                    this.scene.scene.start(nextScene);
                });
            }
        });
    }
}