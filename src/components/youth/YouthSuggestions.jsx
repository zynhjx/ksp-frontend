import { useContext, useState } from 'react'
import './YouthSuggestions.css'
import SuggestionCard from '../common/SuggestionCard'
import { suggestionCardsGridClassName } from '../common/suggestionCardClasses'
import ManagementPageLayout from '../common/ManagementPageLayout'
import { AuthContext } from '../../contexts/AuthContext'

const CATEGORIES = [
  'Education',
  'Employment',
  'Health',
  'Sports',
  'Environment',
  'Community / Social',
  'Other',
]

const mockSuggestions = [
  {
    id: 1,
    title: 'Free Coding Workshops for Youth',
    category: 'Education',
    description:
      'Many young residents lack access to digital skills training. Offering free monthly coding workshops at the barangay hall would help bridge this gap and prepare youth for modern job opportunities.',
    suggestedSolution:
      'Partner with local tech volunteers or organizations to hold 2-hour Saturday workshops every month. Provide computers or coordinate with the school to use their lab.',
    location: 'Barangay Hall Computer Room',
    status: 'Under Review',
    submittedAt: '2026-02-18',
  },
  {
    id: 2,
    title: 'Install More Street Lights Along Rizal St.',
    category: 'Community / Social',
    description:
      'The stretch of Rizal Street past the basketball court is poorly lit at night, making it unsafe for pedestrians, especially youth heading home from evening events.',
    suggestedSolution:
      'Request the barangay to install at least 4 additional solar-powered street lights between the court and the corner of Mabini Ave.',
    location: 'Rizal Street, near basketball court',
    status: 'Pending',
    submittedAt: '2026-03-01',
  },
  {
    id: 3,
    title: 'Regular Barangay Vaccination Drive',
    category: 'Health',
    description:
      'Several community members, particularly younger children and seniors, are not up to date on vaccinations due to limited access to health centers.',
    suggestedSolution:
      'Coordinate with the Rural Health Unit to hold a quarterly vaccination drive at the barangay plaza, making it convenient for all residents.',
    location: 'Barangay Plaza',
    status: 'Acknowledged',
    submittedAt: '2026-01-25',
  },
]

const EMPTY_FORM = {
  title: '',
  category: '',
  description: '',
  suggestedSolution: '',
  location: '',
  submitAnonymously: false,
}

function YouthSuggestions() {
  const { user } = useContext(AuthContext)
  const [suggestions, setSuggestions] = useState(mockSuggestions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const openModal = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const getSubmitterName = () => {
    const firstName = user?.first_name || user?.firstName || ''
    const lastName = user?.last_name || user?.lastName || ''
    const fullName = `${firstName} ${lastName}`.trim()
    return fullName || user?.name || user?.username || 'User'
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    setForm((prev) => ({ ...prev, [name]: fieldValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required.'
    if (!form.category) newErrors.category = 'Please select a category.'
    if (!form.description.trim()) newErrors.description = 'Description is required.'
    if (!form.suggestedSolution.trim()) newErrors.suggestedSolution = 'Suggested solution is required.'
    if (!form.location.trim()) newErrors.location = 'Location is required.'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const newSuggestion = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      suggestedSolution: form.suggestedSolution.trim(),
      location: form.location.trim(),
      status: 'Pending',
      submittedBy: !form.submitAnonymously ? getSubmitterName() : null,
      submittedAt: new Date().toISOString().split('T')[0],
    }

    setSuggestions((prev) => [newSuggestion, ...prev])
    closeModal()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal()
  }

  return (
    <ManagementPageLayout
      title="My Suggestions"
      subtitle="Share your ideas and feedback to help improve programs and services in your barangay."
      addButtonLabel="+ New Suggestion"
      onAddButtonClick={openModal}
      showSearch={false}
    >
      {suggestions.length === 0 ? (
        <div className="suggestions-empty">
          <p>You haven&apos;t submitted any suggestions yet.</p>
          <button type="button" className="new-suggestion-btn" onClick={openModal}>
            Submit your first suggestion
          </button>
        </div>
      ) : (
        <section className={suggestionCardsGridClassName} aria-label="Your suggestions">
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </section>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal">
            <div className="modal-header">
              <h2 id="modal-title">New Suggestion</h2>
              <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                &#x2715;
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="sug-title">Title</label>
                <input
                  id="sug-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Install streetlights along Rizal St."
                  className={errors.title ? 'input-error' : ''}
                />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="sug-category">Category</label>
                <select
                  id="sug-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={errors.category ? 'input-error' : ''}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="sug-description">Description</label>
                <textarea
                  id="sug-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the problem or need you've observed..."
                  rows={4}
                  className={errors.description ? 'input-error' : ''}
                />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="sug-solution">Suggested Solution</label>
                <textarea
                  id="sug-solution"
                  name="suggestedSolution"
                  value={form.suggestedSolution}
                  onChange={handleChange}
                  placeholder="How do you think this could be addressed?"
                  rows={4}
                  className={errors.suggestedSolution ? 'input-error' : ''}
                />
                {errors.suggestedSolution && (
                  <span className="field-error">{errors.suggestedSolution}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="sug-location">Location</label>
                <input
                  id="sug-location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Barangay Hall, Rizal Street corner Mabini Ave."
                  className={errors.location ? 'input-error' : ''}
                />
                {errors.location && <span className="field-error">{errors.location}</span>}
              </div>

              <div className="form-checkbox-field">
                <label htmlFor="sug-submit-anonymously" className="checkbox-label">
                  <input
                    id="sug-submit-anonymously"
                    name="submitAnonymously"
                    type="checkbox"
                    checked={form.submitAnonymously}
                    onChange={handleChange}
                  />
                  <span>Submit anonymously</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Submit Suggestion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagementPageLayout>
  )
}

export default YouthSuggestions
