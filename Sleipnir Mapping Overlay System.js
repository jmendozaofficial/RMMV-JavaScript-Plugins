//=============================================================================
// Sleipnir Mapping Overlay System.js
// Author: Soulpour777
// Credits: Sasuke Kannazuki and Yoji Ojima
//=============================================================================

/*:
 * @plugindesc v1.5 A plugin designed to aid mappers on Parallax Mapping and Map Design.
 * @author Soulpour777
 *
 * @help

 Sleipnir Mapping Overlay System HELP SECTION
 Version Number: 1.0
 Date of Plugin Release: 11 / 18 / 2015

 Place the overlays in the img / overlays folder.

 Q: How can I call out a fog?
 A: To create a fog, create a Parallel Event process with a script call:
 this.create_fog(fog_image_name, opacity, scrollx, scrolly, blendMode);
 where:
  fog_image_name is the name of the fog image you're using.
  opacity as the opacity of the fog
  scrollx meaning the x axis scroll of the fog
  scrolly meaning the y axis scroll of the fog
  blendMode meaning the blendMode your fog is set.

Q: I was able to create it, how can I remove the fog?
A: Make this script call in an event:
  this.remove_fog();

Q: How can I create a ground layer? Are there settings?
A: To create a ground layer, you must put this on the map's
note tag:

<ground_name:x> 
where x is the name of the ground overlay you're using.
example: <ground_name:Brick>
Note: Make sure that there's no spaces.

Q: It's cool, but I kinda want it to be a little bit
transparent. Can we change the opacity?
A: Yes you can. Place this on the note tag of the
map. Make sure no spaces.

<ground_opacity:x>

  where x contains the opacity amount of your ground
  layer.

Q: How can I create an inner shadow?
A: You can do it just the same as ground layers.

<shadow_name:x>
<shadow_opacity:y>

Q: How can I create a Sunlight and Overhead Layer?
A: Both sunlight and overhead has the same note
tagging. To create a sunlight or overhead, you
have to place this in a note tag of the map:

<sunlight:x>
<overhead:x>

  where x is the image name of the sunlight or
  overhead you want to use.

Q: Are there are functions available that you've
done for both of them just like the ground 
layer?
A: But of course. Here are the functions you can
do:

<sunlight_opacity:x>
  where x is the amount of opacity you want.
<sunlightLoopX:a>
  where a can only be true or false
<sunlightLoopY:b>
  where b can only be true or false
<sunlightSx:i>
  where i is the amount of horizontal scrolling if loop X is true.
<sunlightSy:j>
  where j is the amount of vertical scrolling if loop Y is true.
<overhead_opacity:x>
  where x is the amount of opacity you want.
<overheadLoopX:a>
  where a can only be true or false
<overheadLoopY:b>
  where b can only be true or false
<overheadSx:i>
  where i is the amount of horizontal scrolling if loop X is true.
<overheadSy:j>
  where j is the amount of vertical scrolling if loop Y is true.

 Setting Your Fog, Sunlight and Overhead's width and Height correctly:

 If you want to set it just the way the image is sized in your file,
 follow the size setting and place it on to the assigned value. If
 your Fog's width and height for example is 544 x 416, indicate that
 in the width and height.

 Q: What is Z Index?
 Z index was introduced before in the older rpg makers. Sadly, this is not
 anymore as easily available in MV. However, you can still setup which layer
 comes first. Basically what Z index means is the number of layer where
 the certain sprite would appear. For example, if Shadow's Z index is 1 and 
 Ground is 2, that means the shadow comes first, then overlayed by the 
 Ground Layer. This allows you to cast shadows to the ground, in that case.
 You have the freedom to set it yourself in this plugin.
 The Fog System in this plugin is a different section, as it tops all the
 map overlays. To give you a little rundown:

  1st Parallax (Default)
  2nd TileMap (Default)
  3rd Shadow Layer (Custom)
  4th Ground Layers (Custom)
  5th Shadow Layer (Default)
  6th Characters (Default)
  7th Overhead (Custom)
  8th Sunlight (Custom)
  9th Fog (Custom)

 You are free to use my scripts in your game projects as long as you give credit. 
 Scripts are free to use for Commercial Use otherwise stated: NOT FREE FOR
 COMMERCIAL USE. For a better understanding of my terms of use, visit my
 site: https://soulxregalia.wordpress.com/terms-of-use/
 This script, in this sense is:
 protected by: Attribution-NonCommercial-ShareAlike 3.0 Philippines 
 (CC BY-NC-SA 3.0 PH)
 - FREE FOR COMMERCIAL USE -

 *
 * @param FogImageWidth
 * @desc Width of the fog image you are using. (HELP for setting proper w and h)
 * @default 816
 *
 * @param FogImageHeight
 * @desc Height of the fog image you are using. (HELP for setting proper w and h)
 * @default 624
 *
 * @param ShadowOpacity
 * @desc Default Opacity value of your shadow overlay.
 * @default 255
 *
 * @param ShadowZLayer
 * @desc Default z-index value of your shadow overlay. (HELP for info about z-index)
 * @default 1
 * @param GroundZLayer
 * @desc Default z-index value of your ground layer overlay. (HELP for info about z-index)
 * @default 2
 * @param SunlightZLayer
 * @desc Default z-index value of your sunlight layer overlay. (HELP for info about z-index)
 * @default 12
 *
 * @param SunlightImageWidth
 * @desc Width of the sunlight image you are using. (HELP for setting proper w and h)
 * @default 812
 *
 * @param SunlightImageHeight
 * @desc Height of the sunlight image you are using. (HELP for setting proper w and h)
 * @default 624
 * @param OverheadZLayer
 * @desc Default z-index value of your overhead layer overlay. (HELP for info about z-index)
 * @default 8
 *
 * @param OverheadImageWidth
 * @desc Width of the sunlight image you are using. (HELP for setting proper w and h)
 * @default 1000
 *
 * @param OverheadImageHeight
 * @desc Height of the sunlight image you are using. (HELP for setting proper w and h)
 * @default 720
 *
 */


ImageManager.loadOverlay = function(filename, hue) {
    return this.loadBitmap('img/overlays/', filename, hue, true);
};



(function() {

  var Imported = Imported || {};
  Imported.SleipnirMappingOverlay = true;
  var Soulpour777 = Soulpour777 || {};
  Soulpour777.SleipnirMappingOverlay = {};
  Soulpour777.SleipnirMappingOverlay.params = PluginManager.parameters('Sleipnir Mapping Overlay System'); 

  // Local Variables
  // Fog Variables
  var fog_ImageWidth = Number(Soulpour777.SleipnirMappingOverlay.params['FogImageWidth'] || 816);
  var fog_ImageHeight = Number(Soulpour777.SleipnirMappingOverlay.params['FogImageHeight'] || 624);
  // Shadow Overlay Variables
  var defaultShadowOpacity = Number(Soulpour777.SleipnirMappingOverlay.params['ShadowOpacity'] || 255);
  var shadowLayerHeirarchy = Number(Soulpour777.SleipnirMappingOverlay.params['ShadowZLayer'] || 1);
  // Ground Layer Overlay Variables
  var groundLayerHeirarchy = Number(Soulpour777.SleipnirMappingOverlay.params['GroundZLayer'] || 2);

  // alias methods
  var alias_soul_sleipnirvalesti_game_map_initialize = Game_Map.prototype.initialize;
  var alias_soul_sleipnirvalesti_game_map_setup = Game_Map.prototype.setup;
  var alias_soul_sleipnirvalesti_game_map_update = Game_Map.prototype.update;
  var alias_soul_sleipnirvalesti_game_map_setupDisplayPosition = Game_Map.prototype.setDisplayPos;
  var alias_soul_sleipnir_spritesetmap_setupLowerLayer = Spriteset_Map.prototype.createLowerLayer;

  Game_System.prototype.fogName = null;
  Game_System.prototype.fogScrollX = 0;
  Game_System.prototype.fogScrollY = 0;
  Game_System.prototype.fogOpacity = 0;
  Game_System.prototype.fogblendMode = 0;

  Scene_Map.prototype.fogImage;
   
  Game_System.prototype.initializeFog = function(name, opacity, scrollx, scrolly, blendMode) {
    this.fogName = name;
    this.fogScrollX = scrollx;
    this.fogOpacity = opacity;
    this.fogScrollY = scrolly;
    this.fogblendMode = blendMode;
    if(SceneManager._scene instanceof Scene_Map || SceneManager._scene instanceof Scene_Menu) {
      SceneManager._scene.fogImage.bitmap = ImageManager.loadOverlay(name);
      SceneManager._scene.fogImage.opacity = $gameSystem.fogOpacity;
    }
  }
  

  Game_Interpreter.prototype.create_fog = function(name, opacity, scrollx, scrolly, blendMode) {
    $gameSystem.initializeFog(name, opacity, scrollx, scrolly, blendMode);
  }

  var nibelung_scene_map_start = Scene_Map.prototype.start;
   
  Scene_Map.prototype.start = function() {
    nibelung_scene_map_start.call(this);
    this.createFog();
  }
   
  var nibelung_scene_map_update = Scene_Map.prototype.update;
   
  Scene_Map.prototype.update = function() {
    nibelung_scene_map_update.call(this);
    this.update_fog();
  }
   
  Scene_Map.prototype.createFog = function() {
    this.fogImage = new TilingSprite();
    this.fogImage.move(0, 0, fog_ImageWidth, fog_ImageHeight);
    this.fogImage.bitmap = ImageManager.loadOverlay($gameSystem.fogName);
    this.fogImage.opacity = $gameSystem.fogOpacity;
    this.fogImage.blendMode = $gameSystem.fogblendMode;
    this.addChild(this.fogImage);
  }

  Game_System.prototype.removeFog = function() {
    this.fogName = null;
  }

  Game_Interpreter.prototype.remove_fog = function() {
    $gameSystem.removeFog();
  }
   
  Scene_Map.prototype.update_fog = function() {
    this.fogImage.origin.x += $gameSystem.fogScrollX;
    this.fogImage.origin.y += $gameSystem.fogScrollY;
    this.fogImage.bitmap = ImageManager.loadOverlay($gameSystem.fogName);
  }
  ImageManager.isZeroShadow = function(filename) {
    return filename.charAt(0) === '!';
  };
  ImageManager.isZeroGroundLayer = function(filename) {
    return filename.charAt(0) === '!';
  };


  Game_Map.prototype.initialize = function() {
    alias_soul_sleipnirvalesti_game_map_initialize.call(this);
    this.initializeShadow();
    this.initializeGroundLayer();
  };

  Game_Map.prototype.initializeShadow = function(){
    this._shadowOpacity = defaultShadowOpacity;
    this._shadowDefined = true;
    this._shadowName = '';
    this._shadowZero = false;
    this._shadow_XAxis = 0;
    this._shadow_YAxis = 0;
  };

  var alias_soul_sleipnir_game_system_initialize = Game_System.prototype.initialize;

  Game_System.prototype.initialize = function() {
    alias_soul_sleipnir_game_system_initialize.call(this);
    this._fog_scrollx = 0;
    this._fog_scrolly = 0;
  }


  Game_Map.prototype.initializeGroundLayer = function(){
    this._groundlayerOpacity = 255;
    this._groundlayerDefined = true;
    this._groundlayerName = '';
    this._groundlayerZero = false;
    this._groundlayer_XAxis = 0;
    this._groundlayer_YAxis = 0;
  };  

  Game_Map.prototype.reclaimShadow = function(){
    if(!this._shadowDefined){
      this.initializeShadow();
    }
  };


  Game_Map.prototype.reclaimGroundLayer = function(){
    if(!this._shadowDefined){
      this.initializeGroundLayer();
    }
  };

  Game_Map.prototype.shadowName = function() {
    this.reclaimShadow();
    return this._shadowName;
  };

  Game_Map.prototype.shadowOpacity = function() {
    this.reclaimShadow();
    return this._shadowOpacity;
  }

  Game_Map.prototype.groundLayerOpacity = function() {
    this.reclaimGroundLayer();
    return this._groundlayerOpacity;
  }


  Game_Map.prototype.groundLayerName = function() {
    this.reclaimGroundLayer();
    return this._groundlayerName;
  };


  Game_Map.prototype.setup = function(mapId) {
    alias_soul_sleipnirvalesti_game_map_setup.call(this, mapId);
    this.setupShadowLayer();
    this.setupGroundLayer();
  };


  Game_Map.prototype.setupShadowLayer = function() {
    this._shadowName = $dataMap.meta.shadow_name || '';
    this._shadowOpacity = $dataMap.meta.shadow_opacity || '';
    this._shadowZero = ImageManager.isZeroShadow(this._shadowName);
    this._shadow_XAxis = 0;
    this._shadow_YAxis = 0;
  };

  Game_Map.prototype.setupGroundLayer = function() {
    this._groundlayerName = $dataMap.meta.ground_name || '';
    this._groundlayerOpacity = Number($dataMap.meta.ground_opacity) || 255;
    this._groundlayerZero = ImageManager.isZeroGroundLayer(this._groundlayerName);
    this._groundlayer_XAxis = 0;
    this._groundlayer_YAxis = 0;
  };


  Game_Map.prototype.setDisplayPos = function(x, y) {
    alias_soul_sleipnirvalesti_game_map_setupDisplayPosition.call(this, x, y);
    this.reclaimShadow();
    this.reclaimGroundLayer()
    if (this.isLoopHorizontal()) {
      this._shadow_XAxis = x;
      this._groundlayer_XAxis = x;
    } else {
       this._shadow_XAxis = this._displayX;
       this._groundlayer_XAxis = this._displayX;

    }

    if (this.isLoopVertical()) {
      this._shadow_YAxis = y;
      this._groundlayer_YAxis = y;

    } else {
      this._groundlayer_YAxis = this._displayY;
      this._shadow_YAxis = this._displayY;
    }
  };

  
  Game_Map.prototype.update = function(sceneActive) {
    alias_soul_sleipnirvalesti_game_map_update.call(this, sceneActive);
    this.updateShadow();
    this.updateGroundLayer();

  };

  Game_Map.prototype.updateShadow = function() {
    this.reclaimShadow();
  };
  Game_Map.prototype.updateGroundLayer = function() {
    this.reclaimGroundLayer();
  };

  Spriteset_Map.prototype.createLowerLayer = function() {
    alias_soul_sleipnir_spritesetmap_setupLowerLayer.call(this);
    this.createOverlaySprites();
  };


  var valesti_spritesetmap_update = Spriteset_Map.prototype.update;
  Spriteset_Map.prototype.update = function() {
    valesti_spritesetmap_update.call(this);
    this.updateShadow();
    this.updateGroundLayer();
  };

  Spriteset_Map.prototype.createOverlaySprites = function() {  
    this._shadow = new Sprite();
    this._shadow.z = shadowLayerHeirarchy;
    this._tilemap.addChild(this._shadow);
    this._groundlayer = new Sprite();
//    this._groundlayer.move(0, 0, Graphics.width, Graphics.height);
    this._groundlayer.z = groundLayerHeirarchy;
    this._baseSprite.removeChild(this._weather);
    this._tilemap.addChild(this._groundlayer);
    this._baseSprite.addChild(this._weather);
    this._groundlayer.x / $gamePlayer.screenX();
    this._groundlayer.y / $gamePlayer.screenY();
    
  };


  Spriteset_Map.prototype.updateShadow = function() {
    if (this._shadowName !== $gameMap.shadowName()) {
      this._shadowName = $gameMap.shadowName();
      this._shadow.bitmap = ImageManager.loadOverlay(this._shadowName);

    }
    this._shadow.opacity = parseInt($gameMap.shadowOpacity());
  };

  Spriteset_Map.prototype.updateGroundLayer = function() {
    if (this._groundlayerName !== $gameMap.groundLayerName()) {
      this._groundlayerName = $gameMap.groundLayerName();
      this._groundlayer.bitmap = ImageManager.loadOverlay(this._groundlayerName);
    }
      this._groundlayer.x = $gameMap.displayX() * $gameMap.tileWidth();
      this._groundlayer.y = $gameMap.displayY() * $gameMap.tileWidth();
     this._groundlayer.opacity = parseInt($gameMap.groundLayerOpacity());
      
  };
 
})();


(function() {
  var Imported = Imported || {};
  Imported.SleipnirSunlight = true;
  var Soulpour777 = Soulpour777 || {};
  Soulpour777.SleipnirSunlight = {};
  Soulpour777.SleipnirSunlight.params = PluginManager.parameters('Sleipnir Mapping Overlay System'); 

  var sunlightLayeraHeirarchy =  Soulpour777.SleipnirSunlight.params['SunlightZLayer'] || 12;
  var sunlightWidth = Soulpour777.SleipnirSunlight.params['SunlightImageWidth'] || 812;
  var sunlightHeight = Soulpour777.SleipnirSunlight.params['SunlightImageHeight'] || 624;
  var nibelungvalesti_game_map_initialize = Game_Map.prototype.initialize;
  var nibelungvalesti_game_map_setup = Game_Map.prototype.setup;
  var nibelung_game_map_displayPosition = Game_Map.prototype.setDisplayPos;
  var nibelungvalesti_game_map_scrollDown = Game_Map.prototype.scrollDown;
  var nibelungvalesti_game_map_scrollLeft = Game_Map.prototype.scrollLeft;
  var nibelungvalesti_game_map_scrollRight = Game_Map.prototype.scrollRight;
  var nibelungvalesti_game_map_scrollUp = Game_Map.prototype.scrollUp;
  var nibelungvalesti_game_map_update = Game_Map.prototype.update;
  var nibelung_spriteset_map_lowerlayer = Spriteset_Map.prototype.createLowerLayer;
  var nibelungvalesti_spritesetmap_update = Spriteset_Map.prototype.update;

  ImageManager.isZerosunlight = function(filename) {
    return filename.charAt(0) === '!';
  };

  Game_Map.prototype.initialize = function() {
    nibelungvalesti_game_map_initialize.call(this);
    this.initsunlight();
  };

  Game_Map.prototype.initsunlight = function(){
    
    this._sunlightDefined = true;
    this._sunlightName = '';
    this._sunlightZero = false;
    this._sunlightLoopX = false;
    this._sunlightLoopY = false;
    this._sunlightSx = 0;
    this._sunlightSy = 0;
    this._sunlightX = 0;
    this._sunlightY = 0;
    this._sunlightOpacity = 255;
  };

  Game_Map.prototype.reclaimsunlight = function(){
    if(!this._sunlightDefined){
      this.initsunlight();
    }
  };

  Game_Map.prototype.sunlightName = function() {
    this.reclaimsunlight();
    return this._sunlightName;
  };

  Game_Map.prototype.sunlightOpacity = function() {
    this.reclaimsunlight();
    return this._sunlightOpacity;
  }

  
  Game_Map.prototype.setup = function(mapId) {
    nibelungvalesti_game_map_setup.call(this, mapId);
    this.setupsunlight();
  };

  Game_Map.prototype.setupsunlight = function() {
    
    this._sunlightName = $dataMap.meta.sunlight || '';
    this._sunlightZero = ImageManager.isZerosunlight(this._sunlightName);
    this._sunlightLoopX = !!$dataMap.meta.sunlightLoopX;
    this._sunlightLoopY = !!$dataMap.meta.sunlightLoopY;
    this._sunlightSx = Number($dataMap.meta.sunlightSx) || 0;
    this._sunlightSy = Number($dataMap.meta.sunlightSy) || 0;
    this._sunlightOpacity = Number($dataMap.meta.sunlight_opacity) || 255;
    this._sunlightX = 0;
    this._sunlightY = 0;
  };


  
  Game_Map.prototype.setDisplayPos = function(x, y) {
    nibelung_game_map_displayPosition.call(this, x, y);
    this.reclaimsunlight();
    if (this.isLoopHorizontal()) {
      this._sunlightX = x;
    } else {
       this._sunlightX = this._displayX;
    }
    if (this.isLoopVertical()) {
      this._sunlightY = y;
    } else {
      this._sunlightY = this._displayY;
    }
  };

  Game_Map.prototype.sunlightOx = function() {
    this.reclaimsunlight();
    if (this._sunlightZero) {
      return this._sunlightX * this.tileWidth();
    } else if (this._sunlightLoopX) {
      return this._sunlightX * this.tileWidth() / 2;
    } else {
      return 0;
    }
  };

  Game_Map.prototype.sunlightOy = function() {
    this.reclaimsunlight();
    if (this._sunlightZero) {
      return this._sunlightY * this.tileHeight();
    } else if (this._sunlightLoopY) {
      return this._sunlightY * this.tileHeight() / 2;
    } else {
      return 0;
    }
  };

  
  Game_Map.prototype.scrollDown = function(distance) {
    var lastY = this._displayY;
    nibelungvalesti_game_map_scrollDown.call(this, distance);
    this.reclaimsunlight();
    if (this.isLoopVertical()) {
      if (this._sunlightLoopY) {
        this._sunlightY += distance;
      }
    } else if (this.height() >= this.screenTileY()) {
      var displayY = Math.min(lastY + distance,
        this.height() - this.screenTileY());
      this._sunlightY += displayY - lastY;
    }
  };



  Game_Map.prototype.scrollLeft = function(distance) {
    var lastX = this._displayX;
    nibelungvalesti_game_map_scrollLeft.call(this, distance);
    this.reclaimsunlight();
    if (this.isLoopHorizontal()) {
      if (this._sunlightLoopX) {
        this._sunlightX -= distance;
      }
    } else if (this.width() >= this.screenTileX()) {
      var displayX = Math.max(lastX - distance, 0);
      this._sunlightX += displayX - lastX;
    }
  };

  
  Game_Map.prototype.scrollRight = function(distance) {
    var lastX = this._displayX;
    nibelungvalesti_game_map_scrollRight.call(this, distance);
    this.reclaimsunlight();
    if (this.isLoopHorizontal()) {
      if (this._sunlightLoopX) {
        this._sunlightX += distance;
      }
    } else if (this.width() >= this.screenTileX()) {
      var displayX = Math.min(lastX + distance,
       this.width() - this.screenTileX());
      this._sunlightX += displayX - lastX;
    }
  };


  Game_Map.prototype.scrollUp = function(distance) {
    var lastY = this._displayY;
    nibelungvalesti_game_map_scrollUp.call(this, distance);
    this.reclaimsunlight();
    if (this.isLoopVertical()) {
      if (this._sunlightLoopY) {
        this._sunlightY -= distance;
      }
    } else if (this.height() >= this.screenTileY()) {
      var displayY = Math.max(lastY - distance, 0);
      this._sunlightY += displayY - lastY;
    }
  };

  
  Game_Map.prototype.update = function(sceneActive) {
    nibelungvalesti_game_map_update.call(this, sceneActive);
    this.updatesunlight();
  };

  Game_Map.prototype.updatesunlight = function() {
    this.reclaimsunlight();
    if (this._sunlightLoopX) {
      this._sunlightX += this._sunlightSx / this.tileWidth() / 2;
    }
    if (this._sunlightLoopY) {
      this._sunlightY += this._sunlightSy / this.tileHeight() / 2;
    }
  };

  
  Spriteset_Map.prototype.createLowerLayer = function() {
    nibelung_spriteset_map_lowerlayer.call(this);
   this.createsunlight();
  };

  
  Spriteset_Map.prototype.update = function() {
    nibelungvalesti_spritesetmap_update.call(this);
    this.updatesunlight();
  };

  Spriteset_Map.prototype.createsunlight = function() {
    this._sunlight = new TilingSprite();
    this._sunlight.move(0, 0, sunlightWidth, sunlightHeight);
    this._sunlight.opacity = $gameMap.sunlightOpacity();
    this._baseSprite.removeChild(this._weather);
    this._sunlight.z = sunlightLayeraHeirarchy;
    this._tilemap.addChild(this._sunlight);
    this._baseSprite.addChild(this._weather);
  };

  Spriteset_Map.prototype.updatesunlight = function() {
    if (this._sunlightName !== $gameMap.sunlightName()) {
      this._sunlightName = $gameMap.sunlightName();
      this._sunlight.bitmap = ImageManager.loadOverlay(this._sunlightName);
    }
    if (this._sunlight.bitmap) {
      this._sunlight.origin.x = $gameMap.sunlightOx();
      this._sunlight.origin.y = $gameMap.sunlightOy();
    }
  };

})();

(function() {
  var Imported = Imported || {};
  Imported.SleipnirOverhead = true;
  var Soulpour777 = Soulpour777 || {};
  Soulpour777.SleipnirOverhead = {};
  Soulpour777.SleipnirOverhead.params = PluginManager.parameters('Sleipnir Mapping Overlay System'); 
  var overheadLayerHeirarchy =  Soulpour777.SleipnirOverhead.params['OverheadZLayer'] || 8;
  var overheadHeight = Soulpour777.SleipnirOverhead.params['OverheadImageWidth'] || 720;
  var overheadWidth = Soulpour777.SleipnirOverhead.params['OverheadImageWidth'] || 1000;

  // Alias Methods
  var valesti_game_map_update = Game_Map.prototype.update;
  var valesti_spritesetmap_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  var valesti_spritesetmap_update = Spriteset_Map.prototype.update; 
  var valesti_game_map_scrollUp = Game_Map.prototype.scrollUp;
  var valesti_game_map_scrollRight = Game_Map.prototype.scrollRight;
  var valesti_game_map_scrollLeft = Game_Map.prototype.scrollLeft;
  var valesti_game_map_scrollDown = Game_Map.prototype.scrollDown;
  var valesti_game_map_setDisplayPosition = Game_Map.prototype.setDisplayPos;
  var valesti_game_map_setup = Game_Map.prototype.setup;
  var valesti_game_map_initialize = Game_Map.prototype.initialize;

  ImageManager.isZerooverhead = function(filename) {
    return filename.charAt(0) === '!';
  };

  Game_Map.prototype.initialize = function() {
    valesti_game_map_initialize.call(this);
    this.initoverhead();
  };

  Game_Map.prototype.initoverhead = function(){
    this._overheadDefined = true;
    this._overheadName = '';
    this._overheadZero = false;
    this._overheadLoopX = false;
    this._overheadLoopY = false;
    this._overheadSx = 0;
    this._overheadSy = 0;
    this._overheadX = 0;
    this._overheadY = 0;
    this._overheadOpacity = 255;
  };


  Game_Map.prototype.reclaimoverhead = function(){
    if(!this._overheadDefined){
      this.initoverhead();
    }
  };


  Game_Map.prototype.overheadName = function() {
    this.reclaimoverhead();
    return this._overheadName;
  };

  Game_Map.prototype.overheadOpacity = function() {
    this.reclaimoverhead();
    return this._overheadOpacity;
  }

  Game_Map.prototype.setup = function(mapId) {
    valesti_game_map_setup.call(this, mapId);
    this.setupoverhead();
  };

  Game_Map.prototype.setupoverhead = function() {
    this._overheadName = $dataMap.meta.overhead || '';
    this._overheadZero = ImageManager.isZerooverhead(this._overheadName);
    this._overheadLoopX = !!$dataMap.meta.overheadLoopX;
    this._overheadLoopY = !!$dataMap.meta.overheadLoopY;
    this._overheadSx = Number($dataMap.meta.overheadSx) || 0;
    this._overheadSy = Number($dataMap.meta.overheadSy) || 0;
    this._overheadOpacity = Number($dataMap.meta.overhead_opacity) || 255;
    this._overheadX = 0;
    this._overheadY = 0;
  };

  Game_Map.prototype.setDisplayPos = function(x, y) {
    valesti_game_map_setDisplayPosition.call(this, x, y);
    this.reclaimoverhead();
    if (this.isLoopHorizontal()) {
      this._overheadX = x;
    } else {
       this._overheadX = this._displayX;
    }
    if (this.isLoopVertical()) {
      this._overheadY = y;
    } else {
      this._overheadY = this._displayY;
    }
  };

  Game_Map.prototype.overheadOx = function() {
    this.reclaimoverhead();
    if (this._overheadZero) {
      return this._overheadX * this.tileWidth();
    } else if (this._overheadLoopX) {
      return this._overheadX * this.tileWidth() / 2;
    } else {
      return 0;
    }
  };

  Game_Map.prototype.overheadOy = function() {
    this.reclaimoverhead();
    if (this._overheadZero) {
      return this._overheadY * this.tileHeight();
    } else if (this._overheadLoopY) {
      return this._overheadY * this.tileHeight() / 2;
    } else {
      return 0;
    }
  };

  Game_Map.prototype.scrollDown = function(distance) {
    var lastY = this._displayY;
    valesti_game_map_scrollDown.call(this, distance);
    this.reclaimoverhead();
    if (this.isLoopVertical()) {
      if (this._overheadLoopY) {
        this._overheadY += distance;
      }
    } else if (this.height() >= this.screenTileY()) {
      var displayY = Math.min(lastY + distance,
        this.height() - this.screenTileY());
      this._overheadY += displayY - lastY;
    }
  };

  Game_Map.prototype.scrollLeft = function(distance) {
    var lastX = this._displayX;
    valesti_game_map_scrollLeft.call(this, distance);
    this.reclaimoverhead();
    if (this.isLoopHorizontal()) {
      if (this._overheadLoopX) {
        this._overheadX -= distance;
      }
    } else if (this.width() >= this.screenTileX()) {
      var displayX = Math.max(lastX - distance, 0);
      this._overheadX += displayX - lastX;
    }
  };

  Game_Map.prototype.scrollRight = function(distance) {
    var lastX = this._displayX;
    valesti_game_map_scrollRight.call(this, distance);
    this.reclaimoverhead();
    if (this.isLoopHorizontal()) {
      if (this._overheadLoopX) {
        this._overheadX += distance;
      }
    } else if (this.width() >= this.screenTileX()) {
      var displayX = Math.min(lastX + distance,
       this.width() - this.screenTileX());
      this._overheadX += displayX - lastX;
    }
  };

  Game_Map.prototype.scrollUp = function(distance) {
    var lastY = this._displayY;
    valesti_game_map_scrollUp.call(this, distance);
    this.reclaimoverhead();
    if (this.isLoopVertical()) {
      if (this._overheadLoopY) {
        this._overheadY -= distance;
      }
    } else if (this.height() >= this.screenTileY()) {
      var displayY = Math.max(lastY - distance, 0);
      this._overheadY += displayY - lastY;
    }
  };


  Game_Map.prototype.update = function(sceneActive) {
    valesti_game_map_update.call(this, sceneActive);
    this.updateoverhead();
  };

  Game_Map.prototype.updateoverhead = function() {
    this.reclaimoverhead();
    if (this._overheadLoopX) {
      this._overheadX += this._overheadSx / this.tileWidth() / 2;
    }
    if (this._overheadLoopY) {
      this._overheadY += this._overheadSy / this.tileHeight() / 2;
    }
  };


  Spriteset_Map.prototype.createLowerLayer = function() {
    valesti_spritesetmap_createLowerLayer.call(this);
   this.createoverhead();
  };

  
  Spriteset_Map.prototype.update = function() {
    valesti_spritesetmap_update.call(this);
    this.updateoverhead();
  };

  Spriteset_Map.prototype.createoverhead = function() {
    this._overhead = new TilingSprite();
    this._overhead.move(0, 0, overheadWidth, overheadHeight);
    this._overhead.opacity = $gameMap.overheadOpacity();
    this._baseSprite.removeChild(this._weather);
    this._overhead.z = overheadLayerHeirarchy;
    this._tilemap.addChild(this._overhead);
    this._baseSprite.addChild(this._weather);
  };

  Spriteset_Map.prototype.updateoverhead = function() {
    if (this._overheadName !== $gameMap.overheadName()) {
      this._overheadName = $gameMap.overheadName();
      this._overhead.bitmap = ImageManager.loadOverlay(this._overheadName);
    }
    if (this._overhead.bitmap) {
      this._overhead.origin.x = $gameMap.overheadOx();
      this._overhead.origin.y = $gameMap.overheadOy();
    }
  };

})();
