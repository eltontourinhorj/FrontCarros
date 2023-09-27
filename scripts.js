/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = "http://127.0.0.1:5000/carros";
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      data.carros.forEach((item) =>
        insertList(
          item.modelo,
          item.ano,
          item.marca,
          item.quantidade,
          item.valor
        )
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList();

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (
  inputModelo,
  inputAno,
  inputMarca,
  inputQuantity,
  inputPrice
) => {
  const formData = new FormData();
  formData.append("modelo", inputModelo);
  formData.append("ano", inputAno);
  formData.append("marca", inputMarca);
  formData.append("quantidade", inputQuantity);
  formData.append("valor", inputPrice);

  let url = "http://127.0.0.1:5000/carro";
  fetch(url, {
    method: "post",
    body: formData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
};

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName("td")[0].innerHTML;
      if (confirm("Você tem certeza?")) {
        div.remove();
        deleteItem(nomeItem);
        alert("Removido!");
      }
    };
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item);
  let url = "http://127.0.0.1:5000/carro?modelo=" + item;
  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputModelo = document.getElementById("newInput").value;
  let inputAno = document.getElementById("newAno").value;
  let inputMarca = document.getElementById("newMarca").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  Preco = inputPrice.replace("R$ ", "").replace(/\./g, "").replace(/,/g, ".");

  if (inputModelo === "" || inputMarca === "") {
    alert("Escreva o nome de modelo e quarto!");
  } else if (isNaN(inputAno) || isNaN(inputQuantity)) {
    alert("Quantidade ano e valor precisam ser números!");
  } else {
    insertList(inputModelo, inputAno, inputMarca, inputQuantity, inputPrice);
    postItem(inputModelo, inputAno, inputMarca, inputQuantity, Preco);
    alert("Item adicionado!");
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (modeloCarro, ano, marca, quantity, price) => {
  var item = [modeloCarro, ano, marca, quantity, price];
  var table = document.getElementById("myTable");
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));
  document.getElementById("newInput").value = "";
  document.getElementById("newAno").value = "";
  document.getElementById("newMarca").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement();
};

/Possibilita a exportação da tabela/;
document.getElementById("sheetjsexport").addEventListener("click", function () {
  /* Cria planilha a partir de HTML DOM TABLE */
  var wb = XLSX.utils.table_to_book(document.getElementById("myTable"));
  /* Export to file (start a download) */
  XLSX.writeFile(wb, "SheetJSTable.xlsx");
});
