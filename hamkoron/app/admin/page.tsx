'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MOCK_WORKERS, PROFESSIONS, CITIES } from '@/lib/supabase'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'workers' | 'jobs' | 'stats'>('stats')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)

  const mockJobs = [
    { id: '1', name: 'Рустам Алиев', phone: '+992 900 111 222', city: 'Душанбе', description: 'Барои таъмири барқ устои касбӣ лозим аст', profession: 'electrician', created_at: '2025-06-20', status: 'open' },
    { id: '2', name: 'Нилуфар Каримова', phone: '+992 917 333 444', city: 'Хуҷанд', description: 'Ваннахонаро таъмир кардан лозим аст', profession: 'plumber', created_at: '2025-06-21', status: 'open' },
    { id: '3', name: 'Темур Назаров', phone: '+992 934 555 666', city: 'Кӯлоб', description: 'Девори хонаро ранг кардан', profession: 'painter', created_at: '2025-06-22', status: 'closed' },
  ]

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ec', padding: 20 }}>
        <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 24, padding: 40, width: '100%', maxWidth: 360, textAlign: 'center', boxShadow: '0 20px 60px rgba(79,125,31,0.12)' }}>
          <Image src="/logo.png" alt="HAMKORON" width={64} height={64} style={{ borderRadius: 14, marginBottom: 16 }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: -0.5 }}>Панели идоракунӣ</h1>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>Admin Dashboard</p>
          <input
            type="password"
            placeholder="Рамз..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && password === 'hamkoron2025' && setAuthed(true)}
            style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(79,125,31,0.2)', background: 'rgba(255,255,255,0.8)', fontSize: 15, outline: 'none', marginBottom: 12 }}
          />
          <button onClick={() => password === 'hamkoron2025' && setAuthed(true)} style={{ width: '100%', background: 'linear-gradient(135deg, #4F7D1F, #6BA32A)', color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Дохил шудан
          </button>
          {password && password !== 'hamkoron2025' && (
            <p style={{ color: '#e53e3e', fontSize: 12, marginTop: 10 }}>Рамз нодуруст аст</p>
          )}
          <p style={{ color: '#ccc', fontSize: 11, marginTop: 16 }}>Demo: hamkoron2025</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Устоҳои фаъол', value: MOCK_WORKERS.length, icon: '👷', color: '#4F7D1F', bg: 'rgba(79,125,31,0.1)' },
    { label: 'Эълонҳои кор', value: mockJobs.length, icon: '📋', color: '#F4A100', bg: 'rgba(244,161,0,0.1)' },
    { label: 'Тасдиқшудагон', value: MOCK_WORKERS.filter(w => w.verified).length, icon: '✅', color: '#4F7D1F', bg: 'rgba(79,125,31,0.1)' },
    { label: 'Шаҳрҳо', value: CITIES.length, icon: '📍', color: '#F4A100', bg: 'rgba(244,161,0,0.1)' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ec', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Top nav */}
      <nav style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(79,125,31,0.12)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/logo.png" alt="HAMKORON" width={32} height={32} style={{ borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.5 }}>HAMKORON</span>
          <span style={{ background: 'rgba(79,125,31,0.12)', color: '#4F7D1F', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/" style={{ background: 'rgba(79,125,31,0.1)', color: '#4F7D1F', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>← Сайт</a>
          <button onClick={() => setAuthed(false)} style={{ background: 'rgba(255,0,0,0.08)', color: '#cc3333', border: '1px solid rgba(255,0,0,0.15)', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Баромадан</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderRadius: 14, padding: 6, width: 'fit-content' }}>
          {[
            { key: 'stats', label: '📊 Оморҳо' },
            { key: 'workers', label: '👷 Устоҳо' },
            { key: 'jobs', label: '📋 Эълонҳо' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
              padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.key ? 'linear-gradient(135deg, #4F7D1F, #6BA32A)' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#555',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(79,125,31,0.3)' : 'none'
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 18, padding: '22px 20px', boxShadow: '0 4px 20px rgba(79,125,31,0.06)' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: -1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Profession breakdown */}
            <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(79,125,31,0.06)' }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 18, letterSpacing: -0.3 }}>📊 Касбҳо оморан</h3>
              {PROFESSIONS.map(prof => {
                const count = MOCK_WORKERS.filter(w => w.profession === prof.id).length
                const pct = Math.round((count / MOCK_WORKERS.length) * 100)
                return (
                  <div key={prof.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{prof.icon} {prof.tj}</span>
                      <span style={{ fontSize: 13, color: '#888' }}>{count} нафар ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(79,125,31,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #4F7D1F, #6BA32A)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>Ҳамаи устоҳо ({MOCK_WORKERS.length})</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(79,125,31,0.06)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(79,125,31,0.1)', background: 'rgba(79,125,31,0.04)' }}>
                      {['Ном', 'Телефон', 'Касб', 'Шаҳр', 'Рейтинг', 'Тасдиқ', 'Амалиёт'].map(h => (
                        <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_WORKERS.map((w, i) => {
                      const prof = PROFESSIONS.find(p => p.id === w.profession)
                      return (
                        <tr key={w.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(79,125,31,0.02)' }}>
                          <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{w.name}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#4F7D1F' }}>{w.phone}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>{prof?.icon} {prof?.tj}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{w.city}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ color: '#F4A100', fontWeight: 700, fontSize: 13 }}>★ {w.rating}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: w.verified ? 'rgba(79,125,31,0.12)' : 'rgba(0,0,0,0.06)', color: w.verified ? '#4F7D1F' : '#999', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                              {w.verified ? '✓ Тасдиқ' : 'Тасдиқ нашуд'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button style={{ background: 'rgba(79,125,31,0.1)', color: '#4F7D1F', border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✏️</button>
                              <button style={{ background: 'rgba(255,0,0,0.08)', color: '#cc3333', border: 'none', borderRadius: 7, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>Эълонҳои кор ({mockJobs.length})</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockJobs.map(job => {
                const prof = PROFESSIONS.find(p => p.id === job.profession)
                return (
                  <div key={job.id} style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 18, padding: '20px 22px', boxShadow: '0 4px 16px rgba(79,125,31,0.06)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{job.name}</span>
                        <span style={{ background: job.status === 'open' ? 'rgba(79,125,31,0.12)' : 'rgba(0,0,0,0.06)', color: job.status === 'open' ? '#4F7D1F' : '#999', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                          {job.status === 'open' ? '🟢 Кушода' : '🔴 Пӯшида'}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 8, lineHeight: 1.5 }}>{job.description}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(79,125,31,0.08)', color: '#4F7D1F', borderRadius: 7, padding: '3px 9px', fontSize: 12, fontWeight: 500 }}>📍 {job.city}</span>
                        {prof && <span style={{ background: 'rgba(244,161,0,0.1)', color: '#D48B00', borderRadius: 7, padding: '3px 9px', fontSize: 12, fontWeight: 500 }}>{prof.icon} {prof.tj}</span>}
                        <span style={{ color: '#aaa', fontSize: 12 }}>{job.created_at}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <a href={`tel:${job.phone}`} style={{ background: 'linear-gradient(135deg, #4F7D1F, #6BA32A)', color: 'white', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>📞 {job.phone}</a>
                      <button style={{ background: 'rgba(255,0,0,0.08)', color: '#cc3333', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Нест кардан</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
