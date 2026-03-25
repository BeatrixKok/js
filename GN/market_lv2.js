class market_lv2 extends Phaser.Scene {

  constructor() {
    super({ key: 'market_lv2' });
    this.gameStarted = false;
    this.timeLeft = 150;
    this.timerEvent = null;
    this.isFinished = false;
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {

    //eexported JSON map file
    this.load.tilemapTiledJSON("market_lv2", "assets/GN_market.tmj");

    this.load.image("MarketCLandImg", "assets/City_32x32.png");
    this.load.image("MarketLandImg", "assets/Room_Builder_32x32.png");
    this.load.image("MarketPropImg", "assets/Market_32x32.png");
    this.load.spritesheet('Collectable_lv2', 'assets/Collectable_lv2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('Npc_lv2', 'assets/Npc_lv2.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('love', 'assets/loveAni.png', { frameWidth: 32, frameHeight: 32 });

    this.gameManager = new GameManager(this);
    this.gameManager.preloadAssets();
  }


  create() {

    if (this.registry.get("gameManager")) {
      this.gameManager = this.registry.get("gameManager");
    } else {
      this.gameManager = new GameManager(this);
      this.registry.set("gameManager", this.gameManager);
    }

    this.timeLeft = 150;
    this.gameStarted = false;
    this.timerEvent = null;
    this.isFinished = false;

    // UI Syncing
    this.scene.launch("UIScene");
    this.time.delayedCall(150, () => {
      let ui = this.scene.get("UIScene");
      if (ui) {
        ui.setInventoryMode(2);
        ui.updateHearts(this.gameManager.hearts);
        ui.timerText.setVisible(true);

        //Clear old item in invetory
        if (ui.clearInventory) ui.clearInventory();

        let min = Math.floor(this.timeLeft / 60);
        let sec = this.timeLeft % 60;
        ui.timerText.setText(
          String(min).padStart(2, "0") + ":" +
          String(sec).padStart(2, "0")
        );
      }
    });

    // ======================== map ========================

    // Create the map from main
    let map = this.make.tilemap({ key: "market_lv2", });

    //Limit Player from leaving game area
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // ========= tiles =========
    //Add any text to the game

    let MarketCLandTiles = map.addTilesetImage("MarketCLand", "MarketCLandImg");
    let MarketLandTiles = map.addTilesetImage("MarketLand", "MarketLandImg");
    let MarketPropTiles = map.addTilesetImage("MarketProp", "MarketPropImg");

    let tilesArray = [MarketCLandTiles, MarketLandTiles, MarketPropTiles]

    map.createLayer("M_land", tilesArray, 0, 0);
    map.createLayer("M_wall", tilesArray, 0, 0);
    map.createLayer("M_rack", tilesArray, 0, 0);
    map.createLayer("M_prop", tilesArray, 0, 0);
    map.createLayer("M_prop2", tilesArray, 0, 0);
    map.createLayer("M_glass", tilesArray, 0, 0);

    //Animation_Npc
    if (!this.anims.exists("w1_anim")) {
      this.anims.create({ key: "w1_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "w2_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 2, end: 3 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "w3_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 4, end: 5 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "w4_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 6, end: 7 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "m1_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 8, end: 9 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "m2_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 10, end: 11 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "m3_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 12, end: 13 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "m4_anim", frames: this.anims.generateFrameNumbers("Npc_lv2", { start: 14, end: 15 }), frameRate: 3, repeat: -1 });
    }

    //Animation_vegetables & fresh
    if (!this.anims.exists("pakchoy_anim")) {

      this.anims.create({ key: "pakchoy_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "garlic_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 2, end: 3 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "chilli_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 8, end: 9 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "onion_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 32, end: 33 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "broccoli_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 34, end: 35 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "carrot_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 26, end: 27 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "pumpkin_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 22, end: 23 }), frameRate: 3, repeat: -1 });

      //Animation_meat & seafood
      this.anims.create({ key: "chicken_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 6, end: 7 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "shrimps_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 12, end: 13 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "bluefish_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 16, end: 17 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "redfish_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 20, end: 21 }), frameRate: 3, repeat: -1 });

      //Animation_dry & cooking items
      this.anims.create({ key: "bread_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 18, end: 19 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "egg_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 24, end: 25 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "oil_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 4, end: 5 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "salt_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 10, end: 11 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "rice_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 14, end: 15 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "peanutbutter_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 40, end: 41 }), frameRate: 3, repeat: -1 });

      //Animation_drinks
      this.anims.create({ key: "milk_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 28, end: 29 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "coke_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 30, end: 31 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "pepsi_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 42, end: 43 }), frameRate: 3, repeat: -1 });

      //Animation_others
      this.anims.create({ key: "clorox_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 38, end: 39 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "spray_anim", frames: this.anims.generateFrameNumbers("Collectable_lv2", { start: 36, end: 37 }), frameRate: 3, repeat: -1 });

    }

    //animation_love
    if (!this.anims.exists("love_anim")) {
      this.anims.create({
        key: "love_anim",
        frames: this.anims.generateFrameNumbers("love", { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      });
    }

    //Ui Text
    this.targetText = this.add.text(20, this.cameras.main.height - 40, "", {
      font: "20px Arial",
      fill: "#ffff00"
    }).setScrollFactor(0).setDepth(100);
    this.targetText.setVisible(false);

    // ========= load player =========
    let start = map.findObject("Character_lv2", (obj) => obj.name === "Helper");
    console.log(start)
    this.player = this.physics.add.sprite(start.x, start.y, 'Helper')
    //Stay within map boundry
    this.player.setCollideWorldBounds(true);
    //Create the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();
    //Camera follow player
    this.cameras.main.startFollow(this.player, true);
    //Camera stop at edge
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.targetText.setVisible(false);

    // ========= load grandma =========
    this.grandma = this.physics.add.sprite(0, 0, "Grandma");
    this.grandma.setVisible(false); //no show
    this.grandma.body.setImmovable(true);

    this.physics.add.overlap(
      this.player,
      this.grandma,
      this.talkToGrandma,
      null,
      this
    );

    //Exclamation mark on Grandma
    this.exclaim = this.add.text(0, 0, "!", {
      font: "30px Arial",
      fill: "#ffffff",
      fontStyle: "bold"
    });
    this.exclaim.setVisible(false);

    this.grandmaDialogs = [
      "Last time this place was very different...",
      "So hard to use phone now...",
      "Young people nowadays all very busy...",
      "So complicated to buy stuff now...?"
    ];

    this.grandmaSpeech = this.add.text(0, 0, "", {
      font: "14px Arial",
      fill: "#ffffff",
      backgroundColor: "#00000072", // semi-transparent black background
      padding: { x: 5, y: 5 },
      align: "center",
      wordWrap: { width: 150 }
    }).setOrigin(0.5, 1).setDepth(200).setVisible(false);

    // ========= load Npc =========
    this.npcs = [];

    const npcNames = ["w1", "w2", "w3", "w4", "m1", "m2", "m3", "m4"];

    npcNames.forEach(name => {
      let npcObj = map.findObject("Npc_lv2", obj => obj.name === name);
      let npc = this.physics.add.sprite(npcObj.x, npcObj.y, "Npc_lv2");
      npc.setScale(1.1);
      npc.play(name + "_anim");
      this.npcs.push(npc);
    });

    // What will collider witg what layers
    //this.physics.add.collider(mapLayer, this.player);

    //Collision
    //H_collision.setCollisionByProperty({ collides: true });
    //this.physics.add.collider(this.player, H_collision);
    //H_collision.setVisible(false);


    // ======================== Collectables ========================
    this.collectables = this.physics.add.group();
    let items = map.getObjectLayer("Object_lv2").objects;
    items.forEach(obj => {

      let item

      // Love
      if (obj.name === "love1" || obj.name === "love2") {

        item = this.collectables.create(obj.x, obj.y, "love").setOrigin(0, 1)
        item.play("love_anim")

      } else {

        item = this.collectables.create(obj.x, obj.y, "Collectable_lv2").setOrigin(0, 1)

      }

      item.name = obj.name


      switch (obj.name) {

        case "pakchoy": item.play("pakchoy_anim"); break;
        case "garlic": item.play("garlic_anim"); break;
        case "chilli": item.play("chilli_anim"); break;
        case "onion": item.play("onion_anim"); break;
        case "broccoli": item.play("broccoli_anim"); break;
        case "carrot": item.play("carrot_anim"); break;
        case "pumpkin": item.play("pumpkin_anim"); break;

        case "chicken": item.play("chicken_anim"); break;
        case "shrimps": item.play("shrimps_anim"); break;
        case "bluefish": item.play("bluefish_anim"); break;
        case "redfish": item.play("redfish_anim"); break;

        case "bread": item.play("bread_anim"); break;
        case "egg": item.play("egg_anim"); break;
        case "oil": item.play("oil_anim"); break;
        case "salt": item.play("salt_anim"); break;
        case "rice": item.play("rice_anim"); break;
        case "peanutbutter": item.play("peanutbutter_anim"); break;

        case "milk": item.play("milk_anim"); break;
        case "coke": item.play("coke_anim"); break;
        case "pepsi": item.play("pepsi_anim"); break;

        case "clorox": item.play("clorox_anim"); break;
        case "spray": item.play("spray_anim"); break;
      }
    });

    this.physics.add.overlap(
      this.player,
      this.collectables,
      this.collectItem,
      null,
      this
    );


    // ======================== Round System ========================
    this.round = 1; // Start at Round 1
    this.maxRounds = 4;
    this.isFinished = false;
    this.currentTargets = [];
    this.targetsCollected = 0;

    this.availableItems = [
      "pakchoy", "garlic", "oil", "chicken", "chilli",
      "salt", "shrimps", "rice", "bluefish", "bread",
      "redfish", "pumpkin", "egg", "carrot", "milk",
      "coke", "onion", "broccoli", "spray", "clorox",
      "peanutbutter", "pepsi"
    ];
    this.spawnGrandma();
  }

  // ================= Timer =================
  startTimer() {
    if (this.timerEvent) return;
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (!this.gameStarted || this.isFinished) return;
        this.timeLeft--;
        let min = Math.floor(this.timeLeft / 60);
        let sec = this.timeLeft % 60;
        let ui = this.scene.get("UIScene");
        if (ui && ui.timerText) ui.timerText.setText(String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0"));
        if (this.timeLeft <= 0) this.handleLevelFailure();
      }
    });
  }


  /// ================= Restart =================
  handleLevelFailure() {
    this.isFinished = true; // Mark finish so timer stops/ keep update

    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = null;
    }

    // Call the Manager's showFail
    this.gameManager.showFail();
  }


  // ================= Talk to Grandma =================
  talkToGrandma() {
    if (!this.grandma.visible) return;

    // FINAL MESSAGE: After 8 items are found
    if (this.isFinished) {
      let ui = this.scene.get("UIScene");
      ui.showDialogue("Thank you! We have everything.\nLet's go back home to prepare dinner!");

      // Stop the timer since the mission is over
      if (this.timerEvent) this.timerEvent.destroy();

      this.time.delayedCall(4000, () => {
        ui.hideDialogue();
      });
      return;
    }

    // START GAME: First talk
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTimer();
    }

    if (this.currentTargets.length !== 0) return;

    this.generateTargets();
    this.targetText.setVisible(true);
    this.exclaim.setVisible(false);
  }


  // ================= Round control =================
  startNewRound() {
    this.round++;
    if (this.round > this.maxRounds) {
      // Mission Complete: Use GameManager to show the 1024x576 success image
      this.gameManager.showSuccess(2, "lv3_htp");
      return;
    }
    this.targetsCollected = 0;
    this.currentTargets = [];
    this.spawnGrandma();
  }


  spawnGrandma() {

    let npc = Phaser.Utils.Array.GetRandom(this.npcs);

    this.grandma.setPosition(npc.x + 40, npc.y);
    this.grandma.setVisible(true);

    // Update Exclamation Mark
    this.exclaim.setPosition(
      this.grandma.x,
      this.grandma.y - 50
    );
    this.exclaim.setVisible(true);

    // --- Grandma CitChat ---
    let randomLine = Phaser.Utils.Array.GetRandom(this.grandmaDialogs);
    this.grandmaSpeech.setText(randomLine);
    this.grandmaSpeech.setPosition(this.grandma.x, this.grandma.y - 50); // Higher than "!"
    this.grandmaSpeech.setVisible(true);
  }


  generateTargets() {

    // Shuffle first
    Phaser.Utils.Array.Shuffle(this.availableItems);

    // Take first 2
    this.currentTargets = this.availableItems.slice(0, 2);

    //Remove to no repeat
    this.availableItems = this.availableItems.filter(
      item => !this.currentTargets.includes(item)
    );

    let ui = this.scene.get("UIScene")

    ui.showDialogue(
      "I needs " +
      this.currentTargets[0].toUpperCase() +
      " & " +
      this.currentTargets[1].toUpperCase()
    );

    // 4 sec
    this.time.delayedCall(4000, () => {
      ui.dialogBox.setVisible(false)
      ui.dialogText.setVisible(false)
      ui.grandmaIcon.setVisible(false)
      ui.dialogBoxTitle.setVisible(false)
    })

  }

  // ======================== Update ========================
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

    // keep ! above grandma
    if (this.grandma.visible) {
      this.exclaim.setPosition(this.grandma.x, this.grandma.y - 50);
    }

  } /////////////////// end of update //////////////////////////////

  // ======================== Collect System ========================

  collectItem(player, item) {
    if (!this.gameStarted || !item.name) return;

    let ui = this.scene.get("UIScene");

    // ================= Heart +10 sec =================
    if (item.name === "love1" || item.name === "love2") {
      item.disableBody(true, true); // Love disappears when used
      this.timeLeft += 10;
      ui.showDialogue("Heart found! +10 seconds added.");
      this.time.delayedCall(2000, () => { ui.hideDialogue(); });
      return;
    }

    // ================= Correct Target =================
    if (this.currentTargets.includes(item.name)) {
      item.disableBody(true, true); // Correct items disappear (they go in the bag)
      ui.addInventoryItem(item.name);
      this.targetsCollected++;

      if (this.targetsCollected >= 2) {
        ui.showDialogue("Great! You got both. Come, I'll tell you what i need more");
        this.currentTargets = [];
        this.targetText.setVisible(false);
        this.grandma.setVisible(false);
        this.exclaim.setVisible(false);

        this.time.delayedCall(2000, () => {
          ui.hideDialogue();
          this.startNewRound();
        });
      }
    }
    // ================= Wrong Item -10 sec =================
    else {
      // Stop collision
      item.body.enable = false;

      this.timeLeft -= 10;
      this.cameras.main.flash(0, 0, 0, 0);

      ui.showDialogue("Thanks you, but I don't need this... \nLet's try again -10 seconds.");

      // Grey
      item.setTint(0x808080);

      // Reactivate the item after 3 seconds
      this.time.delayedCall(3000, () => {
        if (item && item.body) {
          item.body.enable = true;
          item.clearTint(); // Back to original color
        }
      });

      // Hide the dialogue after 2 seconds
      this.time.delayedCall(2000, () => {
        if (ui.hideDialogue) {
          ui.hideDialogue();
        }
      });
    }
  }
} //////////// end of class world ///////////////////////