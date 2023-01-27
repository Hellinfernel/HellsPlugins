"use strict";
(() => {
//=============================================================================
// Hells Toolkit MZ - Loot++
// VisuMZ_1_BattleCore.js
//=============================================================================

//=============================================================================    
    // All procedures are written here.
    /*:
 * @target MZ
 * @plugindesc Hells first Plugin! A small plugin which gives you advanced options to determine the drops of an enemy!
 * @author Hellinfernel
 * @url 
 * @base 
 * @orderAfter
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin gives you more control over enemy drops and gives you an efficient way to produce masses of common loot.
 * ============================================================================
 * Requirements
 * ============================================================================
 * 
 * Currently its dependent on the Visustella Engine because of the EnemyLevel Plugin.
 * In future updates, i will give you the option to use it without the Visustella Engine as soon as i found out how to actually do that.
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * ============================================================================
 * Parameter Calculations
 * ============================================================================
 * 
 * If an opponent is killed, then items are picked from the common loot table
 * until the value of the loot comes as close as possible to the total value
 * of the opponent, which is calculated as follows:
 * 
 * totalValue = HellsCommonDropBase + (HellsCommonDropFlat * (enemy.level - 1))
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * === Enemy Notetags ===
 * 
 * <HellsCommonDropList: (Item|Armor|Weapon):x w:y>
 * 
 * This notetag is a list of things that can be dropped. A distinction can be made between items, weapons and armor.
 * "x" is the id of the item|Weapon|Armor.
 * With the w:y you can determine the weight of these drops. a higher weight increases the chance of being dropped compared to other drops.
 * "y" is a number, where currently only whole numbers are processed correctly (integer).
 * This modifier is optional. If you dont use it, the weight of the item will be set to 1.
 * 
 * You can make several entries with the note tag by repeating the same sequence several times within the notetag.
 * 
 * Example:
 * 
 * <HellsCommonDropList: Item:1 w:5>
 * <HellsCommonDropList: Item:1 w:5,
 * Weapon:2 w:2,
 * Armor:3>
 * 
 * <HellsCommonDropBase: x>
 * 
 * This Notetag determines the base value of the opponent's drops.
 * The amount of drops is measured by the value of the items that are in the list (<HellsCommonDropList:(Item|Armor|Weapon):x w:y>).
 * 
 * <HellsCommonDropFlat: x>
 *
 * This notetag determines the flat increase in the value of the opponent's drops.
 * 
 * The amount of drops is measured by the value of the items that are in the list (<HellsCommonDropList:(Item|Armor|Weapon):x w:y>).
 * 
 * <HellsRareDropList:(Item|Armor|Weapon):x r:y>
 * 
 *  This notetag is a list of things that can be dropped as Rare Drops. A distinction can be made between items, weapons and armor.
 *  "x" is the id of the item|Weapon|Armor.
 *  With the r:y you can determine the droprate of these drops (in percent).
 *  "y" is a number, where currently only whole numbers are processed correctly (integer).
 *  This modifier is optional. If you dont use it, the Droprate of the item will be set to 100, which means that it drops every time.
 * 
 * You can make several entries with the note tag by repeating the same sequence several times within the notetag.
 * 
 * Example:
 * 
 * <HellsRareDropList: Item:1 r:50>
 * <HellsRareDropList: Item:1 r:50,
 * Weapon:2 r:20,
 * Armor:3>
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

const alias = Game_Enemy.prototype.makeDropItems;
Game_Enemy.prototype.makeDropItems = function(){
    //const regex1 = /Item\s*:\s*(\d+)\s*(\s*w:(\d+))?/gm;
    const regex1new = /(?<ItemCategory>Item|Armor|Weapon)\s*:\s*(?<ID>\d+)\s*(?<Weight>w:(?<WeightFactor>\d+))?/gm;
    const regexRareDrops = /(?<ItemCategory>Item|Weapon|Armor)\s*:\s*(?<ID>\d+)\s*(?<DropRate>r:\s*(?<DropRateChance>\d*))?/gm;
    //The list of the actually droping items. the same item can occur multiple times.
    let actualDropList = new Array;
    let foundTagEntrysList;
    let commonItemDataMap = new Map;
    let CommonDropBase;
    let CommonDropFlat;
    let level = this._level;
    let CommonDropWorth;
    let rareItemDataMap = new Map;
    let foundTagRareEntrysList;
    //const regex1NotGlobal = /Item\s*:\s*(\d+)/;
    //const regexWeight = /(w:(\d+))/;
    // /Item \d+: \d+,
    //Array with a list of the matches
    if(this.enemy().meta.HellsCommonDropList){
        foundTagEntrysList = Array.from(this.enemy().meta.HellsCommonDropList.matchAll(regex1new), entry => entry);
        commonItemDataMap = new Map;
        newTagsAnalyser();
        CommonDropBase = parseInt(this.enemy().meta.HellsCommonDropBase);
        CommonDropFlat = parseInt(this.enemy().meta.HellsCommonDropFlat);
        level = this._level;
        CommonDropWorth = CommonDropBase + (CommonDropFlat * (level - 1));
        commonDropsCalculation();
    }
    if(this.enemy().meta.HellsRareDropList){
        foundTagRareEntrysList = Array.from(this.enemy().meta.HellsRareDropList.matchAll(regexRareDrops), entry => entry);
        newRareTagsAnalyser();
        rareDropsCalculation();

    }
    
    //console.log("matches found:");
    //foundTagEntrysList.forEach(element => console.log(element.toString()));
    //Array with a list of the data the matches 


    //The list of the actually droping items. the same item can occur multiple times.
    //This is the value of the common drops the unit is supposed to drop. The higher it is, the more value you can get.
    //console.log("HellsCommonDropBase: " + this.enemy().meta.HellsCommonDropBase);
    //console.log("HellsCommonDropFlat: " + this.enemy().meta.HellsCommonDropFlat);
    //console.log("CommonDropWorth:  " + CommonDropWorth);
    //console.log(typeof CommonDropWorth);
    //Array.from(commonItemDataMap.entries()).filter(Item => Item[0].price <= CommonDropWorth).map(value => {return value[0],value[1];} );
    /*var cleanFilteredList = function(){
        return commonItemDataList.filter((Item => Item.price <= CommonDropWorth));

    };*/

    /* var cleanCommondropList = function(){
        commonItemDataList.forEach(Item => {
            if(Item.price < CommonDropWorth){
                commonItemDataList.remove(Item);
            }});
            for(var i = 0; i < commonItemDataList.length; i++){ 
                                   
                if ( arr[i] === 5) { 
                    commonItemDataList.splice(i, 1); 
                    i--; 
                }
            }
    }*/
    //console.log("actualDropList: "+ typeof actualDropList);
    //actualDropList.forEach(x => console.log(typeof x));
    return actualDropList.concat(alias.call(this));

    function rareDropsCalculation() {
        rareItemDataMap.forEach((value, key) => {
            let randomNumber = Math.ceil(Math.random() * 100);
                if (value >= randomNumber) {
                    actualDropList.push(key);
                }
        });
            /* filteredMap =  Array.from(commonItemDataMap.entries())
             .filter(Item => Item[0].price <= CommonDropWorth)
             .map(value => {return [value[0]*value[1]];});*/
        
    }

    function commonDropsCalculation() {
        while (filteredMap().size >= 1) {
            let item = null;
            let randomNumber = Math.ceil(Math.random() * combinedWeight());
            //console.log("randomNumber: "+ randomNumber);
            filteredMap().forEach((value, key) => {
                //console.log("currentItem: " + key.name);
                if (item == null) {
                    if (value >= randomNumber) {
                        item = key;
                        //console.log("Choosen Item: " + item.name);
                    }
                    else {
                        randomNumber = randomNumber - value;
                    }
                }
            });


            CommonDropWorth = CommonDropWorth - item.price;
            actualDropList.push(item);

            /* filteredMap =  Array.from(commonItemDataMap.entries())
             .filter(Item => Item[0].price <= CommonDropWorth)
             .map(value => {return [value[0]*value[1]];});*/
        }
    }

    function filteredMap() {
        let map = new Map;
        commonItemDataMap.forEach((value, key) => {
            if (key.price <= CommonDropWorth) {
                map.set(key, value);
                //console.log("item in filteredMap: " + key.name + value);
            }
        });
        return map;
    };


    function TagsAnalyser() {
        foundTagEntrysList.forEach(matchedElement => {
            if (regex1NotGlobal.test(matchedElement)) {
                let Item;
                let Weight;
                let subStringArray = matchedElement.match(regex1NotGlobal)[0].split(':');
                //Extract ID
                //let itemID = substring1.slice(":")[0];
                //Extract Value of the Item
                //let itemValue = substring1.slice(":")[1];
                //commonItemDataList.add($dataItems[substring1]);
                Item = $dataItems[subStringArray[1]];
                //console.log($dataItems[subStringArray[1]].name);
                if (regexWeight.test(matchedElement)) {
                    let substringArray2 = matchedElement.match(regexWeight)[0].split(':');
                    Weight = parseInt(substringArray2[1]);
                }
                else {
                    Weight = 1;
                }
                commonItemDataMap.set(Item, Weight);

            }
        });
    }
    function newTagsAnalyser() {
        foundTagEntrysList.forEach(matchedElement => {
            
                let Item;
                let Weight;
                let ID = matchedElement.groups.ID;
                    switch (matchedElement.groups.ItemCategory) {
                        case "Item":
                            Item = $dataItems[ID];
                            break;

                        case "Weapon":
                            Item = $dataWeapons[ID];
                            break;

                        case "Armor":
                            Item = $dataArmors[ID];
                            break;
                        default:
                            break;
                    }
                    if (typeof matchedElement.groups.Weight !== 'undefined'){
                        Weight = matchedElement.groups.WeightFactor; 
                    }
                    else{
                        Weight = 1; 
                    }
                commonItemDataMap.set(Item, Weight);

            
        });
    }
    function combinedWeight(){
        let Weight = 0;
        filteredMap().forEach((value, key) => Weight = parseInt(Weight) + parseInt(value));
        return Weight;
    }
    function newRareTagsAnalyser() {
        foundTagRareEntrysList.forEach(matchedElement => {
            
                let Item;
                let DropChance;
                let ID = matchedElement.groups.ID;
                    switch (matchedElement.groups.ItemCategory) {
                        case "Item":
                            Item = $dataItems[ID];
                            break;

                        case "Weapon":
                            Item = $dataWeapons[ID];
                            break;

                        case "Armor":
                            Item = $dataArmors[ID];
                            break;
                        default:
                            break;
                    }
                    if (matchedElement.groups.DropRate){
                        DropChance = matchedElement.groups.DropRateChance; 
                    }
                    else{
                        DropChance = 100; 
                    }
                rareItemDataMap.set(Item, DropChance);

            
        });
    }
    }
    



/*//This function cleans the List of items that are not enough worth to be choosen.
function cleanCommondropList(){
    commonItemDataList.forEach(Item => {
        if(Item.value < CommonDropWorth){
            commonItemDataList.remove(Item);
        }});
}*/



})();
