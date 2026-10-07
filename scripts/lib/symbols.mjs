const stroke = (d, width=6) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`
const disk = (x,y,r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`

// Edition 02: compact master symbols, drawn in a common 100-unit workspace.
// Construction is individually authored. Color and application live outside the master.
export function drawSymbol(key) {
  switch (key) {
    case 'leaf': return '<path d="M10 82C5 46 31 13 88 8C93 52 70 86 33 90L69 34L22 82Z"/><path d="M24 88L51 62L17 98Z"/><path d="M68 28L52 44L59 15Z"/>'
    case 'orbit': return '<g fill="none" stroke="currentColor" stroke-width="6"><ellipse cx="50" cy="50" rx="44" ry="25" transform="rotate(-28 50 50)"/><path d="M57 5C21 15 10 77 47 94M43 5C79 15 90 77 53 94"/></g>'+disk(50,50,12)+disk(87,29,7)
    case 'arch': return '<path fill-rule="evenodd" d="M11 94V42C11-9 89-9 89 42V94H72V42C72 11 28 11 28 42V94ZM36 94V50C36 30 64 30 64 50V94H54V50C54 44 46 44 46 50V94Z"/>'
    case 'asterisk': return '<path d="M43 5H57L57 34L82 19L91 34L65 49L91 64L82 80L57 64L57 95H43V64L18 80L9 64L35 49L9 34L18 19L43 34Z"/><path d="M84 6H94V16H84Z"/>'
    case 'flower': return '<path fill-rule="evenodd" d="M50 2C66 2 70 19 69 29C88 15 105 40 85 51C104 68 84 91 69 76C70 102 32 102 31 76C10 91-4 66 15 51C-5 36 17 15 31 29C30 12 37 2 50 2ZM50 38a12 12 0 1 0 0 24a12 12 0 1 0 0-24Z"/>'
    case 'sunseal': return '<circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" stroke-width="2"/><path d="M34 66L50 32L66 66H60L56 57H43L39 66ZM46 51H53L50 42Z" fill-rule="evenodd"/>'+Array.from({length:16},(_,i)=>`<path d="M50 ${i%2?5:9}V${i%2?15:19}" stroke="currentColor" stroke-width="2" transform="rotate(${i*22.5} 50 50)"/>`).join('')
    case 'horizon': return '<path d="M3 72L29 17L47 47L60 29L97 72H82L62 48L47 68L29 40L17 72Z"/><path d="M8 82H92M22 92H79" stroke="currentColor" stroke-width="4"/>'+disk(80,19,8)
    case 'foldn': return '<path d="M8 91V9H29L72 64V9H92V91H71L28 36V91Z"/><path d="M32 8H43L67 37V52Z"/>'
    case 'bird': return '<path d="M3 48L35 35L48 5L64 31L94 23L73 48L93 53L64 71L43 94L42 65L23 58ZM45 48L62 38L52 31Z" fill-rule="evenodd"/>'
    case 'smile': return '<path d="M9 31C-4 58 9 85 33 93L39 78C22 72 15 57 24 38ZM91 31C104 58 91 85 67 93L61 78C78 72 85 57 76 38Z"/>'+stroke('M36 82C43 85 56 85 64 82',9)+disk(35,37,6)+disk(66,37,6)
    case 'signal': return '<path d="M4 79H24V57H45V35H66V12H94V31H75V54H54V77H33V98H4Z"/><path d="M5 8H19V22H5ZM26 8H40V22H26Z"/>'
    case 'sunrise': return '<path d="M8 49a42 42 0 0 1 84 0H75a25 25 0 0 0-50 0Z"/><path d="M6 58H94V65H6ZM14 73H86V80H14ZM28 88H72V95H28Z"/>'
    case 'wave': return '<path d="M5 62C10 25 36 5 62 14C86 22 98 45 91 69C85 91 61 99 44 90L53 76C64 83 76 78 80 65C86 48 73 34 59 32C38 30 22 45 17 67Z"/><path d="M5 79C23 58 47 50 69 55L67 69C45 65 31 72 16 89Z"/>'
    case 'portal': return '<path d="M16 94V37a34 34 0 0 1 68 0v57H68V37a18 18 0 0 0-36 0v57Z"/><path d="M40 92V43a10 10 0 0 1 20 0v49M7 97H93" fill="none" stroke="currentColor" stroke-width="2"/>'
    case 'beams': return '<path d="M4 7H29V36H41V4H59V36H71V7H96V93H71V64H59V96H41V64H29V93H4ZM29 46V54H71V46Z" fill-rule="evenodd"/>'
    case 'ribbon': return '<path d="M20 88C-8 48 30 4 67 7C104 11 98 51 68 65L43 79L33 64L62 50C81 41 85 22 64 23C39 23 23 49 33 67ZM76 30L89 38L44 95L30 86Z"/>'
    case 'sprout': return '<path d="M44 51C18 53 2 33 7 9C33 8 51 28 44 51ZM55 41C50 18 67 3 93 8C95 31 78 47 55 41ZM43 55H57V96H43Z"/><path d="M24 74L43 84V96L18 86ZM76 64L57 75V88L83 75Z"/>'
    case 'modules': return '<path d="M6 88V13H27L50 42L73 13H94V88H74V42L50 71L26 42V88Z"/><path d="M38 88V75L50 88L62 75V88Z"/>'
    case 'dots': return '<path d="M10 25a18 18 0 1 1 36 0v18H28a18 18 0 0 1-18-18ZM57 5H78a21 21 0 1 1-21 21ZM4 63H27a23 23 0 1 1-23 23ZM68 60a19 19 0 1 1 0 38H49V79a19 19 0 0 1 19-19Z"/>'
    case 'pixel': return '<path d="M10 5H65V15H80V30H90V55H75V65H60L90 95H60L40 75H30V95H10ZM30 25V55H60V45H70V35H60V25Z" fill-rule="evenodd"/>'
    case 'table': return '<path d="M11 19H32V40H11ZM39 3H60V24H39ZM68 19H89V40H68ZM76 47H97V68H76ZM68 76H89V97H68ZM39 76H60V97H39ZM11 76H32V97H11ZM3 47H24V68H3Z"/>'+disk(50,50,17)
    case 'pennant': return '<path d="M12 6H25V96H12ZM31 10L94 35L31 61ZM31 70H73V83H31Z"/>'+disk(81,77,6)
    case 'rings': return '<g fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="32"/><circle cx="50" cy="50" r="20"/></g>'+disk(50,50,5)
    case 'stack': return '<path d="M5 69H95V95H5ZM21 39H79V64H21ZM37 8H63V34H37Z"/><path d="M6 8H27V20H6ZM73 83H95V95H73Z"/>'
    case 'kelp': return '<path d="M46 7C68-4 83 24 67 40C51 55 71 56 82 67C104 89 67 112 50 87C39 111 0 88 21 65C40 46 22 38 27 23C29 16 35 11 46 7ZM39 65C31 73 35 86 45 83C54 78 45 72 39 65Z" fill-rule="evenodd"/>'
    case 'link': return '<g fill="none" stroke="currentColor" stroke-width="12"><path d="M45 27H29a23 23 0 0 0 0 46H45M55 27H71a23 23 0 0 1 0 46H55M35 50H65" stroke-linecap="round"/></g>'
    case 'pebble': return '<path d="M7 65C-2 39 16 12 42 9C79 3 104 35 91 64C82 89 61 99 34 91C17 86 12 80 7 65Z"/><path d="M72 7L87 3L93 15L78 19Z"/>'
    case 'slash': return '<path d="M42 3H81L52 43H13ZM48 57H87L58 97H19Z"/><path d="M87 9H97V22H87ZM3 78H13V91H3Z"/>'
    case 'book': return '<path d="M5 15C23 8 35 13 46 24V91C32 79 20 79 5 85ZM95 15C77 8 65 13 54 24V91C68 79 80 79 95 85Z"/>'+stroke('M15 26C27 23 31 25 38 30M62 30C69 25 73 23 85 26',2)
    case 'sparkle': return '<path d="M50 2C54 36 64 46 98 50C64 54 54 64 50 98C46 64 36 54 2 50C36 46 46 36 50 2Z"/><path d="M81 2C82 13 87 18 98 19C87 20 82 25 81 36C80 25 75 20 64 19C75 18 80 13 81 2Z"/>'
    case 'diamond': return stroke('M50 3L96 50L50 97L4 50ZM50 3L70 50L50 97L30 50ZM4 50H96M21 32L50 50L79 32M21 68L50 50L79 68',2.5)
    case 'fold': return '<path d="M7 9H66L93 36V91H7ZM19 21V79H81V41H61V21ZM65 21V37H81Z" fill-rule="evenodd"/>'+stroke('M19 66L47 45L81 66',4)
    case 'hill': return '<path d="M2 87C17 51 35 47 52 53C72 61 83 61 98 44V92H2ZM2 65C22 26 36 25 53 32C74 40 85 35 98 19V32C82 51 72 50 52 43C33 36 20 42 2 75ZM2 41C26 5 39 4 57 10C77 17 89 10 98 2V12C84 28 72 26 53 21C33 16 18 29 2 53Z"/>'
    case 'pause': return '<rect x="15" y="8" width="22" height="84" rx="2"/><rect x="63" y="8" width="22" height="84" rx="2"/><path d="M44 45H56V55H44Z"/>'
    case 'bow': return '<path d="M44 45C14-5-6 17 5 45C12 66 32 65 44 45ZM56 45C86-5 106 17 95 45C88 66 68 65 56 45ZM42 52L17 97L39 91L50 68L61 91L83 97L58 52Z"/>'+disk(50,45,11)
    case 'shard': return '<path d="M6 92L46 6H94L68 46H47L26 92ZM51 57H94L69 92H32Z"/><path d="M5 6H28L21 23H1Z"/>'
    case 'brackets': return stroke('M30 8H9V92H30M70 8H91V92H70',5)+stroke('M39 43H61M39 55H54',3)
    case 'check': return '<path d="M3 45L27 24L44 42L74 6L98 28L44 94Z"/><path d="M6 4H19V17H6ZM83 82H96V95H83Z"/>'
    case 'crescent': return '<path d="M70 4C44 13 34 34 43 56C52 79 75 85 97 70C84 100 41 109 16 82C-14 50 10 2 47 2C55 2 63 2 70 4Z"/>'+disk(79,29,4)
    case 'interlock': return '<path d="M3 3H44V27H27V44H3ZM56 3H97V44H73V27H56ZM97 56V97H56V73H73V56ZM44 97H3V56H27V73H44Z"/><path d="M38 38H62V62H38Z"/>'
    case 'roots': return stroke('M50 3V97M50 23L26 8M50 35L76 14M50 50L13 29M50 65L86 37M50 81L21 62M50 94L74 78M27 38L19 14M73 47L83 20',4.5)
    case 'oval': return '<path fill-rule="evenodd" d="M4 61C4 35 24 16 50 16C76 16 96 35 96 61C96 91 4 91 4 61ZM20 60C20 43 32 31 50 31C68 31 80 43 80 60C80 75 20 75 20 60Z"/>'
    case 'burst': return Array.from({length:9},(_,i)=>`<rect x="45" y="${i%3?6:0}" width="10" height="${i%3?22:28}" rx="5" transform="rotate(${i*40} 50 50)"/>`).join('')+disk(50,50,15)
    case 'triangle': return '<path d="M50 2L98 85H73L50 45L27 85H2ZM31 85L43 65H67L79 85ZM50 2L61 22L37 63H13Z"/>'
    case 'corner': return stroke('M12 69V9H72M28 91H88V31',5)+'<path d="M37 39H63V44H37ZM37 53H55V58H37Z"/>'
    case 'compass': return '<circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="3"/><path d="M50 7L61 39L93 50L61 61L50 93L39 61L7 50L39 39ZM50 36L39 61L64 50Z" fill-rule="evenodd"/>'
    case 'window': return '<path d="M13 95V42a37 37 0 0 1 74 0v53M50 6V95M13 48H87M23 95H77" fill="none" stroke="currentColor" stroke-width="3"/>'+'<path d="M79 17a13 13 0 1 0 0 23a10 10 0 0 1 0-23Z"/>'
    case 'displaced': return '<path d="M3 3H63V22H22V63H3ZM37 37H97V97H37ZM56 56V78H78V56Z" fill-rule="evenodd"/><path d="M77 3H97V23H77Z"/>'
    default: throw new Error(`Unknown master symbol: ${key}`)
  }
}
