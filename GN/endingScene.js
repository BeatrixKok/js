class endingScene extends Phaser.Scene {

constructor(){
super({ key:"endingScene" })
}

create(){

this.cameras.main.setBackgroundColor("#000000")

this.add.text(512,180,
"Family Dinner",
{
font:"40px Arial",
fill:"#ffffff"
}).setOrigin(0.5)

this.add.text(512,280,
"Later that evening...\n\nGrandma sends a photo\nin the family WhatsApp group.",
{
font:"24px Arial",
fill:"#dddddd",
align:"center"
}).setOrigin(0.5)

this.add.text(512,420,
"Connection is the best update.",
{
font:"28px Arial",
fill:"#ffffaa"
}).setOrigin(0.5)

this.add.text(512,500,
"Press SPACE to restart",
{
font:"20px Arial",
fill:"#aaaaaa"
}).setOrigin(0.5)


this.space = this.input.keyboard.addKey(
Phaser.Input.Keyboard.KeyCodes.SPACE
)

this.space.on("down",()=>{
this.scene.start("titleScene")
})

}

}