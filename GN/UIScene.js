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
    const UI_DEPTH = 1000;

    // --- Top UI Elements ---
    this.lifeBox = this.add.image(100, 40, "lifeBox").setScrollFactor(0).setDepth(UI_DEPTH);
    this.heartIcons = [];
    for (let i = 0; i < 3; i++) {
      let heart = this.add.image(54 + i * 45, 40, "heart").setScrollFactor(0).setDepth(UI_DEPTH + 1).setScale(1.4);
      this.heartIcons.push(heart);
    }
    this.timerUI = this.add.image(900, 40, "timerUI").setScrollFactor(0).setDepth(UI_DEPTH);
    this.timerText = this.add.text(900, 40, "02:00", { font: "24px Arial", fill: "#ffffff" }).setScrollFactor(0).setDepth(UI_DEPTH + 1).setOrigin(0.5);

    // --- Inventory Backgrounds ---
    this.inventoryUI = this.add.image(100, 470, "inventoryUI").setScrollFactor(0).setDepth(UI_DEPTH);
    this.inventoryUI2 = this.add.image(100, 410, "inventoryUI2").setScrollFactor(0).setDepth(UI_DEPTH).setVisible(false);

    // --- Inventory Titles ---
    // Level 1 Title
    this.inventoryTitle = this.add.text(61, 391, "Inventory", {
      font: "18px Arial", fill: "#ffffff", fontStyle: "bold", stroke: "#000000", strokeThickness: 4
    }).setScrollFactor(0).setDepth(UI_DEPTH + 1);

    // Level 2 Title (At y: 300)
    this.inventoryTitle2 = this.add.text(61, 274, "Inventory", {
      font: "18px Arial", fill: "#ffffff", fontStyle: "bold", stroke: "#000000", strokeThickness: 4
    }).setScrollFactor(0).setDepth(UI_DEPTH + 1).setVisible(false);

    // --- Grandma Dialogue Elements ---
    this.dialogBox = this.add.image(532, 470, "dialogBox").setScrollFactor(0).setDepth(UI_DEPTH + 2).setVisible(false);
    this.dialogText = this.add.text(220, 460, "", { font: "20px Arial", fill: "#000000", wordWrap: { width: 650 } }).setScrollFactor(0).setDepth(UI_DEPTH + 3).setVisible(false);
    this.grandmaIcon = this.add.image(920, 456, "grandmaIcon").setScrollFactor(0).setDepth(UI_DEPTH + 3).setVisible(false);
    this.dialogBoxTitle = this.add.text(248, 395, "Grandma :", { font: "24px Arial", fill: "#ffffff", fontStyle: "bold", stroke: "#000000", strokeThickness: 4 }).setScrollFactor(0).setDepth(UI_DEPTH + 3).setVisible(false);

    // --- Slots Definition ---
    this.inventorySlots_lv1 = [{ x: 70, y: 456 }, { x: 131, y: 456 }, { x: 72, y: 510 }];
    this.inventorySlots_lv2 = [{ x: 70, y: 341 }, { x: 131, y: 341 }, { x: 70, y: 397 }, { x: 131, y: 397 }, { x: 70, y: 455 }, { x: 131, y: 454 }, { x: 71, y: 510 }, { x: 133, y: 510 }];

    // Initial slot setup
    this.currentSlots = this.inventorySlots_lv1;
  }

  setInventoryMode(level) {
    this.currentLevel = level;

    // Safety check: If the UI elements don't exist yet, stop here
    if (!this.inventoryUI || !this.timerText) return;

    // Hide/Show Level 1 Inventory
    const isLv1 = (level === 1);
    this.inventoryUI.setVisible(isLv1);
    this.inventoryTitle.setVisible(isLv1);

    // Hide/Show Level 2 Inventory
    const isLv2 = (level === 2);
    this.inventoryUI2.setVisible(isLv2);
    this.inventoryTitle2.setVisible(isLv2);

    // If level is 3 or cityHub (0 or 3), clear icons
    if (level === 3 || level === 0) {
      if (this.renderedIcons) {
          this.renderedIcons.forEach(icon => icon.destroy());
          this.renderedIcons = [];
      }
    } else {
      this.currentSlots = (level === 1) ? this.inventorySlots_lv1 : this.inventorySlots_lv2;
      this.refreshFromManager();
    }
  }

  addInventoryItem(itemName) {
    let gm = this.registry.get("gameManager");
    if (gm) gm.addItem(itemName);
  }

  refreshFromManager() {
    let gm = this.registry.get("gameManager");
    if (gm) this.renderInventory(gm.inventory);
  }

  renderInventory(inventory) {
    this.renderedIcons.forEach(icon => icon.destroy());
    this.renderedIcons = [];

    inventory.forEach((itemName, index) => {
      let slot = this.currentSlots[index];
      if (!slot) return;

      let icon;
      if (this.currentLevel === 1) {
        let frames = { phone: 0, spect: 1, n1: 2, n2: 4, n3: 6, n4: 8, n5: 10, n6: 12 };
        icon = this.add.image(slot.x, slot.y, "Collectable_lv1", frames[itemName] ?? 0);
      } else {
        icon = this.add.sprite(slot.x, slot.y, "Collectable_lv2");
        if (this.anims.exists(itemName + "_anim")) icon.play(itemName + "_anim");
      }

      if (icon) {
        icon.setScrollFactor(0).setDepth(1200).setScale(1.2);
        this.renderedIcons.push(icon);
      }
    });
  }

  updateHearts(hp) {
    if (this.heartIcons) {
      this.heartIcons.forEach((img, i) => img.setTexture(i < hp ? "heart" : "nullHeart"));
    }
  }

  showDialogue(text) {
   
    if (!this.dialogBox || !this.dialogText || !this.grandmaIcon || !this.dialogBoxTitle) {
        console.warn("UIScene: Dialogue elements not ready yet!");
        return;
    }

    this.dialogBox.setVisible(true);
    this.dialogText.setVisible(true).setText(text);
    this.grandmaIcon.setVisible(true);
    this.dialogBoxTitle.setVisible(true);
  }

  hideDialogue() {

    if (this.dialogBox) this.dialogBox.setVisible(false);
    if (this.dialogText) this.dialogText.setVisible(false);
    if (this.grandmaIcon) this.grandmaIcon.setVisible(false);
    if (this.dialogBoxTitle) this.dialogBoxTitle.setVisible(false);
  }

clearInventory() {
    // Delete current visual icons
    if (this.renderedIcons) {
      this.renderedIcons.forEach(icon => icon.destroy());
      this.renderedIcons = [];
    }

    // Tell GameManager empty data array
    let gm = this.registry.get("gameManager");
    if (gm) {
      gm.inventory = []; // Empty the actual data list
    }
    
    console.log("UI and Data Inventory Cleared");
  }

}