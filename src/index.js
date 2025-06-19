const player1 = {
    NOME: "Mario",
    VELOCIDADE: 4,
    MANOBRABILIDADE: 3,
    PODER: 3,
    PONTOS: 0,
};

const player2 = {
    NOME: "Peach",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 2,
    PONTOS: 0,
};

const player3 = {
    NOME: "Yoshi",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 4,
    PODER: 3,
    PONTOS: 0,
};

const player4 = {
    NOME: "Browser",
    VELOCIDADE: 5,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
};

const player5 = {
    NOME: "Luigi",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 4,
    PONTOS: 0,
};

const player6 = {
    NOME: "Donkey Kong",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
};
async function rollDice(){
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() { 
    let random = Math.random();
    let result

    switch(true){ 
		case random < 0.33:
			result = "RETA"
			break;
		case random < 0.66:
			result = "CURVA"
			break;
		default:
			result= "CONFRONTO"
	}
	return result
}

async function playRaceEngine(character1, character2) {
    
    for (let i = 0; i <= 5; i++) { 
        console.log(`🏁Rodada ${i}`);

        // Draw block
		let block = await getRandomBlock()
		console.log(`Bloco: ${block}`);

		// Roll the dice
		let diceResult1 = await rollDice()
		let diceResult2 = await rollDice()

		// Skill test
		let totalTestSkill1 = 0;
		let totalTestSkill2 = 0;

    }
}

(async function main() {
    console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando... \n `);

    await playRaceEngine(player1, player2);
})() 
