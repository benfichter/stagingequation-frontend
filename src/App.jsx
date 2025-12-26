import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const emptyAccount = {
  firmName: '',
  name: '',
  email: '',
  phone: '',
}

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [accountForm, setAccountForm] = useState(emptyAccount)
  const [accountStatus, setAccountStatus] = useState({ state: 'idle', message: '' })
  const [user, setUser] = useState(null)

  const [demoForm, setDemoForm] = useState({
    prompt: '',
    roomType: 'living-room',
    style: 'warm-modern',
  })
  const [demoFile, setDemoFile] = useState(null)
  const [demoStatus, setDemoStatus] = useState({ state: 'idle', message: '' })
  const [demoResult, setDemoResult] = useState(null)

  useEffect(() => {
    let active = true
    fetch(`${API_BASE}/healthz`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active) return
        setBackendStatus(data?.status === 'ok' ? 'connected' : 'error')
      })
      .catch(() => {
        if (!active) return
        setBackendStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const updateAccountField = (event) => {
    const { name, value } = event.target
    setAccountForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateDemoField = (event) => {
    const { name, value } = event.target
    setDemoForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAccountSubmit = async (event) => {
    event.preventDefault()
    setAccountStatus({ state: 'loading', message: 'Creating account...' })

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_name: accountForm.firmName.trim(),
          name: accountForm.name.trim(),
          email: accountForm.email.trim(),
          phone: accountForm.phone.trim() || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        if (response.status === 409) {
          throw new Error('That email already exists. Try logging in instead.')
        }
        throw new Error(error.detail || 'Unable to create account.')
      }

      const data = await response.json()
      setUser(data)
      setAccountStatus({ state: 'success', message: 'Account created. You can run the demo now.' })
    } catch (error) {
      setAccountStatus({ state: 'error', message: error.message })
    }
  }

  const handleDemoSubmit = async (event) => {
    event.preventDefault()

    if (!user) {
      setDemoStatus({ state: 'error', message: 'Create an account before running the demo.' })
      return
    }

    if (!demoFile) {
      setDemoStatus({ state: 'error', message: 'Upload a room photo to continue.' })
      return
    }

    setDemoStatus({ state: 'loading', message: 'Generating demo preview...' })

    const formData = new FormData()
    formData.append('user_id', user.id)
    formData.append('file', demoFile)

    if (demoForm.prompt.trim()) {
      formData.append('prompt', demoForm.prompt.trim())
    }

    formData.append('room_type', demoForm.roomType)
    formData.append('style', demoForm.style)

    try {
      const response = await fetch(`${API_BASE}/demo/watermark`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || 'Demo failed. Please try again.')
      }

      const data = await response.json()
      setDemoResult(data)
      setDemoStatus({ state: 'success', message: 'Demo ready. Preview below.' })
    } catch (error) {
      setDemoStatus({ state: 'error', message: error.message })
    }
  }

  const demoUrl = demoResult?.staged?.download_url || demoResult?.staged?.storage_url
  const originalUrl = demoResult?.original?.download_url || demoResult?.original?.storage_url

  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <p className="brand-title">Staging Equation</p>
            <p className="brand-subtitle">AI staging, fast and clean.</p>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#demo">Demo</a>
          <a href="#account">Create account</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-actions">
          <span className={`status-pill ${backendStatus}`}>
            Backend:{' '}
            {backendStatus === 'connected'
              ? 'Connected'
              : backendStatus === 'checking'
                ? 'Checking'
                : 'Offline'}
          </span>
          <a className="primary" href="#account">
            Create account
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="pill">Pay per image. No subscriptions.</p>
            <h1 className="reveal">Stage listing photos in minutes.</h1>
            <p className="lead reveal delay-1">
              Give your rooms the right furniture, lighting, and layout without staging crews.
              Output resolution matches the original photo so previews stay realistic.
            </p>
            <div className="hero-actions reveal delay-2">
              <a className="primary" href="#account">
                Create account
              </a>
              <a className="ghost-link" href="#demo">
                Try the demo
              </a>
            </div>
            <div className="hero-metrics reveal delay-3">
              <div>
                <p className="metric-value">2 hours</p>
                <p className="metric-label">Typical turnaround</p>
              </div>
              <div>
                <p className="metric-value">$29</p>
                <p className="metric-label">Per staged image</p>
              </div>
              <div>
                <p className="metric-value">MLS-ready</p>
                <p className="metric-label">Clean export after payment</p>
              </div>
            </div>
          </div>
          <div className="hero-card reveal delay-2" aria-hidden="true">
            <div className="card-header">
              <div>
                <p className="card-title">Preview</p>
                <p className="card-subtitle">Living Room</p>
              </div>
              <span className="tag">Demo</span>
            </div>
            <div className="card-image">
              <div className="card-glow" />
              <div className="card-pill">Style: Warm Modern</div>
            </div>
            <div className="card-footer">
              <div>
                <p className="metric-value">Bold watermark</p>
                <p className="metric-label">Removed after payment</p>
              </div>
              <button className="secondary small" type="button">
                Download
              </button>
            </div>
          </div>
        </section>

        <section className="demo" id="demo">
          <div className="section-heading">
            <p className="eyebrow">Interactive demo</p>
            <h2>Prompt the AI with the look you want.</h2>
            <p className="section-lead">
              Describe the style, furniture, and vibe. We will produce a watermarked preview.
            </p>
          </div>
          <div className="demo-grid">
            <form className="panel" onSubmit={handleDemoSubmit}>
              <label className="field">
                <span>Prompt</span>
                <textarea
                  name="prompt"
                  rows="4"
                  placeholder="Modern coastal living room with light oak, linen sofa, and soft daylight."
                  value={demoForm.prompt}
                  onChange={updateDemoField}
                />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Room type</span>
                  <select name="roomType" value={demoForm.roomType} onChange={updateDemoField}>
                    <option value="living-room">Living room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="office">Office</option>
                  </select>
                </label>
                <label className="field">
                  <span>Style</span>
                  <select name="style" value={demoForm.style} onChange={updateDemoField}>
                    <option value="warm-modern">Warm modern</option>
                    <option value="coastal">Coastal</option>
                    <option value="scandi">Scandi</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </label>
              </div>
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setDemoFile(event.target.files?.[0] || null)}
                />
                <div>
                  <p className="upload-title">Upload a room photo</p>
                  <p className="upload-subtitle">JPG or PNG, up to 15MB.</p>
                </div>
              </label>
              {demoFile ? <p className="file-pill">{demoFile.name}</p> : null}
              <button className="primary full" disabled={demoStatus.state === 'loading'}>
                {demoStatus.state === 'loading' ? 'Generating...' : 'Generate demo'}
              </button>
              {demoStatus.message ? (
                <p className={`status ${demoStatus.state}`}>{demoStatus.message}</p>
              ) : null}
              <p className="fine-print">
                Demo previews use the same resolution as the input image.
              </p>
            </form>
            <div className="panel panel-preview">
              <div className="preview-frame">
                {demoUrl ? <img src={demoUrl} alt="Staged demo preview" /> : 'Your demo preview will appear here.'}
              </div>
              <div className="preview-meta">
                <div>
                  <p className="metric-value">Watermarked</p>
                  <p className="metric-label">Preview only</p>
                </div>
                <div>
                  <p className="metric-value">Fast</p>
                  <p className="metric-label">Typically under 2 hours</p>
                </div>
              </div>
              {demoResult ? (
                <div className="preview-links">
                  {originalUrl ? (
                    <a href={originalUrl} target="_blank" rel="noreferrer">
                      View original
                    </a>
                  ) : null}
                  {demoUrl ? (
                    <a href={demoUrl} target="_blank" rel="noreferrer">
                      Open demo file
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="section" id="account">
          <div className="section-heading">
            <p className="eyebrow">Create account</p>
            <h2>Start a workspace in minutes.</h2>
            <p className="section-lead">
              We only need contact details to start staging. Payments stay per image.
            </p>
          </div>
          <div className="section-grid">
            <form className="panel" onSubmit={handleAccountSubmit}>
              <label className="field">
                <span>Brokerage or firm</span>
                <input
                  name="firmName"
                  placeholder="Northside Realty"
                  value={accountForm.firmName}
                  onChange={updateAccountField}
                  autoComplete="organization"
                  required
                />
              </label>
              <label className="field">
                <span>Your name</span>
                <input
                  name="name"
                  placeholder="Alex Morgan"
                  value={accountForm.name}
                  onChange={updateAccountField}
                  autoComplete="name"
                  required
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="alex@northside.com"
                  value={accountForm.email}
                  onChange={updateAccountField}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="field">
                <span>Phone</span>
                <input
                  name="phone"
                  placeholder="(555) 123-4567"
                  value={accountForm.phone}
                  onChange={updateAccountField}
                  autoComplete="tel"
                />
              </label>
              <button className="primary full" disabled={accountStatus.state === 'loading'}>
                {accountStatus.state === 'loading' ? 'Saving...' : 'Create account'}
              </button>
              {accountStatus.message ? (
                <p className={`status ${accountStatus.state}`}>{accountStatus.message}</p>
              ) : null}
            </form>
            <div className="panel panel-muted">
              <h3>What happens next</h3>
              <ul>
                <li>Save your profile and staging preferences.</li>
                <li>Run demos and upload rooms for review.</li>
                <li>Pay per image when you approve a preview.</li>
              </ul>
              {user ? (
                <div className="account-card">
                  <p className="account-pill">Workspace active</p>
                  <p className="account-name">{user.name}</p>
                  <p className="account-meta">{user.email}</p>
                  <p className="account-meta">{user.firm_name}</p>
                </div>
              ) : (
                <p className="fine-print">Create your account to unlock staging demos.</p>
              )}
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>Clear, simple, and built for agents.</h2>
          </div>
          <div className="steps">
            <article>
              <h3>1. Upload</h3>
              <p>Send a room photo and tell us the style you want.</p>
            </article>
            <article>
              <h3>2. Review</h3>
              <p>We deliver a watermarked preview for fast feedback.</p>
            </article>
            <article>
              <h3>3. Pay and download</h3>
              <p>Pay per image and receive the clean, MLS-ready export.</p>
            </article>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="section-heading">
            <p className="eyebrow">Pricing</p>
            <h2>Simple per-image pricing.</h2>
          </div>
          <div className="pricing">
            <div className="price-card">
              <h3>Per image</h3>
              <p className="price">$29</p>
              <ul>
                <li>Watermarked preview</li>
                <li>Clean export after payment</li>
                <li>Commercial usage for listings</li>
              </ul>
              <a className="primary full" href="#account">
                Create account
              </a>
            </div>
            <div className="price-card muted">
              <h3>Teams</h3>
              <p className="price">Custom</p>
              <ul>
                <li>Volume pricing</li>
                <li>Shared workspace</li>
                <li>Dedicated support</li>
              </ul>
              <button className="secondary full" type="button">
                Talk to sales
              </button>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Answers before you start.</h2>
          </div>
          <div className="faq">
            <div>
              <h4>Does the AI change room size or structure?</h4>
              <p>No. We keep the layout intact and only add staging elements.</p>
            </div>
            <div>
              <h4>Is 4K guaranteed?</h4>
              <p>
                Output resolution matches the input image. For best results, upload the highest
                quality photo you have.
              </p>
            </div>
            <div>
              <h4>Can I request edits?</h4>
              <p>Yes. We can iterate on style and furniture before final delivery.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <p className="brand-title">Staging Equation</p>
          <p className="fine-print">hello@stagingequation.com</p>
        </div>
        <div className="footer-links">
          <a href="#demo">Demo</a>
          <a href="#account">Create account</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
      </footer>
    </div>
  )
}

export default App
