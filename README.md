# SnapThis

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Gebruik](#gebruik)
- [Kenmerken](#kenmerken)
- [User Preference Media Features](#user-preference-media-features)
- [Installatie](#installatie)
- [Bronnen](#bronnen)
- [Licentie](#licentie)

## Beschrijving

![Free iPhone 17 Pro (1)](https://github.com/user-attachments/assets/37c584ae-ae54-437b-b8f3-ede414c2940f)

SnapThis is een foto-deelplatform waarbij gebruikers foto's kunnen uploaden naar een snapmap. De app is gebouwd als server-side rendered website met Express en Liquid templates, en haalt data op via de Directus API.

## Gebruik

De volgende schermen heb ik deze sprint gemaakt:

- **Snapmap-overzicht:** een fotogrid met alle foto's in een snapmap, plus een formulier om een nieuwe foto toe te voegen
- **Foto-detailpagina:** klik op een foto voor een vergrote weergave met extra info zoals auteur, locatie en datum
- **Groepenpagina:** een overzicht van alle groepen en hun snapmaps

<img width="1500" height="1125" alt="iPhone 15 Pro" src="https://github.com/user-attachments/assets/527c6555-ef4f-4346-a865-c3b56b648368" />

### Foto uploaden

1. Open een snapmap
2. Kies een foto via het uploadformulier
3. Bekijk direct een preview van de gekozen foto
4. Bevestig met de "Ja, voeg toe"-knop
5. Na het uploaden verschijnt een bevestigingsmelding

https://github.com/user-attachments/assets/5991149e-4f6c-4703-9d95-8b6e33c0ef3d

## Kenmerken

### Progressive Enhancement

De kern van dit project is dat de app werkt voor iedereen, ongeacht hun apparaat, browser of instellingen. De app is opgebouwd in drie lagen, elke laag voegt iets toe, maar de laag eronder blijft altijd werken.

**Laag 1: HTML & Server**

Het uploaden van een foto is de belangrijkste interactie in de app. De eerste keuze was om dit als een standaard HTML-formulier te bouwen, niet als een JavaScript-flow. Dat betekent dat de server het werk doet: het formulier stuurt via POST, de server verwerkt het bestand en stuurt een nieuwe pagina terug.

```html
<form method="POST" enctype="multipart/form-data">
  <input type="file" name="snap" accept="image/*" />
  <button type="submit">Voeg toe</button>
</form>
```

dit werkt op elke browser, elk apparaat, met of zonder JavaScript. Dit is de basis. Alles daarna is een verbetering bovenop.

**Laag 2: CSS**

CSS voegt stijl en structuur toe, maar ook gedrag dat anders JavaScript zou vereisen.

De succes-melding na een upload is hiervan een voorbeeld. Na een geslaagde upload redirect de server naar dezelfde pagina met `#succes` in de URL. Met de CSS `:target` selector wordt de melding zichtbaar, zonder één regel JavaScript.

```css
#succes:not(:target) {
  display: none;
}
```

Dit was een bewuste keuze: een succes-melding is geen reden om JavaScript te vereisen. CSS kan dit zelf af.

De foto's in het grid laden in met een staggered fade-in via `sibling-index()`. De animatie staat alleen aan als de gebruiker daar geen bezwaar tegen heeft, meer daarover bij [User Preference Media Features](#user-preference-media-features).

**Laag 3: JavaScript**

Pas in de derde laag komt JavaScript. Het script voegt één ding toe: een preview van de foto direct na het kiezen, zodat de gebruiker weet wat er geüpload gaat worden voordat ze bevestigen.

```js
snapInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  document.getElementById('preview-img').src = URL.createObjectURL(file)
  document.getElementById('snap-preview').hidden = false
})
```

De submit-knop wordt standaard verborgen. JavaScript toont hem pas weer als de gebruiker de preview bevestigt. Staat JavaScript uit? Dan is de submit-knop er gewoon, en werkt het formulier zoals in laag 1.

De preview is dus een verbetering van de ervaring, niet een vereiste voor de functionaliteit.

### Andere ontwerpkeuzes

**`<details>` en `<summary>` voor de snapmap-dropdown**

`<details>` en `<summary>` zijn semantisch de juiste keuze voor een dropdown. Het is robuuste HTML die precies dit gedrag beschrijft, zonder extra code of JavaScript nodig te hebben. Toegankelijkheid zit er standaard in.

**View Transitions API**

Bij het navigeren naar een foto-detailpagina lijkt de foto soepel te bewegen van de grid naar de detailweergave. Dit werkt via `view-transition-name` in CSS, gecombineerd met de View Transitions API. Een kleine toevoeging die de app een stuk prettiger maakt om te gebruiken.

**Toegankelijkheid**

knoppen met alleen een icoon hebben een `aria-label`, zodat screenreaders kunnen voorlezen wat de knop doet. Succes-meldingen hebben `role="status"` zodat ze automatisch worden voorgelezen. Focus-stijlen zijn  zichtbaar door een rode outline.

## User Preference Media Features

Een onderdeel van Progressive Enhancement is dat je rekening houdt met de voorkeuren van de gebruiker.

In dit project zijn twee van dit soort media features toegepast.

### `prefers-reduced-motion`

De foto's in het grid laden standaard in met een fade-in animatie. Maar die animatie is een *verbetering*, niet de basis. Heeft de gebruiker `reduce motion` ingesteld? Dan valt de app gewoon terug op de basisstijl: foto's zijn gewoon zichtbaar, zonder animatie.

```css
.photo-item {
    animation: fade-in 0.5s backwards;
    animation-delay: calc(100ms * sibling-index());
}

@media (prefers-reduced-motion: reduce) {
    .photo-item {
        animation: none;
    }
}
```

Hetzelfde geldt voor de View Transitions bij paginanavigatie. Die geven een mooie overgang, maar bij `reduce motion` worden ze uitgezet:

```css
@view-transition { navigation: auto; }

@media (prefers-reduced-motion: reduce) {
    ::view-transition-old(*),
    ::view-transition-new(*) {
        animation: none;
    }
}
```

Dit is Progressive Enhancement in de praktijk: de animatie is de enhancement. De inhoud werkt altijd, de animatie is extra.

### `hover: hover`

Op een touchscreen heeft hover geen betekenis, je vinger beweegt niet over een element voordat je het aanraakt. Hover-effecten op touch kunnen zelfs voor rare gedrag zorgen, waarbij een element in een "stuck hover state" blijft hangen na een tik.

Daarom worden hover-stijlen alleen toegevoegd voor apparaten die hover echt ondersteunen, zoals een muis of trackpad.

```css
@media (hover: hover) {
    .snapmap-dropdown-list li a:hover {
        background-color: rgba(146, 146, 146, 0.07);
    }

    .map-title-btn:hover {
        transform: scale(1.05);
    }
}
```

De basis werkt op touch. Hover is de verbetering voor muisgebruikers.

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

- [MDN - Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
- [MDN - FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [MDN - CSS :target](https://developer.mozilla.org/en-US/docs/Web/CSS/:target)
- [MDN - prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN - hover media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)
- [MDN - View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Directus API Docs](https://docs.directus.io/)
- [Liquid Template Language](https://liquidjs.com/)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
