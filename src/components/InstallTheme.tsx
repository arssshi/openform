import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Check, Code2, Copy, FileCode2, Laptop, RefreshCw, Smartphone, Sparkles, Terminal } from 'lucide-react'
import { assetUrl, kitUrl } from '../lib/catalog'
import type { Brand } from '../types'

interface Props { brand: Brand; notify: (message: string) => void }

export default function InstallTheme({ brand, notify }: Props) {
  const [prompt, setPrompt] = useState('')
  const [promptError, setPromptError] = useState(false)
  const [copied, setCopied] = useState('')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [refresh, setRefresh] = useState(0)
  const [width, setWidth] = useState(700)
  const previewRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const short = `Install the Openform "${brand.name}" Edition 02 theme in this project. The complete downloaded kit is available locally. Read AI-PROMPT.md and theme.json, run install-theme.mjs against this project's root, then follow reference.html and components.html to apply the exact system across the site. Preserve the existing content, routes, data, and functionality.`
  const command = 'node install-theme.mjs --target "/path/to/your/project" --html index.html'
  const html = `<link rel="stylesheet" href="/themes/${brand.id}/theme.css">\n\n<!-- Add this attribute to your existing root or wrapper. -->\n<div data-openform="${brand.id}" class="of-theme">\n  <main class="of-container of-section">\n    <img class="of-logo" src="/themes/${brand.id}/lockup.svg"\n         alt="${brand.name}" width="240">\n    <h1 class="of-display">Your real project headline.</h1>\n    <p class="of-body">Your real project description.</p>\n    <a class="of-button" href="/your-existing-route">Get started</a>\n  </main>\n</div>`

  useEffect(() => {
    const controller = new AbortController()
    fetch(assetUrl(brand.id, 'AI-PROMPT.md'), { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Prompt unavailable'); return response.text() })
      .then(setPrompt)
      .catch(error => { if (error.name !== 'AbortError') setPromptError(true) })
    return () => { controller.abort(); if (timerRef.current) clearTimeout(timerRef.current) }
  }, [brand.id])

  useEffect(() => {
    const element = previewRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      notify(`${label} copied to clipboard`)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(''), 2000)
    } catch { notify('Select and copy the text, or download the prompt file below.') }
  }

  const frameWidth = device === 'desktop' ? 1280 : 390
  const frameHeight = device === 'desktop' ? 900 : 844
  const scale = Math.min(1, Math.max(0.15, (width - 24) / frameWidth))
  const copyIcon = (label: string) => copied === label ? <Check size={15} /> : <Copy size={15} />

  return <div className="install-theme-panel">
    <div className="panel-intro"><span className="eyebrow">THE EXACT DESIGN. AN ACTUAL THEME.</span><h3>Just say: “install this theme.”</h3><p>A working website, a complete component system, and an ordered implementation prompt. Your coding assistant gets the actual files and exact decisions.</p></div>
    <div className="install-badges"><span><Check size={13} /> Local fonts included</span><span><Check size={13} /> Framework-independent CSS</span><span><Check size={13} /> No npm dependencies</span><span><Check size={13} /> Small-model instructions</span></div>

    <div className="install-steps">
      <div><span>01</span><h4>Get the complete kit</h4><p>Unzip it into a folder your coding assistant can read. Everything is local and ready to use.</p><a className="text-link" href={kitUrl(brand.id)} download>Download {brand.name} <ArrowDownToLine size={15} /></a></div>
      <div><span>02</span><h4>Give it this instruction</h4><p>The one-line request points the model to the exact spec, source, references, and installer.</p><button className="text-link" onClick={() => copy(short, 'Install request')}>Copy the install request {copyIcon('Install request')}</button></div>
      <div><span>03</span><h4>Apply it across your site</h4><p>The full prompt maps your existing components to the theme and preserves your working application.</p><a className="text-link" href={assetUrl(brand.id, 'INSTALL.md')} download>Read the install guide <ArrowDownToLine size={15} /></a></div>
    </div>

    <div className="install-prompt-box"><div className="install-prompt-heading"><span><Sparkles size={16} /> THE REQUEST TO GIVE YOUR CODING ASSISTANT</span><button onClick={() => copy(short, 'Install request')}>{copyIcon('Install request')}{copied === 'Install request' ? 'Copied' : 'Copy request'}</button></div><p>{short}</p></div>
    <div className="prompt-download-row"><button className="button button-dark" disabled={!prompt} onClick={() => copy(prompt, 'Full implementation prompt')}>{copyIcon('Full implementation prompt')}{copied === 'Full implementation prompt' ? 'Prompt copied' : 'Copy full implementation prompt'}</button><a className="button button-outline" href={assetUrl(brand.id, 'AI-PROMPT.md')} download>Download AI-PROMPT.md <ArrowDownToLine size={16} /></a></div>
    {promptError && <p className="prompt-load-note">The inline prompt could not load. The downloadable prompt file is available above.</p>}
    <details className="full-prompt-details"><summary>Read the complete ordered implementation prompt</summary><pre>{prompt || (promptError ? 'Download AI-PROMPT.md to read the complete prompt.' : 'Loading the exact instructions…')}</pre></details>

    <div className="theme-reference-section">
      <div className="section-label"><Laptop size={18} /><h3>This is the theme you actually get.</h3><a className="text-link" href={assetUrl(brand.id, 'reference.html')} target="_blank" rel="noreferrer">Open the working site <ArrowUpRight size={15} /></a></div>
      <div className="theme-browser">
        <div className="theme-browser-toolbar"><span className="browser-dots" aria-hidden="true"><i /><i /><i /></span><span>{brand.name} / {brand.system.direction}</span><div><button aria-label="Desktop theme preview" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Laptop size={16} /></button><button aria-label="Mobile theme preview" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}><Smartphone size={16} /></button><button aria-label="Refresh theme preview" onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} /></button></div></div>
        <div className="theme-browser-viewport" ref={previewRef}><div className="theme-frame-size" style={{ width: frameWidth * scale, height: frameHeight * scale }}><iframe key={`${brand.id}-${device}-${refresh}`} title={`${brand.name} live ${device} theme`} src={`${assetUrl(brand.id, 'reference.html')}?preview=${refresh}`} width={frameWidth} height={frameHeight} style={{ transform: `scale(${scale})` }} loading="lazy" /></div></div>
      </div>
      <div className="theme-reference-links"><a href={assetUrl(brand.id, 'components.html')} target="_blank" rel="noreferrer">Explore real components <ArrowUpRight size={15} /></a><a href={assetUrl(brand.id, 'theme.json')} download>Machine-readable specification <ArrowDownToLine size={15} /></a><a href={assetUrl(brand.id, 'components.tsx')} download>Reusable React primitives <ArrowDownToLine size={15} /></a></div>
    </div>

    <div className="detail-section"><div className="section-label"><Terminal size={18} /><h3>Prefer to install it directly?</h3><span>Node.js 18+ · No dependencies</span></div><div className="code-window"><div><span><Terminal size={15} /> From the extracted kit folder</span><button onClick={() => copy(command, 'Install command')}>{copyIcon('Install command')}{copied === 'Install command' ? 'Copied' : 'Copy command'}</button></div><pre><code>{command}</code></pre></div><p className="install-context-note">The installer copies the theme into your static assets folder. The optional <code>--html</code> flag also attaches it to an existing HTML entry. The implementation prompt then guides your model through the actual component mapping.</p></div>
    <div className="detail-section"><div className="section-label"><FileCode2 size={18} /><h3>The exact markup. Your own content.</h3></div><div className="code-window"><div><span><Code2 size={15} /> Framework-independent integration</span><button onClick={() => copy(html, 'HTML snippet')}>{copyIcon('HTML snippet')}{copied === 'HTML snippet' ? 'Copied' : 'Copy HTML'}</button></div><pre><code>{html}</code></pre></div></div>
  </div>
}
