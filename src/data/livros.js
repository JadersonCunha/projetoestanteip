// Padrão do nome do arquivo PDF:
// nome-do-educando_turma_educadora.pdf
// Exemplo: joao-silva_gratidao_maria-souza.pdf
//
// Turmas disponíveis: acolhida | empatia | fe | gratidao | trabalho-educativo
//
// Após adicionar um PDF em /public/livros/, adicione uma entrada aqui.

export const livros = [
  // Exemplo (remova quando adicionar livros reais):
  // {
  //   id: 'joao-silva_gratidao_maria-souza',
  //   arquivo: 'joao-silva_gratidao_maria-souza.pdf',
  //   educando: 'João Silva',
  //   turma: 'gratidao',
  //   educadora: 'Maria Souza',
  // },
];

export const turmas = [
  { id: 'acolhida',           nome: 'Acolhida' },
  { id: 'empatia',            nome: 'Empatia' },
  { id: 'fe',                 nome: 'Fé' },
  { id: 'gratidao',           nome: 'Gratidão' },
  { id: 'trabalho-educativo', nome: 'Trabalho Educativo' },
];
