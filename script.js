const Modal = { 
  
    toggle() {
      document.
        querySelector('.modal-overlay-box-transperent').
        classList.toggle('active')
    }
}

const Storage = {
  // pegar informações
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },
  // guardarQconfigurar as informações
  set(transactions){
    
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  },


}

const Transaction = {
    all: Storage.get(),


    add(trans){
      Transaction.all.push(trans)

      App.reload()
    },

    remove(index){
      Transaction.all.splice(index, 1)

      App.reload()
    },

    incomes(){
      let income = 0
      // pegat todas as transações
      // para cada caso
      Transaction.all.forEach( dataTransacationArray => {
        // se for maior que zero
        if(dataTransacationArray.amount > 0){
          // somar a uma variavel e retornar a variavel
          income = income + dataTransacationArray.amount
        }
      } )
      return income
    },


    expenses(){
      let expense = 0
      // pegar todas as transações 
      // para cada caso
      Transaction.all.forEach( dataTransacationArray => {
        if(dataTransacationArray.amount < 0){
          // somar a uma variável e retorná-la
          expense = expense + dataTransacationArray.amount
        }

      })

     return expense
    },


    total(){
     
      return Transaction.incomes() + Transaction.expenses()
       
    }

}

const DOM = {
  transactionContainer: document.querySelector("#data-table tbody"),

  addTransaction(dataTransacationArray , index){
    const tr = document.createElement('tr')
    tr.innerHTML= DOM.innerHTMLTransaction(dataTransacationArray, index)
    tr.dataset.index = index

    DOM.transactionContainer.appendChild(tr)

  },


  innerHTMLTransaction(dataTransacationArray, index){
    const CSSclass = dataTransacationArray.amount > 0 ? "income" : "expense" 

    const amount = Utils.formatCurrency(dataTransacationArray.amount)

    const html = 
       `<td class="description">${dataTransacationArray.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${dataTransacationArray.date}</td>
        <td>
          <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação.">
        </td>
        `
    return html

  },


  updateBalance(){
    // ENTRADAS
    document.
        getElementById("income-display").
        innerHTML=Utils.formatCurrency(Transaction.incomes())
    // SAÍDAS
    document.
        getElementById("expense-display").
        innerHTML=Utils.formatCurrency(Transaction.expenses())
    // TOTAL
    document.
        getElementById("total-display").
        innerHTML=Utils.formatCurrency(Transaction.total())
  },

  clearTransactions(){
    DOM.transactionContainer.innerHTML=''
  }


}


const Utils = {
  formatAmount(value){
    value = Number(value) * 100
    return value
  },

  formatDate(date){
    const splittedDate = date.split("-")

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""
                    //    "\D "significa tudo que não for numero
                    //    "g" siginifica global
    value = String(value).replace(/\D/g,"")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR",{
      style: "currency",
      currency: "BRL"
    })

    return signal + value
  }
}

const Form = {
  description: document.getElementById('description'),
  amount: document.getElementById('amount-resultar'),
  date: document.getElementById('date'),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  
  validateFields(){
    const { description, amount, date} = Form.getValues()

    if( description.trim() === "" || 
        amount.trim() === "" || 
        date.trim() === ""){
          throw new Error("Por favor, preencha todos os campos.")
    }

    // console.log(description)
  },

  formatValues(){
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description: description,
      amount: amount,
      date: date
    }
  },

  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
        //evitar o padrão 
    event.preventDefault()

    try {
      // verificar se todas as inform foram preenchidas
      Form.validateFields()

      // formatar os dados para salvar
      const transaction = Form.formatValues()

      Transaction.add(transaction)

      // apagar os dados do formulario
      Form.clearFields()

      // modal feche
      Modal.toggle()

    } catch (error) {
      alert(error.message)
    }


    
    
  }
}

const App = {
  init() {

    Transaction.all.forEach( (dataTransacationArray, index) => {
      DOM.addTransaction( dataTransacationArray, index )
    })
    
    DOM.updateBalance()

    Storage.set(Transaction.all)
    
  },

  reload() {
    DOM.clearTransactions(),
    App.init()
  },

}


App.init()

