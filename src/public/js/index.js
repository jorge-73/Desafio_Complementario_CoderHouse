const socket = io();

const form = document.getElementById("form");
const productsTable = document.querySelector("#productsTable");
const tbody = productsTable.querySelector("#tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Crear el objeto con los valores del formulario
  let product = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    price: document.querySelector("#Price").value,
    code: document.querySelector("#code").value,
    category: document.querySelector("#category").value,
    stock: document.querySelector("#Stock").value,
  };

  // Enviar el producto al servidor
  const res = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    const result = await res.json();
    if (result.status === "error") {
      throw new Error(result.error);
    } else {
      // Obtener la lista actualizada de productos desde el servidor
      const resultProducts = await fetch("/api/products");
      const results = await resultProducts.json();
      if (results.status === "error") {
        throw new Error(results.error);
      } else {
        // Emitir el evento "productList" con la lista de productos actualizada
        socket.emit("productList", results.products);

        // Mostrar notificación de éxito
        Toastify({
          text: "new product added successfully",
          duration: 2000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "#008000",
          },
          onClick: function(){} // Callback after click
        }).showToast();

        // Restablecer los campos del formulario
        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#Price").value = "";
        document.querySelector("#code").value = "";
        document.querySelector("#category").value = "";
        document.querySelector("#Stock").value = "";
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Función para eliminar un producto
const deleteProduct = async (id) => {
  console.log(typeof(id));
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.status === "error") throw new Error(result.error);
    else socket.emit("productList", result.products);

    // Mostrar notificación de éxito
    Toastify({
      text: "product removed successfully",
      duration: 2000,
      newWindow: true,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ff0000",
      },
      onClick: function(){} // Callback after click
    }).showToast();

  } catch (error) {
    console.log(error);
  }
};

// Escucha el evento "updatedProducts" emitido por el servidor
socket.on("updatedProducts", (products) => {
  // Limpiar el contenido de tbody
  tbody.innerHTML = "";

  // Agregar los nuevos productos a tbody
  products.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.description}</td>
        <td>${item.price}</td>
        <td>${item.code}</td>
        <td>${item.category}</td>
        <td>${item.stock}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteProduct('${item._id}')" id="btnDelete">Delete</button>
        </td>
      `;
    tbody.appendChild(row);
  });
});