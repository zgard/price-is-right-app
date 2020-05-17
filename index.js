// Populate the container for product. 
function renderProduct(product) {
    let renderInfo = product.category.subCat.map(productInfo => {
        return `
            <div class="card mx-2 my-3 col-lg-2 col-md-3 col-sm-4">
                <div class="card-body">
                    <h5 id="productName" class="card-title d-flex flex-column text-center">${productInfo.name}</h5>
                    <img id="productImg" class="card-img-top" src="${productInfo.box.large}" alt="...">
                    <span id="productDesc" class="date badge badge-danger">${productInfo.description} watching</span> 
                    <span id="productPrice" class="date badge badge-dark">${productInfo.price} streaming</span>
                    <br>
                </div>
            </div>
        `
    })
    return renderInfo.join('');
};

// Function to bring in random product and price