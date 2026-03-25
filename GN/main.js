class main extends Phaser.Scene {

    constructor() {
        super({ key: 'main' });
    }

    preload() {
        // --- 1. LOAD GLOBAL ASSETS ---
        // This ensures they are in memory before any level starts
        this.load.spritesheet('Helper', 'assets/Helper.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('Grandma', 'assets/Grandma.png', { frameWidth: 34, frameHeight: 48 });
        this.load.spritesheet('love', 'assets/loveAni.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        console.log('*** Global Initialization Started');

        // --- 2. SET GLOBAL SPEEDS (The Registry) ---
        // This stays active even if you switch scenes!
        this.registry.set('playerSpeed', 200);
        this.registry.set('grandmaFollowSpeed', 130);

        // --- 3. CREATE GLOBAL ANIMATIONS ---
        // We use the "if exists" check to prevent errors on scene restarts
        if (!this.anims.exists('Helper-down')) {
            
            // Helper Animations
            this.anims.create({
                key: 'Helper-down',
                frames: this.anims.generateFrameNumbers('Helper', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'Helper-left',
                frames: this.anims.generateFrameNumbers('Helper', { start: 4, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'Helper-right',
                frames: this.anims.generateFrameNumbers('Helper', { start: 8, end: 11 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'Helper-up',
                frames: this.anims.generateFrameNumbers('Helper', { start: 12, end: 15 }),
                frameRate: 8,
                repeat: -1
            });

            // Grandma Animations
            this.anims.create({
                key: 'Grandma-down',
                frames: this.anims.generateFrameNumbers('Grandma', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'Grandma-left',
                frames: this.anims.generateFrameNumbers('Grandma', { start: 4, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'Grandma-right',
                frames: this.anims.generateFrameNumbers('Grandma', { start: 8, end: 11 }),
                frameRate: 8,
                repeat: -1
            });
            this.anims.create({
                key: 'Grandma-up',
                frames: this.anims.generateFrameNumbers('Grandma', { start: 12, end: 15 }),
                frameRate: 8,
                repeat: -1
            });

            // Love Animation
            this.anims.create({
                key: "love_anim",
                frames: this.anims.generateFrameNumbers("love", { start: 0, end: 5 }),
                frameRate: 8,
                repeat: -1
            });
        }

        console.log('*** Initialization Complete. Moving to Title.');

        // --- 4. AUTO-JUMP TO TITLE ---
        // Instead of waiting for Space, we go straight to the Title Scene.
        // This ensures the game is "ready" when the player reaches the title.
        this.scene.start('titleScene');
    }
}