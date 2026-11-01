import { useState } from 'react'
import { Sparkles, ImagePlus, WandSparkles, Download, Upload, Heart, Image, LoaderCircle } from 'lucide-react'
import './App.css'

const API = 'https://aihorde.net/api/v2'

export default function App() {
  const [tab, setTab] = useState('create')
  const [prompt, setPrompt] = useState('')
  const [photo, setPhoto] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function createImage() {
    if (!prompt.trim()) {
      setMessage('Նախ գրիր նկարի նկարագրությունը։')
      return
    }

    setLoading(true)
    setResult('')
    setMessage('Ուղարկում ենք հարցումը AI-ին...')

    const headers = {
      'Content-Type': 'application/json',
      apikey: '0000000000',
      'Client-Agent': 'Lilit-AI:1.0:anonymous'
    }

    try {
      const response = await fetch(`${API}/generate/async`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: prompt.trim(),
          params: {
            width: 512,
            height: 512,
            steps: 20,
            n: 1,
            sampler_name: 'k_euler',
            cfg_scale: 7
          },
          nsfw: false,
          censor_nsfw: true,
          r2: true
        })
      })

      const data = await response.json()
      if (!response.ok || !data.id) {
        throw new Error(data.message || 'AI հարցումը չընդունվեց։')
      }

      let finished = false

      for (let i = 0; i < 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000))

        const checkResponse = await fetch(`${API}/generate/check/${data.id}`, { headers })
        const check = await checkResponse.json()

        if (check.faulted) throw new Error('AI սերվերի սխալ։ Փորձիր կրկին։')

        if (check.done) {
          finished = true
          break
        }

        setMessage(`Նկարը պատրաստվում է... ${Math.min(i + 1, 100)}%`)
      }

      if (!finished) throw new Error('Ստեղծումը երկար տևեց։ Փորձիր կրկին։')

      setMessage('Բեռնում ենք պատրաստ նկարը...')

      const statusResponse = await fetch(`${API}/generate/status/${data.id}`, { headers })
      const status = await statusResponse.json()
      const imageUrl = status.generations?.[0]?.img

      if (!imageUrl) throw new Error('Նկարը չստացվեց։ Փորձիր նորից։')

      setResult(imageUrl)
      setMessage('Նկարը պատրաստ է։')
    } catch (error) {
      setMessage(error.message || 'Կապի սխալ։ Փորձիր կրկին։')
    } finally {
      setLoading(false)
    }
  }

  function downloadImage() {
    if (!result) return
    const link = document.createElement('a')
    link.href = result
    link.download = 'Lilit-AI-image.png'
    link.target = '_blank'
    link.click()
  }

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
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Օրինակ՝ գեղեցիկ լեռներ, մայրամուտ, կինեմատոգրաֆիկ ոճ..."
            disabled={loading}
          />
          <button className="mainButton" onClick={createImage} disabled={loading}>
            {loading ? <LoaderCircle size={19}/> : <Sparkles size={19}/>}
            {loading ? 'Սպասիր...' : 'Ստեղծել AI նկար'}
          </button>

          {message && <p className="selected">{message}</p>}

          {result && (
            <div style={{ marginTop: 20 }}>
              <img src={result} alt="Lilit AI ստեղծած նկար" style={{ width: '100%', borderRadius: 16 }} />
              <button className="mainButton" onClick={downloadImage}>
                <Download size={19}/> Ներբեռնել նկարը
              </button>
            </div>
          )}
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
          {photo && <img src={URL.createObjectURL(photo)} alt="Ընտրված նկար" style={{ width: '100%', borderRadius: 16 }} />}
          <button className="mainButton" onClick={() => setMessage('Խմբագրման գործիքները կավելացնենք հաջորդ քայլով։')}>
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
