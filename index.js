const prompt = require('prompt-sync')({ sigint: true });

// characters
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

// game class
class Field {
	constructor() {
		this.fieldSize = []
		this.field = []
		this.playField = []
		this.user = {}
		this.hat = {}
		this.holes = []
		this.isPlaying = false
		this.mode = 1
	}

	// print method
	print() {
		console.log(this.playField.map(f => f.join('')).join('\n'));
	}

	// clone field method
	cloneField() {
		this.playField = [...this.field.map((f) => [...f])];
	}

	// reset method
	reset() {
		this.field = []
		this.playField = []
		this.user = {}
		this.hat = {}
		this.holes = []
		this.mode = 1
		this.isPlaying = false
	}

	// get input method
	getIntroInput() {
		console.log("let\’s find your hat!")
		const inputX = prompt("columns: ")
		console.clear()

		console.log("let\’s find your hat!")
		const inputY = prompt("rows: ")
		this.fieldSize = [parseInt(inputX), parseInt(inputY)]
		console.clear()

		console.log("let\’s find your hat! \n 1.easy \n 2.normal \n 3.hard")
		const inputMode = prompt("select mode (type 1, 2, 3): ")
		this.mode = parseInt(inputMode)
	}

	// generate field
	generateField() {
		// using nested for
		for (let i = 0; i < this.fieldSize[1]; i++) {
			this.field.push([]);
			for (let j = 0; j < this.fieldSize[0]; j++) {
				this.field[i].push(fieldCharacter);
			};
		};
		
		// // using array fill
		// let x = Array(this.fieldSize[0]).fill(fieldCharacter)
		// this.field = Array(this.fieldSize[1]).fill(x)
		
		this.cloneField()
	};

	// generate random position
	generateRandom() {
		let randomX = Math.floor(Math.random() * this.fieldSize[0]);
		let randomY = Math.floor(Math.random() * this.fieldSize[1]);
		return { x: randomX, y: randomY };
	};

	//  choose game play mode
	chooseMode(mode) {
		switch (mode) {
			case 1:
				return (this.fieldSize[0] * this.fieldSize[1]) * 0.3
			case 2:
				return (this.fieldSize[0] * this.fieldSize[1]) * 0.5
			case 3:
				return (this.fieldSize[0] * this.fieldSize[1]) * 0.7
			default:
				return (this.fieldSize[0] * this.fieldSize[1]) * 0.5
		}
	}

	// generate holes
	generateHoles(level) {
		let holesNum = this.chooseMode(level)
		let random
		for (let i = 0; i < holesNum; i++) {
			this.holes.push(this.generateRandom())
			this.playField[this.holes[i].y][this.holes[i].x] = hole
		}
	}

	// generate extra holes for hard mode 
	generateExtraHole() {
		// add an extra hole every step
		let random
		do {
			random = this.generateRandom()
		} while (random.x == this.user.y && random.y == this.user.x ||
			random.x == this.hat.y && random.y == this.hat.x)
		this.holes.push(random)
		this.playField[this.holes[this.holes.length - 1].y][this.holes[this.holes.length - 1].x] = hole
	}

	// generate user position
	generateUser() {
		this.user = this.generateRandom()
		this.playField[this.user.y][this.user.x] = pathCharacter
	}

	// generate hat position
	generateHat() {
		let random
		do {
			random = this.generateRandom()
		} while (random.x == this.user.y &&
			random.y == this.user.x)
		this.hat = random
		this.playField[this.hat.y][this.hat.x] = hat
	}
	
	// game logic
	gameWin() {
		console.log(`you win!!!`)
		console.log('have a good day!')
		this.isPlaying = false
	}

	gameOver() {
		const inputEnd = prompt('you lose:( try again? (y/n): ').toLowerCase()
		if (inputEnd === 'y') {
			this.reset()
			this.start()
		} else {
			console.log('have a good day!')
			return this.isPlaying = false
		}
	}

	checkLogic() {
		const isHat = this.user.x == this.hat.x && this.user.y == this.hat.y
		const isHole = this.holes.some(hole => {
			return this.user.x == hole.x && this.user.y == hole.y
		})
		const isOutside = this.user.x < 0 || this.user.x > this.fieldSize[0] - 1 || this.user.y < 0 || this.user.y > this.fieldSize[1] - 1

		if (isHat) {
			this.gameWin()
		} else if (isHole || isOutside) {
			this.gameOver()
		} else {
			this.playField[this.user.y][this.user.x] = pathCharacter
			// add extra holes
			if (this.mode == 3) {
				this.generateExtraHole()
			}
		}
	}

	// game movement
	moveUp() {
		this.user.y--
		this.checkLogic()
	};

	moveDown() {
		this.user.y++
		this.checkLogic()
	};

	moveLeft() {
		this.user.x--
		this.checkLogic()
	};

	moveRight() {
		this.user.x++;
		this.checkLogic()
	}

	// game initiator
	start() {
		console.clear()
		this.getIntroInput()
		this.generateField()
		this.generateHoles(this.mode)
		this.generateUser()
		this.generateHat()

		this.isPlaying = true;

		while (this.isPlaying) {
			console.clear();
			this.print();
			const input = prompt('type W, A, S, D: ').toLowerCase();
			switch (input) {
				case 'w':
					this.moveUp();
					break;
				case 'a':
					this.moveLeft();
					break;
				case 's':
					this.moveDown();
					break;
				case 'd':
					this.moveRight();
					break;
			}
		}
	}
	
 }

const game = new Field()
game.start()