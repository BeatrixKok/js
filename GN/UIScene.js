class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene", active: false });
    this.renderedIcons = [];
    this.currentLevel = 1;
  }

  preload() {
    this.load.image("lifeBox", "assets/LifeBox.png");
    this.load.image("dialogBox", "assets/DialogBox.png");
    this.load.image("inventoryUI", "assets/Inventory_lv1.png");
    this.load.image("inventoryUI2", "assets/Inventory_lv2.png");
    this.load.image("heart", "assets/Heart.png");
    this.load.image("nullHeart", "assets/NullHeart.png");
    this.load.image("timerUI", "assets/Timer.png");
    this.load.image("grandmaIcon", "assets/GrandmaDialog.png");
  }

  create() {
    // Set a massive depth so UI is always on top of maps/players
    const UI_DEPTH = 5000;

    // --- HEALTH UI ---
    this.lifeBox = this.add.image(100, 40, "lifeBox").setScrollFactor(0).setDepth(UI_DEPTH);
    this.heartIcons = [];
    for (let i = 0; i < 3; i++) {
      let heart = this.add.image(54 + i * 45, 40, "heart")
        .setScrollFactor(0)
        .setDepth(UI_DEPTH + 1)
        .setScale(1.4);
      this.heartIcons.push(heart);
    }
    
    // --- TIMER UI ---
    this.timerUI = this.add.image(900, 40, "timerUI").setScrollFactor(0).setDepth(UI_DEPTH);
    this.timerText = this.add.text(900, 40, "00:00", { 
        fontFamily: "Determination",
            fontSize: "24px",
            fill: "#ffffff"
    }).setScrollFactor(0).setDepth(UI_DEPTH + 1).setOrigin(0.5);

    // --- INVENTORY UI (Level 1 & 2) ---
    this.inventoryUI = this.add.image(100, 470, "inventoryUI").setScrollFactor(0).setDepth(UI_DEPTH);
    this.inventoryUI2 = this.add.image(100, 410, "inventoryUI2").setScrollFactor(0).setDepth(UI_DEPTH).setVisible(false);

    this.inventoryTitle = this.add.text(52, 391, "Inventory", {
      fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff", fontStyle: "bold", stroke: "#000000", strokeThickness: 4
    }).setScrollFactor(0).setDepth(UI_DEPTH + 1);

    this.inventoryTitle2 = this.add.text(52, 272, "Inventory", {
      fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff", fontStyle: "bold", stroke: "#000000", strokeThickness: 4
    }).setScrollFactor(0).setDepth(UI_DEPTH + 1).setVisible(false);

    // --- DIALOGUE UI ---
    this.dialogBox = this.add.image(532, 470, "dialogBox").setScrollFactor(0).setDepth(UI_DEPTH + 10).setVisible(false);
    this.dialogText = this.add.text(224, 460, "", { 
        fontFamily: "Determination",
            fontSize: "20px",
            fill: "#2e0d0d" , wordWrap: { width: 650 } 
    }).setScrollFactor(0).setDepth(UI_DEPTH + 11).setVisible(false);
    
    this.grandmaIcon = this.add.image(920, 456, "grandmaIcon").setScrollFactor(0).setDepth(UI_DEPTH + 11).setVisible(false);
    
    this.dialogBoxTitle = this.add.text(248, 393, "Grandma :", { 
        fontFamily: "Determination",
            fontSize: "24px",
            fill: "#ffffff", stroke: "#000000", strokeThickness: 4 
    }).setScrollFactor(0).setDepth(UI_DEPTH + 11).setVisible(false);

    // --- SLOTS CONFIG ---
    this.inventorySlots_lv1 = [{ x: 70, y: 456 }, { x: 131, y: 456 }, { x: 72, y: 510 }];
    this.inventorySlots_lv2 = [
        { x: 70, y: 341 }, { x: 131, y: 341 }, 
        { x: 70, y: 397 }, { x: 131, y: 397 }, 
        { x: 70, y: 455 }, { x: 131, y: 454 }, 
        { x: 71, y: 510 }, { x: 133, y: 510 }
    ];
    this.currentSlots = this.inventorySlots_lv1;
  }

  // Use this in the create() of every level to set the right UI look
  setInventoryMode(level) {
    this.currentLevel = level;
    if (!this.inventoryUI) return;

    // Toggle Visibility based on Level
    this.inventoryUI.setVisible(level === 1);
    this.inventoryTitle.setVisible(level === 1);
    this.inventoryUI2.setVisible(level === 2);
    this.inventoryTitle2.setVisible(level === 2);

    // Show hearts in all levels except Title/Win (Level 0)
    const showStats = (level !== 0); 
    this.lifeBox.setVisible(showStats);
    this.heartIcons.forEach(h => h.setVisible(showStats));

    // Show Timer only in Level 2 and Level 3
    const showTimer = (level === 2 || level === 3);
    this.timerUI.setVisible(showTimer);
    this.timerText.setVisible(showTimer);

    if (level === 3 || level === 0) {
      this.clearIconsOnly();
    } else {
      this.currentSlots = (level === 1) ? this.inventorySlots_lv1 : this.inventorySlots_lv2;
      this.refreshFromManager();
    }
  }

  refreshFromManager() {
    let gm = this.registry.get("gameManager");
    if (gm && gm.inventory) {
      this.renderInventory(gm.inventory);
      this.updateHearts(gm.hearts);
    }
  }

  updateHearts(hp) {
    if (this.heartIcons) {
      this.heartIcons.forEach((img, i) => {
          if (img) img.setTexture(i < hp ? "heart" : "nullHeart");
      });
    }
  }

  addInventoryItem(itemName) {
    let gm = this.registry.get("gameManager");
    if (gm) {
        gm.inventory.push(itemName);
        this.renderInventory(gm.inventory);
    }
  }

  renderInventory(inventory) {
    this.clearIconsOnly();
    if (this.currentLevel === 3 || this.currentLevel === 0 || !inventory) return;

    inventory.forEach((itemName, index) => {
      let slot = this.currentSlots[index];
      if (!slot) return;

      let icon;
      if (this.currentLevel === 1) {
        let frames = { phone: 0, spect: 1, n1: 2, n2: 4, n3: 6, n4: 8, n5: 10, n6: 12 };
        icon = this.add.image(slot.x, slot.y, "Collectable_lv1", frames[itemName] ?? 0);
      } else {
        icon = this.add.sprite(slot.x, slot.y, "Collectable_lv2");
        if (this.anims.exists(itemName + "_anim")) {
            icon.play(itemName + "_anim");
        }
      }

      if (icon) {
        icon.setScrollFactor(0).setDepth(6000).setScale(1.2);
        this.renderedIcons.push(icon);
      }
    });
  }

  clearIconsOnly() {
    this.renderedIcons.forEach(icon => { if(icon) icon.destroy(); });
    this.renderedIcons = [];
  }

  clearInventory() {
    this.clearIconsOnly();
    let gm = this.registry.get("gameManager");
    if (gm) gm.inventory = [];
  }

  showDialogue(text) {
    // Debug fix: Check if UI elements are created before using them
    if (!this.dialogBox || !this.dialogText) {
      console.warn("UIScene: showDialogue called before UI was ready.");
      return;
    }
    
    this.dialogBox.setVisible(true);
    this.dialogText.setVisible(true).setText(text);
    this.grandmaIcon.setVisible(true);
    this.dialogBoxTitle.setVisible(true);
  }

  hideDialogue() {
    this.dialogBox.setVisible(false);
    this.dialogText.setVisible(false);
    this.grandmaIcon.setVisible(false);
    this.dialogBoxTitle.setVisible(false);
  }
}