const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const players = [
    { NOME: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0 },
    { NOME: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0 },
    { NOME: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0 },
    { NOME: "Bowser", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
    { NOME: "Luigi", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0 },
    { NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 }
];

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";
    return "CONFRONTO";
}

async function getConfrontoPenalty() {
    return Math.random() < 0.5 ? { type: "Casco", value: 1 } : { type: "Bomba", value: 2 };
}

async function chanceTurbo() {
    return Math.random() < 0.5;
}

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

async function selectPlayer(playerNumber) {
    console.log(`\nEscolha o ${playerNumber}º personagem:`);
    players.forEach((player, index) => {
        console.log(`${index + 1} - ${player.NOME}`);
    });

    let index;
    while (true) {
        let answer = await askQuestion(`Digite o número do personagem: `);
        index = parseInt(answer) - 1;
        if (index >= 0 && index < players.length) break;
        console.log("Escolha inválida. Tente novamente.");
    }

    // Criar uma cópia independente do personagem
    return { ...players[index], PONTOS: 0 };
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou em dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {
    for (let i = 1; i <= 5; i++) {
        console.log(`\n🏁 Rodada ${i}`);

        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;
            await logRollResult(character1.NOME, "velocidade", diceResult1, character1.VELOCIDADE);
            await logRollResult(character2.NOME, "velocidade", diceResult2, character2.VELOCIDADE);
        }
        else if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;
            await logRollResult(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);
        }
        else if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com ${character2.NOME} 🥊`);
            await logRollResult(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "poder", diceResult2, character2.PODER);

            if (powerResult1 > powerResult2) {
                let penalty = await getConfrontoPenalty();
                let loss = Math.min(penalty.value, character2.PONTOS);
                character2.PONTOS -= loss;
                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu ${loss} ponto(s) por ${penalty.type} 🐢`);

                if (await chanceTurbo()) {
                    character1.PONTOS++;
                    console.log(`${character1.NOME} ganhou um TURBO! +1 ponto 🚀`);
                }
            }
            else if (powerResult2 > powerResult1) {
                let penalty = await getConfrontoPenalty();
                let loss = Math.min(penalty.value, character1.PONTOS);
                character1.PONTOS -= loss;
                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu ${loss} ponto(s) por ${penalty.type} 🐢`);

                if (await chanceTurbo()) {
                    character2.PONTOS++;
                    console.log(`${character2.NOME} ganhou um TURBO! +1 ponto 🚀`);
                }
            }
            else {
                console.log(`Confronto empatado! Ninguém perdeu pontos.`);
            }
        }

        if (block !== "CONFRONTO") {
            if (totalTestSkill1 > totalTestSkill2) {
                character1.PONTOS++;
                console.log(`${character1.NOME} marcou um ponto!`);
            }
            else if (totalTestSkill2 > totalTestSkill1) {
                character2.PONTOS++;
                console.log(`${character2.NOME} marcou um ponto!`);
            }
            else {
                console.log("Rodada empatada! Ninguém marcou ponto.");
            }
        }

        console.log("_______________________________________________________________________________");
    }
}

async function declareWinner(character1, character2, ranking) {
    console.log("\nResultado final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n🏆 ${character1.NOME} venceu a corrida!`);
        ranking.push(character1.NOME);
    }
    else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n🏆 ${character2.NOME} venceu a corrida!`);
        ranking.push(character2.NOME);
    }
    else {
        console.log("A corrida terminou em empate!");
        ranking.push("Empate");
    }
}

async function showRanking(ranking) {
    console.log("\n🏅 RANKING DE VENCEDORES:");
    ranking.forEach((winner, index) => {
        console.log(`${index + 1}º corrida: ${winner}`);
    });
}

async function main() {
    let ranking = [];

    while (true) {
        console.log("\n\n===============================");
        console.log("🏎️ BEM-VINDO A CORRIDA MARIO KART");
        console.log("===============================\n");

        let player1 = await selectPlayer(1);
        let player2;
        while (true) {
            player2 = await selectPlayer(2);
            if (player1.NOME !== player2.NOME) break;
            console.log("Escolha dois personagens diferentes!");
        }

        console.log(`\nCorrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);
        await playRaceEngine(player1, player2);
        await declareWinner(player1, player2, ranking);

        let again = await askQuestion("\nQuer jogar outra corrida? (s/n): ");
        if (again.toLowerCase() !== "s") break;
    }

    await showRanking(ranking);
    rl.close();
}

main();
