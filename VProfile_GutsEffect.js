//===================================================================================//
// SOUL_GutsEffect.js
//===================================================================================//
/*:
* @plugindesc v1.0 Allows an ability to do auto-revive dead party members in battle.
* @author VProfile - soulxregalia.wordpress.com
* 
* @param Default Guts Counter
* @desc This is the default number of times that all actors can use the Guts Effect.
* @default 0
* 
* @param Guts Counter Switch
* @desc Switch ID involved in setting the Guts Counter of the actor to increase if the actor levels up. 
* @default 2
* 
* @param Guts Level Up Chance
* @desc The chance value that when an actor levels up, the Guts Counter would grow for that actor. (by Number)
* @default 50
* 
* @param Guts Anime ID
* @desc Animation ID of Animation played when the actor is revived.
* @default 117
* 
* @param Guts Anime Delay
* @desc Animation Delay of Animation played when the actor is revived.
* @default 0
* 

* @help

//==============================//
// SOUL_GutsEffect
// Author: Soul

Date of Creation: 6 / 27 / 2016

Current Version: 1

//==============================//

Description:

Guts will allow party members to automatically revive themselves when 
vanquished. This saves you from having to waste a turn and use a revive potion. 
The chances of revival will increase as skill level increases.

Instruction:

You can change the Guts Counter individually for each actor at will
by using a plugin command:

Guts operation actorId value

where operation is the operation keyword.
where actorId is the id of the actor you want to add the guts counter of.
where value is the value of the guts counter you want to either add or subtract

Key Words:

Add - addition
Sub - Subtraction
Mul - Multiplication
Div - Division

Each Key Word first letter should be in CAPITAL letter for it to work.

Example of the plugin command:

Guts Add 1 10

^ This for example would add 10 guts counter to actor 1.

============================================
Guts Counter Switch
============================================

The Guts Counter Switch takes the value of a switch ID number
the plugin user must define in order for the level up guts 
increase to work. What this means is if the Guts Counter Switch
is ON, the plugin would be able to increase the guts counter of
the actor via a chance (Guts Level Up Chance). If it is not
ON, then simply, when the actor levels up, the guts counter
will not go up.

===========================================
Guts Level Up Chance
===========================================

This is the chance value for the actor to gain +1 to its
Guts Counter. This goes by the formula that if the
Guts Level Up Chance is met, then it would do a +1,
if not, then there would be no increase. It is set
by 100 at best. If the plugin user placed 50, a random
variable will be rolled out and if the variable is
greater than or equals to 50, then +1 to guts.

===========================================
Support? 
===========================================

Message VProfile at soulxregalia.wordpress.com

*/
var Imported = Imported || {};
Imported.SOUL_GutsEffect = true;

var VProfile = VProfile || {};
VProfile.GE = VProfile.GE || {};

var xs_paramX = PluginManager.parameters('VProfile_GutsEffects');
var g_eff_counterDef = Number(xs_paramX['Default Guts Counter']);
var g_eff_counterS = Number(xs_paramX['Guts Counter Switch']);
var g_eff_counterLChance = Number(xs_paramX['Guts Level Up Chance']);
var g_eff_animeID = Number(xs_paramX['Guts Anime ID']);
var g_eff_animeDelay = Number(xs_paramX['Guts Anime Delay']);

(function($){
	VProfile.GE.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	$.prototype.pluginCommand = function(command, args) {
	    VProfile.GE.Game_Interpreter_pluginCommand.call(this, command, args);
	    if (command === 'Guts') {
	    	if (args[0] === 'Add') {
	    		$gameActors.actor(Number(args[1]))._gutsCounter += Number(args[2]);
	    	} 
	    	if (args[0] === 'Sub') {
	    		$gameActors.actor(Number(args[1]))._gutsCounter -= Number(args[2]);
	    	}
	    	if (args[0] === 'Mul') {
	    		$gameActors.actor(Number(args[1]))._gutsCounter *= Number(args[2]);
	    	}	    	
	    	if (args[0] === 'Div') {
	    		$gameActors.actor(Number(args[1]))._gutsCounter /= Number(args[2]);
	    	}	    	
	    }
	};
})(Game_Interpreter);

(function($){

	VProfile.GE.Game_Actor_initialize = Game_Actor.prototype.initialize;
	$.prototype.initialize = function(actorId) {
	    VProfile.GE.Game_Actor_initialize.call(this, actorId);
	    this._gutsCounter = g_eff_counterDef;
	    this._gutsCounterSB = 0;
	};
	VProfile.GE.Game_Actor_levelUp = Game_Actor.prototype.levelUp;
	$.prototype.levelUp = function() {
	    VProfile.GE.Game_Actor_levelUp.call(this);
	    var gutsChanceEX = Math.floor(Math.random() * 100);
	    if ($gameSwitches.value(g_eff_counterS)) {
		    if (gutsChanceEX >= g_eff_counterLChance) {
		    	this._gutsCounter += 1;
		    }
	    }
	};

	$.prototype.onDamage = function(value) {
	    Game_Battler.prototype.onDamage.call(this, value);
	    this.perform_gutsCounterDamage();
	};
	$.prototype.perform_gutsCounterDamage = function() {
		if (this._gutsCounterSB <= 0) {
			this._gutsCounterSB = 0;
			this.addState(this.deathStateId());
		} else {
			this.startAnimation(g_eff_animeID, false, g_eff_animeDelay);
			this._hp += Math.floor(Math.random() * this.param(3) + this.sparam(3)) + Math.floor(35.54 * this.sparam(3));
			this.removeState(this.deathStateId());
			this._gutsCounterSB -= 1;
		}
	}

	VProfile.GE.Game_Actor_stateResistSet = Game_Actor.prototype.stateResistSet;
	$.prototype.stateResistSet = function(stateId) {
		if (Imported.SOUL_Enemy_ResistDeath) {
			VProfile.GE.Game_Actor_stateResistSet.call(this, stateId);
		}
	    var gutsRes = Game_BattlerBase.prototype.stateResistSet.call(this, stateId);
	    if (this._gutsCounterSB < 0) this.removeState(this.deathStateId());
	    return gutsRes;
	};		
})(Game_Actor);

(function($){
	VProfile.GE.Scene_Battle_start = Scene_Battle.prototype.start;
	$.prototype.start = function() {
	    VProfile.GE.Scene_Battle_start.call(this);
	    for (var i = 0; i < $gameParty.battleMembers().length; i++) {
	    	$gameParty.battleMembers()[i]._gutsCounterSB += $gameParty.battleMembers()[i]._gutsCounter;
	    } 
	};	
})(Scene_Battle);