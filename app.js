class Product {
    //deal with a single product

    constructor(product) {
        this.product = product;
    }

    render() {
        //rendering a single product
        let html = `
        
        <div class="item">
        <img src=${this.product.productImg} alt="${this.product.productName}" >
        <div class="product-item__content">
          <h2>${this.product.productName}</h2>
          <h3>\$ ${this.product.productPrice}</h3>
          <p>${this.product.productDescription}</p>
          <button onclick="new Product().addToCart(${this.product.id})">add</button>
          <button onclick="new Product().updateProduct(${this.product.id})">update</button>
         <button onclick="new Product().deleteProduct(${this.product.id})" ><ion-icon name="trash-outline"></ion-icon></button>
        </div>
     </div>
        
        `;

        return html;
    }

    async addToCart(id, e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const product = await response.json();
        let cartProduct = JSON.stringify(product).replace('"id":', '"postId":');
        await fetch('http://localhost:3000/cart', {
            method: 'POST',
            body: cartProduct,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async deleteProduct(id) {
        await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async updateProduct(id) {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const product = await response.json();

        this.prePopulate(product);
        const btn = document.querySelector('#btn');
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const updatedProduct = new Product().readValues();
            if (btn.innerText === 'Update Product') {
                console.log('Updating');
                this.sendUpdate({ ...updatedProduct, id });
            }
        });
    }

    async sendUpdate(product) {
        await fetch(`http://localhost:3000/products/${product.id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    prePopulate(product) {
        document.querySelector('#p_name').value = product.productName;
        document.querySelector('#p_image').value = product.productImg;
        document.querySelector('#p_price').value = product.productPrice;
        document.querySelector('#p_description').value =
            product.productDescription;
        document.querySelector('#btn').textContent = `Update Product`;
    }

    readValues() {
        const productName = document.querySelector('#p_name').value;
        const productImg = document.querySelector('#p_image').value;
        const productPrice = document.querySelector('#p_price').value;
        const productDescription =
            document.querySelector('#p_description').value;
        return { productName, productImg, productDescription, productPrice };
    }
    async addProduct() {
        const newProduct = new Product().readValues();
        await fetch(' http://localhost:3000/products', {
            method: 'POST',
            body: JSON.stringify(newProduct),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

const btn = document.querySelector('#btn');

// btn.addEventListener('click', () => {
//     if (btn.innerText === 'Add Product') {
//         new Product().addProduct();
//     }
// });

class ProductList {
    //deal with all products

    async render() {
        //get list of products and render- api call
        let products = await this.fetchProduct();
        // console.log(products);
        let html = '';
        for (let product of products) {
            const productHTML = new Product(product).render();
            html += productHTML;
        }
        return html;
    }

    async fetchProduct() {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        return products;
    }
}

const cart = document.querySelector('.cart');
const cartContent = document.querySelector('.cart-items');



const showCart = async () => {
    cartContent.classList.toggle('show');
    let response = await fetch('http://localhost:3000/cart');
    let cartItems = await response.json();
    let count = cartItems.length
    console.log(cartItems, count);
    document.querySelector('.badge').innerText = count
    cartItems.forEach((item) => {
        let cartCard = document.createElement('div');
        cartCard.className = 'cart-card'
        cartCard.innerHTML =
        `
        <div class="left">
            <img src="${item.productImg}" alt="">
        </div>
        <div class="right">
            <h3>${item.productName}</h3>
            <h4>Ksh ${item.productPrice * count}</h4>
            <div class='price'>
                <ion-icon name="remove-circle-outline"></ion-icon>
                <p>${count}</p>
                <ion-icon name="add-circle-outline"></ion-icon>
            <div>
        </div>
        `;
        cartContent.appendChild(cartCard)
    });
};

cart.addEventListener('click', showCart);

class App {
    static async Init() {
        let productList = new ProductList();
        let htmlProducts = await productList.render();
        let app = document.querySelector('#app');
        app.innerHTML = htmlProducts;
    }
}

App.Init();
