// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';


console.log('Hieronder moet je waarschijnlijk nog wat veranderen')
// Doe een fetch naar de data die je nodig hebt
// const apiResponse = await fetch('...')

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
// const apiResponseJSON = await apiResponse.json()

// Controleer eventueel de data in je console
// (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(apiResponseJSON)

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// fetcht een URL en geef direct .data terug
const fetchData = url => fetch(url).then(r => r.json()).then(r => r.data)

// homepagina laad alle snapmaps en opent de eerste
app.get('/', async (req, res) => {
  const snapmaps = await fetchData('https://fdnd-agency.directus.app/items/snappthis_snapmap')
  // Gebruik de uuid van de eerste snapmap om de details op te halen
  const snapmap = await fetchData(`https://fdnd-agency.directus.app/items/snappthis_snapmap/${snapmaps[0].uuid}?fields=*,snaps.*,groups.snappthis_group_uuid.*`)
  res.render('snapmap.liquid', { snapmaps, snapmap, snaps: snapmap.snaps, groep: snapmap.groups[0]?.snappthis_group_uuid || null, activePage: 'home' })
})

// Detailpagina van één snapmap, haalt snapmap en alle snapmaps tegelijk op
app.get('/snapmap/:uuid', async (req, res) => {
  // Promise.all stuurt beide fetches tegelijk op
  const [snapmap, snapmaps] = await Promise.all([
    fetchData(`https://fdnd-agency.directus.app/items/snappthis_snapmap/${req.params.uuid}?fields=*,snaps.*,groups.snappthis_group_uuid.*`),
    fetchData('https://fdnd-agency.directus.app/items/snappthis_snapmap'),
  ])
  res.render('snapmap.liquid', { snapmap, snaps: snapmap.snaps, snapmaps, groep: snapmap.groups[0]?.snappthis_group_uuid || null, activePage: 'home' })
})

// Overzichtspagina van alle groepen
app.get('/groepen', async (req, res) => {
  const groepen = await fetchData('https://fdnd-agency.directus.app/items/snappthis_group?fields=*,snappmap.*')
  res.render('groepen.liquid', { groepen, activePage: 'groepen' })
})

// Detailpagina van één groep op basis van uuid in de URL
app.get('/groep/:uuid', async (req, res) => {
  const groep = await fetchData(`https://fdnd-agency.directus.app/items/snappthis_group/${req.params.uuid}?fields=*,snappmap.snappthis_snapmap_uuid.*`)
  res.render('groep.liquid', { groep, activePage: 'groepen' })
})


// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

app.use((req, response) => {
  
  response.status(404).render('error.liquid')
});


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
