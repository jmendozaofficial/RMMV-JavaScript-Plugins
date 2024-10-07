//=============================================================================
// SOUL_MV_BattleResults.js
//=============================================================================

/*:
 * @plugindesc v1.0 Shows a scene based battle results instead of messages after battle.
 * @author Soul
 *
 *
 * @param Display Level Up
 * @desc Would you like to display the level up message during victory?
 * @default false
 *
 * @param BR Wallpaper
 * @desc The wallpaper used when showing the battle results. (img / results)
 * @default CrossedSwords
 *
 * @param BR Victorious Image
 * @desc The victorious message image shown after the wallpaper during the battle results scene.
 * @default Victorious
 *
 * @param BR Music
 * @desc ME played when the Battle Results is shown.
 * @default Victory2
 *
 * @param BR Volume
 * @desc Volume of the ME played during the Battle Results scene.
 * @default 100
 *
 * @param BR Pitch
 * @desc Pitch of the ME played during the Battle Results scene.
 * @default 100
 *
 * @param BR Pan
 * @desc Pan value of the ME played during the Battle Results scene.
 * @default 0
 *
 * @help 

SOUL_MV_BattleResults.js
Author: Soul

Credits: Yoji Ojima for the Window_BattleResults code as my base.

 This plugin does not provide plugin commands.
 */


(function() {
    var dislayLevelUp = PluginManager.parameters('SOUL_MV_BattleResults')['Display Level Up'] === 'true' ? true : false;
    var resultWallpaper = PluginManager.parameters('SOUL_MV_BattleResults')['BR Wallpaper'] || 'CrossedSwords';
    var resultVictorious = PluginManager.parameters('SOUL_MV_BattleResults')['BR Victorious Image'] || 'Victorious';
    var resultMeName = PluginManager.parameters('SOUL_MV_BattleResults')['BR Music'] || 'Victory2';
    var resultVolume = Number(PluginManager.parameters('SOUL_MV_BattleResults')['BR Volume'] || 100);
    var resultPitch = Number(PluginManager.parameters('SOUL_MV_BattleResults')['BR Pitch'] || 100);
    var resultPan = Number(PluginManager.parameters('SOUL_MV_BattleResults')['BR Pan'] || 0);    
    var line_horizontal = 150;

    var resultDisplaying = 0;

    Game_Actor.prototype.displayLevelUp = function(newSkills) {
        var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
        $gameMessage.newPage();
        $gameMessage.add(text);
        newSkills.forEach(function(skill) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        });
    };


    var _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.call(this);
        resultDisplaying = 0;
    };

    var _BattleManager_update = BattleManager.update;
    BattleManager.update = function() {
        _BattleManager_update.call(this);
        if (resultDisplaying > 0) {
            if (++resultDisplaying >= 60) {
                if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
                    resultDisplaying = 0;
                }
            }
        }
    };



    var _BattleManager_isBusy = BattleManager.isBusy;
    BattleManager.isBusy = function() {
        return _BattleManager_isBusy.call(this) || resultDisplaying > 0;
    };



    BattleManager.displayVictoryMessage = function() {
    };

    BattleManager.displayRewards = function() {
        resultDisplaying = 1;
    };

    Game_Actor.prototype.shouldDisplayLevelUp = function() {
        return dislayLevelUp;
    };

    Scene_Battle.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        $gameParty.onBattleEnd();
        $gameTroop.onBattleEnd();
        AudioManager.stopMe();
        SceneManager.goto(Scene_BattleResults);
    };


    function Scene_BattleResults() {
        this.initialize.apply(this, arguments);
    }

    Scene_BattleResults.prototype = Object.create(Scene_Base.prototype);
    Scene_BattleResults.prototype.constructor = Scene_BattleResults;

    Scene_BattleResults.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_BattleResults.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createResultWindow();
        this.createVictoriousImage();
        this.playResultsMusic();
    };

    Scene_BattleResults.prototype.createVictoriousImage = function() {
        Scene_Base.prototype.create.call(this);
        this.victoriousImage = new Sprite();
        this.victoriousImage.bitmap = ImageManager.loadResults(resultVictorious);
        this.addChild(this.victoriousImage);
    };

    Scene_BattleResults.prototype.playResultsMusic = function() {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        var audio = {
            name: resultMeName,
            volume: resultVolume,
            pitch: resultPitch,
            pan: resultPan
        }
        AudioManager.playMe(audio);
    };


    Scene_BattleResults.prototype.createResultWindow = function() {
        this.resultBattleWindow = new Window_BattleResults();
        this.addChild(this.resultBattleWindow);        
    }

    ImageManager.loadResults = function(filename, hue) {
        return this.loadBitmap('img/results/', filename, hue, true);
    };

    Scene_BattleResults.prototype.createBackground = function() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadResults(resultWallpaper);
        this.addChild(this._backSprite);
    };    

    Scene_BattleResults.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        this.startFadeIn(this.slowFadeSpeed(), false);
    };    

    Scene_BattleResults.prototype.isTriggered = function() {
        return Input.isTriggered('ok') || TouchInput.isTriggered();
    };

    Scene_BattleResults.prototype.gotoMap = function() {
        SceneManager.goto(Scene_Map);
    };    

    Scene_BattleResults.prototype.update = function() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
            this.gotoMap();
        }
        Scene_Base.prototype.update.call(this);
    };   

    Scene_BattleResults.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        this.removeChild(this.resultBattleWindow);
        this.removeChild(this.victoriousImage);
        AudioManager.stopAll();
    };     

    function Window_BattleResults() {
        this.initialize.apply(this, arguments);
    }

    Window_BattleResults.prototype = Object.create(Window_Base.prototype);
    Window_BattleResults.prototype.constructor = Window_BattleResults;

    Window_BattleResults.prototype.initialize = function() {
        var rewards = BattleManager._rewards;
        var width = 400;
        var height = this.fittingHeight(Math.min(9, rewards.items.length + 1));
        var statusHeight = this.fittingHeight(4);
        var x = (Graphics.boxWidth - width) / 2;
        var y = (Graphics.boxHeight - statusHeight - height) / 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.openness = 0;
        this.open();
    };

    Window_BattleResults.prototype.refresh = function() {
        var x = this.textPadding();
        var y = 0;
        var width = this.contents.width;
        var lineHeight = this.lineHeight();
        var rewards = BattleManager._rewards;
        var items = rewards.items;
        this.contents.clear();

        this.resetTextColor();
        this.drawText(rewards.exp, x, y);
        x += this.textWidth(rewards.exp) + 6;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.expA, x, y);
        x += this.textWidth(TextManager.expA + '  ');

        this.resetTextColor();
        this.drawText(rewards.gold, x, y);
        x += this.textWidth(rewards.gold) + 6;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.currencyUnit, x, y);

        x = 0;
        y += lineHeight;

        items.forEach(function(item) {
            this.drawItemName(item, x, y, width);
            y += lineHeight;
        }, this);
    };

})();
