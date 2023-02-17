const orderId = new URLSearchParams(document.location.search).get('orderid')
document.querySelector('#orderId').innerText = orderId
