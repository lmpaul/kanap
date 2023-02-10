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

const updatePageContent = async () => {
  const productId = new URLSearchParams(document.location.search).get('id')
  const product = await getProduct(productId)
  console.log(product)
  document.title = product.name

  displayProductImg(product)
  document.querySelector('#title').innerText = product.name
  document.querySelector('#price').innerText = product.price
  document.querySelector('#description').innerText = product.description
  addColorsOptions(product.colors)

}

updatePageContent()
