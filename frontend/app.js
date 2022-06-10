
/* Populate database. */
const loadDataurl = 'http://localhost:3001/all'
let table = document.getElementsByClassName('table');
axios.get(loadDataurl).then(
  data=>{
    entriesarray = data['data'];
    entriesarray.forEach(entry => {
      console.log(entry)
      let iD = entry['_id'];
      let name = entry['inventory_name'];
      let amount = entry['inventory_amount'];
      let date = entry['storage_date']
      console.log(iD, name, amount, date)
      let newDiv1 = document.createElement("div");
      let newDiv2 = document.createElement("div");
      let newDiv3 = document.createElement("div");
      let newDiv4 = document.createElement("div");
      let id_text = document.createTextNode(iD);
      let name_text = document.createTextNode(name);
      let amount_text = document.createTextNode(amount);
      let date_text = document.createTextNode(date);
      newDiv1.appendChild(id_text)
      newDiv2.appendChild(name_text)
      newDiv3.appendChild(amount_text)
      newDiv4.appendChild(date_text)
      table[0].appendChild(newDiv1);
      table[0].appendChild(newDiv2);
      table[0].appendChild(newDiv3);
      table[0].appendChild(newDiv4);

    });

  }
) 