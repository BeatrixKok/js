class howToPlayScene extends Phaser.Scene {

constructor(){
super({ key: "howToPlayScene" })
}

preload() {
this.load.image("htpBG", "assets/Main_HTP.jpg");
}

create(){

const centerX = this.cameras.main.width / 2;
const centerY = this.cameras.main.height / 2;

this.add.image(centerX, centerY, "htpBG");

        
        this.add.text(centerX, 110, "HOW TO PLAY", {
            fontFamily: "Determination",
            fontSize: "40px",
            fill: "#ffffff"
        }).setOrigin(0.5);

        
        this.add.text(224, 206, "Move: Arrow Keys", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        }).setOrigin(0.5);

       
        this.add.text(520, 180, " Explore   >   Collect   >   Complete Task", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "#ffffaa"
        }).setOrigin(0.5);

    
        this.add.text(452, 238, "Hearts  =  Grandma Stress Level", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        });

        this.add.text(452, 300, "Wrong item  >  -1 Hearts / -5s Time", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffaaaa"
        });

        this.add.text(578, 361, "0 Hearts  =  Restart Game", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        });

        this.add.text(426, 420, "0:00           Time out = Restart Level", {
            fontFamily: "Determination",
            fontSize: "18px",
            fill: "#ffffff"
        });

    
        this.add.text(232, 410, "Tips: \n- Read carefully\n- Remember instructions\n- Be patient", {
            fontFamily: "Determination",
            fontSize: "14px",
            fill: "#dddddd"
        }).setOrigin(0.5);

        this.add.text(880, 520, "Press SPACE to Start", {
            fontFamily: "Determination",
            fontSize: "16px",
            fill: "hsl(183, 100%, 50%)"
        }).setOrigin(1);

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.on("down", () => {
            //lv1_htp
            this.scene.start("lv1_htp"); 
        });
    }
}