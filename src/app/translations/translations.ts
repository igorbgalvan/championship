export const translations: Record<string, Record<string, string>> = {
  pt: {
    // App
    'app.title': '🏆 CHAMPIONSHIP',
    'app.subtitle': 'Sistema de Torneio Eliminação Simples',

    // SEO (título da aba e meta tags – traduzido para busca no Google)
    'seo.pageTitle': 'Campeonato - Sistema de Torneio Eliminação Simples',
    'seo.metaDescription': 'Crie e gerencie torneios de eliminação simples com bracket visual interativo. Suporte para qualquer número de jogadores, gerenciamento de byes automático e persistência local. Gratuito e 100% frontend.',
    
    // Tournament Setup
    'setup.title': 'Criar Novo Torneio',
    'setup.name.label': 'Nome do Torneio (Opcional)',
    'setup.name.placeholder': 'Digite o nome do torneio',
    'setup.continue': 'Continuar',
    
    // Player Input
    'players.title': 'Adicionar Jogadores',
    'players.add': 'Adicionar Jogador',
    'players.count': '{{count}} jogador',
    'players.count.plural': '{{count}} jogadores',
    'players.start': 'Iniciar Torneio',
    'players.placeholder': 'Jogador {{number}}',
    
    // Bracket
    'bracket.export': 'Exportar',
    'bracket.import': 'Importar',
    'bracket.new': 'Novo Torneio',
    'bracket.round': 'Rodada {{number}}',
    'bracket.champion': 'CAMPEÃO',
    'bracket.vs': 'VS',
    'bracket.bye': 'BYE',
    'bracket.edit': 'Editar',
    'bracket.tbd': 'TBD',
    
    // Modal
    'modal.champion.title': 'CHAMPION',
    'modal.champion.new': 'Novo Torneio',
    
    // Actions
    'action.confirm.clear': 'Tem certeza que deseja iniciar um novo torneio? Isso irá limpar o torneio atual.',
    'action.import.error': 'Falha ao importar torneio. Formato de arquivo inválido.',
  },
  
  en: {
    // App
    'app.title': '🏆 CHAMPIONSHIP',
    'app.subtitle': 'Single-Elimination Tournament System',

    // SEO (browser tab title and meta tags)
    'seo.pageTitle': 'Championship - Single-Elimination Tournament System',
    'seo.metaDescription': 'Create and manage single-elimination tournaments with an interactive bracket. Support for any number of players, automatic bye handling, and local persistence. Free and 100% frontend.',
    
    // Tournament Setup
    'setup.title': 'Create New Tournament',
    'setup.name.label': 'Tournament Name (Optional)',
    'setup.name.placeholder': 'Enter tournament name',
    'setup.continue': 'Continue',
    
    // Player Input
    'players.title': 'Add Players',
    'players.add': 'Add Player',
    'players.count': '{{count}} player',
    'players.count.plural': '{{count}} players',
    'players.start': 'Start Tournament',
    'players.placeholder': 'Player {{number}}',
    
    // Bracket
    'bracket.export': 'Export',
    'bracket.import': 'Import',
    'bracket.new': 'New Tournament',
    'bracket.round': 'Round {{number}}',
    'bracket.champion': 'CHAMPION',
    'bracket.vs': 'VS',
    'bracket.bye': 'BYE',
    'bracket.edit': 'Edit',
    'bracket.tbd': 'TBD',
    
    // Modal
    'modal.champion.title': 'CHAMPION',
    'modal.champion.new': 'New Tournament',
    
    // Actions
    'action.confirm.clear': 'Are you sure you want to start a new tournament? This will clear the current tournament.',
    'action.import.error': 'Failed to import tournament. Invalid file format.',
  },
  
  es: {
    // App
    'app.title': '🏆 CHAMPIONSHIP',
    'app.subtitle': 'Sistema de Torneo Eliminación Simple',

    // SEO (título de la pestaña y meta tags)
    'seo.pageTitle': 'Campeonato - Sistema de Torneo Eliminación Simple',
    'seo.metaDescription': 'Crea y gestiona torneos de eliminación simple con bracket visual interactivo. Soporte para cualquier número de jugadores, gestión automática de byes y persistencia local. Gratuito y 100% frontend.',
    
    // Tournament Setup
    'setup.title': 'Crear Nuevo Torneo',
    'setup.name.label': 'Nombre del Torneo (Opcional)',
    'setup.name.placeholder': 'Ingrese el nombre del torneo',
    'setup.continue': 'Continuar',
    
    // Player Input
    'players.title': 'Agregar Jugadores',
    'players.add': 'Agregar Jugador',
    'players.count': '{{count}} jugador',
    'players.count.plural': '{{count}} jugadores',
    'players.start': 'Iniciar Torneo',
    'players.placeholder': 'Jugador {{number}}',
    
    // Bracket
    'bracket.export': 'Exportar',
    'bracket.import': 'Importar',
    'bracket.new': 'Nuevo Torneo',
    'bracket.round': 'Ronda {{number}}',
    'bracket.champion': 'CAMPEÓN',
    'bracket.vs': 'VS',
    'bracket.bye': 'BYE',
    'bracket.edit': 'Editar',
    'bracket.tbd': 'TBD',
    
    // Modal
    'modal.champion.title': 'CAMPEÓN',
    'modal.champion.new': 'Nuevo Torneo',
    
    // Actions
    'action.confirm.clear': '¿Está seguro de que desea iniciar un nuevo torneo? Esto limpiará el torneo actual.',
    'action.import.error': 'Error al importar torneo. Formato de archivo inválido.',
  }
};
