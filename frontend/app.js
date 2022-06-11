/* NEED TO REPLACE THE URLS WHEN PRODUCTION */




/* Populate database. */
const loadDataurl = 'http://localhost:3001/all'
let table = document.getElementsByClassName('table');
axios.get(loadDataurl).then(
  data=>{
    entriesarray = data['data'];
    
    entriesarray.forEach(entry => {
      let tableRow = document.createElement('div')
      tableRow.className = 'table-row'
      let checkrow = document.createElement('div')
      let check = document.createElement('input')
      check.type = 'checkbox'
      Object.values(entry).forEach(e => {
        let newDiv = document.createElement("div");
        if (e == entry['storage_date']) {
          let field_text = document.createTextNode(new Date(e).toDateString());
          newDiv.className = 'date';
          newDiv.appendChild(field_text)
        }
        else if(e == entry['_id']){
          let field_text = document.createTextNode(e);
           newDiv.className = 'id';
           newDiv.appendChild(field_text)
        }
        else {
          let field_text = document.createTextNode(e);
          newDiv.appendChild(field_text)
            
        }
        
        tableRow.appendChild(newDiv)
        checkrow.appendChild(check)
        tableRow.appendChild(checkrow)
      });
        table[0].appendChild(tableRow)
    }
    );

  }
) 

/* Add a new item. */

const sendEntryurl = 'http://localhost:3001/send';
var submitbutton = document.querySelector('input[type=submit]')
submitbutton.addEventListener('click', async(e) => {
  let inventory_name = document.querySelector('input[name=inventory_name]')
  let storage_date = document.querySelector('input[name=storage_date]')
  let amount = document.querySelector('input[name=amount]')
  let formData = {
    "name": inventory_name.value.toString(), 
    "date": storage_date.value.toString(),
    "amount": parseInt(amount.value)
  }
  if(parseInt(amount.value) < 0){
    alert('The number is less than 0. It cannot be submitted.')
  }
  else{
    console.log(formData)
      axios.post(sendEntryurl, formData).then((res)=>{
        console.log(res)
        alert(`Entry with name ${formData['name']}, at date ${formData['date']} and amount ${formData['amount']} has been added to the database.`)
  })
  }
  
})



/* Function to get a list of selected entries, for updating or deleting. */

function getSelected(){
  const checkboxesArray = document.querySelectorAll('input[type=checkbox]');
  const selectedArray = [];
  let namesArray = [];
  checkboxesArray.forEach(element => {
    if(element.checked){
      selectedArray.push(element)
      let tableRow = element.parentElement.parentElement;
      let name = tableRow.childNodes[1].innerHTML;
      namesArray.push(name)
    }}
  )
  return [selectedArray, namesArray]

}

/* Update an item. */
const updateButton = document.querySelector('.update');
updateButton.addEventListener('click', updateItem)

function updateItem(){
  
  const baseupdateurl = 'http://localhost:3001/update';
  const selectedArray = getSelected()[0]
  if (selectedArray.length != 0){
    console.log(selectedArray)
    alert(`Updating ${selectedArray.length} item/s.`)
  }
  else{
    alert('Please select elements to update/delete.')
  }
  
}

/* Delete an item. */
const deleteButton = document.querySelector('.delete');
deleteButton.addEventListener('click', deleteItem)

function deleteItem(){
  const deleteUrl = 'http://localhost:3001/delete';
  const pushtoStack = 'http://localhost:3001/stackpush'
  const names = getSelected()[1]
  names.forEach(name => {
    console.log(name)
    /* Need to add a way of getting the user comments, and saving them to the database, such that I can undo any deletions. The comments can be done using a prompt, whilst I will also need to grab the data of the deleted entry right before it is deleted. */
    var comment = prompt(`Please add any comments to accompany the deletion of ${name}.`)
    var namecomments = {
      'comments': comment,
      'name': name
    };
    axios.post(pushtoStack, namecomments).then((res)=>{
      console.log(res)
      axios.delete(deleteUrl + '/' + name).then(
      alert(`${name} has been deleted from the database.`)
    )})

    
  });
  
}

