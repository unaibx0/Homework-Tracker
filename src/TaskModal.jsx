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
                  {SUBJECT_EMOJIS[s]} {s}
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
            <select id="student" name="student" defaultValue={editingTask?.student || 'MHM'} required>
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