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



async function main(){
  const uri = 'mongodb+srv://test:test@inventory.qpxdt.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);
  
  
  try {
    await client.connect();
    const database = client.db("logistics");
    const collection = database.collection('inventory')
    /* await addEntry(collection, {inventory_name: 'find',
  storage_date: '4022-03-02',
    inventory_amount : 10}); */
    /* await findEntry(collection, 'find') */
    /* await showallEntries(collection) */
    await updateEntrybyID(collection, 'new ObjectId("629cceb6c4285b32db42e0f0")',{$set: {inventory_name: "updated"}})



    

   

  } 
  catch (error) {
    console.error(error)
  }

  finally{
    await client.close();
  }

}


async function addEntry(collections, inventoryObject){
  const entry = await collections.insertOne(inventoryObject);
  
}

async function findEntry(collections, inventory_name){
  const entry = await collections.findOne({"inventory_name": inventory_name})
  if(entry){
    console.log(`Found an entry with the name ${inventory_name}.`)
    console.log(entry)
  }
  else{
    console.log(`No entry found with the name ${inventory_name}. `)
  }
}

async function showallEntries(collections){
  const allentries = await collections.find({}).toArray();
  console.log(allentries)
}

async function updateEntrybyID(collections, id, inventory_object){
  if(id == ''){
    console.log('Id cannot be blank.')
  }
  else{
    const updateEntry = await collections.findOneAndUpdate({ _id: id },{ $set:{inventory_amount: 2}})
  }
}




main().catch(console.error);




/*TEST to see if server works and is online. */

app.get('/', (req,res) => {
  res.send('Hello world.')
});

/*CREATE*/

/*Route to send a value into the database.*/
app.post('/send', (req, res) => {
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
    console.log(inventory_object)
    res.send(body);
  }
  
});
/*READ*/

/*Route to get one specific value */
app.get('/:id', (req,res) => {
  
});

/*Route to get all values*/
app.get('/all', (req,res) => {

});

/*UPDATE*/

/*Route to update a value*/
app.put('/update/:id', (req,res) => {

});

/*DELETE*/

/*Route to delete a value*/
app.delete('/delete/:id', (req,res)=> {

});
app.listen(server.port, () => console.log(`Server started, listening port: ${server.port}`))








