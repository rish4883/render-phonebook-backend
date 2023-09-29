const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
morgan.token('jsonbody', function (req, res) {
  return `${JSON.stringify(req.body)}`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonbody'))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.jsonbody(req, res)
  ].join(' ')
})
)



let persons  = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req,res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const personCount = persons.length;
  const message = `Phonebook has info for ${personCount} people`;
  const date = new Date().toString();
  res.send(`${message} <br/> <br/> ${date}`)
  
})

app.get('/api/persons/:id', (req, res)=> {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.filter(p => p.id === id)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

const generateId = () => {
  let idTaken = true
  let id
  while(idTaken) {
    id = Math.floor(Math.random() * (persons.length * 7))
    idTaken = false
    for(let i=0; i<persons.length; i++) {
      if(persons[i].id === id) {
        idTaken = true
        break
      } 
    }
  }
  return id
}

const checkDuplicate= (name) => {
  for(let i=0; i<persons.length; i++) {
    if(persons[i].name === name)
      return true
  }
  return false
}

app.post('/api/persons', (req, res) => {
  console.log(req.body);
  const body = req.body
  if(!body.name || !body.number) {
    return res.status(400).json({error: 'data missing'})
  }

  if(checkDuplicate(body.name)) {
    return res.status(400).json({error: 'duplicate name'})
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons.push(newPerson)
  res.json(newPerson)
})

app.listen(PORT, () => {
  console.log("server running at port: ", PORT);
})

