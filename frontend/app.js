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
  })
  }
  
})

/* Update an item. */

function updateItem(){
  const updateurl = 'http://localhost:3001/send';

}

/* Delete an item. */

function deleteItem(){

}

