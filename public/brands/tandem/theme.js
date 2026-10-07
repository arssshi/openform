// Progressive enhancement for the reference pages only. No dependencies.
document.querySelectorAll('.of-mobile-links a').forEach(link => {
  link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'))
})
document.querySelectorAll('.of-demo-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault()
    const output = form.querySelector('.of-demo-message')
    if (output) {
      output.hidden = false
      output.textContent = 'This local reference form works. In your project, preserve or connect your real form handler.'
    }
  })
})
