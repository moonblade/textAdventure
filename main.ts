var constants = {
    defaultPlayerName: "player",
    startLocation: "startLocation",
    endMarker: '.',
    invalidCommand: "Invalid Command"
}

var variables = {
    gameStepText: [],
    gameText: [],
}

class Game {
    static commandList = [];
    static print(string: String) {
        // Save till endMarker, when endMarker comes, print it on screen
        if (string == constants.endMarker) {
            variables.gameText = variables.gameStepText.concat(variables.gameText);
            Game.updateGameScreen();
            variables.gameStepText = [];
        }else{
            variables.gameStepText.push(string);
        }
    }

    static reset() {
        var boxList:Array<Box>;
        var roomList:Array<Room>;
    }

    static execute(command: Command) {
        Game.print(command.toString());
        switch (command.verb) {
            case 'help':
                Command.generateHelp();
                break;
            // case 'go':
                // break;
            default:
                Game.print(constants.invalidCommand);
                break;
        }
        Game.print(constants.endMarker);

    }

    // Send the gameStep to the screen
    static updateGameScreen() {
        var gameTextDiv = ( < HTMLElement > document.getElementById('gameText'))
        var divElement = document.createElement("div");
        var pElement = document.createElement("pre");
        for (var key in variables.gameStepText) {
            pElement.textContent += variables.gameStepText[key] + "\n";
            divElement.appendChild(pElement);
        }
        gameTextDiv.insertBefore(divElement, gameTextDiv.firstChild);

    }
}

function has(array, element) {
    return array.indexOf(element) > -1;
}

class Command {

    static commands = {
        'inventory': {
            desc: 'Print inventory',
            alternatives: ['inv']
        },
        'look': {
            desc: 'Give description of the room you\'re in',
            alternatives: ['info']
        },
        'go': {
            desc: 'Go to the specified direction',
            alternatives: ['move', 'walk'],
            extraDescription : '\tCan also use north, east, south, west, up, down, n, e, s, w as well',
            extra: ['[direction]'],
            directions: {
                'north': 'go north',
                'n': 'go north',
                'south': 'go south',
                's': 'go south',
                'east': 'go east',
                'e': 'go east',
                'west': 'go west',
                'w': 'go west',
                'up': 'go up',
                'down': 'go down',
            }
        },
        'take': {
            desc: 'Take an object',
            alternatives: ['pick', 'fill'],
            extra: '[object]'
        },
        'put': {
            desc: 'Put an object',
            alternatives: ['place', 'keep', 'fix', 'pour'],
            extra: '[object]'
        },
        'open': {
            desc: 'Try to open the object',
            alternatives: ['unlock'],
            extra: '[object]'
        },
        'attack': {
            desc: 'Try to kill the enemy',
            alternatives: ['kill'],
            extra: '[enemy]'
        },
        'make': {
            desc: 'Make object if the materials are present',
            alternatives: ['craft', 'build'],
            extra: '[object]'
        },
        'ls': {
            desc: 'Combination of inventory and look'
        },
        'save': {
            desc: 'Create a checkpoint that can be loaded later',
            extra: '[tag]'
        },
        'load': {
            desc: 'Load a checkpoint that has been saved',
            extra: '[tag]'
        },
        'reset': {
            desc: 'Start game from beginning again',
            alternatives: ['redo', 'reboot', 'restart']
        },
        'clear': {
            desc: 'Clear the screen of game text'
        },
        'help': {
            desc: 'Print this help menu'
        },
    }
    verb: String;
    object: String;
    constructor() {
        var str = ( < HTMLInputElement > document.getElementById('command')).value;
        // splits string into an array of words, taking out all whitespace
        var parts = str.split(/\s+/);
        // command is the first word in the array, which is removed from the array
        this.verb = parts.shift();
        // the rest of the words joined together.  If there are no other words, this will be an empty string
        this.object = parts.join(' ');
        // check if valid, if not valid, clear the command
        // Clear the command
        ( < HTMLInputElement > document.getElementById('command')).value = "";
    }

    public toString(){
        return this.verb + " " + this.object;
    }

    static generateHelp() {
        Game.print("The following commands are available");
        for (var key in Command.commands) {
            var command = Command.commands[key];
            var extra = (command.extra ? " " + command.extra : "");
            var helpText = key + extra;
            if (command.alternatives){
                for (let alternative of command.alternatives) 
                    helpText += "/ " + alternative + extra;
            }
            Game.print(helpText + " : " + command.desc);
            if (command.extraDescription)
                Game.print(command.extraDescription);
        }
    }

    // Check if a given command is valid
    public isValid() {
        // If no command entered invalid
        if (this.verb == '')
            return false;
        for (var key in Command.commands) {
            // If command is one of direct commands, then it is valid
            if (key == this.verb) {
                // If required extra field is not given, then its not valid
                if (Command.commands[key].extra)
                    if (this.object == '')
                        return false;
                return true;
            }
            // If command is one of the alternatives, its valid
            if (Command.commands[key].alternatives)
                if (has(Command.commands[key].alternatives, this.verb)) {
                    // If required extra field is not given, then its not valid
                    if (Command.commands[key].extra)
                        if (this.object == '')
                            return false;
                    this.verb = key;
                    return true;
                }
        }
        return false;
    }
}

class Unique {
    static ids = [];
    public id: String;
    public name: String;
    public desc: String;
}

interface Interactible {

}

interface Attackable extends Interactible{
    attack();
}

interface Openable extends Interactible {
    opensWith:String;
    open();
}

class Box extends Unique  implements Openable{
    public material: String;
    public locked: boolean;
    public opensWith: String;
    public contents: Array < any > ;
    public open(){
    }
}

class Character extends Unique {
    inventory: Array < any > ;
    location: String;
    constructor(name: String) {
        super();
        this.name = name;
        this.inventory = [];
        this.location = constants.startLocation;
    }

    public has(searchItem:String) {
        for(let item of this.inventory)
        {
            has(item, searchItem)
                return true;
        }   
        return false;
    }

    public moveTo(location) {
        console.log("Moving To " + location);
        this.location = location;
    }
}

class Room extends Unique {
    shortName: String;
    description: String;
    constructor(name:String) {
        super();
        this.name = name;
    }
}

function doCommand() {
    var command = new Command();
    Game.execute(command);
}

let player = new Character(constants.defaultPlayerName);
// console.log(player)