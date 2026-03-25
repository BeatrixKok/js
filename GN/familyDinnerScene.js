class familyDinnerScene extends Phaser.Scene {

constructor(){
super({ key:"familyDinnerScene" })
}

create(){

this.cameras.main.setBackgroundColor("#000000")

this.add.text(512,200,
"Family Dinner",
{
font:"40px Arial",
fill:"#ffffff"
}).setOrigin(0.5)

this.add.text(512,300,
"The whole family arrives for dinner.\n\nGrandma smiles happily.",
{
font:"24px Arial",
fill:"#dddddd",
align:"center"
}).setOrigin(0.5)

this.add.text(512,460,
"Press SPACE to continue",
{
font:"20px Arial",
fill:"#ffffaa"
}).setOrigin(0.5)

this.space = this.input.keyboard.addKey(
Phaser.Input.Keyboard.KeyCodes.SPACE
)

this.space.on("down",()=>{
this.scene.start("endingScene")
})

}

}