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
  { id: 'acolhida-manha', nome: 'Acolhida Manhã' },
  { id: 'acolhida-tarde', nome: 'Acolhida Tarde' },
  { id: 'empatia-tarde',  nome: 'Empatia Tarde' },
  { id: 'fe-manha',       nome: 'Fé Manhã' },
  { id: 'fe-tarde',       nome: 'Fé Tarde' },
  { id: 'gratidao',       nome: 'Gratidão' },
];
