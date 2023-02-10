const getProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`)
  const data = await response.json()
  return data
}

const displayProductImg = (product) => {
  const imgDiv = document.querySelector('.item__img')

  const productImg = document.createElement('img')
  productImg.src = product.imageUrl
  productImg.alt = product.altTxt

  imgDiv.append(productImg)
}

const addColorsOptions = (colors) => {
  const colorSelect = document.querySelector('#colors')
  colors.forEach((color) => {
    const newOption = document.createElement('option')
    newOption.value = color
    newOption.innerText = color
    colorSelect.append(newOption)
  })
}

const updatePageContent = async (id) => {

  const product = await getProduct(id)
  console.log(product)
  document.title = product.name

  displayProductImg(product)
  document.querySelector('#title').innerText = product.name
  document.querySelector('#price').innerText = product.price
  document.querySelector('#description').innerText = product.description
  addColorsOptions(product.colors)

}

const addProductToCart = (id) => {

  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  const quantity = document.querySelector("#quantity").value
  const color = document.querySelector('#colors').value

  const sameProduct = cart.find((product) => product.id === id && product.color === color)
  if (sameProduct) {
    sameProduct.quantity = parseInt(sameProduct.quantity) + parseInt(quantity)
  } else {
    const cartItem = {id: id, quantity: quantity, color: color}
    cart.push(cartItem)
  }

  localStorage.removeItem("cart")
  localStorage.setItem("cart", JSON.stringify(cart))
}

const productId = new URLSearchParams(document.location.search).get('id')
updatePageContent(productId)
document.querySelector("#addToCart").addEventListener('click', () => addProductToCart(productId))
