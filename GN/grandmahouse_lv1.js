class grandmahouse_lv1 extends Phaser.Scene {
  constructor() {
    super({
      key: "grandmahouse_lv1",
    });

    // Put global variable here
  }

  // incoming data from scene below
  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {
    this.load.tilemapTiledJSON("grandmahouse", "assets/GN_house.tmj");
    this.load.image("HouselandImg", "assets/Room_Builder_32x32.png");
    this.load.image("HouseGeneralImg", "assets/General_32x32.png");
    this.load.image("HouseClandImg", "assets/City_32x32.png");
    this.load.image("HouseBedRImg", "assets/4_Bedroom_32x32.png");
    this.load.image("HouseBathRImg", "assets/3_Bathroom_32x32.png");
    this.load.spritesheet('Collectable_lv1', 'assets/Collectable_lv1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('cat', 'assets/cat.png', { frameWidth: 20, frameHeight: 14 });
    this.load.spritesheet('love', 'assets/loveAni.png', { frameWidth: 32, frameHeight: 32 });

    //Audio
    this.load.audio('correct', 'assets/soundEffect_correctitem.mp3');
    this.load.audio('wrong', 'assets/soundEffect_wrongitem.mp3');
    
    // Only preload assets if manager doesn't exist yet
    if (!this.registry.get("gameManager")) {
        let tempManager = new GameManager(this);
        tempManager.preloadAssets();
    }
  }

  create() {

    if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
    }

    // --- State Reset ---
    this.phoneFound = false;
    this.glassesFound = false;
    this.passwordFound = false;
    this.correctNote = "n4";
    this.playerPositions = [];

    // --- GameManager Setup (The Bug Fix) ---
    this.gameManager = this.registry.get("gameManager");
    if (!this.gameManager) {
        this.gameManager = new GameManager(this);
        this.registry.set("gameManager", this.gameManager);
    } else {
        this.gameManager.updateScene(this);
    }
    
    // Reset for Level 1 start
    this.gameManager.resetStats(); 

    // --- UI Setup ---
    if (!this.scene.isActive("UIScene")) {
        this.scene.launch("UIScene");
    }
    
    this.time.delayedCall(150, () => {
        let ui = this.scene.get("UIScene");
        if (ui) {
            ui.setInventoryMode(1);
            ui.updateHearts(this.gameManager.hearts);
            ui.showDialogue("I want to stay active with the family...\nCan you help me text them for a dinner today?");
            this.time.delayedCall(4000, () => ui.hideDialogue());
        }
    });

    // ======================== map ========================
    let map = this.make.tilemap({
      key: "grandmahouse",
    });

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    let houselandTiles = map.addTilesetImage("HouseLand", "HouselandImg");
    let housegGeneralTiles = map.addTilesetImage("HouseGeneral", "HouseGeneralImg");
    let houseClandTiles = map.addTilesetImage("HouseCLand", "HouseClandImg");
    let houseBedRTiles = map.addTilesetImage("HouseBedR", "HouseBedRImg");
    let houseBathRTiles = map.addTilesetImage("HouseBathR", "HouseBathRImg");

    let tilesArray = [houselandTiles, housegGeneralTiles, houseClandTiles, houseBedRTiles, houseBathRTiles]

    map.createLayer("H_land", tilesArray, 0, 0);
    let H_wall = map.createLayer("H_wall", tilesArray, 0, 0);
    map.createLayer("H_landwallprop", tilesArray, 0, 0);
    let H_furniture = map.createLayer("H_furniture", tilesArray, 0, 0);
    let H_prop2 = map.createLayer("H_prop2", tilesArray, 0, 0);
    map.createLayer("H_prop3", tilesArray, 0, 0);

    this.scene.bringToTop('UIScene');

    //Collisions
    H_wall.setCollisionByExclusion(-1, true);
    H_furniture.setCollisionByExclusion(-1, true);
    H_prop2.setCollisionByExclusion(-1, true);

    //Animation_collectable-note
    if (!this.anims.exists("n1_anim")) {
      this.anims.create({ key: "n1_anim", frames: this.anims.generateFrameNumbers("Collectable_lv1", { start: 2, end: 3 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "n2_anim", frames: this.anims.generateFrameNumbers("Collectable_lv1", { start: 4, end: 5 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "n3_anim", frames: this.anims.generateFrameNumbers("Collectable_lv1", { start: 6, end: 7 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "n4_anim", frames: this.anims.generateFrameNumbers("Collectable_lv1", { start: 8, end: 9 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "n5_anim", frames: this.anims.generateFrameNumbers("Collectable_lv1", { start: 10, end: 11 }), frameRate: 3, repeat: -1 });
      this.anims.create({ key: "n6_anim", frames: this.anims.generateFrameNumbers("Collectable_lv1", { start: 12, end: 13 }), frameRate: 3, repeat: -1 });
    }

    //Animation_Cat
    if (!this.anims.exists("catanim")) {
      this.anims.create({
        key: "catanim",
        frames: this.anims.generateFrameNumbers("cat", { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
      });
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

    //Load player
    let start = map.findObject("Object_lv1", (obj) => obj.name === "Helper");
    this.player = this.physics.add.sprite(start.x, start.y, 'Helper')
    this.player.setCollideWorldBounds(true);

    //Collision
    this.physics.add.collider(this.player, H_wall);
    this.physics.add.collider(this.player, H_prop2);
    this.physics.add.collider(this.player, H_furniture);

    //Load grandma
    let grandmaObj = map.findObject("Object_lv1", (obj) => obj.name === "Grandma");
    this.grandma = this.physics.add.sprite(grandmaObj.x, grandmaObj.y, "Grandma");

    this.playerPositions = [];

    this.followSpeed = this.registry.get('grandmaFollowSpeed');

    //Load cat
    let catObj = map.findObject("Object_lv1", obj => obj.name === "cat");
    this.cat = this.physics.add.sprite(catObj.x, catObj.y, "cat")
    this.cat.play("catanim");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //Set collectable by group
    this.collectables = this.physics.add.group();
    let items = map.getObjectLayer("Object_lv1").objects;

    items.forEach(obj => {

      if (
        obj.name !== "phone" &&
        obj.name !== "spect" &&
        obj.name !== "n1" &&
        obj.name !== "n2" &&
        obj.name !== "n3" &&
        obj.name !== "n4" &&
        obj.name !== "n5" &&
        obj.name !== "n6" &&
        obj.name !== "love" &&
        obj.name !== "love1" &&
        obj.name !== "love2"
      ) return;

      let item

      if (
        obj.name === "love1" ||
        obj.name === "love2"
      ) {
        item = this.collectables.create(obj.x, obj.y, "love").setOrigin(0, 1)
        item.play("love_anim")
      }
      else {
        item = this.collectables.create(obj.x, obj.y, "Collectable_lv1").setOrigin(0, 1)
      }

      item.name = obj.name

      switch (obj.name) {

        case "phone": item.setFrame(0); break;
        case "spect": item.setFrame(1); break;

        case "n1": item.play("n1_anim"); break;
        case "n2": item.play("n2_anim"); break;
        case "n3": item.play("n3_anim"); break;
        case "n4": item.play("n4_anim"); break;
        case "n5": item.play("n5_anim"); break;
        case "n6": item.play("n6_anim"); break;
      }

    });

    this.physics.add.overlap(this.player, this.collectables, this.collectItem, null, this);
    
    this.phoneFound = false;
    this.glassesFound = false;
    this.passwordFound = false;
    this.correctNote = "n4";
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

     //Record player position (for grandma to follow)
    let last = this.playerPositions[this.playerPositions.length - 1];

    if (!last || this.player.x !== last.x || this.player.y !== last.y) {
      this.playerPositions.push({ x: this.player.x, y: this.player.y });
    }

    //Follow player
    if (this.playerPositions.length > 5) {

      let target = this.playerPositions[0];

      let distance = Phaser.Math.Distance.Between(
        this.grandma.x,
        this.grandma.y,
        target.x,
        target.y
      );

      //Keep distand for grandma and player (avoid collapse)
      if (distance > 16) {
        this.physics.moveTo(this.grandma, target.x, target.y, this.followSpeed);
      }
      else {
        this.grandma.body.setVelocity(0);
      }

      if (distance < 16) {
        this.playerPositions.shift();
      }

      let velocity = this.grandma.body.velocity;

      if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
        if (velocity.x > 0) this.grandma.anims.play("Grandma-right", true);
        else this.grandma.anims.play("Grandma-left", true);
      }
      else if (Math.abs(velocity.y) > 0) {
        if (velocity.y > 0) this.grandma.anims.play("Grandma-down", true);
        else this.grandma.anims.play("Grandma-up", true);
      }

    }
    else {
      this.grandma.body.setVelocity(0);
      this.grandma.anims.stop();
    }

  } /////////////////// end of update //////////////////////////////

  collectItem(player, item) {
    if (!item.name) return;
    let ui = this.scene.get("UIScene");
    if (!ui) return; // Safety check
    
    item.disableBody(true, true);

    // ---- LOVE FOUND ---- (Plays 'correct' via addHeart)
    if (item.name.includes("love")) {
      ui.showDialogue("+1 Heats!");
      this.gameManager.addHeart(); 
      this.time.delayedCall(4000, () => { ui.hideDialogue(); });
      return;
    }

    // ---- PHONE FOUND ----
    if (item.name === "phone") {
      ui.showDialogue("Yeah My phone! You found it! Alwyas forgot where I put it...");
      ui.addInventoryItem(item.name);

      this.gameManager.collectCorrect();

      this.phoneFound = true;
      this.time.delayedCall(4000, () => { ui.hideDialogue(); });
      this.checkLevelComplete();
    }

    // ---- GLASSES FOUND ----
    if (item.name === "spect") {
      ui.showDialogue("You find my glsses! Now I can see clearly and help you.");
      ui.addInventoryItem(item.name);

      this.gameManager.collectCorrect();

      this.glassesFound = true;
      this.time.delayedCall(4000, () => { ui.hideDialogue(); });
      this.checkLevelComplete();
    }

    // ---- NOTE FOUND ----
    if (item.name.startsWith("n")) {
      if (item.name === this.correctNote) {
        ui.showDialogue("Yes! This is the note I needs.\nPhone Password: 5060");
        ui.addInventoryItem(item.name);
        
        this.gameManager.collectCorrect();

        this.passwordFound = true;
        this.time.delayedCall(4000, () => { ui.hideDialogue(); });
        this.checkLevelComplete();
      } else {
        const wrongNoteReactions = {
          "n1": "Eggs, Pakchoy, Carrot, Oil... This is not what I am looking for. -1 Hearts",
          "n2": "My baby girl birthday party, do not forget! Important also... but not now... -1 Hearts",
          "n3": "Doctor appointment this Thursday... Later... not this for now... -1 Hearts",
          "n5": "Bestie forever! But later... family now... -1 Hearts",
          "n6": "Oh ya! Oyen has to go check up! But not today... -1 Hearts"
        };

        let reaction = wrongNoteReactions[item.name] || "This is not the right note, dear.";
        ui.showDialogue(reaction);
        this.gameManager.loseHeart(); 
        
        // Wrong notes also disappear:
        this.time.delayedCall(4000, () => { ui.hideDialogue(); });
      }
    }

  } /////////////////// end of collect //////////////////////////////

  checkLevelComplete() {
    if (this.phoneFound && this.glassesFound && this.passwordFound) {
      let ui = this.scene.get("UIScene");

      ui.showDialogue("Grandma: Yes! This one!\nThank you.\nLet's send out the dinner invitation message!");

      this.time.delayedCall(1000, () => {
        ui.hideDialogue();
        // Call manager: Level 1 complete, go to cityHub
        this.gameManager.showSuccess(1, "cityHub"); 
      });
    }
  }
}