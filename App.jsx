import PromptForm from './PromptForm'
import PromptResult from './PromptResult'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [promptData, setPromptData] = useState(null)
  const [dark, setDark] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleResetPrompt = () => setPromptData(null)
  const handleResetTotal = () => {
    setPromptData(null)
    setFormKey(k => k + 1)
  }

  return (
    <div className={`container${dark ? ' dark' : ''}`}>
      <button
        onClick={() => setDark(d => !d)}
        style={{position:'fixed',top:18,right:24,zIndex:1000,padding:'8px 18px',borderRadius:20,border:'none',background:dark?'#222':'#eee',color:dark?'#fff':'#222',fontWeight:600,cursor:'pointer',boxShadow:'0 2px 8px #0002'}}
        aria-label="Toggle dark mode"
      >
        {dark ? '🌙 Dark' : '☀️ Light'}
      </button>
      <h1>Konsisten Karakter Prompt Generator Veo 3</h1>
      <div style={{display:'flex',gap:12,marginBottom:16}}>
        <button type="button" onClick={handleResetPrompt} style={{background:'#ffe066',color:'#222',fontWeight:600}}>Reset Prompt</button>
        <button type="button" onClick={handleResetTotal} style={{background:'#e57373',color:'#fff',fontWeight:600}}>Reset Total</button>
      </div>
      <PromptForm onGenerate={setPromptData} key={formKey} />
      <PromptResult promptData={promptData} />
    </div>
  )
}

export default App
