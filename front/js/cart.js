const changeProductQty = (e) => {
  const article = e.target.closest('article')
  const id = article.dataset.id
  const color = article.dataset.color

  const text = e.target.previousSibling
  text.innerText = "Qté: " + e.target.value
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  cart.find((item) => item.id === id && item.color === color ).quantity = e.target.value
  localStorage.removeItem("cart")
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartTotals()
}

const deleteArticle = (e) => {
  const article = e.target.closest('article')
  const id = article.dataset.id
  const color = article.dataset.color

  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  const differentId = cart.filter((item) => item.id !== id )
  const sameId = cart.filter((item) => item.id === id )
  const sameIdDifferentColor = sameId.filter((item) => item.color !== color)
  const newCart = differentId.concat(sameIdDifferentColor)

  localStorage.removeItem("cart")
  localStorage.setItem("cart", JSON.stringify(newCart))

  article.remove()
  updateCartTotals()
}

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
  quantityInput.addEventListener('change', (e) => {changeProductQty(e)})
  quantityDiv.append(quantityText, quantityInput)

  const deleteDiv = document.createElement('div')
  deleteDiv.classList.add('cart__item__content__settings__delete')
  const deleteText = document.createElement('p')
  deleteText.classList.add('deleteItem')
  deleteText.innerText = 'Supprimer'
  deleteText.addEventListener('click', (e) => (deleteArticle(e)))
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


const updateCartArticles = async () => {
  const products = await getProducts()
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  cart.forEach((product) => addProductToPage(product, products))
}

const updateCartTotals = async () => {
  const products = await getProducts()
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  updateCartTotal(cart, products)
}

const hideInputErrorMessage = (id) => {
  const invalidInput = document.querySelector(`#${id}ErrorMsg`)
  invalidInput.innerText = ''
}

const displayInputErrorMessage = (inputType, id) => {
  const invalidInput = document.querySelector(`#${id}ErrorMsg`)
  switch (inputType) {
    case 'email':
      invalidInput.innerText = 'Votre adresse email est invalide.'
    default:
      invalidInput.innerText = 'Ce champs est invalide.'
  }
}

const getRegex = (inputType) => {
  switch (inputType) {
    case 'email':
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    default:
      return /(.+)/
  }
}

const checkAllInputs = (inputDivs) => {
  const contactObject = {
    firstName: null,
    lastName: null,
    address: null,
    city: null,
    email: null
  }

  inputDivs.forEach((div) => {
    const input = div.querySelector('input')
    const regex = getRegex(input.name)
    const isValid = input.value.match(regex) ? true : false
    if (isValid) {
      hideInputErrorMessage(input.id)
      contactObject[input.name] = input.value
    } else {
      displayInputErrorMessage(input.name, input.id)
    }
  })
  return contactObject
}

const postOrder = async (contactObject) => {
  const cart = JSON.parse(localStorage.getItem('cart'))
  const productIds = cart.map((item) => item.id)
  const uniqueIds = [...new Set(productIds)]
  let response = await fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({contact: contactObject, products: uniqueIds})
  });
  const data = await response.json()
  return data
}

const handleFormSubmit = async (e) => {
  e.preventDefault()
  const inputDivs = document.querySelectorAll('.cart__order__form__question')
  const contactObject = checkAllInputs(inputDivs)
  if (Object.values(contactObject).every((value) => value !== null )) {
    const { orderId } = await postOrder(contactObject)
    window.location = `/front/html/confirmation.html?orderid=${orderId}`;
  } else {
    console.log('the form is not valid')
  }
}

const orderButton = document.querySelector('#order')
orderButton.addEventListener('click', (e) => {handleFormSubmit(e)})

updateCartArticles()
updateCartTotals()
