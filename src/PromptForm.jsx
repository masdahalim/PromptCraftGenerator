import { useState } from 'react'
import cameraMotions from './cameraMotions'

const initialState = {
  judul: '',
  deskripsi: '',
  suara: '',
  aksi: '',
  ekspresi: '',
  latar: '',
  visual: '',
  suasana: '',
  ambience: '',
  dialog: '',
  negative: '',
  cameraMotion: '',
  pendamping: [],
  gambarRef: null,
  gambarRefUrl: '',
  customFields: [],
}

const moodboardImages = {
  'Terminal Bus Malam': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'Pasar Pagi': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  'Kantin Sekolah': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
}

const autofillData = {
  'Terminal Bus Malam': {
    latar: 'Di terminal bus antar kota malam hari, terdapat pedagang kaki lima di pinggir jalur keberangkatan, beberapa bus berjajar dengan lampu menyala. Waktu: malam hari, hujan rintik-rintik.',
    visual: 'Gerakan Kamera: tracking shot dari belakang karakter lalu menyamping dan ke depan, mengikuti langkahnya secara sinematik. Pencahayaan: natural dari lampu jalan dan lampu bus, pantulan cahaya pada aspal basah. Gaya Video/Art Style: cinematic realistis. Kualitas Visual: Resolusi 4K.',
    suasana: 'Suasana sibuk, ramai, dengan kesan perjalanan malam yang hidup dan dinamis meskipun hujan.',
    ambience: 'SOUND: suara mesin bus menyala, pengumuman dari pengeras suara, derai hujan ringan, dan percakapan samar antar penumpang dan pedagang.'
  },
  'Pasar Pagi': {
    latar: 'Di pasar tradisional pagi hari, ramai pedagang dan pembeli, suasana sibuk, cahaya matahari pagi masuk di sela tenda.',
    visual: 'Gerakan Kamera: handheld, mengikuti karakter utama menyusuri lorong pasar. Pencahayaan: natural pagi hari. Gaya Video: dokumenter realis. Kualitas Visual: 4K.',
    suasana: 'Suasana ramai, penuh aktivitas, suara tawar-menawar dan tawa.',
    ambience: 'SOUND: suara pedagang, pembeli, dan kendaraan lewat di sekitar pasar.'
  },
  'Kantin Sekolah': {
    latar: 'Di kantin sekolah siang hari, banyak siswa antre membeli makanan, suasana ceria dan penuh tawa.',
    visual: 'Gerakan Kamera: static dan pan, menyorot interaksi siswa. Pencahayaan: terang alami. Gaya Video: slice of life. Kualitas Visual: 4K.',
    suasana: 'Suasana ceria, penuh tawa dan obrolan remaja.',
    ambience: 'SOUND: suara siswa bercanda, suara alat makan, dan penjual memanggil.'
  }
}

const SUGGESTIONS = {
  deskripsi: [
    'Tubuh mungil, tinggi 158cm, proporsional',
    'Kulit sawo matang cerah',
    'Rambut ikal sebahu, hitam kecokelatan',
    'Wajah oval, alis tebal alami, mata hitam besar',
    'Senyum ramah, pipi merona',
    'Bibir natural dengan sentuhan lip tint',
    'Mengenakan jaket parasut kuning mustard',
    'Celana panjang hitam, membawa ransel kecil',
  ],
  aksi: [
    'Berjalan di sekitar lokasi sambil mengamati sekitar',
    'Berinteraksi dengan karakter lain',
    'Mengambil gambar atau merekam video',
    'Membeli makanan/minuman',
    'Melambaikan tangan ke kamera',
    'Duduk dan berbincang',
  ],
  ekspresi: [
    'Ekspresi kagum dan antusias',
    'Sering tersenyum sambil melirik kamera',
    'Ekspresi serius dan fokus',
    'Tertawa lepas',
    'Ekspresi ramah dan terbuka',
  ],
  visual: [
    'Pencahayaan natural dari lampu jalan',
    'Pantulan cahaya pada aspal basah',
    'Gaya video cinematic realistis',
    'Resolusi 4K',
    'Kamera tracking shot',
    'Pencahayaan pagi hari',
  ],
  suasana: [
    'Suasana sibuk dan ramai',
    'Kesan perjalanan malam yang hidup',
    'Suasana ceria dan penuh tawa',
    'Suasana penuh aktivitas',
    'Suasana santai dan akrab',
  ],
}

const CHECKLIST = [
  'Warna kulit karakter utama sudah konsisten?',
  'Dialog karakter utama sudah natural dan sesuai suara?',
  'Ekspresi karakter utama sesuai dengan aksi?',
  'Deskripsi pakaian dan properti sudah jelas?',
  'Aksi karakter utama dan pendamping tidak bertabrakan?',
  'Suara karakter sudah sesuai dengan latar budaya/daerah?',
  'Tidak ada inkonsistensi antara visual dan suasana?',
  'Negative prompt sudah lengkap?',
]

const NEGATIVE_PRESETS = [
  'Hindari: teks di layar, subtitle, tulisan di video, font, logo, distorsi, artefak, anomali, wajah ganda, anggota badan cacat, tangan tidak normal, orang tambahan, objek mengganggu, kualitas rendah, buram, glitch, suara robotik, suara pecah.',
  'Avoid: text, subtitles, watermark, logo, distortion, artifact, anomaly, double face, deformed limbs, abnormal hands, extra people, distracting objects, low quality, blurry, glitch, robotic voice, cracked voice.',
  'No text, no logo, no watermark, no distortion, no artifact, no anomaly, no double face, no extra people, no distracting objects, no low quality, no blurry, no glitch.'
]

function AutoSuggestTextarea({ name, value, onChange, suggestions, ...props }) {
  const [show, setShow] = useState(false)
  const [filtered, setFiltered] = useState([])

  const handleInput = e => {
    onChange(e)
    const val = e.target.value.toLowerCase()
    if (val.length > 0) {
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(val)))
      setShow(true)
    } else {
      setShow(false)
    }
  }

  const handleSelect = s => {
    onChange({ target: { name, value: s } })
    setShow(false)
  }

  return (
    <div style={{position:'relative'}}>
      <textarea name={name} value={value} onChange={handleInput} {...props} autoComplete="off" />
      {show && filtered.length > 0 && (
        <ul style={{position:'absolute',zIndex:10,background:'#fff',border:'1px solid #ccc',borderRadius:6,margin:0,padding:'4px 0',listStyle:'none',maxHeight:120,overflowY:'auto',width:'100%'}}>
          {filtered.map((s, i) => (
            <li key={i} style={{padding:'4px 12px',cursor:'pointer'}} onMouseDown={() => handleSelect(s)}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DialogPreview({ utama, utamaNama, pendamping }) {
  if ((!utama && (!pendamping || pendamping.length === 0))) return null
  return (
    <div style={{gridColumn:'1/-1',margin:'2rem 0',padding:'1rem',background:'#f8f8fc',border:'1px solid #d1d1e7',borderRadius:8}}>
      <div style={{fontWeight:600,marginBottom:8}}>Simulasi Dialog (Preview)</div>
      {utama && (
        <div style={{display:'flex',alignItems:'flex-start',marginBottom:8}}>
          <div style={{background:'#1e90ff',color:'#fff',borderRadius:16,padding:'8px 16px',maxWidth:400}}><b>{utamaNama||'Karakter Utama'}:</b> {utama}</div>
        </div>
      )}
      {pendamping && pendamping.map((p,i)=>(
        p.dialog ? (
          <div key={i} style={{display:'flex',alignItems:'flex-start',marginBottom:8,justifyContent:'flex-end'}}>
            <div style={{background:'#43a047',color:'#fff',borderRadius:16,padding:'8px 16px',maxWidth:400}}><b>{p.nama||`Pendamping #${i+1}`}:</b> {p.dialog}</div>
          </div>
        ) : null
      ))}
    </div>
  )
}

function validatePrompt(form) {
  const warnings = []
  if (form.deskripsi.length < 30) warnings.push('Deskripsi karakter utama terlalu singkat.')
  if (form.aksi.length < 15) warnings.push('Aksi karakter utama terlalu singkat.')
  if (form.ekspresi.length < 10) warnings.push('Ekspresi karakter utama terlalu singkat.')
  if (form.visual.length < 15) warnings.push('Detail visual tambahan terlalu singkat.')
  if (form.suasana.length < 10) warnings.push('Suasana keseluruhan terlalu singkat.')
  if (form.ambience.length < 10) warnings.push('Suara lingkungan/ambience terlalu singkat.')
  if (form.dialog.length < 8) warnings.push('Dialog karakter utama terlalu singkat.')
  if (form.negative.length < 10) warnings.push('Negative prompt terlalu singkat.')
  // Cek inkonsistensi warna kulit di deskripsi vs visual
  if (/kulit/i.test(form.deskripsi) && !/(sawo matang|putih|gelap|cokelat|kuning|cerah|hitam)/i.test(form.deskripsi)) {
    warnings.push('Deskripsi karakter utama menyebut "kulit" tapi tidak menyebut warna kulit secara spesifik.')
  }
  return warnings
}

export default function PromptForm({ onGenerate }) {
  const [form, setForm] = useState({ ...initialState, utamaNama: '' })
  const [check, setCheck] = useState(Array(CHECKLIST.length).fill(false))
  const [highlight, setHighlight] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setHighlight({ [name]: true })
  }

  const handlePendampingChange = (idx, e) => {
    const { name, value } = e.target
    setForm(f => {
      const pendamping = [...f.pendamping]
      pendamping[idx] = { ...pendamping[idx], [name]: value }
      return { ...f, pendamping }
    })
  }

  const addPendamping = () => {
    setForm(f => ({ ...f, pendamping: [...f.pendamping, { nama: '', deskripsi: '', aksi: '', ekspresi: '', dialog: '' }] }))
  }

  const removePendamping = idx => {
    setForm(f => {
      const pendamping = [...f.pendamping]
      pendamping.splice(idx, 1)
      return { ...f, pendamping }
    })
  }

  const handleGambarChange = e => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setForm(f => ({ ...f, gambarRef: file, gambarRefUrl: url }))
    }
  }

  const removeGambar = () => {
    setForm(f => ({ ...f, gambarRef: null, gambarRefUrl: '' }))
  }

  const handleAutofill = () => {
    const data = autofillData[form.judul]
    if (data) {
      setForm(f => ({
        ...f,
        latar: data.latar,
        visual: data.visual,
        suasana: data.suasana,
        ambience: data.ambience
      }))
    }
  }

  const handleCustomFieldChange = (idx, e) => {
    const { name, value } = e.target
    setForm(f => {
      const customFields = [...(f.customFields||[])]
      customFields[idx] = { ...customFields[idx], [name]: value }
      return { ...f, customFields }
    })
  }

  const addCustomField = () => {
    setForm(f => ({ ...f, customFields: [...(f.customFields||[]), { title: '', value: '' }] }))
  }

  const removeCustomField = idx => {
    setForm(f => {
      const customFields = [...(f.customFields||[])]
      customFields.splice(idx, 1)
      return { ...f, customFields }
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const warnings = validatePrompt(form)
    if (warnings.length > 0) {
      alert(`Peringatan Validasi Prompt:\n${warnings.join('\n')}\n\nSilakan perbaiki prompt sebelum generate.`)
    } else {
      onGenerate(form)
    }
  }

  // Preview sinematik: moodboard dari judul adegan
  const moodboardUrl = moodboardImages[form.judul]

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-section">
          <h3>Informasi Dasar</h3>
          <label>
            Nama Karakter Utama
            <input 
              name="utamaNama" 
              value={form.utamaNama} 
              onChange={handleChange} 
              placeholder="Contoh: Sari" 
              className={highlight?.utamaNama ? 'highlight' : ''}
            />
          </label>
          <label>
            Judul Adegan
            <div className="input-group">
              <input 
                name="judul" 
                value={form.judul} 
                onChange={handleChange} 
                required 
                className={highlight?.judul ? 'highlight' : ''}
              />
              {autofillData[form.judul] && (
                <button type="button" className="btn btn-primary btn-sm" onClick={handleAutofill}>
                  <span className="btn-icon">✨</span> Autofill
                </button>
              )}
            </div>
          </label>
        </div>

        {moodboardUrl && (
          <div className="moodboard-section">
            <h3>Preview Sinematik</h3>
            <div className="moodboard-container">
              <img src={moodboardUrl} alt="Moodboard" className="moodboard-image" />
            </div>
          </div>
        )}

        <div className="form-section">
          <h3>Karakter Utama</h3>
          <label>
            Deskripsi Karakter
            <AutoSuggestTextarea 
              name="deskripsi" 
              value={form.deskripsi} 
              onChange={handleChange} 
              suggestions={SUGGESTIONS.deskripsi} 
              required 
              className={highlight?.deskripsi ? 'highlight' : ''}
            />
          </label>
          <label>
            Detail Suara
            <textarea 
              name="suara" 
              value={form.suara} 
              onChange={handleChange} 
              required 
              className={highlight?.suara ? 'highlight' : ''}
            />
          </label>
          <label>
            Aksi Karakter
            <AutoSuggestTextarea 
              name="aksi" 
              value={form.aksi} 
              onChange={handleChange} 
              suggestions={SUGGESTIONS.aksi} 
              required 
              className={highlight?.aksi ? 'highlight' : ''}
            />
          </label>
          <label>
            Ekspresi Karakter
            <AutoSuggestTextarea 
              name="ekspresi" 
              value={form.ekspresi} 
              onChange={handleChange} 
              suggestions={SUGGESTIONS.ekspresi} 
              required 
              className={highlight?.ekspresi ? 'highlight' : ''}
            />
          </label>
        </div>

        <div className="form-section">
          <h3>Latar & Visual</h3>
          <label>
            Latar Tempat & Waktu
            <textarea 
              name="latar" 
              value={form.latar} 
              onChange={handleChange} 
              required 
              className={highlight?.latar ? 'highlight' : ''}
            />
          </label>
          <label>
            Detail Visual
            <AutoSuggestTextarea 
              name="visual" 
              value={form.visual} 
              onChange={handleChange} 
              suggestions={SUGGESTIONS.visual} 
              required 
              className={highlight?.visual ? 'highlight' : ''}
            />
          </label>
          <label>
            Gerakan Kamera
            <select 
              name="cameraMotion" 
              value={form.cameraMotion} 
              onChange={handleChange} 
              required
              className={highlight?.cameraMotion ? 'highlight' : ''}
            >
              <option value="">Pilih Gerakan Kamera</option>
              {cameraMotions.map((motion, i) => (
                <option key={i} value={motion.en}>{motion.en} ({motion.id})</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-section">
          <h3>Suasana & Dialog</h3>
          <label>
            Suasana Keseluruhan
            <AutoSuggestTextarea 
              name="suasana" 
              value={form.suasana} 
              onChange={handleChange} 
              suggestions={SUGGESTIONS.suasana} 
              required 
              className={highlight?.suasana ? 'highlight' : ''}
            />
          </label>
          <label>
            Suara Lingkungan
            <textarea 
              name="ambience" 
              value={form.ambience} 
              onChange={handleChange} 
              required 
              className={highlight?.ambience ? 'highlight' : ''}
            />
          </label>
          <label>
            Dialog Karakter
            <textarea 
              name="dialog" 
              value={form.dialog} 
              onChange={handleChange} 
              required 
              className={highlight?.dialog ? 'highlight' : ''}
            />
          </label>
        </div>

        <div className="form-section">
          <h3>Referensi & Pengaturan</h3>
          <label>
            Upload Gambar Referensi
            <div className="file-upload">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleGambarChange}
                className="file-input"
              />
              {form.gambarRefUrl && (
                <div className="image-preview">
                  <img src={form.gambarRefUrl} alt="Preview" />
                  <button type="button" className="btn btn-danger btn-sm" onClick={removeGambar}>
                    <span className="btn-icon">🗑️</span> Hapus
                  </button>
                  <div className="file-name">{form.gambarRef?.name}</div>
                </div>
              )}
            </div>
          </label>
          <label>
            Negative Prompt
            <select 
              className="negative-preset"
              onChange={e => setForm(f => ({ ...f, negative: e.target.value }))}
            >
              <option value="">-- Pilih Preset Negative Prompt --</option>
              {NEGATIVE_PRESETS.map((p,i) => (
                <option key={i} value={p}>{p.slice(0,60)}...</option>
              ))}
            </select>
            <textarea 
              name="negative" 
              value={form.negative} 
              onChange={handleChange} 
              required 
              className={highlight?.negative ? 'highlight' : ''}
            />
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg">
          <span className="btn-icon">✨</span> Generate Prompt
        </button>
      </div>
    </form>
  )
} 