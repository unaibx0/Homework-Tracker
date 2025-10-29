import React from 'react'
import dayjs from 'dayjs'

const STUDENTS = [
  { key: 'Muhammad', name: 'Muhammad', color: '#16a34a' },
  { key: 'Mahveen', name: 'Mahveen', color: '#7c3aed' },
  { key: 'Hadia', name: 'Hadia', color: '#f97316' }
]

const SUBJECT_ICONS = {
  'Math': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  ),
  'ICT': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  'English': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="10" y1="8" x2="16" y2="8"/>
      <line x1="10" y1="12" x2="16" y2="12"/>
      <line x1="10" y1="16" x2="14" y2="16"/>
    </svg>
  ),
  'Urdu': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
      <path d="M8 14c0-2 1.5-3 3-3s3 1 3 3-1.5 3-3 3"/>
      <path d="M14 8v3"/>
      <circle cx="14" cy="8" r="0.5" fill="currentColor"/>
    </svg>
  ),
  'Islamiat': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0 7 7 7 7 0 0 1-7 7 7 7 0 0 1-7-7 7 7 0 0 0 7-7z"/>
      <path d="M17 12l3 3-3 3"/>
      <path d="M7 12l-3 3 3 3"/>
    </svg>
  ),
  'History': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8v13H3V8"/>
      <path d="M1 3h22v5H1z"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
  'Geography': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  'Science': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
      <path d="M8.5 2h7"/>
      <path d="M7 16h10"/>
    </svg>
  )
}

const SUBJECTS = ['Math', 'English', 'Urdu', 'Islamiat', 'History', 'Geography', 'Science', 'ICT']

export default function TaskModal({ editingTask, onClose, onSubmit }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <aside className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={onSubmit} className="add-form">
          <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              name="title"
              placeholder="Enter task title"
              required
              defaultValue={editingTask?.title || ''}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select id="subject" name="subject" defaultValue={editingTask?.subject || ''} required>
              <option value="" disabled>Select Subject</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Due Date</label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              defaultValue={editingTask?.due_date || ''}
              min={dayjs().format('YYYY-MM-DD')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="student">Student</label>
            <select id="student" name="student" defaultValue={editingTask?.student || 'Muhammad'} required>
              {STUDENTS.map(s=> (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hidden notes field to maintain backend compatibility */}
          <input type="hidden" name="notes" value="" />

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingTask ? 'Update' : 'Add Task'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}