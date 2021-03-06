//TÄÄLLÄ ON B-OSAN HARJOITTELUT
//BACKEND


//otetaan express käyttöön
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))



//MONGO-JUTUT

const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://Daniela:${password}@cluster0-kwssb.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)






let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
]

//ROUTES

app.get('/api/', (req, res) => {
    res.send('<h1>Hello World!!!</h1>')
})
  
app.get('/api/notes', (request, response) => {
  console.log("testiiii")
  Note.find({}).then(notes => {
    response.json(notes)
    console.log('testi', notes)
  })
})

    //yksittäisen resurssin näyttäminen
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
  }
})
    //resurssin poistaminen
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  //uuden muistiinpanon lisääminen 1/2
  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  //uuden muistiinpanon lisääminen 2/2
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })
 
//määritetään kuunneltava portti
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})  

//muutos

