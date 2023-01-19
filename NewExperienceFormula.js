(() => {
//=============================================================================
// Hells Toolkit MZ - Loot++
// VisuMZ_1_BattleCore.js
//=============================================================================

//=============================================================================    
    // All procedures are written here.
    /*:
 * @target MZ
 * @plugindesc A small Plugin for a simpler calculation of the EXP curve.
 * @author Hellinfernel
 * @url 
 * @base 
 * @orderAfter
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin gives you a simpler and more transparent way to calculate the needed experience for a level up.
 * ============================================================================
 * Requirements
 * ============================================================================
 * 
 *
 * 
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * ============================================================================
 * Parameter Calculations
 * ============================================================================
 * 
 * The following line is the calculation of the needed experience in total for a level:
 * 
 * return Math.round((basis * level) + (((flat * level * (level + 1)) * 0.5)));
 * 
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * === Class Notetags ===
 * 
 * <ExperienceFormularBase:100>
 * 
 * The basis amount of EXP that is required to level up.
 * 
 * <ExperienceFormularFlat:100>
 * 
 * The Flat increase in required EXP. This does increase with every level up you get ("Little Gauß");
 * 
 * 
 * 
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 
 * 1. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "Hellinfernel".
 * 
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Hellinfernel
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * .
 *
 * Version 0.10: January 12, 2020
 * First Alpha-Version
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * */
//=============================================================================

Game_Actor.prototype.expForLevel = function(level) {
    const c = this.currentClass();
    const basis = parseInt(c.meta.ExperienceFormularBase);
    const flat = parseInt(c.meta.ExperienceFormularFlat);
    //const extra = c.expParams[1];
    //const acc_a = c.expParams[2];
    //const acc_b = c.expParams[3];
    return Math.round((basis * level) + (((flat * level * (level + 1)) * 0.5)));
};
})();