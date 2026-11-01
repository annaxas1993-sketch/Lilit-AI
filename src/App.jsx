import { useState } from 'react'
import { Sparkles, ImagePlus, WandSparkles, Download, Upload, Heart, Image } from 'lucide-react'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('create')
  const [prompt, setPrompt] = useState('')
  const [photo, setPhoto] = useState(null)

  return (
    <main className="app">
      <header>
        <div className="logo"><Sparkles size={25}/> Lilit <span>AI</span></div>
        <div className="avatar">L</div>
      </header>

      <section className="hero">
        <div className="tag"><Sparkles size={14}/> AI CREATIVE STUDIO</div>
        <h1>Ստեղծիր քո<br/><span>երևակայությունը</span></h1>
        <p>Գեղեցիկ նկարներ՝ քո գաղափարներից։</p>
      </section>

      <nav>
        <button className={tab === 'create' ? 'active' : ''} onClick={() => setTab('create')}>
          <Sparkles size={18}/> Ստեղծել նկար
        </button>
        <button className={tab === 'edit' ? 'active' : ''} onClick={() => setTab('edit')}>
          <WandSparkles size={18}/> Խմբագրել
        </button>
      </nav>

      {tab === 'create' ? (
        <section className="panel">
          <h2><Sparkles/> Նոր նկար ստեղծել</h2>
          <p>Նկարագրիր՝ ինչ պատկեր ես ուզում ստանալ։</p>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Օրինակ՝ գեղեցիկ լեռներ, մայրամուտ, կինեմատոգրաֆիկ ոճ..." />
          <button className="mainButton" onClick={() => alert('AI ստեղծման ծառայությունը դեռ պետք է միացնենք։')}>
            <Sparkles size={19}/> Ստեղծել AI նկար
          </button>
        </section>
      ) : (
        <section className="panel">
          <h2><ImagePlus/> Նկար խմբագրել</h2>
          <p>Ընտրիր նկար հեռախոսից։</p>
          <label className="upload">
            <Upload size={32}/>
            <strong>Ընտրել նկար</strong>
            <small>JPG, PNG կամ WEBP</small>
            <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}/>
          </label>
          {photo && <p className="selected">Ընտրված է՝ {photo.name}</p>}
          <button className="mainButton" onClick={() => alert('Խմբագրման գործիքները հաջորդ քայլով կավելացնենք։')}>
            <WandSparkles size={19}/> Խմբագրել նկարը
          </button>
        </section>
      )}

      <section className="bottom">
        <div><Image/><span>Ստեղծագործիր առանց սահմանների</span></div>
        <Heart size={18}/>
      </section>
      <footer>Lilit AI · Քո ստեղծագործական աշխարհը</footer>
    </main>
  )
}
