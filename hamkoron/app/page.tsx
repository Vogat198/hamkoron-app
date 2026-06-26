'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { PROFESSIONS, CITIES, MOCK_WORKERS, Worker } from '@/lib/supabase'

// Star Rating Component
function StarRating({ rating, size = 14 }: { rating: number, size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? '#F4A100' : '#ddd' }}>★</span>
      ))}
    </div>
  )
}

// Worker Card
function WorkerCard({ worker }: { worker: Worker }) {
  const profession = PROFESSIONS.find(p => p.id === worker.profession)
  const initials = worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const colors = ['#4F7D1F', '#F4A100', '#3A5C16', '#D48B00', '#6BA32A']
  const bgColor = colors[parseInt(worker.id) % colors.length]

  return (
    <div className="glass worker-card" style={{
      borderRadius: 20,
      padding: 20,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {worker.verified && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'linear-gradient(135deg, #4F7D1F, #6BA32A)',
          color: 'white', borderRadius: 8, padding: '3px 8px',
          fontSize: 11, fontWeight: 600
        }}>✓ Тасдиқ</div>
      )}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}88)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: '#1F1F1F' }}>{worker.name}</div>
          <div style={{ fontSize: 13, color: '#4F7D1F', fontWeight: 600, marginBottom: 6 }}>
            {profession?.icon} {profession?.tj}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <StarRating rating={worker.rating || 0} />
            <span style={{ fontSize: 12, color: '#666' }}>({worker.review_count})</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(79,125,31,0.1)', color: '#4F7D1F',
              borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 500
            }}>📍 {worker.city}</span>
            <span style={{
              background: 'rgba(244,161,0,0.1)', color: '#D48B00',
              borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 500
            }}>⏱ {worker.experience}</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(79,125,31,0.1)' }}>
        <a href={`tel:${worker.phone}`} className="btn-primary" style={{
          display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: 14, padding: '10px 16px'
        }}>
          📞 {worker.phone}
        </a>
      </div>
    </div>
  )
}

// Modal Component
function Modal({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }} onClick={onClose}>
      <div className="glass" style={{
        borderRadius: 24, padding: 28, width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 10,
            width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [searchProfession, setSearchProfession] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchName, setSearchName] = useState('')
  const [showJobModal, setShowJobModal] = useState(false)
  const [showWorkerModal, setShowWorkerModal] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [activeTab, setActiveTab] = useState<'find-worker' | 'find-job'>('find-worker')
  const workersRef = useRef<HTMLDivElement>(null)
  const [navScrolled, setNavScrolled] = useState(false)

  // Job form state
  const [jobForm, setJobForm] = useState({ name: '', phone: '', city: '', description: '', profession: '' })
  // Worker form state
  const [workerForm, setWorkerForm] = useState({ name: '', phone: '', profession: '', experience: '', city: '' })

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredWorkers = MOCK_WORKERS.filter(w => {
    const profMatch = !searchProfession || w.profession === searchProfession
    const cityMatch = !searchCity || w.city === searchCity
    const nameMatch = !searchName || w.name.toLowerCase().includes(searchName.toLowerCase())
    return profMatch && cityMatch && nameMatch
  })

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')
    await new Promise(r => setTimeout(r, 1200))
    setSubmitStatus('success')
    setTimeout(() => { setShowJobModal(false); setSubmitStatus('idle'); setJobForm({ name: '', phone: '', city: '', description: '', profession: '' }) }, 2000)
  }

  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')
    await new Promise(r => setTimeout(r, 1200))
    setSubmitStatus('success')
    setTimeout(() => { setShowWorkerModal(false); setSubmitStatus('idle'); setWorkerForm({ name: '', phone: '', profession: '', experience: '', city: '' }) }, 2000)
  }

  const scrollToWorkers = () => {
    workersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Animated Background */}
      <div className="blob-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '12px 20px',
        transition: 'all 0.3s ease',
        ...(navScrolled ? {
          background: 'rgba(240,244,236,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(79,125,31,0.12)'
        } : {})
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/logo.png" alt="HAMKORON" width={40} height={40} style={{ borderRadius: 10 }} />
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: '#1F1F1F' }}>HAMKORON</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={() => setShowJobModal(true)} style={{ padding: '9px 18px', fontSize: 13 }}>
              + Кор гузоред
            </button>
            <button className="btn-secondary" onClick={() => setShowWorkerModal(true)} style={{ padding: '9px 18px', fontSize: 13 }}>
              Бақайд гиред
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 20px 60px',
        position: 'relative'
      }}>
        {/* Logo */}
        <div className="fade-up" style={{ marginBottom: 24, animationDelay: '0s' }}>
          <div className="glass" style={{
            display: 'inline-flex', padding: 16, borderRadius: 28,
            boxShadow: '0 20px 60px rgba(79,125,31,0.2)'
          }}>
            <Image src="/logo.png" alt="HAMKORON" width={90} height={90} style={{ borderRadius: 16 }} />
          </div>
        </div>

        {/* Tagline badge */}
        <div className="fade-up glass-green" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 100, marginBottom: 20,
          fontSize: 13, fontWeight: 600, color: '#4F7D1F',
          animationDelay: '0.1s'
        }}>
          <span style={{ animation: 'pulse-ring 2s infinite', display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#4F7D1F' }} />
          Платформаи №1 дар Тоҷикистон
        </div>

        {/* Headline */}
        <h1 className="fade-up" style={{
          fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: 800,
          letterSpacing: -1.5, lineHeight: 1.1,
          maxWidth: 700, marginBottom: 16,
          animationDelay: '0.15s'
        }}>
          <span style={{ color: '#1F1F1F' }}>Усто ва кор ёфтан</span>
          <br />
          <span className="gradient-text">бо мо осон!</span>
        </h1>

        {/* Subheadline */}
        <p className="fade-up" style={{
          fontSize: 'clamp(15px, 3vw, 18px)', color: '#555', maxWidth: 520,
          lineHeight: 1.65, marginBottom: 36, animationDelay: '0.2s'
        }}>
          Платформа барои пайдо кардани устоҳо ва ҷойи кор дар Тоҷикистон.
          <br />
          <span style={{ fontSize: '0.9em', color: '#888' }}>Платформа для поиска мастеров и работы в Таджикистане.</span>
        </p>

        {/* CTA Buttons */}
        <div className="fade-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48, animationDelay: '0.25s' }}>
          <button className="btn-primary" onClick={scrollToWorkers} style={{ padding: '16px 32px', fontSize: 16, borderRadius: 16 }}>
            🔍 Ёфтани кор
          </button>
          <button className="btn-secondary" onClick={() => setShowWorkerModal(true)} style={{ padding: '16px 32px', fontSize: 16, borderRadius: 16 }}>
            👷 Ёфтани усто
          </button>
          <button className="btn-ghost" onClick={() => setShowJobModal(true)} style={{ padding: '16px 32px', fontSize: 16 }}>
            📋 Эълон гузоред
          </button>
        </div>

        {/* Stats */}
        <div className="fade-up" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.3s' }}>
          {[
            { num: '1000+', label: 'Усто', labelRu: 'Мастеров', color: '#4F7D1F' },
            { num: '500+', label: 'Корфармо', labelRu: 'Работодателей', color: '#F4A100' },
            { num: '20+', label: 'Касб', labelRu: 'Профессий', color: '#4F7D1F' },
          ].map(stat => (
            <div key={stat.num} className="glass" style={{ borderRadius: 18, padding: '16px 24px', textAlign: 'center', minWidth: 110 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, letterSpacing: -1 }}>{stat.num}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{stat.labelRu}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', opacity: 0.4 }}>
          <div style={{ width: 24, height: 40, border: '2px solid #4F7D1F', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: '#4F7D1F', borderRadius: 2, animation: 'float 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="gradient-text" style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>КАСБҲО</span>
          <h2 className="section-title" style={{ marginTop: 8, marginBottom: 8 }}>Ҳамаи касбҳо</h2>
          <p style={{ color: '#666', fontSize: 15 }}>Устоҳои мо барои ҳар кори хона</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 12
        }}>
          {PROFESSIONS.map(prof => (
            <button key={prof.id} className="glass category-card" onClick={() => { setSearchProfession(prof.id); scrollToWorkers() }} style={{
              border: 'none', cursor: 'pointer', borderRadius: 18,
              padding: '18px 12px', textAlign: 'center', transition: 'all 0.25s ease',
              background: searchProfession === prof.id ? 'rgba(79,125,31,0.15)' : undefined,
              borderColor: searchProfession === prof.id ? 'rgba(79,125,31,0.4)' : undefined,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{prof.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1F1F1F', marginBottom: 2 }}>{prof.tj}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{prof.ru}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Workers Directory */}
      <section ref={workersRef} style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="gradient-text" style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>УСТОҲО</span>
          <h2 className="section-title" style={{ marginTop: 8, marginBottom: 8 }}>Пайдо кардани усто</h2>
          <p style={{ color: '#666', fontSize: 15 }}>Аз байни 1000+ устои тасдиқшуда интихоб кунед</p>
        </div>

        {/* Search & Filter */}
        <div className="glass" style={{ borderRadius: 20, padding: 20, marginBottom: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            placeholder="🔍 Ному насаб..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            style={{ flex: '1 1 180px', minWidth: 0 }}
          />
          <select value={searchProfession} onChange={e => setSearchProfession(e.target.value)} style={{ flex: '1 1 160px', minWidth: 0 }}>
            <option value="">⚡ Ҳамаи касбҳо</option>
            {PROFESSIONS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.tj}</option>)}
          </select>
          <select value={searchCity} onChange={e => setSearchCity(e.target.value)} style={{ flex: '1 1 140px', minWidth: 0 }}>
            <option value="">📍 Ҳамаи шаҳрҳо</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(searchProfession || searchCity || searchName) && (
            <button onClick={() => { setSearchProfession(''); setSearchCity(''); setSearchName('') }}
              style={{ padding: '13px 16px', background: 'rgba(255,0,0,0.08)', border: '1.5px solid rgba(255,0,0,0.2)', borderRadius: 12, cursor: 'pointer', fontSize: 13, color: '#cc3333', fontWeight: 500 }}>
              ✕ Тоза кардан
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
          {filteredWorkers.length} усто ёфт шуд
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="glass" style={{ borderRadius: 20, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
            <p style={{ color: '#666', fontSize: 16, marginBottom: 16 }}>Бо ин меъёрҳо усто ёфт нашуд</p>
            <button className="btn-ghost" onClick={() => { setSearchProfession(''); setSearchCity(''); setSearchName('') }}>
              Ҳамаи устоҳоро нишон деҳ
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
            {filteredWorkers.map(w => <WorkerCard key={w.id} worker={w} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="gradient-text" style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>ЧӢ ТАВР КОР МЕКУНАД</span>
          <h2 className="section-title" style={{ marginTop: 8, marginBottom: 8 }}>Осон ва зуд</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { step: '01', icon: '🔍', title: 'Ҷустуҷӯ кунед', sub: 'Касб ва шаҳри худро интихоб кунед', color: '#4F7D1F' },
            { step: '02', icon: '👷', title: 'Усто интихоб кунед', sub: 'Профил ва рейтингро бинед', color: '#F4A100' },
            { step: '03', icon: '📞', title: 'Тамос гиред', sub: 'Мустақим зang занед ё паём гузоред', color: '#4F7D1F' },
            { step: '04', icon: '⭐', title: 'Баҳо гузоред', sub: 'Ба дигарон кӯмак кунед', color: '#F4A100' },
          ].map(item => (
            <div key={item.step} className="glass" style={{ borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: `${item.color}15`, position: 'absolute', top: -8, right: 12, lineHeight: 1, letterSpacing: -2 }}>{item.step}</div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: '#1F1F1F' }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Post a Job Section */}
      <section style={{ padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
        <div className="glass" style={{ borderRadius: 28, padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>Корро эълон кунед</h2>
          <p style={{ color: '#666', fontSize: 15, marginBottom: 24 }}>Эълони худро гузоред ва устоҳо бо шумо тамос мегиранд</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setShowJobModal(true)} style={{ padding: '14px 28px', fontSize: 15 }}>
              📝 Эълони кор гузоред
            </button>
            <button className="btn-secondary" onClick={() => setShowWorkerModal(true)} style={{ padding: '14px 28px', fontSize: 15 }}>
              👷 Усто шавед
            </button>
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <footer style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="glass-dark" style={{ borderRadius: 28, padding: '36px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Image src="/logo.png" alt="HAMKORON" width={36} height={36} style={{ borderRadius: 8 }} />
                <span style={{ fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: -0.5 }}>HAMKORON</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
                Платформаи беҳтарин барои пайдо кардани устоҳо ва ҷойи кор дар Тоҷикистон.
              </p>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Касбҳо</div>
              {['Барқкаш', 'Сантехник', 'Рангрез', 'Ҷӯшкор', 'Бинокор'].map(p => (
                <div key={p} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 6, cursor: 'pointer', transition: 'color 0.2s' }}>{p}</div>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Тамос</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 10 }}>
                <a href="tel:+79630691835" style={{ color: '#F4A100', textDecoration: 'none', fontWeight: 600 }}>📞 +7 963 069 18 35</a>
              </div>
              <div>
                <a href="https://www.instagram.com/hamkoron" target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #F4A100, #E91E8C)',
                  color: 'white', borderRadius: 10, padding: '8px 14px',
                  textDecoration: 'none', fontSize: 13, fontWeight: 600
                }}>
                  📸 @hamkoron
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>© 2025 HAMKORON. Ҳамаи ҳуқуқҳо маҳфузанд.</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Тоҷикистон 🇹🇯</span>
          </div>
        </div>
      </footer>

      {/* Job Modal */}
      <Modal isOpen={showJobModal} onClose={() => { setShowJobModal(false); setSubmitStatus('idle') }} title="📋 Эълони кор гузоред">
        {submitStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#4F7D1F' }}>Муваффақ шуд!</h3>
            <p style={{ color: '#666', fontSize: 14 }}>Эълони шумо гузошта шуд. Устоҳо бо шумо тамос мегиранд.</p>
          </div>
        ) : (
          <form onSubmit={handleJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Ному насаб *</label>
              <input required placeholder="Масалан: Алишер Раҳимов" value={jobForm.name} onChange={e => setJobForm({...jobForm, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Рақами телефон *</label>
              <input required type="tel" placeholder="+992 900 000 000" value={jobForm.phone} onChange={e => setJobForm({...jobForm, phone: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Шаҳр *</label>
              <select required value={jobForm.city} onChange={e => setJobForm({...jobForm, city: e.target.value})}>
                <option value="">Шаҳрро интихоб кунед</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Касб</label>
              <select value={jobForm.profession} onChange={e => setJobForm({...jobForm, profession: e.target.value})}>
                <option value="">Касбро интихоб кунед</option>
                {PROFESSIONS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.tj}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Тавсифи кор *</label>
              <textarea required rows={4} placeholder="Корро тавсиф диҳед..." value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={submitStatus === 'loading'} style={{ padding: '14px', fontSize: 15, marginTop: 4, opacity: submitStatus === 'loading' ? 0.7 : 1 }}>
              {submitStatus === 'loading' ? '⏳ Интизор шавед...' : '📤 Фиристодан'}
            </button>
          </form>
        )}
      </Modal>

      {/* Worker Registration Modal */}
      <Modal isOpen={showWorkerModal} onClose={() => { setShowWorkerModal(false); setSubmitStatus('idle') }} title="👷 Усто шавед">
        {submitStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: '#4F7D1F' }}>Хуш омадед!</h3>
            <p style={{ color: '#666', fontSize: 14 }}>Профили шумо сохта шуд. Корфармоён бо шумо тамос мегиранд.</p>
          </div>
        ) : (
          <form onSubmit={handleWorkerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Ному насаб *</label>
              <input required placeholder="Масалан: Баҳром Назаров" value={workerForm.name} onChange={e => setWorkerForm({...workerForm, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Рақами телефон *</label>
              <input required type="tel" placeholder="+992 900 000 000" value={workerForm.phone} onChange={e => setWorkerForm({...workerForm, phone: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Касб *</label>
              <select required value={workerForm.profession} onChange={e => setWorkerForm({...workerForm, profession: e.target.value})}>
                <option value="">Касбро интихоб кунед</option>
                {PROFESSIONS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.tj}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Таҷриба *</label>
              <input required placeholder="Масалан: 5 сол" value={workerForm.experience} onChange={e => setWorkerForm({...workerForm, experience: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#333' }}>Шаҳр *</label>
              <select required value={workerForm.city} onChange={e => setWorkerForm({...workerForm, city: e.target.value})}>
                <option value="">Шаҳрро интихоб кунед</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-secondary" disabled={submitStatus === 'loading'} style={{ padding: '14px', fontSize: 15, marginTop: 4, opacity: submitStatus === 'loading' ? 0.7 : 1 }}>
              {submitStatus === 'loading' ? '⏳ Интизор шавед...' : '🚀 Бақайд гирифтан'}
            </button>
          </form>
        )}
      </Modal>
    </>
  )
}
