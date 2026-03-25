class cityHub extends Phaser.Scene {
    constructor() {
        super({ key: "cityHub" });
    }

    init(data) {
        this.player = data.player;
        this.inventory = data.inventory;
        this.hasWarnedPlayer = false;
    }

    preload() {
        this.load.tilemapTiledJSON("cityHub", "assets/GN_city.tmj");
        this.load.image("CitylandImg", "assets/City_32x32.png");
        this.load.image("CityPropImg", "assets/CityProp_32x32.png");
        this.load.image("CityShoppingImg", "assets/Shopping_32x32.png");
        this.load.image("GrandmaHouseImg", "assets/GN_House.png");
    }

    create() {
        if (!this.scene.isActive("UIScene")) {
            this.scene.launch("UIScene");
        }


        // Delay the UI setup slightly to give UIScene time to run its create()
        this.time.delayedCall(50, () => {
            let ui = this.scene.get("UIScene");
            if (ui && ui.timerText) { // Check if timerText actually exists
                ui.hideDialogue(); 
                ui.setInventoryMode(3); 
                ui.timerText.setVisible(false);
                if (ui.timerUI) ui.timerUI.setVisible(false);
            }
        });

        // ======================== map ========================
        let map = this.make.tilemap({ key: "cityHub" });
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        let CitylandTiles = map.addTilesetImage("CityLand", "CitylandImg");
        let CityPropTiles = map.addTilesetImage("CityProp", "CityPropImg");
        let CityShoppingTiles = map.addTilesetImage("CityShopping", "CityShoppingImg");
        let GN_HouseTiles = map.addTilesetImage("GN_House", "GrandmaHouseImg");
        let tilesArray = [CitylandTiles, CityPropTiles, CityShoppingTiles, GN_HouseTiles];

        map.createLayer("c_land", tilesArray, 0, 0);
        map.createLayer("c_building", tilesArray, 0, 0);
        let c_prop = map.createLayer("c_prop", tilesArray, 0, 0);
        c_prop.setPosition(32, 0);

        let start = map.findObject("Object_cityHub_1", (obj) => obj.name === "Helper");
        this.player = this.physics.add.sprite(start.x, start.y, 'Helper');
        this.player.setCollideWorldBounds(true);

        let grandmaObj = map.findObject("Object_cityHub_1", (obj) => obj.name === "Grandma");
        this.grandma = this.physics.add.sprite(grandmaObj.x, grandmaObj.y, "Grandma");

        this.playerPositions = [];
        this.followSpeed = this.registry.get('grandmaFollowSpeed') || 150;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {

        let ui = this.scene.get("UIScene");
        
        this.player.body.setVelocity(0);
        let speed = 280;

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

        // Grandma Follow Logic
        let last = this.playerPositions[this.playerPositions.length - 1];
        if (!last || this.player.x !== last.x || this.player.y !== last.y) {
            this.playerPositions.push({ x: this.player.x, y: this.player.y });
        }

        if (this.playerPositions.length > 5) {
            let target = this.playerPositions[0];
            let distance = Phaser.Math.Distance.Between(this.grandma.x, this.grandma.y, target.x, target.y);

            if (distance > 24) { //gap player
                this.physics.moveTo(this.grandma, target.x, target.y, this.followSpeed);

                // Grandma Animation
                let vel = this.grandma.body.velocity;
                if (Math.abs(vel.x) > Math.abs(vel.y)) {
                    if (vel.x > 0) this.grandma.anims.play("Grandma-right", true);
                    else this.grandma.anims.play("Grandma-left", true);
                } else {
                    if (vel.y > 0) this.grandma.anims.play("Grandma-down", true);
                    else this.grandma.anims.play("Grandma-up", true);
                }
            } else {
                this.grandma.body.setVelocity(0);
                this.grandma.anims.stop();
            }
            if (distance < 24) this.playerPositions.shift();
        }

        // --- TOO FAR Warning ---
        let Ui = this.scene.get("UIScene");
        
        // Calculate the current gap between 2 mian charcter
        let currentGap = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.grandma.x, this.grandma.y);

        // If gap > 330 px
        if (currentGap > 350 && !this.hasWarnedPlayer) {
            if (ui) {
                const grandmaMessages = [
                    "Wait for me, dear! My old legs can't keep up!",
                    "Slow down, young one! I'm not as fast as I used to be.",
                    "Don't leave me too far behind, I'll lost you!",
                    "Where are you rushing, the market isn't gonna run away!",
                    "Hold on! Let me catch my breath for a moment."
                ];
                let randomMsg = Phaser.Utils.Array.GetRandom(grandmaMessages);
                ui.showDialogue(randomMsg);
                
                this.hasWarnedPlayer = true;
                this.time.delayedCall(3000, () => { ui.hideDialogue(); });
                //Reset every 6
                this.time.delayedCall(6000, () => { this.hasWarnedPlayer = false; });
            }
        }

       // ========= Market Entry ((Both Player and Grandma must be in area)) =========
        const entryX_Min = 2760;
        const entryX_Max = 2900;
        const entryY_Min = 890;
        const entryY_Max = 1030;

        let playerInArea = (this.player.x > entryX_Min && this.player.x < entryX_Max && this.player.y > entryY_Min && this.player.y < entryY_Max);
        let grandmaInArea = (this.grandma.x > entryX_Min && this.grandma.x < entryX_Max && this.grandma.y > entryY_Min && this.grandma.y < entryY_Max);

        if (playerInArea) {
            if (grandmaInArea) {
                // STOP the current scene and launch the HTP scene
                // Passing the inventory so it carries over to the market later
                this.scene.start("lv2_htp", { inventory: this.inventory }); 
            } else {
                // Specific message for the door if they aren't together
                if (!this.hasWarnedPlayer && ui) {
                    ui.showDialogue("Wait for me at the door, dear! We should go in together.");
                    this.hasWarnedPlayer = true;
                    this.time.delayedCall(3000, () => { if(ui) ui.hideDialogue(); });
                    this.time.delayedCall(6000, () => { this.hasWarnedPlayer = false; });
                }
            }
        }
    }
}