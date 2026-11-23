import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Search, LayoutDashboard, CalendarDays, CheckCircle2, Clock3,
  Circle, MoreHorizontal, Pencil, Trash2, X, ChevronLeft, ChevronRight,
  Flag, ListTodo, Menu, RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'focusboard-tasks';
const STATUSES = ['To do', 'In progress', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const seed = [
  { id: 1, title: 'Plan weekly priorities', description: 'Review goals and map out the most important work for this week.', category: 'Planning', status: 'In progress', priority: 'High', dueDate: '2026-11-25' },
  { id: 2, title: 'Prepare project presentation', description: 'Create slides and gather the latest project updates.', category: 'Work', status: 'To do', priority: 'High', dueDate: '2026-11-27' },
  { id: 3, title: 'Read 20 pages', description: 'Continue reading the product design book.', category: 'Personal', status: 'Completed', priority: 'Low', dueDate: '2026-11-21' },
  { id: 4, title: 'Review design feedback', description: 'Go through comments and list the required changes.', category: 'Design', status: 'In progress', priority: 'Medium', dueDate: '2026-11-26' },
  { id: 5, title: 'Update portfolio', description: 'Add recent work and refresh the about section.', category: 'Personal', status: 'To do', priority: 'Medium', dueDate: '2026-11-30' },
  { id: 6, title: 'Send meeting notes', description: 'Share decisions and action items with the team.', category: 'Work', status: 'Completed', priority: 'Low', dueDate: '2026-11-22' }
];
const notes = [
  'Start with the task that matters most. Small progress every day adds up.',
  'Keep your workspace clear and your priorities even clearer.',
  'Focus on progress, not perfection. Take a short break when you need one.'
];
const blank = { title: '', description: '', category: 'Work', status: 'To do', priority: 'Medium', dueDate: '' };

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return seed;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return seed;
    return parsed.filter(task => task && task.id !== undefined && typeof task.title === 'string');
  } catch {
    return seed;
  }
}

function formatToday() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase();
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [tab, setTab] = useState('All');
  const [priority, setPriority] = useState('All');
  const [search, setSearch] = useState('');
  const [note, setNote] = useState(0);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch (error) { console.error('Unable to save FocusBoard tasks:', error); }
  }, [tasks]);

  const filtered = useMemo(() => tasks.filter(task =>
    (tab === 'All' || task.status === tab) &&
    (priority === 'All' || task.priority === priority) &&
    task.title.toLowerCase().includes(search.trim().toLowerCase())
  ), [tasks, tab, priority, search]);

  const done = tasks.filter(task => task.status === 'Completed').length;
  const active = tasks.filter(task => task.status === 'In progress').length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  function openNew() {
    setEditing(null); setForm(blank); setFormError(''); setModal(true);
  }
  function openEdit(task) {
    setEditing(task.id); setForm({ ...blank, ...task }); setFormError(''); setModal(true);
  }
  function closeModal() {
    setModal(false); setEditing(null); setForm(blank); setFormError('');
  }
  function save(event) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) { setFormError('Please enter a task title.'); return; }
    if (!form.dueDate) { setFormError('Please select a due date.'); return; }
    const updated = { ...form, title, description: form.description.trim(), id: editing ?? (globalThis.crypto?.randomUUID?.() ?? Date.now()) };
    setTasks(current => editing
      ? current.map(task => task.id === editing ? updated : task)
      : [updated, ...current]
    );
    closeModal();
  }
  function updateStatus(id, status) {
    setTasks(current => current.map(task => task.id === id ? { ...task, status } : task));
  }
  function remove(id) {
    const task = tasks.find(item => item.id === id);
    if (task && window.confirm(`Delete “${task.title}”? This action cannot be undone.`)) {
      setTasks(current => current.filter(item => item.id !== id));
    }
  }
  function resetFilters() { setTab('All'); setPriority('All'); setSearch(''); }

  return (
    <div className="app">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brandmark"><CheckCircle2 size={21} /></span> FocusBoard
          <button className="mobile-close" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><X size={19} /></button>
        </div>
        <div className="navlabel">MENU</div>
        <button className="nav active" aria-current="page"><LayoutDashboard size={18} /> Dashboard</button>
        <button className="nav" onClick={() => { setTab('All'); setMobileNavOpen(false); }}><CalendarDays size={18} /> My tasks</button>
        <div className="sidebottom"><div className="avatar">FB</div><div><b>My Workspace</b><small>Personal board</small></div></div>
      </aside>
      {mobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

      <main className="main">
        <header className="top">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={21} /></button>
          <div className="welcome"><div className="eyebrow">{formatToday()}</div><h1>Good morning <span>✦</span></h1><p>Here's what's happening with your tasks today.</p></div>
          <button className="primary" onClick={openNew}><Plus size={18} /> Add task</button>
        </header>

        <section className="stats" aria-label="Task overview">
          <Stat icon={<ListTodo />} label="Total tasks" value={tasks.length} tone="blue" />
          <Stat icon={<Clock3 />} label="In progress" value={active} tone="orange" />
          <Stat icon={<CheckCircle2 />} label="Completed" value={done} tone="green" />
          <Stat icon={<Flag />} label="Completion rate" value={`${completion}%`} tone="purple" />
        </section>

        <section className="content">
          <div className="tasks-panel">
            <div className="sectionhead"><div><h2>My tasks</h2><p>Manage and track your daily work</p></div><span className="count">{filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}</span></div>
            <div className="toolbar">
              <div className="tabs" role="group" aria-label="Filter tasks by status">
                {['All', ...STATUSES].map(value => <button key={value} className={tab === value ? 'selected' : ''} aria-pressed={tab === value} onClick={() => setTab(value)}>{value}</button>)}
              </div>
              <div className="filters">
                <label className="search"><Search size={16} /><span className="sr-only">Search tasks by title</span><input placeholder="Search tasks..." value={search} onChange={event => setSearch(event.target.value)} /></label>
                <label className="priority-filter"><span className="sr-only">Filter by priority</span><select value={priority} onChange={event => setPriority(event.target.value)}><option value="All">All priorities</option>{PRIORITIES.map(value => <option key={value}>{value}</option>)}</select></label>
                {(tab !== 'All' || priority !== 'All' || search) && <button className="reset-filter" onClick={resetFilters} aria-label="Clear all filters"><RotateCcw size={15} /></button>}
              </div>
            </div>
            <div className="tasklist">
              {filtered.map(task => (
                <article className="task" key={task.id}>
                  <span className={`statusdot ${task.status === 'Completed' ? 'isdone' : ''}`}>{task.status === 'Completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />}</span>
                  <div className="taskbody"><div className="tasktitle">{task.title}</div><p>{task.description || 'No description added.'}</p>
                    <div className="meta"><span className="category">{task.category || 'General'}</span><span className={`priority ${String(task.priority).toLowerCase()}`}>{task.priority} priority</span><span className="due"><CalendarDays size={13} />{task.dueDate || 'No due date'}</span></div>
                  </div>
                  <label className="task-status-select"><span className="sr-only">Change status for {task.title}</span><select value={task.status} onChange={event => updateStatus(task.id, event.target.value)}>{STATUSES.map(value => <option key={value}>{value}</option>)}</select></label>
                  <div className="actions"><button aria-label={`Edit ${task.title}`} title="Edit task" onClick={() => openEdit(task)}><Pencil size={16} /></button><button aria-label={`Delete ${task.title}`} title="Delete task" onClick={() => remove(task.id)}><Trash2 size={16} /></button></div>
                </article>
              ))}
              {!filtered.length && <div className="empty">No tasks found. Try changing your search or filters.</div>}
            </div>
          </div>

          <aside className="rightcol" aria-label="Focus notes and productivity tip">
            <div className="note-card"><div className="note-top"><span>✦ FOCUS NOTES</span><MoreHorizontal size={18} /></div><div className="note-quote">“</div><p aria-live="polite">{notes[note]}</p><div className="note-controls"><button onClick={() => setNote(index => (index + 2) % 3)} aria-label="Previous note"><ChevronLeft size={17} /></button><div className="dots">{notes.map((_, index) => <button key={index} className={note === index ? 'on' : ''} onClick={() => setNote(index)} aria-label={`Show note ${index + 1}`} aria-pressed={note === index} />)}</div><button onClick={() => setNote(index => (index + 1) % 3)} aria-label="Next note"><ChevronRight size={17} /></button></div></div>
            <div className="tip-card"><div className="tip-icon">✧</div><h3>Stay focused</h3><p>Break big goals into smaller steps. One task at a time.</p></div>
          </aside>
        </section>
      </main>

      {modal && <div className="overlay" onMouseDown={event => { if (event.target === event.currentTarget) closeModal(); }}>
        <form className="modal" onSubmit={save} aria-labelledby="task-form-title">
          <div className="modalhead"><h2 id="task-form-title">{editing ? 'Edit task' : 'Create a task'}</h2><button type="button" aria-label="Close task form" onClick={closeModal}><X /></button></div>
          <label>Task title<input required maxLength={100} autoFocus value={form.title} onChange={event => { setForm({ ...form, title: event.target.value }); setFormError(''); }} placeholder="What needs to be done?" /></label>
          <label>Description<textarea maxLength={500} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="Add a few details..." /></label>
          <div className="formgrid">
            <label>Category<input value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} placeholder="e.g. Work" /></label>
            <label>Due date<input type="date" required value={form.dueDate} onChange={event => { setForm({ ...form, dueDate: event.target.value }); setFormError(''); }} /></label>
            <label>Status<select required value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}>{STATUSES.map(value => <option key={value}>{value}</option>)}</select></label>
            <label>Priority<select required value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}>{PRIORITIES.map(value => <option key={value}>{value}</option>)}</select></label>
          </div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="modalfoot"><button type="button" className="secondary" onClick={closeModal}>Cancel</button><button className="primary" type="submit">{editing ? 'Save changes' : 'Create task'}</button></div>
        </form>
      </div>}
    </div>
  );
}

function Stat({ icon, label, value, tone }) {
  return <div className="stat"><div className={`staticon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}
