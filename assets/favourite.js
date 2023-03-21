let favTab = document.querySelector('#favTab');
let home = document.querySelector('#homeTab');
// let url = 'https://www.superheroapi.com/api.php/1168930280669000';
let main = document.querySelector('.container');

showFavourite();
async function showFavourite(){
	let favIdList = await getFavId();

	for(id of favIdList){
		await fetchDataAsync(id)
	}

	let favBtn = document.getElementsByClassName('fav-btn');
	for(f of favBtn){
		f.addEventListener('click',removeFromFavourite);
	}
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


//Fech single Data using the ID
async function fetchDataAsync(id){

	await fetch(`https://www.superheroapi.com/api.php/1168930280669000/${id}`)
	.then(res => res.json())
	.then( (data) => {
		console.log("Data ",data)
		if(data.response === 'success'){

			let item = `<div class="card item h-50 m-4 hero" style="width: 13rem;">
							<img src=${data.image.url} class="card-img-top thumbnail" alt="...">
							<div class="card-body d-flex flex-row justify-content-around">
								<h5 class="card-title text-center"><a class="text-decoration-none" href=showDetails.html?id=${data.id}>${data.name}</a></h5>							    
								<div class="fav-btn" >
									<img class="favImg" id="${data.id}"  src="images/fav.png" alt="fav" >
								</div>
							</div>
						</div>`
				
				main.innerHTML += item
			}
			
		})
	.catch(error => console.error('Error while fetching req : ',error))	
}


// function removeAllChildNodes(parent) {
//     while (parent.firstChild) {
//         parent.removeChild(parent.firstChild);
//     }
// }

// to removing from the favourite
async function removeFromFavourite(e){

	let id = e.target.id;
	let fav = getFavId();
	let hero = e.target.parentElement.parentElement.parentElement;

	console.log("Remove from fav to this id : ",id,"  selected is : ",hero)
	let newFav =await fav.filter((f)=>{
		return f != id
	})

	await localStorage.setItem('favorites',newFav)
	console.log('Fav After remove : ',localStorage.getItem('favorites'))
	hero.remove();

}