// Dados originais dos aniversariantes
const aniversariantesData = [
    { nome: 'ANDRé PEREIRA TELES', aniversario: '23 de junho', cargo: 'ASSESSOR ADMINISTRATIVO' },
    { nome: 'CLEUTON CORREA DE SOUZA FILHO', aniversario: '12 de julho', cargo: 'ASSISTENTE DA PROCURADORIA-GERAL DE JUSTIÇA' },
    { nome: 'Helena Rocha Fernandes', aniversario: '19 de dezembro', cargo: 'ASSISTENTE DA PROCURADORIA-GERAL DE JUSTIÇA' },   
    { nome: 'GUSTAVO OSORIO RIZZI LIPPI', aniversario: '18 de fevereiro', cargo: 'ASSESSOR JURIDICO' },
    { nome: 'JOSé SOARES COSTA FILHO', aniversario: '09 de julho', cargo: 'AUXILIAR MOTORISTA / MOTORISTA DA ADMINISTRAÇÃO SUPERIOR' },
    { nome: 'JULIANA AMORIM PINTO', aniversario: '20 de abril', cargo: 'ASSESSOR JURIDICO' },
    { nome: 'LAILA SABRINA FERREIRA BORBA', aniversario: '22 de agosto', cargo: 'ASSESSOR JURIDICO' },
    { nome: 'LORRAYNE CHRISTYNE DOS SANTOS CRUZ', aniversario: '06 de fevereiro', cargo: 'ANALISTA EM INFORMÁTICA / ASSESSOR DA PROCURADORIA-GERAL DE JUSTIÇA' },
    { nome: 'THIAGO MARQUES MENESES', aniversario: '05 de fevereiro', cargo: 'ASSESSOR ADMINISTRATIVO' },
    { nome: 'Dr. Marcelo André de Azevedo', aniversario: '08 de janeiro', cargo: 'Subprocuradoria-Geral de Justiça para Assuntos de Planejamento, Estratégia e Inovação' },
    { nome: 'Dr. Rafael Correa Costa', aniversario: '01 de dezembro', cargo: 'Promotor de Justiça e Assessor Jurídico-Administrativo da PGJ' },
    { nome: 'Dra. Liana Antunes Vieira Tormin', aniversario: '24 de fevereiro', cargo: 'Promotora de Justiça e Assessora Jurídica-Administrativa da PGJ' }
];

let processedAndSortedAniversariantesData = [];

const monthMap = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5,
    'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
};

function cleanNamePrefixes(name) {
    if (!name) return "";
    return name.replace(/Dr\. |Dra\. /gi, '').trim();
}

function toTitleCase(str) {
    if (!str) return "";
    str = str.toLowerCase();
    const wordsToKeepLowercase = new Set(['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'para', 'com', 'por', 'sem']);
    return str.split(' ').map((word, index) =>
        (index > 0 && wordsToKeepLowercase.has(word)) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function parseBirthdayString(birthdayString) {
    const parts = birthdayString.toLowerCase().replace(' de ', ' ').split(' ');
    if (parts.length >= 2) {
        const day = parseInt(parts[0], 10);
        const month = monthMap[parts[1]];
        if (!isNaN(day) && month !== undefined) {
            return { day, month };
        }
    }
    return null;
}

function calculateNextBirthdayInfo(person) {
    const birthdayInfo = parseBirthdayString(person.aniversario);
    let nextBirthdayDate = null;
    let daysUntilNextBirthday = -1;

    if (birthdayInfo) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let nextBday = new Date(today.getFullYear(), birthdayInfo.month, birthdayInfo.day);
        if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
        const diff = nextBday - today;
        daysUntilNextBirthday = Math.ceil(diff / (1000 * 60 * 60 * 24));
        nextBirthdayDate = nextBday;
    }

    return { nextBirthdayDateObj: nextBirthdayDate, daysUntilNextBirthday };
}

function gerarICS(aniversariantes) {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:-//Subplei//Calendário de Aniversários//PT-BR\n';
    const year = new Date().getFullYear();

    aniversariantes.forEach(p => {
        const { nomeProcessado, nextBirthdayDateObj, cargo } = p;
        if (!nextBirthdayDateObj) return;
        const dt = nextBirthdayDateObj;
        const dtstart = `${year}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}`;
        const uid = `${dtstart}-${nomeProcessado.replace(/\s+/g, '-')}`.toLowerCase();

        ics += `BEGIN:VEVENT\nUID:${uid}@subplei\nDTSTAMP:${year}0101T000000Z\nSUMMARY:🎂 Aniversário de ${nomeProcessado}\nDTSTART;VALUE=DATE:${dtstart}\nRRULE:FREQ=YEARLY\nDESCRIPTION:Cargo: ${cargo}\nEND:VEVENT\n`;
    });

    ics += 'END:VCALENDAR';
    return ics;
}

function baixarICS(aniversariantes) {
    const content = gerarICS(aniversariantes).replace(/\\n/g, '\n');
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aniversarios-subplei.ics';
    a.click();
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    processedAndSortedAniversariantesData = aniversariantesData.map(person => {
        const nome = toTitleCase(cleanNamePrefixes(person.nome));
        const info = calculateNextBirthdayInfo(person);
        return { ...person, nomeProcessado: nome, ...info };
    }).sort((a, b) => (a.nextBirthdayDateObj - b.nextBirthdayDateObj));

    const container = document.getElementById('aniversariantes-list');
    processedAndSortedAniversariantesData.forEach(person => {
        const card = document.createElement('div');
        card.classList.add('person-card');
        card.innerHTML = `
            <h3>${person.nomeProcessado}</h3>
            <p>${person.cargo}</p>
            <p>${person.aniversario}</p>
            <p>${person.daysUntilNextBirthday === 0 ? '🥳 É ANIVERSÁRIO HOJE!' : 'Faltam ' + person.daysUntilNextBirthday + ' dias'}</p>
        `;
        container.appendChild(card);
    });

    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '2em';
    btnContainer.innerHTML = '<button onclick="baixarICS(processedAndSortedAniversariantesData)">📅 Baixar agenda (.ics)</button>';
    document.querySelector('.container').appendChild(btnContainer);
});
