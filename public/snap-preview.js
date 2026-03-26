document.getElementById('snap-input').addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file) return
  document.getElementById('preview-img').src = URL.createObjectURL(file)
  document.getElementById('snap-preview').hidden = false
})
