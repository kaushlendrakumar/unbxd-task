var listPageDetail = {};

// start getData
var getData = async function(){
	let loaderEle = document.getElementById('loader');
	loaderEle.classList.toggle("loaderShow");
	try{
		let searchInput = document.getElementById('search-input').value;
		let requestUrl = `http://search.unbxd.io/fb853e3332f2645fac9d71dc63e09ec1/demo-unbxd700181503576558/search?&q=${searchInput.trim()}`
		let response = await fetch(requestUrl);
		let jsonResponse = await response.json();
		if(response.ok && response.status === 200){
			listPageDetail['apiResponse'] = jsonResponse
			if(listPageDetail['apiResponse'].response.products.length > 0){
				setPageDetail();
			} else{
				throw new Error("Results not found.");
			}
		}
		else{
			throw new Error("Error while fetching data.");
		}
	}
	catch(err){
		console.warn('Something went wrong.', err);
		console.log('Something went wrong. Please Retry');
	}
	finally{
		loaderEle.classList.toggle("loaderShow");
	}
}
// end getData

// start debounce
var debounce = function(){
	let timer;
	return function(){
		clearTimeout(timer);
		timer = setTimeout( () => {
			getData.apply();
		}, 1000);
	}
}
// end debounce

let globalSearch = debounce(getData);

document.getElementById('search-input').value = "Dresses";
getData();



// start setPageDetail
function setPageDetail(){
	setBanner();
	setPagination()
	setFilters();
	setItemList();
}
// end setPageDetail

// start setBanner
function setBanner(){
	let bannger = document.getElementById('banner-image');
	if(listPageDetail.apiResponse.banner.banners[0].imageUrl){
		bannger.src = listPageDetail.apiResponse.banner.banners[0].imageUrl;
	} else{
		bannger.src = "../assets/img/banner.png";
	}
}
// end setBanner

// start setPagination
function setPagination(){
	let totalCount = listPageDetail.apiResponse.response.numberOfProducts;
	let totalCountEle = document.getElementById('total-count');
	totalCountEle.innerText = totalCount;

	let totalPage = parseInt(totalCount/10);
	if(totalCount%10 > 0 ){
		totalPage = totalPage + 1;
	}

	let paginationEle = document.getElementById('pagination-list');
	let paginationHtml = "";
	if(totalPage > 9){
		for(let i=1; i <= totalPage; i++){
			paginationHtml += `<li class="${i===1 ? 'active' : ''}">${i}</li>`
		}
		paginationEle.innerHTML = paginationHtml;
	}
}
// end setPagination


// start setFilters
function setFilters(){
	document.getElementById('filters-container').innerHTML = "";
	Object.keys(listPageDetail.apiResponse.facets).forEach((key, index) => {
		var evens = [];
		var odds = [];
		if(listPageDetail.apiResponse.facets[key].values.counts && 
			listPageDetail.apiResponse.facets[key].values.counts.length > 1){			
			for (var i = 0; i < listPageDetail.apiResponse.facets[key].values.counts.length; i++) {
		        if (i%2 === 0) {
		            odds.push(listPageDetail.apiResponse.facets[key].values.counts[i]);
		        }
		        else {
		            evens.push(listPageDetail.apiResponse.facets[key].values.counts[i]);
		        }
		    }
		    filterHtml(listPageDetail.apiResponse.facets[key].displayName, odds, evens)

		} else if(listPageDetail.apiResponse.facets[key].values.length > 1){
			for (var i = 0; i < listPageDetail.apiResponse.facets[key].values.length; i++) {
		        if (i%2 === 0) {
		            odds.push(listPageDetail.apiResponse.facets[key].values[i]);
		        }
		        else {
		            evens.push(listPageDetail.apiResponse.facets[key].values[i]);
		        }
		    }
		    filterHtml(listPageDetail.apiResponse.facets[key].displayName, odds, evens)
		}

	});
}
// end setFilters

// start filterHtml
function  filterHtml(title, oddArr, evenArr) {
	let itemList = "";
	for (var i = 0; i < oddArr.length; i++) {
		itemList += `
			<div class="filter-item-row">
				<div class="checkbox-col">
					<input type="checkbox">
				</div>
				<div class="checkbox-label-col">
					${oddArr[i]} <span class="checkbox-label-count">(${evenArr[i]})</span>
				</div>
			</div>
		`;
	}


	let filterHtmlEle = document.getElementById('filters-container');
	filterHtmlEle.innerHTML += `
		<div class="each-filter-container">
			<div class="filter-title">${title}</div>
			${itemList}
		</div>
	`;
}
// end filterHtml

// start setItemList
function setItemList(){
	let productListContainerEle = document.getElementById('product-list-container');
	productListContainerEle.innerHTML = "";

	if(listPageDetail.apiResponse.response.products.length > 0){
		let products = listPageDetail.apiResponse.response.products;

		products.forEach(productDetail => {
			productListContainerEle.innerHTML += `
				<div class="item-container">
					<a href="http://demo-unbxd.unbxdapi.com/product?pid=${productDetail.sku}" target="_blank">
						${
							productDetail.productImage ? 
							`<img class="item-img-cont" src="${productDetail.productImage}" alt="item-image" />`	
							: 
							`
							<div class="no-item-img">
								<span>photo coming soon</span>
							</div>
							`
						}
						<div class="item-title">${productDetail.title}</div>
						<div>${productDetail.displayPrice}</div>
					</a>
				</div>
			`;
		});
	}
}
// end setItemList

// start toggleHamburger
function toggleHamburger(){
	let hamburgerEle = document.querySelector('#hamburger img')
	if(hamburgerEle.src.indexOf('close.png') === -1){
		hamburgerEle.src = "../assets/img/close.png";
	} else{
		hamburgerEle.src = "../assets/img/hamburger.jpg";
	}

	let filterContainerEle = document.getElementById('filters-container');
	filterContainerEle.classList.toggle('open');
}
// end toggleHamburger
