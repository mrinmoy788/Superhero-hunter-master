// $(document).ready(findData);
let main = document.querySelector('main')
findData();

async function findData(){
	const urlParams = await new URLSearchParams(window.location.search);
	console.log("This is Url params",urlParams.get('id'))
	let id = await parseInt(urlParams.get('id'),10);

	await fetchDataAsync(id);
}

async function fetchDataAsync(id){
	
	await fetch(`https://www.superheroapi.com/api.php/1168930280669000/${id}`)
	.then(res => res.json())
	.then((data) => {
		console.log('Data : ',data);
			let item = `<div id="showDetail">
							<div class="left">
								<img src="${data['image']['url']}">
							</div>
							<div class="right">
								<h1 class="text-white heading">${data.name}<h1>
								<div id="underline">
								<p>Full name : ${data['biography']['full-name']}</p>
								<p>Work : ${data['work']['base']}</p>
								<p>Occupation : ${data['work']['occupation']}</p>

								<div class="d-flex flex-row justify-content-between my-1 details">
									<p>Combat : ${data['powerstats']['combat']}</p>
									<p>Intelligence :  ${data['powerstats']['intelligence']}</p>
									<p>Strength : ${data['powerstats']['strength']}</p>
									<p>Power : ${data['powerstats']['power']}</p>
									<p>Speed : ${data['powerstats']['speed']}</p>
								</div>
										
								<button type="button" id=${data.id} class="btn fav btn-outline-success">Favourite</button>
								
							</div>
						</div>`
			main.innerHTML += item;

	})
	.catch(error => console.error('Error while fetching req : ',error))

	let favBtn = document.getElementsByClassName('fav')[0];
	showFavExistence(favBtn);
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
	await e.target.removeEventListener('click',addToFavourite);
	console.log('Fav After Add : ',localStorage.getItem('favorites'))
	e.target.innerHTML = "Unfavourite"

	e.target.setAttribute('style','background-color : red');
	await e.target.addEventListener('click',removeFromFavourite)
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

	await e.target.removeEventListener('click',removeFromFavourite);
	// e.target.src="assets/images/unFav.png"
	// e.target.alt="Unfav"
	e.target.innerHTML = "Favourite"
	await e.target.addEventListener('click',addToFavourite)
	e.target.removeAttribute('style');

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
	let child = f;
	let id = f.getAttribute('id')
	let fav = getFavId();
	//If current Tag id is Exist in fav then add removeFav listner
	if(fav.includes(id)){
		//update fav icon
		f.innerHTML = "Unfavourite"
		f.setAttribute('style','background-color : red');
		await f.addEventListener('click',removeFromFavourite);
	}
	else{
		await f.addEventListener('click',addToFavourite);	
	}
}