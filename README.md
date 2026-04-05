# SnapThis - Interactieve Functionaliteit

Een server-side web app waarmee gebruikers foto's kunnen uploaden en bekijken in snapmaps.

![SnapThis preview](public/assets/DetailPhotoView.png)

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Gebruik](#gebruik)
- [Kenmerken](#kenmerken)
- [Installatie](#installatie)
- [Bronnen](#bronnen)
- [Licentie](#licentie)

## Beschrijving

SnapThis is een foto-deelplatform waarbij gebruikers foto's kunnen uploaden naar een snapmap. De app is gebouwd als server-side rendered website met Express en Liquid templates, en haalt data op via de Directus API.

Het centrale idee achter dit project: **de app moet werken voor iedereen**, ongeacht of JavaScript aan staat, of iemand een trage verbinding heeft, of welk apparaat iemand gebruikt. Dat is Progressive Enhancement in de praktijk, niet als trucje, maar als uitgangspunt.

## Gebruik

De app heeft een paar duidelijke schermen:

- **Snapmap-overzicht**: een fotogrid met alle foto's in een snapmap. Bovenaan staat een formulier om een nieuwe foto toe te voegen.
- **Foto-detailpagina**: klik op een foto voor een vergrote weergave met extra info zoals auteur, locatie en datum.
- **Groepenpagina**: een overzicht van alle groepen en hun snapmaps.

### Foto uploaden

1. Open een snapmap
2. Kies een foto via het uploadformulier
3. Bekijk direct een preview van de gekozen foto
4. Bevestig met de "Ja, voeg toe"-knop
5. Na het uploaden verschijnt een bevestigingsmelding

## Kenmerken

### Progressive Enhancement

De app is opgebouwd in drie lagen. Elke laag voegt iets toe, maar de vorige laag blijft altijd werken.

**Laag 1: HTML & Server**

De basis werkt volledig zonder CSS of JavaScript. Het uploadformulier is een gewoon HTML-formulier dat via POST stuurt. De server verwerkt het verzoek en stuurt een nieuwe pagina terug. Geen client-side magie nodig.

```html
<form method="POST" enctype="multipart/form-data">
  <input type="file" name="snap" accept="image/*" />
  <button type="submit">Voeg toe</button>
</form>
```

**Laag 2: CSS**

CSS voegt visuele structuur en stijl toe. De fotogrid is responsive met CSS Grid. Foto's laden in met een staggered fade-in via `sibling-index()`. Voor gebruikers die beweging liever niet zien, worden animaties uitgeschakeld via `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: no-preference) {
  .snaps-list li {
    animation: fadeIn 0.4s ease both;
    animation-delay: calc(sibling-index() * 0.05s);
  }
}
```

De succes-melding na upload werkt via de CSS `:target` selector, zonder JavaScript. Als de URL eindigt op `#succes`, wordt de melding zichtbaar.

```css
#succes:not(:target) {
  display: none;
}
```

**Laag 3: JavaScript**

JavaScript verbetert de uploadervaring. Wanneer een gebruiker een foto kiest, verbergt het script de standaard submit-knop en toont direct een preview van de foto. Pas als de gebruiker bevestigt, wordt het formulier verstuurd.

```js
snapInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  document.getElementById('preview-img').src = URL.createObjectURL(file)
  document.getElementById('snap-preview').hidden = false
})
```

Dit is een bewuste keuze: de preview is een verbetering, geen vereiste. Zonder JavaScript werkt het formulier nog steeds.

### Andere technische keuzes

| Techniek | Gebruik |
|---|---|
| **Express.js** | Server-side routing en POST-afhandeling |
| **Liquid** | Templating voor dynamische HTML |
| **Multer** | Bestandsupload verwerking |
| **Directus API** | Ophalen en opslaan van data en bestanden |
| **`<details>` / `<summary>`** | Dropdown voor snapmap-navigatie, werkt zonder JS |
| **View Transitions API** | Soepele paginaovergangen via CSS |
| **ARIA-labels** | Toegankelijkheid voor screenreaders |

### Toegankelijkheid

- Alle knoppen met alleen een icoon hebben een `aria-label`
- Screenreader-tekst wordt verborgen via `.sr-only`
- Focus-stijlen zijn goed zichtbaar door de rode outline
- Succes-meldingen hebben `role="status"` zodat screenreaders ze voorlezen
- Semantische HTML-structuur (`<header>`, `<main>`, `<footer>`, `<nav>`)

## Installatie

```bash
# 1. Clone de repo
git clone https://github.com/jouw-gebruikersnaam/the-web-is-for-everyone-interactive-functionality.git

# 2. Ga naar de projectmap
cd the-web-is-for-everyone-interactive-functionality

# 3. Installeer de packages
npm install

# 4. Start de development server
npm run dev
```

De app draait op `http://localhost:8000`.

## Bronnen

- [MDN -Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
- [MDN -FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [MDN -CSS :target](https://developer.mozilla.org/en-US/docs/Web/CSS/:target)
- [MDN -prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN -View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Directus API Docs](https://docs.directus.io/)
- [Liquid Template Language](https://liquidjs.com/)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
