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
 * @plugindesc Hells first Plugin! A small plugin which allows you to m
 * @author Hellinfernel
 * @url 
 * @base
 * @orderAfter
 * */
//=============================================================================
Game_Enemy.prototype.makeDropItems = function(){
    const regex1 = /Item\s*:\s*(\d+)\s*(\s*w:(\d+))?/gm;
    const regex1NotGlobal = /Item\s*:\s*(\d+)/;
    const regexWeight = /(w:(\d+))/;
    // /Item \d+: \d+,
    //Array with a list of the matches 
    let foundTagEntrysList = Array.from(this.enemy().meta.HellsCommonDropList.matchAll(regex1), entry => entry[0]);
    console.log("matches found:");
    foundTagEntrysList.forEach(element => console.log(element.toString()));
    //Array with a list of the data the matches 
    let commonItemDataMap = new Map;

    //The list of the actually droping items. the same item can occur multiple times.
    let actualDropList = new Array;
    TagsAnalyser();
    //This is the value of the common drops the unit is supposed to drop. The higher it is, the more value you can get.
    let CommonDropWorth = this.enemy().meta.HellsCommonDropBase /*+ (enemy.dataObject.meta.HellsCommonDropFlat * (this.enemy.level-1))*/;
    filteredMap();

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
    while (filteredMap().size >= 1){
        let item = null;
        let randomNumber = Math.floor(Math.random()*combinedWeight());
        console.log("randomNumber: "+ randomNumber);
        filteredMap().forEach((value,key) => {
            console.log("currentItem: " + key.name);
        if(item == null){
            if(value >= randomNumber){
                item = key;
                console.log("Choosen Item: " + item.name);
            }
        }});
            
        
        CommonDropWorth = CommonDropWorth - item.price;
        actualDropList.push(item);
    
       /* filteredMap =  Array.from(commonItemDataMap.entries())
        .filter(Item => Item[0].price <= CommonDropWorth)
        .map(value => {return [value[0]*value[1]];});*/
        
    }
    console.log("actualDropList: "+ typeof actualDropList);
    actualDropList.forEach(x => console.log(typeof x));
    return actualDropList;

    function filteredMap() {
        let map = new Map;
        let weightCount = 0;
        commonItemDataMap.forEach((value, key) => {
            if (key.price <= CommonDropWorth) {
                weightCount = weightCount + value;
                map.set(key, weightCount);
                console.log("item in filteredMap: " + key.name + weightCount)
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
                console.log($dataItems[subStringArray[1]].toString());
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
    function combinedWeight(){
        let Weight = 0;
        filteredMap().forEach((value, key) => Weight = Weight + value);
        return Weight;
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
