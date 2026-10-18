/**
 * User-facing strings. English is the fallback for any language or key that
 * is missing, and a key nobody has renders as itself so the gap is visible
 * rather than blank.
 *
 * Portuguese is here because TaskMate ships it; other languages are a pull
 * request away. Keys are flat on purpose — this is a card, not an app.
 */
const STRINGS = {
  en: {
    today: 'Today',
    all_day: 'All day',
    nothing_scheduled: 'Nothing scheduled',
    nothing_on: 'Nothing on',
    no_tasks: 'No tasks',
    chores_points: 'Chores & points',
    chores: 'Chores',
    to_do: '{n} to do',
    all_done: 'All done',
    no_chore_list: 'No chore list',
    next: 'Next: {chore}',
    done_of: '{done}/{total} done',
    waiting: 'waiting',
    overdue: 'overdue',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    week_of: 'Week of {date}',
    last_updated: 'Last updated {time}',
    cant_read: "Can't read {entities}",
    loading: 'Loading…',
    previous: 'Previous',
    next_page: 'Next',
    add: 'Add',
    calendar: 'Calendar',
    tasks: 'Tasks',
    due: '{n} due',
    points: 'points',
    streak: '{n} day streak',
    family: 'Family',
    n_chores: '{n} chores',
    chores_done: '{done}/{total} chores',
    complete_for: 'Complete {chore} for {name}',
    view_not_built: "{view} view isn't built yet — showing agenda",
    // add dialog
    todo_task: 'To-do task',
    calendar_event: 'Calendar event',
    taskmate_chore: 'TaskMate chore',
    opens_taskmate: 'opens TaskMate',
    cancel: 'Cancel',
    adding: 'Adding…',
    choose: 'Choose…',
    list: 'List',
    task: 'Task',
    due_optional: 'Due (optional)',
    event: 'Event',
    date: 'Date',
    start: 'Start',
    end_optional: 'End (optional)',
    add_in_taskmate: 'add in TaskMate',
    lists_blocked: '{n} lists do not accept new items directly. TaskMate chores carry points, recurrence and assignment, so they are created in TaskMate.',
    list_blocked: 'One list does not accept new items directly. TaskMate chores carry points, recurrence and assignment, so they are created in TaskMate.',
  },
  pt: {
    today: 'Hoje',
    all_day: 'Todo o dia',
    nothing_scheduled: 'Nada agendado',
    nothing_on: 'Nada marcado',
    no_tasks: 'Sem tarefas',
    chores_points: 'Tarefas e pontos',
    chores: 'Tarefas',
    to_do: '{n} por fazer',
    all_done: 'Tudo feito',
    no_chore_list: 'Sem lista de tarefas',
    next: 'Próxima: {chore}',
    done_of: '{done}/{total} feitas',
    waiting: 'a aguardar',
    overdue: 'atrasada',
    morning: 'Manhã',
    afternoon: 'Tarde',
    evening: 'Noite',
    week_of: 'Semana de {date}',
    last_updated: 'Atualizado às {time}',
    cant_read: 'Sem acesso a {entities}',
    loading: 'A carregar…',
    previous: 'Anterior',
    next_page: 'Seguinte',
    add: 'Adicionar',
    calendar: 'Calendário',
    tasks: 'Tarefas',
    due: '{n} previstas',
    points: 'pontos',
    streak: '{n} dias seguidos',
    family: 'Família',
    n_chores: '{n} tarefas',
    chores_done: '{done}/{total} tarefas',
    complete_for: 'Concluir {chore} de {name}',
    view_not_built: 'A vista {view} ainda não existe — a mostrar agenda',
    todo_task: 'Tarefa',
    calendar_event: 'Evento',
    taskmate_chore: 'Tarefa TaskMate',
    opens_taskmate: 'abre o TaskMate',
    cancel: 'Cancelar',
    adding: 'A adicionar…',
    choose: 'Escolher…',
    list: 'Lista',
    task: 'Tarefa',
    due_optional: 'Prazo (opcional)',
    event: 'Evento',
    date: 'Data',
    start: 'Início',
    end_optional: 'Fim (opcional)',
    add_in_taskmate: 'adicionar no TaskMate',
    lists_blocked: '{n} listas não aceitam itens novos diretamente. As tarefas TaskMate têm pontos, recorrência e atribuição, por isso criam-se no TaskMate.',
    list_blocked: 'Uma lista não aceita itens novos diretamente. As tarefas TaskMate têm pontos, recorrência e atribuição, por isso criam-se no TaskMate.',
  },
};

export function t(lang, key, vars = {}) {
  const table = STRINGS[lang] || STRINGS.en;
  const raw = table[key] ?? STRINGS.en[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, k) => (vars[k] === undefined ? `{${k}}` : String(vars[k])));
}

/** Two-letter language from hass, falling back to English. */
export function pickLanguage(hass) {
  const raw = hass?.locale?.language || hass?.language || 'en';
  return String(raw).split(/[-_]/)[0].toLowerCase();
}
