import React, { useEffect, useState, useCallback, useMemo, useRef, lazy, Suspense } from 'react'
import { supabase } from './lib/supabase'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const LONG_PRESS_DURATION = 500 // milliseconds
const MOVE_THRESHOLD = 8 // pixels to cancel long press when user scrolls/drags

// Lazy load modal component for better initial load
const TaskModal = lazy(() => import('./TaskModal'))

const STUDENTS = [
  { key: 'MHM', name: 'Muhammad', color: '#16a34a' },
  { key: 'MAH', name: 'Mahveen', color: '#7c3aed' },
  { key: 'HAD', name: 'Hadia', color: '#f97316' }
]

const SUBJECT_EMOJIS = {
  'Math': '🔢',
  'English': '📖',
  'Urdu': '🇵🇰',
  'Islamiat': '🕌',
  'History': '📜',
  'Geography': '🌍',
  'Science': '🧪'
}

const SUBJECTS = ['Math', 'English', 'Urdu', 'Islamiat', 'History', 'Geography', 'Science']

// Memoized color utilities for performance
const darkenColor = (hex, percent) => {
  const f=parseInt(hex.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

export default function App(){
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [longPressTask, setLongPressTask] = useState(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [pressingId, setPressingId] = useState(null)
  // Long-press handling refs for robust press-and-hold UX
  const pressTimerRef = useRef(null)
  const startPosRef = useRef({ x: 0, y: 0 })
  const cancelledRef = useRef(false)

  // Clamp popup into viewport to avoid overflow near edges
  const clampPosition = useCallback((x, y) => {
    const m = 12
    const vw = window.innerWidth || 0
    const vh = window.innerHeight || 0
    const cx = Math.min(vw - m, Math.max(m, x))
    const cy = Math.min(vh - m, Math.max(m, y))
    return { x: cx, y: cy }
  }, [])

  useEffect(()=> {
    fetchTasks()
    // real-time listener with debounce for better performance
    let fetchTimeout
    try {
      const channel = supabase.channel('public:tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
          clearTimeout(fetchTimeout)
          fetchTimeout = setTimeout(() => fetchTasks(), 100)
        }).subscribe()
      return () => {
        clearTimeout(fetchTimeout)
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.error('Real-time subscription error:', error)
      return () => clearTimeout(fetchTimeout)
    }
  },[])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showAddTask) {
        setShowAddTask(false)
        setEditingTask(null)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showAddTask])

  // Ensure any pending long-press timers are cleared on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
  }, [])

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('tasks').select('*').order('due_date', {ascending:true})
      if(error){
        console.error('Fetch error:', error)
        setTasks([])
      }
      else setTasks(data || [])
    } catch (error) {
      console.error('Fetch exception:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addTask = useCallback(async (e) => {
    e.preventDefault()
    const form = e.target
    const title = form.title.value.trim()
    if(!title) return
    const student = form.student.value
    const color = STUDENTS.find(s=>s.key===student)?.color || '#666'
    const due_date = form.due_date.value || null
    const task = { title, subject: form.subject.value, notes: form.notes.value, due_date, student, color }
    if (editingTask) {
      const { error } = await supabase.from('tasks').update(task).eq('id', editingTask.id)
      if (error) console.error(error)
      else setEditingTask(null)
    } else {
      const { error } = await supabase.from('tasks').insert({ ...task, id: uuidv4() })
      if (error) console.error(error)
    }
    form.reset()
    setShowAddTask(false)
    fetchTasks()
  }, [editingTask, fetchTasks])

  const toggleComplete = useCallback(async (id, completed) => {
    const { error } = await supabase.from('tasks').update({ completed: !completed }).eq('id', id)
    if(error) console.error(error)
    else fetchTasks()
  }, [fetchTasks])

  const editTask = useCallback((task) => {
    setEditingTask(task)
    setShowAddTask(true)
    setShowContextMenu(false)
    setLongPressTask(null)
  }, [])

  const removeTask = useCallback(async (id) => {
    if(!confirm('Delete task?')) return
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if(error) console.error(error)
    else fetchTasks()
    setShowContextMenu(false)
    setLongPressTask(null)
  }, [fetchTasks])

  // Improved long-press: pointer-based, movement threshold, positions at finger/cursor, vibration feedback
  const handleLongPressStart = useCallback((task, event) => {
    if (!event) return
    const native = event.nativeEvent || event
    const clientX = native.clientX ?? (native.touches && native.touches[0]?.clientX) ?? null
    const clientY = native.clientY ?? (native.touches && native.touches[0]?.clientY) ?? null
  
    cancelledRef.current = false
    startPosRef.current = { x: clientX ?? 0, y: clientY ?? 0 }
    setPressingId(task.id)
  
    const clear = () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('pointermove', onMove)
      setPressingId(null)
    }
  
    const onUp = () => clear()
  
    const onMove = (ev) => {
      const dx = (ev.clientX ?? 0) - startPosRef.current.x
      const dy = (ev.clientY ?? 0) - startPosRef.current.y
      if (Math.hypot(dx, dy) > MOVE_THRESHOLD) {
        cancelledRef.current = true
        clear()
      }
    }
  
    window.addEventListener('pointerup', onUp, { once: true })
    window.addEventListener('pointercancel', onUp, { once: true })
    window.addEventListener('pointermove', onMove)
  
    pressTimerRef.current = setTimeout(() => {
      if (cancelledRef.current) return
      setLongPressTask(task)
      setShowContextMenu(true)
      if (clientX != null && clientY != null) {
        setContextMenuPosition(clampPosition(clientX, clientY))
      } else {
        const rect = event.currentTarget.getBoundingClientRect()
        const pos = clampPosition(rect.left + rect.width / 2, rect.top + rect.height / 2)
        setContextMenuPosition(pos)
      }
      try { window.navigator.vibrate && window.navigator.vibrate(10) } catch {}
      clear()
    }, LONG_PRESS_DURATION)
  }, [clampPosition])

  const handleContextMenuClose = useCallback(() => {
    setShowContextMenu(false)
    setLongPressTask(null)
  }, [])
  
  // Close the context menu with Escape for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && showContextMenu) {
        setShowContextMenu(false)
        setLongPressTask(null)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showContextMenu])

  const visible = useMemo(() => tasks.filter(t=>{
    if(q && !((t.title||'').toLowerCase().includes(q.toLowerCase()) || (t.subject||'').toLowerCase().includes(q.toLowerCase()))) return false
    return true
  }), [tasks, q])

  return (
    <div className="app">
      <header>
        <h1>Homework Tracker</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <p>{q ? 'No tasks found matching your search' : 'No tasks yet. Click the + button to add your first task!'}</p>
          </div>
        ) : (
          visible.map(t => {
            const daysLeft = dayjs(t.due_date).diff(dayjs(), 'day');
            const isOverdue = daysLeft < 0;
            const isTomorrow = daysLeft === 0 && dayjs(t.due_date).isAfter(dayjs(), 'day');
            
            return (
              <article
                className={`card ${t.completed ? 'completed' : ''} ${pressingId === t.id ? 'pressing' : ''}`}
                key={t.id}
                style={{background: `rgba(${hexToRgb(t.color)}, 0.85)`}}
                onPointerDown={(e) => handleLongPressStart(t, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setLongPressTask(t);
                  setShowContextMenu(true);
                  const pos = clampPosition(e.clientX, e.clientY);
                  setContextMenuPosition(pos);
                  try { window.navigator.vibrate && window.navigator.vibrate(10) } catch {}
                }}
              >
                <div className="student-chip">
                  <div className="chip" style={{background: t.color, boxShadow: `0 0 10px ${t.color}`, borderColor: darkenColor(t.color, 0.4)}}>{t.student}</div>
                </div>
                <button
                  className="card-menu-btn"
                  aria-label="More actions"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLongPressTask(t)
                    setShowContextMenu(true)
                    const rect = e.currentTarget.getBoundingClientRect()
                    setContextMenuPosition({ x: rect.left + rect.width / 2, y: rect.bottom + 8 })
                    try { window.navigator.vibrate && window.navigator.vibrate(10) } catch {}
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="5" cy="12" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="19" cy="12" r="2"></circle>
                  </svg>
                </button>
                <div className="card-left">
                  <div className="card-title">
                    <h3>{t.title}</h3>
                  </div>
                  <p className="subject">
                    {t.subject}
                    {isTomorrow && <span className="alarm-emoji">🚨</span>}
                    {isOverdue && <span className="alarm-emoji">⚠️</span>}
                  </p>
                  <p className="due">
                    Due: {t.due_date ? dayjs(t.due_date).format('dddd YYYY-MM-DD') : '—'}
                    {t.due_date && (
                      <span className={isOverdue ? 'urgent' : isTomorrow ? 'tomorrow' : ''}>
                        ({isOverdue ? `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} overdue` : isTomorrow ? 'Tomorrow' : daysLeft === 0 ? 'Today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`})
                      </span>
                    )}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </main>
      
      {showAddTask && (
        <Suspense fallback={<div className="loading-container"><div className="loading-spinner"></div></div>}>
          <TaskModal
            editingTask={editingTask}
            onClose={() => {
              setShowAddTask(false)
              setEditingTask(null)
            }}
            onSubmit={addTask}
          />
        </Suspense>
      )}

      {/* Context Menu */}
      {showContextMenu && longPressTask && (
        <div
          className="context-menu-overlay"
          onClick={handleContextMenuClose}
        >
          <div
            className="context-menu"
            style={{
              position: 'fixed',
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <button
              className="context-menu-item edit"
              onClick={() => editTask(longPressTask)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
            <button
              className="context-menu-item delete"
              onClick={() => removeTask(longPressTask.id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      <button className="fab" onClick={() => setShowAddTask(true)}>+</button>

    </div>
  )
}
