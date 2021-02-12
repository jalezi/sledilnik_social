export const summaryDict = {
  testsToday: [
    {
      prefix: 'PCR: ',
      dataKeys: ['subValues', 'positive'],
      suffix: ', ',
      formatType: 'sign',
    },
    { prefix: 'testiranih: ', dataKeys: ['value'], suffix: ', ' },
    {
      prefix: 'delež pozitivnih: ',
      dataKeys: ['subValues', 'percent'],
      suffix: '.',
      formatType: 'percent',
      divide: 100,
    },
  ],
  testsTodayHAT: [
    {
      prefix: 'HAT: ',
      dataKeys: ['subValues', 'positive'],
      suffix: ', ',
      formatType: 'sign',
    },
    {
      prefix: 'testiranih: ',
      dataKeys: ['value'],
      suffix: ', ',
    },
    {
      prefix: 'delež pozitivnih: ',
      dataKeys: ['subValues', 'percent'],
      suffix: '.',
      formatType: 'percent',
      divide: 100,
    },
  ],
  casesActive: [
    {
      prefix: 'Aktivni primeri: ',
      dataKeys: ['value'],
      suffix: ' ',
    },
    {
      prefix: '(',
      dataKeys: ['subValues', 'in'],
      suffix: ', ',
      formatType: 'sign',
    },
    {
      prefix: '',
      dataKeys: ['subValues', 'out'],
      suffix: ').',
      formatType: 'sign',
      negative: true,
    },
  ],
  casesToDateSummary: [
    {
      prefix: 'Skupaj: ',
      dataKeys: ['value'],
      suffix: ' potrjenih primerov.',
    },
  ],
  vaccinationSummary: [
    { prefix: 'Cepljenih oseb: 💉', dataKeys: ['value'], suffix: ', ' },
    { prefix: '💉💉', dataKeys: ['subValues', 'in'], suffix: '.' },
  ],
};

export const patients = {
  hospitalized: [
    {
      prefix: 'Hospitalizirani: ',
      dataKeys: ['0', 'total', 'inHospital', 'today'],
      suffix: ' ',
    },
    {
      prefix: '(',
      dataKeys: ['0', 'total', 'inHospital', 'in'],
      suffix: ', ',
      formatType: 'sign',
    },
    {
      prefix: '',
      dataKeys: ['0', 'total', 'inHospital', 'out'],
      suffix: '), ',
      formatType: 'sign',
      negative: true,
    },
    {
      prefix: 'EIT: ',
      dataKeys: ['0', 'total', 'icu', 'today'],
      suffix: ' ',
    },
    {
      prefix: '(',
      dataKeys: ['total', 'icu', 'today'],
      calculate: { what: 'diff', indexArray: [0, 1] },
      suffix: ').',
      formatType: 'sign',
    },
  ],
  onRespiratory: [
    {
      prefix: 'Na respiratorju: ',
      dataKeys: ['total'],
      calculate: {
        what: 'sum',
        dataKeys: [
          ['critical', 'today'],
          ['niv', 'today'],
        ],
      },
      suffix: ', ',
    },
    {
      prefix: 'intubirani: ',
      dataKeys: ['0', 'total', 'critical', 'today'],
      suffix: ' ',
    },
    {
      prefix: '(',
      dataKeys: ['total', 'critical', 'today'],
      calculate: { what: 'diff', indexArray: [0, 1] },
      suffix: '), ',
      formatType: 'sign',
    },
    {
      prefix: 'neinvazivno: ',
      dataKeys: ['0', 'total', 'niv', 'today'],
      suffix: ' ',
    },
    {
      prefix: '(',
      dataKeys: ['total', 'niv', 'today'],
      calculate: { what: 'diff', indexArray: [0, 1] },
      suffix: ').',
      formatType: 'sign',
    },
  ],
  care: [
    {
      prefix: 'Negovalne bolnišnice: ',
      dataKeys: ['0', 'total', 'care', 'today'],
      suffix: ' ',
    },
    {
      prefix: '( ',
      dataKeys: ['0', 'total', 'care', 'in'],
      suffix: ', ',
      formatType: 'sign',
    },
    {
      prefix: '',
      dataKeys: ['0', 'total', 'care', 'out'],
      suffix: ').',
      formatType: 'sign',
      negative: true,
    },
  ],
  deceased: [
    {
      prefix: 'Umrli: ',
      dataKeys: ['0', 'total', 'deceased', 'today'],
      suffix: ', ',
      formatType: 'sign',
    },
    {
      prefix: 'skupaj: ',
      dataKeys: ['0', 'total', 'deceased', 'toDate'],
      suffix: '.',
    },
  ],
};

const perAge = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((acc, item) => {
  acc = [
    ...acc,
    {
      dataKeys: ['0', 'statePerAgeToDate', item, 'ageFrom'],
      suffix: item === 9 ? '' : '-',
    },
    item === 9
      ? { prefix: '+' }
      : { dataKeys: ['0', 'statePerAgeToDate', item, 'ageTo'], suffix: ' ' },
    {
      prefix: '(',
      dataKeys: ['allToDate'],
      calculate: {
        what: 'diff',
        indexArray: [
          ['1', 'statePerAgeToDate', item],
          ['2', 'statePerAgeToDate', item],
        ],
      },
      suffix: item === 9 ? ').' : '), ',
    },
  ];
  return acc;
}, []);
export const stats = {
  statePerAgeToDate: [
    {
      prefix: 'Potrjeni primeri po starosti: ',
    },
    ...perAge,
  ],
};
