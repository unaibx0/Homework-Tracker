import React from 'react'
import dayjs from 'dayjs'

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

export default function TaskModal({ editingTask, onClose, onSubmit }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <aside className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={onSubmit} className="add-form">
          <h2>{editingTask ? '✏️ Edit Task' : '➕ Add New Task'}</h2>
          <input
            name="title"
            placeholder="📝 Task title..."
            required
            defaultValue={editingTask?.title || ''}
            autoFocus
          />
          <select name="subject" defaultValue={editingTask?.subject || ''} required>
            <option value="" disabled>📚 Select Subject</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{SUBJECT_EMOJIS[s]} {s}</option>)}
          </select>
          <textarea
            name="notes"
            placeholder="📋 Additional notes (optional)..."
            defaultValue={editingTask?.notes || ''}
            rows={3}
          ></textarea>
          <input
            name="due_date"
            type="date"
            defaultValue={editingTask?.due_date || ''}
            min={dayjs().format('YYYY-MM-DD')}
          />
          <select name="student" defaultValue={editingTask?.student || 'MHM'} required>
            {STUDENTS.map(s=> (
              <option key={s.key} value={s.key}>
                👤 {s.name} — {s.key}
              </option>
            ))}
          </select>
          <div style={{display: 'flex', gap: '12px'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{flex: 2}}
            >
              {editingTask ? '💾 Update Task' : '➕ Add Task'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}