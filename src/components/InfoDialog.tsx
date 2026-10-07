import { ArrowDownToLine, ArrowUpRight, Code2, Download, Github, Palette } from 'lucide-react'
import Dialog from './Dialog'
import { sitePath } from '../lib/site'

export default function InfoDialog({ mode, onClose }: { mode: 'contribute' | 'license'; onClose: () => void }) {
  const repo = import.meta.env.VITE_REPO_URL || 'https://github.com/arssshi/openform'
  return <Dialog label={mode === 'contribute' ? 'Contribute to Openform' : 'Openform licenses'} className="info-dialog" onClose={onClose}>
    <span className="eyebrow">{mode === 'contribute' ? 'GOOD THINGS, MADE TOGETHER' : 'OPEN BY DESIGN'}</span>
    <h2>{mode === 'contribute' ? <>A good idea.<br /><em>A shared beginning.</em></> : <>Yours to use.<br /><em>Yours to make.</em></>}</h2>
    {mode === 'contribute' ? <><p className="info-lead">A library gets better when more people bring care and a point of view. Contribute an original identity, improve a theme, or help make the experience clearer.</p><div className="contribution-options"><div><Palette size={24} /><h3>Bring a clear idea.</h3><p>A meaningful mark, intentional type, purposeful color, and applications that feel like they belong together.</p></div><div><Code2 size={24} /><h3>Make it more useful.</h3><p>Help with accessibility, working themes, documentation, generation tools, and the details that make installation easier.</p></div></div><div className="contribution-actions">{repo && <a href={repo} className="button button-outline" target="_blank" rel="noreferrer"><Github size={17} />Open the repository</a>}<a href={sitePath('/downloads/openform-source.zip')} download className="button button-dark"><Download size={17} />Download source</a><a href={sitePath('/docs/CONTRIBUTING.md')} download className="button button-outline">Contribution guide<ArrowDownToLine size={16} /></a></div><p className="info-footnote">The source includes the site, original design data, artwork and theme generators, installers, instructions, and verification tools.</p></> : <><p className="info-lead">Personal projects, client work, and commercial products are welcome. Each kit includes the appropriate original notices.</p><div className="license-list">{[
      ['Original design · CC0 1.0', 'Original logos, illustrations, palettes, design information, and guidelines are dedicated to the public domain. Attribution is appreciated, never required.', '/docs/LICENSE-ASSETS.txt'],
      ['Website & theme code · MIT', 'The website, CSS, JavaScript, React primitives, installer, and tooling use MIT. Retain the copyright and license notice with copies.', '/docs/LICENSE.txt'],
      ['Local fonts · SIL OFL 1.1', 'The original font files retain their SIL Open Font License. Keep the included notices with redistributed font files.', '/docs/THIRD-PARTY-NOTICES.md'],
     ].map(([heading, text, href], index) => <div key={heading}><span>0{index + 1}</span><div><h3>{heading}</h3><p>{text}</p><a href={sitePath(href)} download>Read the notice<ArrowUpRight size={15} /></a></div></div>)}</div><p className="info-footnote">These are original fictional design concepts. Supplied research references are not included in the downloadable assets.</p></>}
  </Dialog>
}
