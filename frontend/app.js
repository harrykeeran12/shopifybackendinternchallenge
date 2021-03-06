/* NEED TO REPLACE THE URLS WHEN PRODUCTION */

 const url = 'http://localhost:3001';

function refreshPage(time){
  setTimeout(()=>{
    location.reload()
  }, time)
}
/* Populate database. */
const loadDataurl = url + '/all'
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

const sendEntryurl = url + '/send';
var submitbutton = document.querySelector('input[type=submit]')
let update = false;
submitbutton.addEventListener('click', async(e) => {
  if(update == false){
    submitbutton.value = 'Submit New Entry'
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
  }
  
  
})



/* Function to get a list of selected entries, for updating or deleting. */

function getSelected(){
  const checkboxesArray = document.querySelectorAll('input[type=checkbox]');
  const selectedArray = [];
  let namesArray = [];
  let tableRowArray = [];
  checkboxesArray.forEach(element => {
    if(element.checked){
      selectedArray.push(element)
      let tableRow = element.parentElement.parentElement;
      tableRowArray.push(tableRow)
      let name = tableRow.childNodes[1].innerHTML;
      namesArray.push(name)
    }}
  )
  return [selectedArray, namesArray, tableRowArray]

}

/* Update an item. */
const updateButton = document.querySelector('.update');
updateButton.addEventListener('click', updateItem)

function updateItem(){
  const baseupdateurl = url + '/update';
  const selectedArray = getSelected()[2];
  const namesArray = getSelected()[1];
  
  if (selectedArray.length != 0){
    update = true
    let inventory_name = document.querySelector('input[name=inventory_name]')
    let storage_date = document.querySelector('input[name=storage_date]')
    let amount = document.querySelector('input[name=amount]')
    for (let i = 0; i < selectedArray.length; i++) {
      const insideElements = selectedArray[i].children;
      tempDate = new Date(insideElements[2].innerHTML)
      let month = tempDate.getMonth().toString()
      let day = tempDate.getDate().toString()
      if(tempDate.getMonth() < 10){
        month = '0' + tempDate.getMonth().toString()
      }
      if(tempDate.getDay() < 10){
        date = '0' + tempDate.getDate().toString()
      }
      
      inventory_name.value = insideElements[1].innerHTML;
      storage_date.value = `${tempDate.getFullYear()}-${month}-${day}`
      amount.value = insideElements[3].innerHTML;
      console.log(new Date(storage_date.value).toString())
      /* Change submit button to send data*/
      if (update == true) {
        submitbutton.value = 'Update entry.'
        submitbutton.addEventListener('click', async function(){
          let updateEntry = {}
          /* Appending values to object*/
          if ((inventory_name.value != insideElements[1].innerHTML) && (inventory_name.value != '')){
            Object.assign(updateEntry, {'inventory_name' : inventory_name.value});
          }
          if ((amount.value != insideElements[3].innerHTML) && (amount.value != '')){
            Object.assign(updateEntry, {'inventory_amount' : amount.value});
          }
          if ((storage_date.value != new Date(storage_date.value).toString()) && (storage_date.value != '')){
            Object.assign(updateEntry, {'storage_date' : new Date(storage_date.value).toString()});
          }
          console.log(updateEntry)
          let name = namesArray[i]
          axios.put(baseupdateurl + '/' + name, updateEntry).then(refreshPage(1000))
          update = false
          

        })
      }
      console.log(new Date(insideElements[2].innerHTML))     
    }
    
    //alert(`Updating ${selectedArray.length} item/s.`)
  }
  else if(selectedArray.length > 1){
    alert('Please only select one item to be updated at a time.')
  }
  else{
    alert('Please select elements to update/delete.')
  }
  
}

/* Delete an item. */
const deleteButton = document.querySelector('.delete');
deleteButton.addEventListener('click', deleteItem)

function deleteItem(){
  const deleteUrl = url + '/delete';
  const pushtoStack = url + '/stackpush'
  const names = getSelected()[1]
  names.forEach(name => {
    console.log(name)
    /* Need to add a way of getting the user comments, and saving them to the database, such that I can undo any deletions. The comments can be done using a prompt, whilst I will also need to grab the data of the deleted entry right before it is deleted. */
    var comment = prompt(`Please add any comments to accompany the deletion of ${name}.`)
    var namecomments = {
      'comments': comment,
      'name': name
    };
    console.log(namecomments)
    axios.post(pushtoStack, namecomments).then((res)=>{
      if(res){
        axios.delete(deleteUrl + '/' + name).then(()=>{
          alert(`${name} has been deleted from the database.`)
        })
      }
    })
  })
  refreshPage(1000);

}

const undoButton = document.querySelector('.undo');
const undoURL = url + '/popstack';
undoButton.addEventListener('click', undoDelete)
function undoDelete(){
  axios.get(undoURL).then(refreshPage(1000))
  //Put something here to refresh the page.

}

const addButton = document.querySelector('.add');

addButton.addEventListener('click', function(){
  const formdata = document.getElementById('new_entry')
  if('hidden' in formdata.classList){
    formdata.classList.toggle('hidden')
  }
  else{
    formdata.classList.toggle('hidden')
  }})

    

