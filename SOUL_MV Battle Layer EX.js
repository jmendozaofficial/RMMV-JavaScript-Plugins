/*:
* @plugindesc v1.0 Creates unlimited layer graphics and movement in your battle scenes.
* @author Soulpour777
*
* @help

SOUL_MV Battle Layer EX
Author: Soulpour777

Latest Stable Version 1.0

Plugin Description

This plugin will allow you to create and add unlimited layer graphics inside
your battle scene. This is the battle version of any Mapping Overlay you
can find for your maps. 

What can you add?

Unlimited Ground Layers
 - Singular Opacity

Unlimited Overlay Layers
 - Singular Opacity

Fog Layer
 - Singular Opacity

This means that any layer you wish can be added with this plugin.

Let us discuss the plugin commands necessary for this plugin:

I. For adding layers

addOverlayLayer x           where x is the name of the image you want to add as an OVERLAY layer.
addGroundLayer  x           where x is the name of the image you want to add as a GROUND layer.
addBattleFogLayer x         where x is the name of the image you want to add as a FOG layer.
addBlurPanoramaLayer x      where x is the name of the image you want to blur throughout the battle scene.

II. For controlling the layers

setup_battleback1 x y       where x is the horz scroll speed and y the vert scroll speed for battle back 1.
setup_battleback2 x y       where x is the horz scroll speed and y the vert scroll speed for battle back 2.

III. For deleting the layers

addOverlayLayer ""          this means that adding "" after the overlay layer will set no image used.

This works for all added graphics.

III: Location of Images

battlebacks1    for the original battleback1
battlebacks2    for the original battleback2
battle_overlays     for all the overlays / overhead
ground_overlays     for all the ground layers

Support:

Q: I am using your plugin and when I added Yanfly Plugins, your plugin says there is an error.
What shall I do to make them compatible?

A: All you have to do is put my script before any Yanfly Plugin.

Q: Can I rename your plugin file?

A: No you can't. You must retain the name of the plugin in order for it to work.

Purpose:

What is the purpose of this plugin? Well, simple. I hate 2 battlebacks feature in
RPG Maker. It is absurd if you ask me, because I want unlimited animated layers
everywhere. - Soulpour777

Ye who uses this plugin, may thy spirit find grace,
Happiness instilled in your heart, may thy world
be filled with colors and thy mind with joy.
May thy project be filled with inspiration
and thus will tell a story that you have crafted,
to the world it shall be foretold, to the world
it shall be brought.

*
* @param Battleback 1 Scroll X
* @desc Battleback 1's horizontal scroll speed. (Default. Changable in Plugin Commands)
* @default 0
*
* @param Battleback 1 Scroll Y
* @desc Battleback 1's horizontal scroll speed. (Default. Changable in Plugin Commands)
* @default 0
*
* @param Battleback 2 Scroll X
* @desc Battleback 2's horizontal scroll speed. (Default. Changable in Plugin Commands)
* @default 0
*
* @param Battleback 2 Scroll Y
* @desc Battleback 2's horizontal scroll speed. (Default. Changable in Plugin Commands)
* @default 0
*
* @param Blur Speed
* @desc Speed of blurring by default. Blur Graphic only. (Default. Changable in Plugin Commands)
* @default 0.020
*
* @param Fog Blur Speed
* @desc Speed of the fog image blurring by default. Fog Graphic only. (Default. Changable in Plugin Commands)
* @default 0.020
*
* @param Fog Opacity
* @desc Opacity value of the used fog. (Default. Changable in Plugin Commands)
* @default 80
*
* @param Fog Scroll X
* @desc Horizontal scroll speed of the fog image used. Fog Graphic only. (Default. Changable in Plugin Commands)
* @default 0.50
*
* @param Fog Scroll Y
* @desc Vertical scroll speed of the fog image used. Fog Graphic only. (Default. Changable in Plugin Commands)
* @default 0
*
* @param Ground Opacity
* @desc Opacity value of the used ground layers. (Default. Changable in Plugin Commands)
* @default 10
*
* @param Overlay Opacity
* @desc Opacity value of the used overlay layers. (Default. Changable in Plugin Commands)
* @default 255
*
* @param Blur Power
* @desc Blurring intensity for both Fogs and Blurred Layers.
* @default 10
*
*/

var SOUL_MV = SOUL_MV = {};
SOUL_MV.BattleLayerEX = {};

SOUL_MV.BattleLayerEX.blurPower = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Blur Power'] || 10);

SOUL_MV.BattleLayerEX.gameSystemInitialize = Game_System.prototype.initialize;
SOUL_MV.BattleLayerEX.battleback1_scrollx = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Battleback 1 Scroll X'] || 0);
SOUL_MV.BattleLayerEX.battleback1_scrolly = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Battleback 1 Scroll Y'] || 0);
SOUL_MV.BattleLayerEX.battleback2_scrollx = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Battleback 2 Scroll X'] || 0);
SOUL_MV.BattleLayerEX.battleback2_scrolly = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Battleback 2 Scroll Y'] || 0);
SOUL_MV.BattleLayerEX.blurImageSpeed = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Blur Speed'] || 0.020);
SOUL_MV.BattleLayerEX.fogImageSpeed = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Fog Blur Speed'] || 0.020);

SOUL_MV.BattleLayerEX.fogOpacity = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Fog Opacity'] || 80);
SOUL_MV.BattleLayerEX.fogScrollX = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Fog Scroll X'] || 0.50);
SOUL_MV.BattleLayerEX.fogScrollY = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Fog Scroll Y'] || 0);

SOUL_MV.BattleLayerEX.groundOpacity = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Ground Opacity'] || 80);
SOUL_MV.BattleLayerEX.overlayOpacity = Number(PluginManager.parameters('SOUL_MV Battle Layer EX')['Overlay Opacity'] || 255);

Game_System.prototype.initialize = function() {
    SOUL_MV.BattleLayerEX.gameSystemInitialize.call(this);
    
    // original commands
    this._scroll1X = SOUL_MV.BattleLayerEX.battleback1_scrollx;
    this._scroll1Y = SOUL_MV.BattleLayerEX.battleback1_scrolly;
    this._scroll2X = SOUL_MV.BattleLayerEX.battleback2_scrollx;
    this._scroll2Y = SOUL_MV.BattleLayerEX.battleback2_scrolly;

    // blur
    this._blurSpeed = SOUL_MV.BattleLayerEX.blurImageSpeed;

    // fog
    this._fogSpeed = SOUL_MV.BattleLayerEX.fogImageSpeed;
    this._fogOpacity = SOUL_MV.BattleLayerEX.fogOpacity;
    this._fogScrollx = SOUL_MV.BattleLayerEX.fogScrollX;
    this._fogScrolly = SOUL_MV.BattleLayerEX.fogScrollY;

    this._blurLayer = null;
    this._fogLayer = null;
    this._ground_battleback = [];
    this._overlay_layers = [];

    this.overlayOp = SOUL_MV.BattleLayerEX.overlayOpacity;
    this.groundOp = SOUL_MV.BattleLayerEX.overlayOpacity;

}

Spriteset_Battle.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleField();
    this.createBattleback();
    this.createBattleGround();
    // this.createBlurTile();
    this.createEnemies();
    this.createActors();
    this.createLayerBack();
    this.createFogLayer();
    
};


SOUL_MV.BattleLayerEX.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    SOUL_MV.BattleLayerEX.pluginCommand.call(this, command, args);
    if (command === 'setup_battleback1') {
        $gameSystem._scroll1X = parseInt(args[0]);
        $gameSystem._scroll1Y = parseInt(args[1]);
    }  
    if (command === 'setup_battleback2') {
        $gameSystem._scroll2X = parseInt(args[0]);
        $gameSystem._scroll2Y = parseInt(args[1]);
    }        
    if (command === 'addOverlayLayer') {
        $gameSystem._overlay_layers.push(args[0]);
    }
    if (command === 'addGroundLayer') {
        $gameSystem._ground_battleback.push(args[0]);
    }    
    if (command === 'addBlurPanoramaLayer') {
        $gameSystem._blurLayer = args[0];
    }       
    if (command === 'addBattleFogLayer') {
        $gameSystem._fogLayer = args[0];
    }      
    switch(command) {
        case 'setOpacity':
            if (args[0] === 'groundBattleLayer') {
                $gameSystem.groundOp = parseInt(args[1]);
            } 
            if (args[0] === 'overlayBattleLayer') {
                $gameSystem.overlayOp = parseInt(args[1]);
                console.log($gameSystem.overlayOp);
            }
            if (args[0] === 'fogBattleLayer') {
                $gameSystem._fogOpacity = parseInt(args[1]);
            }            
            break;
    }     
};

ImageManager.loadBattleOverlay = function(filename, hue) {
    return this.loadBitmap('img/battle_overlays/', filename, hue, true);
};

ImageManager.loadBattleGround = function(filename, hue) {
    return this.loadBitmap('img/ground_overlays/', filename, hue, true);
};

Spriteset_Battle.prototype.createBattleback = function() {
    this._panorama = [];
    this._battleBackX = [];
    var margin = 32;
    var x = -this._battleField.x - margin;
    var y = -this._battleField.y - margin;
    var width = Graphics.width + margin * 2;
    var height = Graphics.height + margin * 2;
    this._back1Sprite = new TilingSprite();
    this._back2Sprite = new TilingSprite();

    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();
    this._back1Sprite.move(x, y, width, height);
    this._back2Sprite.move(x, y, width, height);

    this._battleField.addChild(this._back1Sprite);
    this._battleField.addChild(this._back2Sprite);
  
};

Spriteset_Battle.prototype.createLayerBack = function() {
    for (var i = 0; i < $gameSystem._overlay_layers.length; ++i) {
        var panorama = new TilingSprite();
        panorama.move(0, 0, Graphics.width, Graphics.height);
        if ($gameSystem._overlay_layers[i] != null) {
            panorama.bitmap = ImageManager.loadBattleOverlay($gameSystem._overlay_layers[i]);
        }
        
        panorama.opacity = $gameSystem.overlayOp;
        this._panorama.push(panorama);
        this._battleField.addChild(this._panorama[i]);
    }      
}

Spriteset_Battle.prototype.createBattleGround = function() {
    for (var i = 0; i < $gameSystem._ground_battleback.length; ++i) {
        var panorama = new TilingSprite();
        panorama.move(0, 0, Graphics.width, Graphics.height);
        if ($gameSystem._ground_battleback[i] != null) {
            panorama.bitmap = ImageManager.loadBattleGround($gameSystem._ground_battleback[i]);
        }
        panorama.opacity = $gameSystem.groundOp;
        this._battleBackX.push(panorama);
        this._battleField.addChild(this._battleBackX[i]);
    }      
}

Spriteset_Battle.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors();
    this.updateBattleback();
};

Spriteset_Battle.prototype.updateBattleback = function() {
    if (!this._battlebackLocated) {
        this.locateBattleback();
        this._battlebackLocated = true;
    }   

    //updates the original battle backgrounds
    this._back1Sprite.origin.x += $gameSystem._scroll1X;
    this._back1Sprite.origin.y += $gameSystem._scroll1Y;
    this._back2Sprite.origin.x += $gameSystem._scroll2X;
    this._back2Sprite.origin.y += $gameSystem._scroll2Y;

    

    this._count += $gameSystem._blurSpeed;
    this._fog_count += $gameSystem._fogSpeed;
    // this._blurFilter.blur = SOUL_MV.BattleLayerEX.blurPower * Math.sin(this._count);      
    // this._fogFilter.blur = SOUL_MV.BattleLayerEX.blurPower * Math.sin(this._fog_count);      

    this._fogSprite.origin.x += $gameSystem._fogScrollx;
    this._fogSprite.origin.y += $gameSystem._fogScrolly;
    this._fogSprite.opacity = $gameSystem._fogOpacity;
};

Spriteset_Battle.prototype.createBlurTile = function() {
    Scene_Base.prototype.create.call(this);
    this._blurSprite = new Sprite(Bitmap.load('img/battlebacks1/' + $gameSystem._blurLayer + '.png')); 
    this._blurFilter = new PIXI.BlurFilter();
    this._blurSprite.opacity = 200;
    this._blurSprite.filters = [this._blurFilter];
    this._battleField.addChild(this._blurSprite);
    this._count = 0;
};

Spriteset_Battle.prototype.createFogLayer = function() {
    Scene_Base.prototype.create.call(this);
    this._fogSprite = new TilingSprite();
    if ($gameSystem._fogLayer != null) {
        this._fogSprite.bitmap = Bitmap.load('img/battlebacks1/' + $gameSystem._fogLayer + '.png'); 
    }
    this._fogSprite.move(0, 0, Graphics.width, Graphics.height);
    // this._fogFilter = new PIXI.BlurFilter();
    this._fogSprite.opacity = $gameSystem._fogOpacity;
    // this._fogSprite.filters = [this._fogFilter];
    this._battleField.addChild(this._fogSprite);
    this._fog_count = 0;
};


