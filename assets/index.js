
let url = 'https://www.superheroapi.com/api.php/1168930280669000';
let container = document.querySelector('.container');


fetchAndLoadListner();

//Fetch all data and then it load Event Listner on all Favourite btn
async function fetchAndLoadListner(){
	for(let id=1 ; id<15 ; id++){
		await fetchDataAsync(`${url}/${id}`);
	}
	let favBtn = document.getElementsByClassName('fav-btn')
	
	//apply eventListner on Each Favicon and Show Which Already favouratedd
	for(f of favBtn){

		showFavExistence(f);
		
	}  	
}



//Fech single Data using the ID
async function fetchDataAsync(url){

	await fetch(url)
	.then(res => res.json())
	.then( (data) => {

		let item = `<div class="card item h-50 m-4 hero" style="width: 13rem;">
						<img src=${data.image.url} class="card-img-top thumbnail" alt="...">
						<div class="card-body d-flex flex-row justify-content-around">
							<h5 class="card-title text-center"><a class="text-decoration-none" href=assets/showDetails.html?id=${data.id}>${data.name}</a></h5>							    
							<div class="fav-btn" >
								<img class="favImg" id="${data.id}"  src="assets/images/unFav.png" alt="Unfav" >
							</div>
						</div>
					</div>`
			
			container.innerHTML += item

			
		})
	.catch(error => console.error('Error while fetching req : ',error))
			
	
}

//To adding in the favourite
async function addToFavourite(e){
	let id = e.target.id;
	let fav = getFavId();
	console.log("Add to fav to this id : ",id)
	if(!fav.includes(id)){
		fav.push(id)
		console.log('its new so Push')
	}
	//making list to string
	await localStorage.setItem('favorites',fav);
	await e.target.parentElement.removeEventListener('click',addToFavourite);
	console.log('Fav After Add : ',localStorage.getItem('favorites'))
	e.target.src="assets/images/fav.png"
	e.target.alt="favourite"
	await e.target.parentElement.addEventListener('click',removeFromFavourite)

}

// to removing from the favourite
async function removeFromFavourite(e){

	let id = e.target.id;
	let fav = getFavId();

	console.log("Remove from fav to this id : ",id)
	let newFav =await fav.filter((f)=>{
		return f != id
	})

	localStorage.setItem('favorites',newFav)
	console.log('Fav After remove : ',localStorage.getItem('favorites'))

	await e.target.parentElement.removeEventListener('click',removeFromFavourite);
	e.target.src="assets/images/unFav.png"
	e.target.alt="Unfav"
	await e.target.parentElement.addEventListener('click',addToFavourite)
}





//GET all superhero id from localstorage
function getFavId(){
	let fav;
	let value = localStorage.getItem('favorites');
	if(value === null){
		fav = [];
	}else{
		//making string to array
		fav = value.split(",");
	}
	return fav;
}


//Show Which is already exist in Favourite list
async function showFavExistence(f){
	let child = f.children[0]
	let id = child.getAttribute('id')
	let fav = getFavId();
	//If current Tag id is Exist in fav then add removeFav listner
	if(fav.includes(id)){
		await f.addEventListener('click',removeFromFavourite);
		//update fav icon
		child.setAttribute('src','assets/images/fav.png')
		child.setAttribute('alt','favourite')
	}
	else{
		await f.addEventListener('click',addToFavourite);	
	}
}



// ===========================Search functionality======================================
let searchBox = document.querySelector('#search');
let searchResultCont = document.querySelector('#search-result-container');

loadEventListner();
function loadEventListner() {
	searchBox.addEventListener('keyup',handlerSearch);
}


function handlerSearch (e) {
	
	
	//this remove the whitespace from start and end
	let name = e.target.value.trim();
	
	if(name !== ""){
		fetch(`${url}/search/${name}`)
		.then(res => res.json())
		.then( (data) => {
			if(data.response === 'success'){
				searchResultCont.innerHTML = ''
				let heroes = data.results
				// console.log("This ",heroes)	
				for( hero  of heroes ){
					let li = document.createElement('li');
					let a = document.createElement('a')
					a.innerHTML = hero.name;
					a.setAttribute('id', hero.id);
					a.setAttribute('href',`assets/showDetails.html?id=${hero.id}`)
					a.classList.add('item');
					li.appendChild(a);
					searchResultCont.appendChild(li);
				}
			}
			
		} )
	}
	else{
		searchResultCont.innerHTML = ''
	}
}