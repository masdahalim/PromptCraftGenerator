import PromptForm from './PromptForm'
import PromptResult from './PromptResult'
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import cameraMotions from './cameraMotions'
import { adeganPresets } from './presets'

function getRandom(arr, exclude) {
  // Ambil random dari arr, kecuali value exclude
  const filtered = arr.filter(x => x !== exclude)
  return filtered[Math.floor(Math.random() * filtered.length)] || exclude
}

function getAllStoryNames() {
  return Object.keys(localStorage)
    .filter(k => k.startsWith('sceneHistory_'))
    .map(k => k.replace('sceneHistory_', ''))
}

function App() {
  const [promptData, setPromptData] = useState(null)
  const [dark, setDark] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [highlight, setHighlight] = useState({})
  const [notif, setNotif] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [storyName, setStoryName] = useState('')
  const [storyList, setStoryList] = useState([])
  const [previewStory, setPreviewStory] = useState(null)
  const [previewName, setPreviewName] = useState('')
  const [renameName, setRenameName] = useState('')
  const [renameOld, setRenameOld] = useState('')
  const [showRenameDialog, setShowRenameDialog] = useState(false)

  const handleResetPrompt = () => setPromptData(null)
  const handleResetTotal = () => {
    setPromptData(null)
    setFormKey(k => k + 1)
    setHistory([])
    setHistoryIndex(-1)
    setHighlight({})
  }

  // Undo/redo scene
  const handleUndo = () => {
    if (historyIndex > 0) {
      setPromptData(history[historyIndex - 1])
      setHistoryIndex(historyIndex - 1)
    }
  }
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setPromptData(history[historyIndex + 1])
      setHistoryIndex(historyIndex + 1)
    }
  }

  // Helper function to get random item from array
  const getRandom = (arr, exclude = null) => {
    if (!arr || arr.length === 0) return null;
    const filtered = arr.filter(item => item !== exclude);
    if (filtered.length === 0) return arr[0];
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  // Next scene generator
  const handleNextScene = () => {
    if (!promptData) return;
    
    // Get random camera motion
    const newCamera = getRandom(cameraMotions.map(m => m.en), promptData.cameraMotion);
    
    // Get random latar from presets
    const presetLatars = adeganPresets.map(p => p.latar);
    const newLatar = getRandom(presetLatars, promptData.latar);
    
    // Generate new dialog
    let newDialog = promptData.dialog;
    if (promptData.dialog.length > 0) {
      // Add continuation marker and some variation
      const variations = [
        ' (lanjutan)',
        ' (bersambung)',
        ' (selanjutnya)',
        ' (to be continued)'
      ];
      newDialog = promptData.dialog + getRandom(variations);
    }
    
    // Create new scene data
    const nextData = {
      ...promptData,
      cameraMotion: newCamera || promptData.cameraMotion,
      latar: newLatar || promptData.latar,
      dialog: newDialog,
      judul: promptData.judul + ' (Part ' + (history.length + 1) + ')'
    };
    
    // Update state
    setPromptData(nextData);
    setHighlight({ cameraMotion: true, latar: true, dialog: true });
    
    // Update history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(nextData);
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  };

  // Saat generate prompt baru, reset highlight dan update history
  const handleGenerate = (data) => {
    setPromptData(data)
    setHighlight({})
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(data)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Save dialog
  const handleSave = () => {
    setShowSaveDialog(true)
    setStoryName('')
  }
  const doSave = () => {
    if (!storyName) return
    localStorage.setItem('sceneHistory_' + storyName, JSON.stringify(history))
    setNotif('Cerita "' + storyName + '" berhasil disimpan!')
    setShowSaveDialog(false)
    setTimeout(() => setNotif(''), 2000)
    setStoryList(getAllStoryNames())
  }

  // Load dialog
  const handleLoad = () => {
    setStoryList(getAllStoryNames())
    setShowLoadDialog(true)
  }
  const doLoad = (name) => {
    const saved = localStorage.getItem('sceneHistory_' + name);
    if (saved) {
      const loadedHistory = JSON.parse(saved);
      if (loadedHistory && loadedHistory.length > 0) {
        setHistory(loadedHistory);
        setHistoryIndex(loadedHistory.length - 1);
        setPromptData(loadedHistory[loadedHistory.length - 1]);
        setNotif('Cerita "' + name + '" berhasil dimuat!');
        setTimeout(() => setNotif(''), 2000);
      } else {
        setNotif('Cerita kosong atau rusak.');
        setTimeout(() => setNotif(''), 2000);
      }
    }
    setShowLoadDialog(false);
  }
  // Hapus cerita
  const doDelete = (name) => {
    localStorage.removeItem('sceneHistory_' + name)
    setStoryList(getAllStoryNames())
    setNotif('Cerita "' + name + '" dihapus.')
    setTimeout(() => setNotif(''), 2000)
  }

  // Preview cerita
  const handlePreview = (name) => {
    const saved = localStorage.getItem('sceneHistory_' + name)
    if (saved) {
      setPreviewStory(JSON.parse(saved))
      setPreviewName(name)
    }
  }
  const closePreview = () => {
    setPreviewStory(null)
    setPreviewName('')
  }

  // Export cerita ke file
  const handleExport = (name) => {
    const saved = localStorage.getItem('sceneHistory_' + name)
    if (saved) {
      const blob = new Blob([saved], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name + '.json'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    }
  }

  // Rename cerita
  const handleRename = (oldName) => {
    setRenameOld(oldName)
    setRenameName(oldName)
    setShowRenameDialog(true)
  }
  const doRename = () => {
    if (!renameName || renameName === renameOld) {
      setShowRenameDialog(false)
      return
    }
    const saved = localStorage.getItem('sceneHistory_' + renameOld)
    if (saved) {
      localStorage.setItem('sceneHistory_' + renameName, saved)
      localStorage.removeItem('sceneHistory_' + renameOld)
      setNotif('Cerita berhasil di-rename!')
      setTimeout(() => setNotif(''), 2000)
      setStoryList(getAllStoryNames())
    }
    setShowRenameDialog(false)
  }

  // Auto-load on mount (ambil cerita terakhir jika ada)
  useEffect(() => {
    const all = getAllStoryNames()
    setStoryList(all)
    if (all.length > 0) {
      const last = all[all.length-1]
      const saved = localStorage.getItem('sceneHistory_' + last)
      if (saved) {
        const loadedHistory = JSON.parse(saved)
        setHistory(loadedHistory)
        setHistoryIndex(loadedHistory.length - 1)
        setPromptData(loadedHistory[loadedHistory.length - 1])
        setNotif('Cerita otomatis dimuat!')
        setTimeout(() => setNotif(''), 2000)
      }
    }
  }, [])

  return (
    <div className={`container${dark ? ' dark' : ''}`}>
      <div className="app-header">
        <div className="header-content">
          <h1>Konsisten Karakter Prompt Generator Veo 3</h1>
          <div className="creator-credit">
            Created by <a href="https://www.threads.net/@masdahalim" target="_blank" rel="noopener noreferrer">Masda Halim</a>
          </div>
        </div>
        <button
          onClick={() => setDark(d => !d)}
          className="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {dark ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      <div className="action-buttons">
        <button type="button" onClick={handleResetPrompt} className="btn btn-warning">
          <span className="btn-icon">🔄</span> Reset Prompt
        </button>
        <button type="button" onClick={handleResetTotal} className="btn btn-danger">
          <span className="btn-icon">🗑️</span> Reset Total
        </button>
        <button type="button" onClick={handleUndo} disabled={historyIndex<=0} className="btn btn-secondary">
          <span className="btn-icon">↩️</span> Undo
        </button>
        <button type="button" onClick={handleRedo} disabled={historyIndex>=history.length-1} className="btn btn-secondary">
          <span className="btn-icon">↪️</span> Redo
        </button>
        <button type="button" onClick={handleSave} className="btn btn-success">
          <span className="btn-icon">💾</span> Save Cerita
        </button>
        <button type="button" onClick={handleLoad} className="btn btn-primary">
          <span className="btn-icon">📂</span> Load Cerita
        </button>
      </div>

      {notif && (
        <div className="notification">{notif}</div>
      )}
      {/* Save Dialog */}
      {showSaveDialog && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#0008',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:32,borderRadius:12,minWidth:320}}>
            <div style={{fontWeight:700,fontSize:'1.2rem',marginBottom:12}}>Simpan Cerita</div>
            <input value={storyName} onChange={e=>setStoryName(e.target.value)} placeholder="Nama Cerita" style={{padding:'0.5rem',fontSize:'1rem',borderRadius:6,border:'1px solid #ccc',width:'100%',marginBottom:16}} />
            <div style={{display:'flex',gap:12}}>
              <button onClick={doSave} style={{background:'#43a047',color:'#fff',fontWeight:600}}>Simpan</button>
              <button onClick={()=>setShowSaveDialog(false)} style={{background:'#e57373',color:'#fff',fontWeight:600}}>Batal</button>
            </div>
          </div>
        </div>
      )}
      {/* Load Dialog */}
      {showLoadDialog && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#0008',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:32,borderRadius:12,minWidth:320}}>
            <div style={{fontWeight:700,fontSize:'1.2rem',marginBottom:12}}>Pilih Cerita</div>
            {storyList.length === 0 && <div style={{color:'#888'}}>Belum ada cerita tersimpan.</div>}
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {storyList.map(name => (
                <li key={name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <span>{name}</span>
                  <span>
                    <button onClick={()=>doLoad(name)} style={{background:'#1e90ff',color:'#fff',fontWeight:600,marginRight:8}}>Load</button>
                    <button onClick={()=>handlePreview(name)} style={{background:'#ffe066',color:'#222',fontWeight:600,marginRight:8}}>Preview</button>
                    <button onClick={()=>handleExport(name)} style={{background:'#888',color:'#fff',fontWeight:600,marginRight:8}}>Export</button>
                    <button onClick={()=>handleRename(name)} style={{background:'#b39ddb',color:'#222',fontWeight:600,marginRight:8}}>Rename</button>
                    <button onClick={()=>doDelete(name)} style={{background:'#e57373',color:'#fff',fontWeight:600}}>Hapus</button>
                  </span>
                </li>
              ))}
            </ul>
            <div style={{marginTop:16}}>
              <button onClick={()=>setShowLoadDialog(false)} style={{background:'#bbb',color:'#222',fontWeight:600}}>Tutup</button>
            </div>
          </div>
        </div>
      )}
      {/* Preview Modal */}
      {previewStory && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#0008',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:32,borderRadius:12,minWidth:340,maxWidth:500}}>
            <div style={{fontWeight:700,fontSize:'1.2rem',marginBottom:8}}>Preview Cerita: {previewName}</div>
            <div style={{marginBottom:8}}>Jumlah Scene: <b>{previewStory.length}</b></div>
            <div style={{marginBottom:8,fontWeight:600}}>Scene Terakhir:</div>
            <div style={{background:'#f7fafd',border:'1px solid #b3d1e7',borderRadius:8,padding:12,marginBottom:16,maxHeight:180,overflowY:'auto',fontSize:'0.98rem'}}>
              {previewStory.length > 0 ? (
                <pre style={{margin:0,whiteSpace:'pre-wrap'}}>{JSON.stringify(previewStory[previewStory.length-1], null, 2)}</pre>
              ) : 'Tidak ada data.'}
            </div>
            <div style={{display:'flex',gap:12}}>
              <button onClick={()=>{doLoad(previewName); closePreview();}} style={{background:'#1e90ff',color:'#fff',fontWeight:600}}>Load Cerita Ini</button>
              <button onClick={closePreview} style={{background:'#bbb',color:'#222',fontWeight:600}}>Tutup</button>
            </div>
          </div>
        </div>
      )}
      {/* Rename Dialog */}
      {showRenameDialog && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#0008',zIndex:4000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:32,borderRadius:12,minWidth:320}}>
            <div style={{fontWeight:700,fontSize:'1.2rem',marginBottom:12}}>Rename Cerita</div>
            <input value={renameName} onChange={e=>setRenameName(e.target.value)} placeholder="Nama Cerita Baru" style={{padding:'0.5rem',fontSize:'1rem',borderRadius:6,border:'1px solid #ccc',width:'100%',marginBottom:16}} />
            <div style={{display:'flex',gap:12}}>
              <button onClick={doRename} style={{background:'#b39ddb',color:'#222',fontWeight:600}}>Rename</button>
              <button onClick={()=>setShowRenameDialog(false)} style={{background:'#e57373',color:'#fff',fontWeight:600}}>Batal</button>
            </div>
          </div>
        </div>
      )}
      <PromptForm onGenerate={handleGenerate} key={formKey} highlight={highlight} />
      <PromptResult promptData={promptData} />
      {promptData && (
        <div style={{marginTop:24}}>
          <button type="button" onClick={handleNextScene} style={{background:'#1e90ff',color:'#fff',fontWeight:600,padding:'0.8rem 2.2rem',fontSize:'1.1rem',borderRadius:8}}>Buat Adegan Selanjutnya</button>
        </div>
      )}
      <div style={{marginTop:48, marginBottom:16}}>
        <a href="https://mayar.gg/pasticuanacademy" target="_blank" rel="noopener noreferrer">
          <button type="button" style={{background:'#ffb300',color:'#222',fontWeight:700,padding:'0.9rem 2.5rem',fontSize:'1.15rem',borderRadius:10,boxShadow:'0 2px 8px #0001',border:'none',cursor:'pointer'}}>☕ Traktir Kopi</button>
        </a>
        <div style={{fontSize:'1rem',color:'#888',marginTop:8}}>Dukung pengembangan web ini jika kamu merasa terbantu!</div>
      </div>
    </div>
  )
}

export default App
