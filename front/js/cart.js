const addProductToPage = async (product, products) => {
  const productInfo = products.find((item) => item._id === product.id)
  const articlesSection = document.querySelector('#cart__items')

  const productArticle = document.createElement('article')
  productArticle.classList.add("cart__item")
  productArticle.dataset.id = product.id
  productArticle.dataset.color = product.color

  const productImgDiv = document.createElement('div')
  productImgDiv.classList.add("cart__item__img")
  const productImg = document.createElement('img')
  productImg.src = productInfo.imageUrl
  productImg.alt = productInfo.altTxt
  productImgDiv.append(productImg)

  const productContentDiv = document.createElement('div')
  productContentDiv.classList.add('cart__item__content')

  const productContentDescriptionDiv = document.createElement('div')
  productContentDescriptionDiv.classList.add('cart__item__content__description')
  const title = document.createElement('h2')
  title.innerText = productInfo.name
  const colorText = document.createElement('p')
  colorText.innerText = product.color
  const priceText = document.createElement('p')
  priceText.innerText = `${productInfo.price}€`

  productContentDescriptionDiv.append(title, colorText, priceText)

  const productContentSettingsDiv = document.createElement('div')
  productContentSettingsDiv.classList.add('cart__item__content__settings')

  const quantityDiv = document.createElement('div')
  quantityDiv.classList.add('cart__item__content__settings__quantity')
  const quantityText = document.createElement('p')
  quantityText.innerText = `Qté: ${product.quantity}`
  const quantityInput = document.createElement('input')
  quantityInput.type = 'number'
  quantityInput.classList.add('itemQuantity')
  quantityInput.name='itemQuantity'
  quantityInput.min = "1"
  quantityInput.max="100"
  quantityInput.value = product.quantity
  quantityDiv.append(quantityText, quantityInput)

  const deleteDiv = document.createElement('div')
  deleteDiv.classList.add('cart__item__content__settings__delete')
  const deleteText = document.createElement('p')
  deleteText.classList.add('deleteItem')
  deleteText.innerText = 'Supprimer'
  deleteDiv.append(deleteText)

  productContentSettingsDiv.append(quantityDiv, deleteDiv)

  productContentDiv.append(productContentDescriptionDiv, productContentSettingsDiv)
  productArticle.append(productImgDiv, productContentDiv)

  articlesSection.append(productArticle)
}

const computeSum = (array) => {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}

const updateCartTotal = (cart, products) => {
  const quantities = cart.map(article => parseInt(article.quantity))
  const totalQuantity = computeSum(quantities)
  document.querySelector('#totalQuantity').innerText = totalQuantity

  const prices = cart.map((product) => {
    productInfo = products.find((item) => item._id === product.id)
    return parseInt(productInfo.price) * parseInt(product.quantity)
  })
  const totalPrice = computeSum(prices)
  document.querySelector('#totalPrice').innerText = totalPrice
}


const getProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products')
  const products = await response.json()
  return products
}

const updatePageContent = async () => {
  const products = await getProducts()
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  cart.forEach((product) => addProductToPage(product, products))
  updateCartTotal(cart, products)
}

updatePageContent()
