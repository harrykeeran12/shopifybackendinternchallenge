/*
This file is the backend.
This file needs to house a create(POST method), read(GET method), update(PUT method) and delete(DELETE method). It will use express.js to create an API, and mongodb to access/modify the database.
*/

/* Dependencies */
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');

const {MongoClient} = require('mongodb');

app = express()

/*Uses the dependencies cors and body-parser, so that the output is more readable. */
app.use(cors())
app.use(bodyparser.json())

/*Assigns a port number. */
let server = { 
  port: 3001
}

const uri = 'mongodb+srv://test:test@inventory.qpxdt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
client.connect().then((client) =>{
  console.log('Connected to database.')
  database = client.db("logistics");
  collection = database.collection('inventory');
  
})

/* Database functions: */

async function addEntry(collections, inventoryObject){

  const entry = await collections.insertOne(inventoryObject);
  
}

async function showEntry(collections, inventory_name){
  const entry = await collections.findOne({"inventory_name": inventory_name})
  if(entry){
    console.log(`Found an entry with the name ${inventory_name}.`)
    return entry
  }
  else{
    console.log(`No entry found with the name ${inventory_name}. `)
  }
}

async function showallEntries(collections){
  const allentries = await collections.find({}).toArray();
  return allentries
}

async function updateEntrybyName(collections, name, inventory_object){
  if(name == ''){
    console.log('Name cannot be blank.')
  }
  else{
    const updateEntry = await collections.findOneAndUpdate({ inventory_name: name },{ $set: inventory_object}).then(()=>{
      console.log('Found.')
    }, ()=>{
      console.log('Not found.')
    })
    
    
  }
}

async function deleteEntrybyName(collections, name){
  //Need to add comments to this.
  if(name == ''){
    console.log('Name cannot be blank.')
  }
  else{
    try {
      const result = await collections.deleteOne({inventory_name: name})
      console.log(`Deleted document with the inventory_name ${name}.`)
    } catch (error) {
      console.log(error)
    }
    
  }
  
}



/*CREATE*/

/*Route to send a value into the database.*/
app.post('/send', async function (req, res){
  const body = req.body;
  let inventory_name = body['name'];
  let inventory_amount = body['amount'];
  let storage_date = new Date(body['date']);
  //date format has to be in YYYY-MM-DD
  let inventory_object = {
    "inventory_name": inventory_name,
  "storage_date": storage_date,
    "inventory_amount" : inventory_amount
  }
  if (inventory_amount < 0) {
    res.send('Bad request, number is less than 0.')
  } 
  else {
    console.log(`Adding ${inventory_object} to the database.`)
    const entry = await addEntry(collection, inventory_object)
    res.send(entry);
  }
  
});

/*READ*/

/*Route to get one specific value */
app.get('/api/:name', async function (req,res){
  const entry = await showEntry(collection, req.params.name)
  if (entry){
    res.send(entry)
  }
  else{
    res.send(`Did not find an entry with the name ${req.params.name}`)
  }
});

/*Route to get all values*/
app.get('/all', async function (req,res){
  const entries = await showallEntries(collection)
  res.send(entries)
});

/*UPDATE*/

/*Route to update a value*/
app.put('/update/:name', async function (req,res){
  let name = req.params.name
  const update = await updateEntrybyName(collection, name, req.body).then(()=> {
    res.send(`Updated entry with name ${name}.`)
  }, () => {
    res.send(`Unable to update the entry ${name}.`)
  })
  
});


/*DELETE*/

/*Route to delete a value*/
app.delete('/delete/:name', async function (req,res){
  const name = req.params.name
  try {
    const deleteEntry = await deleteEntrybyName(collection, name).then(()=>{
    res.send('Deleted the entry.')
  })
  } catch (error) {
    console.log(error)

  }
  

});

app.listen(server.port, () => console.log(`Server started, listening port: ${server.port}`))








