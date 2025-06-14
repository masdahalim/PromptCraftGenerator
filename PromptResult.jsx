import { useState, useEffect } from 'react'
import { generatePrompt, translatePrompt } from './utils'

const HIGHLIGHT_WORDS = [
  // Warna
  'kuning', 'hitam', 'merah', 'biru', 'hijau', 'cokelat', 'sawo matang', 'putih', 'abu-abu', 'gelap', 'cerah',
  // Ekspresi
  'kagum', 'antusias', 'serius', 'fokus', 'ramah', 'tersenyum', 'tertawa', 'ceria', 'murung',
  // Aksi
  'berjalan', 'melihat', 'berinteraksi', 'mengamati', 'membeli', 'duduk', 'berbincang', 'melambaikan', 'mengambil',
  // Properti
  'jaket', 'celana', 'ransel', 'topi', 'sepatu', 'kamera', 'payung', 'kopi', 'makanan', 'minuman',
  // Visual
  'pencahayaan', 'pantulan', 'resolusi', 'cinematic', 'realistis', 'handheld', 'tracking shot', 'pan', 'static', '4K',
  // Suasana
  'ramai', 'sibuk', 'hidup', 'dinamis', 'ceria', 'penuh tawa', 'santai', 'akrab',
]

function highlightText(text) {
  if (!text) return ''
  let result = text
  HIGHLIGHT_WORDS.forEach(word => {
    const re = new RegExp(`\\b(${word})\\b`, 'gi')
    result = result.replace(re, '<span class="highlight-key">$1</span>')
  })
  return result
}

function analyzePrompt(promptData) {
  if (!promptData) return { score: 0, feedback: 'Prompt belum diisi.' }
  let score = 100
  let feedback = []
  if (!promptData.deskripsi || promptData.deskripsi.length < 30) { score -= 15; feedback.push('Deskripsi karakter utama kurang detail.') }
  if (!promptData.aksi || promptData.aksi.length < 15) { score -= 10; feedback.push('Aksi karakter utama kurang detail.') }
  if (!promptData.ekspresi || promptData.ekspresi.length < 10) { score -= 8; feedback.push('Ekspresi karakter utama kurang detail.') }
  if (!promptData.visual || promptData.visual.length < 15) { score -= 8; feedback.push('Detail visual tambahan kurang.') }
  if (!promptData.suasana || promptData.suasana.length < 10) { score -= 5; feedback.push('Suasana keseluruhan kurang.') }
  if (!promptData.ambience || promptData.ambience.length < 10) { score -= 5; feedback.push('Suara lingkungan/ambience kurang.') }
  if (!promptData.dialog || promptData.dialog.length < 8) { score -= 8; feedback.push('Dialog karakter utama kurang.') }
  if (!promptData.negative || promptData.negative.length < 10) { score -= 5; feedback.push('Negative prompt kurang.') }
  if (/kulit/i.test(promptData.deskripsi) && !/(sawo matang|putih|gelap|cokelat|kuning|cerah|hitam)/i.test(promptData.deskripsi)) {
    score -= 8; feedback.push('Deskripsi karakter utama menyebut "kulit" tapi tidak menyebut warna kulit secara spesifik.')
  }
  if (score > 90) feedback.unshift('Prompt sangat lengkap dan siap digunakan!')
  else if (score > 75) feedback.unshift('Prompt cukup baik, tapi masih bisa ditingkatkan.')
  else feedback.unshift('Prompt masih kurang detail, mohon lengkapi lagi.')
  return { score, feedback: feedback.join(' ') }
}

export default function PromptResult({ promptData }) {
  const [idPrompt, setIdPrompt] = useState('')
  const [enPrompt, setEnPrompt] = useState('')

  useEffect(() => {
    if (promptData) {
      const id = generatePrompt(promptData, 'id')
      setIdPrompt(id)
      setEnPrompt(translatePrompt(promptData, id))
    }
  }, [promptData])

  const analysis = analyzePrompt(promptData)

  if (!promptData) return null

  return (
    <div className="prompt-result">
      <div>
        <h2>Prompt Bahasa Indonesia (editable)</h2>
        <div style={{position:'relative'}}>
          <textarea value={idPrompt} onChange={e => setIdPrompt(e.target.value)} rows={16} style={{width:'100%',opacity:0.01,position:'absolute',zIndex:1,top:0,left:0,height:'100%'}} />
          <div className="prompt-highlight" style={{pointerEvents:'none',whiteSpace:'pre-wrap',minHeight:350,padding:'1rem',fontFamily:'Fira Mono, Consolas, monospace',fontSize:'1rem',borderRadius:8,border:'1px solid #bbb',background:'#fafbfc',position:'relative',zIndex:0}} dangerouslySetInnerHTML={{__html:highlightText(idPrompt)}} />
        </div>
      </div>
      <div>
        <h2>Prompt Bahasa Inggris (final)</h2>
        <div className="prompt-highlight" style={{whiteSpace:'pre-wrap',minHeight:350,padding:'1rem',fontFamily:'Fira Mono, Consolas, monospace',fontSize:'1rem',borderRadius:8,border:'1px solid #bbb',background:'#f5f5f5'}} dangerouslySetInnerHTML={{__html:highlightText(enPrompt)}} />
      </div>
      <div style={{gridColumn:'1/-1',marginTop:24,padding:'1rem',background:'#e3f6e8',border:'1px solid #b2dfdb',borderRadius:8,color:'#22543d'}}>
        <b>Analisis Kualitas Prompt:</b><br/>
        <span style={{fontSize:20,fontWeight:700}}>Skor: {analysis.score}/100</span><br/>
        <span>{analysis.feedback}</span>
      </div>
    </div>
  )
} 