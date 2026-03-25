class gameOverScene extends Phaser.Scene {

constructor(){
super({ key: "gameOverScene" })
}

create(){

this.scene.stop("UIScene");

this.cameras.main.setBackgroundColor("#000000")

this.add.text(512,200,
"Game Over",
{
font:"36px Arial",
fill:"#ffffff"
}).setOrigin(0.5)

this.add.text(512,300,
"You have failed.......",
{
font:"24px Arial",
fill:"#dddddd",
align:"center"
}).setOrigin(0.5)

this.add.text(512,460,
"Press SPACE to main menu",
{
font:"20px Arial",
fill:"#ffffaa"
}).setOrigin(0.5)

this.space = this.input.keyboard.addKey(
Phaser.Input.Keyboard.KeyCodes.SPACE
)

this.space.on("down",()=>{
this.scene.start("titleScene")
})

}

}