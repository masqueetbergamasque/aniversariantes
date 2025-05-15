// Dados originais dos aniversariantes
const aniversariantesData = [
    { nome: 'ANDRé PEREIRA TELES', aniversario: '23 de Junho', email: 'andre.teles@mpgo.mp.br', cargo: 'ASSESSOR ADMINISTRATIVO' },
    { nome: 'CLEUTON CORREA DE SOUZA FILHO', aniversario: '12 de Julho', email: 'cleuton.correa@mpgo.mp.br', cargo: 'ASSISTENTE DA PROCURADORIA-GERAL DE JUSTIÇA' },
    { nome: 'GUSTAVO OSORIO RIZZI LIPPI', aniversario: '18 de Fevereiro', email: 'gustavo.lippi@mpgo.mp.br', cargo: 'ASSESSOR JURIDICO' },
    { nome: 'JOSé SOARES COSTA FILHO', aniversario: '09 de Julho', email: 'jose.soares@mpgo.mp.br', cargo: 'AUXILIAR MOTORISTA / MOTORISTA DA ADMINISTRAÇÃO SUPERIOR' },
    { nome: 'JULIANA AMORIM PINTO', aniversario: '20 de Abril', email: 'juliana.pinto@mpgo.mp.br', cargo: 'ASSESSOR JURIDICO' },
    { nome: 'LAILA SABRINA FERREIRA BORBA', aniversario: '22 de Agosto', email: 'laila.borba@mpgo.mp.br', cargo: 'ASSESSOR JURIDICO' },
    { nome: 'LORRAYNE CHRISTYNE DOS SANTOS CRUZ', aniversario: '06 de fevereiro', email: 'lorrayne.cruz@mpgo.mp.br', cargo: 'ANALISTA EM INFORMÁTICA / ASSESSOR DA PROCURADORIA-GERAL DE JUSTIÇA' },
    { nome: 'THIAGO MARQUES MENESES', aniversario: '05 de Fevereiro', email: 'thiago.meneses@mpgo.mp.br', cargo: 'ASSESSOR ADMINISTRATIVO' },
    { nome: 'Dr. Marcelo André de Azevedo', aniversario: '08 de Janeiro', email: 'marcelo.azevedo@mpgo.mp.br', cargo: 'Subprocuradoria-Geral de Justiça para Assuntos de Planejamento, Estratégia e Inovação' },
    { nome: 'Dr. Rafael Correa Costa', aniversario: '01 de Dezembro', email: 'rafael.correa@mpgo.mp.br', cargo: 'Promotor de Justiça e Assessor Jurídico-Administrativo da PGJ' },
    { nome: 'Dra. Liana Antunes Vieira Tormin', aniversario: '24 de Fevereiro', email: 'liana.tormin@mpgo.mp.br', cargo: 'Promotora de Justiça e Assessora Jurídica-Administrativa da PGJ' }
];

// Array para armazenar os dados processados e ordenados
let processedAndSortedAniversariantesData = [];

// Mapeamento dos nomes dos meses para números (Janeiro é 0, Fevereiro é 1, etc.)
const monthMap = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5,
    'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
};

// --- Funções de Formatação de Nome ---

function cleanNamePrefixes(name) {
    if (!name) return "";
    return name.replace(/Dr\. |Dra\. /gi, '').trim();
}

function toTitleCase(str) {
    if (!str) return "";
    str = str.toLowerCase();
    const wordsToKeepLowercase = new Set(['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'para', 'com', 'por', 'sem']);

    const words = str.split(' ');
    const titleCaseWords = words.map((word, index) => {
        if (!word) return "";
        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        if (index > 0 && wordsToKeepLowercase.has(word)) {
            return word;
        } else {
            return capitalizedWord;
        }
    });

    return titleCaseWords.join(' ');
}

// --- Função de Parse de Data ---

function parseBirthdayString(birthdayString) {
    const parts = birthdayString.toLowerCase().replace(' de ', ' ').split(' ');
    if (parts.length >= 2) {
        const day = parseInt(parts[0], 10);
        const monthName = parts[1];
        const month = monthMap[monthName];
        if (!isNaN(day) && month !== undefined) {
            return { day: day, month: month }; // month é 0-indexed
        }
    }
    return null; // Retorna null se não conseguir parsear
}


// --- Função para calcular o próximo aniversário e dias restantes para uma pessoa ---
function calculateNextBirthdayInfo(person) {
    const birthdayInfo = parseBirthdayString(person.aniversario);
    let nextBirthdayDate = null;
    let daysUntilNextBirthday = -1; // Indica erro ou data inválida

    if (birthdayInfo) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera as horas de hoje

        const { day, month } = birthdayInfo;

        let nextBdayDateCandidate = new Date(today.getFullYear(), month, day);
        nextBdayDateCandidate.setHours(0, 0, 0, 0); // Zera as horas da data de aniversário

        // Se o aniversário deste ano já passou ou é hoje (comparando apenas data)
        if (nextBdayDateCandidate < today) {
            nextBdayDateCandidate.setFullYear(today.getFullYear() + 1); // Próximo aniversário é no próximo ano
        }

        const diffTime = nextBdayDateCandidate.getTime() - today.getTime();
        daysUntilNextBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferença em dias, arredonda para cima

         // Ajuste para o caso de ser exatamente hoje (diffTime pode ser levemente negativo se a hora atual for após a hora da data criada)
         if (daysUntilNextBirthday < 0 && nextBdayDateCandidate.getDate() === today.getDate() &&
             nextBdayDateCandidate.getMonth() === today.getMonth() &&
             nextBdayDateCandidate.getFullYear() === today.getFullYear()) {
             daysUntilNextBirthday = 0;
         }


        nextBirthdayDate = nextBdayDateCandidate; // Armazena o objeto Date real para ordenação
    }

    return {
        nextBirthdayDateObj: nextBirthdayDate, // Objeto Date do próximo aniversário
        daysUntilNextBirthday: daysUntilNextBirthday // Número de dias restantes
    };
}


// --- Função para exibir a lista de aniversariantes (Inclui email e dias restantes) ---
function displayAniversariantes(peopleToDisplay) {
    console.log('Dentro de displayAniversariantes. Array a ser exibido:', peopleToDisplay); // <<< DEBUG LOG
    const listContainer = document.getElementById('aniversariantes-list');
    console.log('Contêiner da lista encontrado:', listContainer); // <<< DEBUG LOG
    listContainer.innerHTML = ''; // Limpa a lista atual

    if (peopleToDisplay.length === 0) {
         console.log('Array peopleToDisplay está vazio. Exibindo mensagem.'); // <<< DEBUG LOG
         listContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
         return;
    }

    console.log(`Array peopleToDisplay NÃO está vazio. Iterando sobre ${peopleToDisplay.length} itens.`); // <<< DEBUG LOG

    peopleToDisplay.forEach(person => {
        // console.log('Criando cartão para:', person.nomeProcessado); // <<< DEBUG LOG OPCIONAL
        const personCard = document.createElement('div');
        personCard.classList.add('person-card');

        const nameElement = document.createElement('h3');
        nameElement.textContent = person.nomeProcessado; // Usa nome processado

        const emailElement = document.createElement('p');
        emailElement.classList.add('person-email'); // Classe para o email
        emailElement.textContent = person.email;

        const birthdayElement = document.createElement('p');
        birthdayElement.classList.add('birthday-date'); // Classe para a data
        birthdayElement.textContent = person.aniversario; // Exibe a string original

        // Elemento para os dias restantes
        const daysElement = document.createElement('p');
        daysElement.classList.add('days-remaining'); // Classe para os dias restantes

        // Define o texto dos dias restantes
        if (person.daysUntilNextBirthday === 0) {
             daysElement.textContent = '🥳 É ANIVERSÁRIO HOJE!';
         } else if (person.daysUntilNextBirthday > 0) {
             daysElement.textContent = `Faltam ${person.daysUntilNextBirthday} dias`;
         } else {
             daysElement.textContent = 'Data inválida';
         }


        // Adiciona os elementos ao cartão na ordem desejada
        personCard.appendChild(nameElement);
        personCard.appendChild(emailElement); // Email abaixo do nome
        personCard.appendChild(birthdayElement); // Data abaixo do email
        personCard.appendChild(daysElement); // Dias restantes abaixo da data


        listContainer.appendChild(personCard); // Adiciona o cartão completo ao contêiner da lista
    });

    console.log('Loop de displayAniversariantes finalizado. Elementos deveriam estar na tela.'); // <<< DEBUG LOG
}

// Função para realizar a busca (busca nos dados processados e ordenados)
function searchAniversariantes() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();

    // Filtra os dados *processados e ordenados*
    const filteredData = processedAndSortedAniversariantesData.filter(person => {
        // Busca no nome processado
        return person.nomeProcessado.toLowerCase().includes(filter);
    });

    // Exibe os resultados filtrados (mantendo a ordem original dos filtrados)
    displayAniversariantes(filteredData);
}

// Função para calcular e exibir os próximos aniversários e os de hoje no ALERTA
function calculateAndDisplayAlertBirthdays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let nextBirthday = null;
    let minDays = Infinity;
    const todayBirthdays = [];

    // Itera sobre os dados *processados e ordenados*
    processedAndSortedAniversariantesData.forEach(person => {
        // Usa as informações já calculadas e armazenadas no objeto person
        const { nextBirthdayDateObj, daysUntilNextBirthday } = person;

        if (nextBirthdayDateObj) { // Se a data foi calculada corretamente
             // Verifica se é aniversário hoje (já temos os dias calculados)
            if (daysUntilNextBirthday === 0) {
                todayBirthdays.push(person);
            }
            // Verifica se é o próximo aniversário (tem que ser no futuro)
            else if (daysUntilNextBirthday > 0 && daysUntilNextBirthday < minDays) {
                minDays = daysUntilNextBirthday;
                nextBirthday = person;
            }
        }
    });

    // Atualiza a seção de alertas no HTML
    const todayAlertElement = document.getElementById('today-birthday-alert');
    const nextAlertElement = document.getElementById('next-birthday-alert');

    todayAlertElement.innerHTML = ''; // Limpa alertas anteriores
    nextAlertElement.innerHTML = '';

    if (todayBirthdays.length > 0) {
        const names = todayBirthdays.map(p => p.nomeProcessado).join(', ');
        todayAlertElement.innerHTML = `🥳🎉 É ANIVERSÁRIO HOJE de: <strong>${names}</strong>! Felicidades!`;
    } else {
         todayAlertElement.textContent = `Não há aniversariantes hoje.`;
    }


    if (nextBirthday) {
        // A data do próximo aniversário já está no objeto nextBirthday.nextBirthdayDateObj
        const options = { day: 'numeric', month: 'long' };
        const formattedNextDate = nextBirthday.nextBirthdayDateObj.toLocaleDateString('pt-BR', options);

        nextAlertElement.innerHTML = `Próximo aniversário: <strong>${nextBirthday.nomeProcessado}</strong> em ${formattedNextDate} (faltam ${minDays} dias).`;
    } else {
        nextAlertElement.textContent = `Não foi possível determinar o próximo aniversário.`;
    }
}


// --- Event Listeners ---

// Espera o HTML carregar completamente antes de rodar o JavaScript
document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM completamente carregado. Iniciando processamento...'); // <<< DEBUG LOG

    // --- Processa, CALCULA datas por pessoa e ORDENA os dados ao carregar ---
    processedAndSortedAniversariantesData = aniversariantesData.map(person => {
        const cleanedName = cleanNamePrefixes(person.nome);
        const titleCasedName = toTitleCase(cleanedName);

        // Calcula as informações do próximo aniversário para CADA pessoa
        const birthdayInfo = calculateNextBirthdayInfo(person);

        return { // Cria um novo objeto com todos os dados originais + processados + calculados
            ...person, // Copia todas as propriedades do objeto original
            nomeProcessado: titleCasedName, // Adiciona o nome formatado
            nextBirthdayDateObj: birthdayInfo.nextBirthdayDateObj, // Adiciona o objeto Date
            daysUntilNextBirthday: birthdayInfo.daysUntilNextBirthday // Adiciona os dias restantes
        };
    });

    console.log('Dados processados (antes da ordenação):', processedAndSortedAniversariantesData); // <<< DEBUG LOG

    // --- Ordena os dados pelo próximo aniversário ---
    processedAndSortedAniversariantesData.sort((a, b) => {
        // Compara as datas do próximo aniversário (já calculadas)
        // Coloca pessoas com data inválida no final
        if (!a.nextBirthdayDateObj && !b.nextBirthdayDateObj) return 0;
        if (!a.nextBirthdayDateObj) return 1;
        if (!b.nextBirthdayDateObj) return -1;

        // Compara as timestamps das datas
        return a.nextBirthdayDateObj.getTime() - b.nextBirthdayDateObj.getTime();
    });

    console.log('Dados processados e ordenados (após a ordenação):', processedAndSortedAniversariantesData); // <<< DEBUG LOG


    // Exibe todos os aniversariantes inicialmente (agora ordenados)
    console.log('Chamando displayAniversariantes com:', processedAndSortedAniversariantesData); // <<< DEBUG LOG
    displayAniversariantes(processedAndSortedAniversariantesData);

    // Configura o campo de busca
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', searchAniversariantes);

    // Calcula e exibe os alertas de aniversário na seção de alerta
    calculateAndDisplayAlertBirthdays();
    console.log('Calculo e exibição de alertas finalizados.'); // <<< DEBUG LOG
});
