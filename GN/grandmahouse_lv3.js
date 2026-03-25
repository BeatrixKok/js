class grandmahouse_lv3 extends Phaser.Scene {
    constructor() {
        super({ key: "grandmahouse_lv3" });
        this.tasksCompleted = 0;
        this.totalTasks = 8;
    }

    init(data) {
        this.playerData = data.player;
        this.inventory = data.inventory;
    }

    preload() {

        //Exported JSON map file
        this.load.tilemapTiledJSON("grandmahouse_lv3", "assets/GN_house_lv3.tmj");

        this.load.image("HouselandImg", "assets/Room_Builder_32x32.png");
        this.load.image("HouseGeneralImg", "assets/General_32x32.png");
        this.load.image("HouseClandImg", "assets/City_32x32.png");
        this.load.image("HouseBedRImg", "assets/4_Bedroom_32x32.png");
        this.load.image("HouseBathRImg", "assets/3_Bathroom_32x32.png");
        this.load.spritesheet('Collectable_lv3', 'assets/Collectable_lv3.png', { frameWidth: 54, frameHeight: 54 });

    }

    create() {
        this.tasksCompleted = 0;

        // Create GameManager
        this.gameManager = this.registry.get("gameManager");
        if (!this.gameManager) {
            this.gameManager = new GameManager(this);
            this.registry.set("gameManager", this.gameManager);
        } else {
            // Update manager to current scene context
            this.gameManager.scene = this;
        }

        // --- UI SETUP ---
        this.scene.launch("UIScene");
        this.scene.bringToTop("UIScene");

        this.time.delayedCall(150, () => {
            let ui = this.scene.get("UIScene");
            if (ui) {
                ui.setInventoryMode(3);
                this.gameManager.updateUI();
                this.gameManager.startTimer(180);

                ui.showDialogue("Finally home! Help me settle these chores before dinner, will you?");
                this.time.delayedCall(3000, () => ui.hideDialogue());
            }
        });

        // ======================== map ========================
        let map = this.make.tilemap({ key: "grandmahouse_lv3" });
        //Limit Player from leaving game area
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        let houselandTiles = map.addTilesetImage("HouseLand", "HouselandImg");
        let housegGeneralTiles = map.addTilesetImage("HouseGeneral", "HouseGeneralImg");
        let houseClandTiles = map.addTilesetImage("HouseCLand", "HouseClandImg");
        let houseBedRTiles = map.addTilesetImage("HouseBedR", "HouseBedRImg");
        let houseBathRTiles = map.addTilesetImage("HouseBathR", "HouseBathRImg");

        let tilesArray = [houselandTiles, housegGeneralTiles, houseClandTiles, houseBedRTiles, houseBathRTiles]
        //Load in layers by layers
        let H_land = map.createLayer(
            "H_land",
            tilesArray,
            0,
            0
        );

        let H_wall = map.createLayer(
            "H_wall",
            tilesArray,
            0,
            0
        );

        let H_landwallprop = map.createLayer(
            "H_landwallprop",
            tilesArray,
            0,
            0
        );

        let H_furniture = map.createLayer(
            "H_furniture",
            tilesArray,
            0,
            0
        );

        let H_prop2 = map.createLayer(
            "H_prop2",
            tilesArray, 0,
            0
        );

        let H_prop3 = map.createLayer(
            "H_prop3",
            tilesArray,
            0,
            0
        );

        //Animation_collectable-note
        this.anims.create({ key: "tv_anim", frames: this.anims.generateFrameNumbers("Collectable_lv3", { start: 1, end: 2 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: "aircon_anim", frames: this.anims.generateFrameNumbers("Collectable_lv3", { start: 9, end: 11 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: "water_anim", frames: this.anims.generateFrameNumbers("Collectable_lv3", { start: 5, end: 6 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: "vacume_anim", frames: this.anims.generateFrameNumbers("Collectable_lv3", { start: 12, end: 14 }), frameRate: 3, repeat: -1 });
        this.anims.create({ key: "starveCat_anim", frames: this.anims.generateFrameNumbers("Collectable_lv3", { start: 15, end: 16 }), frameRate: 3, repeat: -1 });

        //Load player
        let start = map.findObject("Object_lv3", (obj) => obj.name === "Helper");
        console.log(start)
        this.player = this.physics.add.sprite(start.x, start.y, 'Helper')
        //Stay within map boundry
        this.player.setCollideWorldBounds(true);

        //Load grandma
        let grandmaObj = map.findObject("Object_lv3", (obj) => obj.name === "Grandma");
        this.grandma = this.physics.add.sprite(grandmaObj.x, grandmaObj.y, "Grandma");

        // --- HIint Array ---
        this.hintList = [
            "I hear a beeping sound coming from the kitchen...",
            "There is a tap tap sound in the bathroom...",
            "I hear Oyen keep meow meow meow...",
            "Did I remember to unplug the vacuum??",
            "Hmm... Did I find the TV remote this morning...",
            "The floor feels cold when I walk past that room.",
            "I can't find the purple clothes I wanted to wear tonight...",
            "Did I remember to close the door...?"
        ];

        this.grandmaSpeech = this.add.text(this.grandma.x, this.grandma.y - 30, "", {
            font: "14px Arial",
            fill: "#ffffff",
            backgroundColor: "#00000072", // semi-transparent black background
            padding: { x: 8, y: 4 },
            wordWrap: { width: 180 },
            align: 'center'
        }).setOrigin(0.5, 1).setDepth(2000).setVisible(false);

        this.hintTimer = this.time.addEvent({
            delay: 7000,
            callback: this.showGrandmaHint,
            callbackScope: this,
            loop: true
        });

        //Create the arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();

        //Camera follow player
        this.cameras.main.startFollow(this.player, true);
        //camera stop at edge
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //Collision
        //H_collision.setCollisionByProperty({ collides: true });
        //this.physics.add.collider(this.player, H_collision);
        //H_collision.setVisible(false);


        //Set collectable by group
        this.collectables = this.physics.add.group();
        let items = map.getObjectLayer("Object_lv3").objects;

        items.forEach(obj => {

            if (
                obj.name !== "tv" &&
                obj.name !== "aircon" &&
                obj.name !== "water" &&
                obj.name !== "door" &&
                obj.name !== "clothes" &&
                obj.name !== "vacume" &&
                obj.name !== "starveCat" &&
                obj.name !== "fridge" &&
                obj.name !== "love1" &&
                obj.name !== "love2"
            ) return;

            let item = this.collectables
                .create(obj.x, obj.y, "Collectable_lv3")
                .setOrigin(0, 1)

            item.name = obj.name;

            switch (obj.name) {

                case "tv":
                    item.play("tv_anim");
                    item.setScale(2.1);
                    item.body.setSize(46, 20);
                    item.body.setOffset(4, item.height - 16);
                    break;

                case "aircon":
                    item.play("aircon_anim");
                    item.setScale(2.2);
                    item.body.setSize(32, 30);
                    item.body.setOffset(4, item.height - 28);
                    break;

                case "water":
                    item.play("water_anim");
                    item.setScale(2.2);
                    item.body.setSize(30, 0);
                    break;

                case "door":
                    item.setFrame(4);
                    item.setScale(1.54);
                    break;

                case "vacume":
                    item.play("vacume_anim");
                    item.setScale(1);
                    item.body.setSize(40, 70);
                    break;

                case "clothes":
                    item.setFrame(0);
                    item.setScale(1.6);
                    item.body.setSize(40, 40);
                    item.body.setOffset(0, item.height - 20);
                    break;

                case "fridge":
                    item.setFrame(8);
                    item.setScale(2.2);
                    item.body.setSize(30, 60);
                    break;

                case "starveCat":
                    item.play("starveCat_anim");
                    break;

                case "love1":
                case "love2":
                    item.destroy();
                    this.gameManager.timeLeft += 10;
                    this.gameManager.addHeart();
                    return;

            }

        });

        this.physics.add.overlap(this.player, this.collectables, this.collectItem, null, this);

    }

    showGrandmaHint() {
        let randomHint = Phaser.Utils.Array.GetRandom(this.hintList);
        this.grandmaSpeech.setText(randomHint).setVisible(true);
        this.time.delayedCall(5000, () => this.grandmaSpeech.setVisible(false));
    }

    handleLevelFailure() {
        if (this.timerEvent) this.timerEvent.destroy();
        this.gameManager.hearts -= 1;

        if (this.gameManager.hearts <= 0) {
            this.gameManager.hearts = 3; // Reset for fresh start
            this.scene.start("grandmahouse_lv1");
        } else {
            this.scene.restart(); // Retry LV3
        }
    }

    update() {

        this.player.body.setVelocity(0);
        let speed = this.registry.get('playerSpeed');

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
            this.player.anims.play("Helper-left", true);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
            this.player.anims.play("Helper-right", true);
        } else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
            this.player.anims.play("Helper-up", true);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
            this.player.anims.play("Helper-down", true);
        } else {
            this.player.anims.stop();
        }

    }/////////////////// end of update //////////////////////////////

    collectItem(player, item) {
        let ui = this.scene.get("UIScene");
        let msg = "";

        // Chores Task Logic
        switch (item.name) {
            case "door": item.setFrame(3); msg = "Ah, the door is locked now. Safety always first!"; break;
            case "starveCat": item.anims.stop(); item.setFrame(17); msg = "Aww... Oyen looks happy now!"; break;
            case "vacume": item.anims.stop(); item.setFrame(12); msg = "Vacuum is off! No more electricity waste!"; break;
            case "aircon": item.anims.stop(); msg = "Ahh... the aircon is off! No more electricity waste!"; break;
            case "clothes": msg = "Ah! My dress... just what I wanted for tonight!"; break;
            case "tv": item.anims.stop(); msg = "Wah, finally you found the TV remote! It's off now."; break;
            case "fridge": msg = "Ah... the beep sound is the fridge door...\nThat sound is gone now. Much better!"; break;
            case "water": item.anims.stop(); msg = "Good, no more dripping water sound. Water saved !"; break;
            case "love1":
            case "love2":
                item.destroy();
                this.timeLeft += 10; // Bonus time
                this.gameManager.hearts = Math.min(this.gameManager.hearts + 1, 3);
                if (ui) ui.updateHearts(this.gameManager.hearts);
                return;
        }

        // Logic for specialized items that stay in the scene vs disappeared items
        if (["door", "starveCat", "vacume"].includes(item.name)) {
            item.body.enable = false; // Disable physics but keep it visible
        } else {
            item.destroy();
        }

        if (msg !== "") {
            this.tasksCompleted++;
            if (ui) {
                ui.showDialogue(msg);
                this.time.delayedCall(3000, () => ui.hideDialogue());
            }
        }

        // --- WIN CONDITION TRIGGER ---
        if (this.tasksCompleted >= this.totalTasks) {
            if (this.gameManager.timerEvent) {
                this.gameManager.timerEvent.remove();
            }

            if (ui) {
                ui.showDialogue("We did it! The house is perfect. Thank you for your help!");
                this.time.delayedCall(3500, () => {
                    this.scene.stop("UIScene"); // Remove hearts/timer
                    this.scene.start('WinScene'); // Go to your new WinPage
                });
            }
        }
    }
}//////////// end of class world ////////////////////////