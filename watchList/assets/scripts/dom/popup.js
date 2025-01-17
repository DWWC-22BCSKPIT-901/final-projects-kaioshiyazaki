
//animates the pop-up menu and generates the HTML for all the non-search pop-up menu functions

function closePopUp() {
	$('#search-box')
		.removeClass('d-none')
		.addClass('d-flex');
	$('.obscure').fadeOut(200, () => {
		$(this).css('display', 'none');
	});
}


//controller function for the pop-up box

function makePopUp(type, name) {
	$('#add-or-edit-container').html('');
	$('.obscure').fadeIn(300);
	$('.obscure').css('display', 'block');
	if (type == 'manageFilters') {
		manageFilters();
	} else if (type == 'help') {
		displayHelp();
	} else if (type == 'reset') {
		resetData();
	} else if (type == 'add') {
		addingItem(name);
	} else {
		addNewMenu(type);
	}
}


//close the modal on outside clicks
$(document).on('click', e => {
	if ($(e.target).hasClass('obscure')) {
		closePopUp();
	}
});


// when a user clicks adds an item while browsing a pop-up appears asking if they wish to continue browsing 
// or view their updated watchList
function addingItem(name) {
	$('#add-or-edit-container').html(
		`<div class="p-4"><p class="heading text-center">${name} has been added</p></div>`
	);
	let browse = $(`<button type="button" class="btn btn-default">Keep Browsing</button>`).on('click', () => {
		closePopUp();
	});
	let viewList = $(`<button type="button" class="btn btn-default">View My List</button>`).on('click', () => {
		closePopUp();
		watchListDom.render(watchList.contents);
	});
	let buttonWrapper = $(`<div class="d-flex justify-content-around mb-4"></div>`).append(browse, viewList);
	$('#add-or-edit-container').append(buttonWrapper);
}

//Create and Render HTML for the manage tags menu

function manageFilters() {
	$('#add-or-edit-container').html('');
	let manageFiltersWrapper = $(`<div class="manage-tags p-2"></div>`);
	let title = $(`<h3 class="heading text-center">Add or Edit Tags</h3><hr>`);
	let newTagWrapper = $(
		`<div class="d-flex justify-content-center align-items-center new-collection-wrapper">`
	);

	let tagLabel = $(`<label>Add New Tag</label>`);
	let tagInput = $(`<input id="collection-input" type="text"></input>`)
		.on('input keydown', e => {
			if (e.keyCode == 13) {
				if ($('#collection-input').val().length > 0) {
					watchListDom.addTag($('#collection-input').val());
					manageFilters();
				}
				else{
					$('#collection-input').effect("shake")
				}
				$(e.target).blur();
			}
		})
		.focusin(e => {
			$(e.target)
				.siblings()
				.animate({ 'font-size': '0.5rem', bottom: '25px' }, 'linear');
		})
		.focusout(e => {
			if ($(e.target).val().length == 0) {
				$(e.target)
					.siblings()
					.animate({ 'font-size': '1rem', bottom: '0px' }, 'linear');
			}
		});
	let button = $(`<div class="btn d-flex justify-content-center align-items-center my-0"><i class="fas fa-plus"></i></div>`);
	button.on('click', () => {
		if ($('#collection-input').val().length > 0) {
			watchListDom.addTag($('#collection-input').val());
			manageFilters();
		}
	});
	let inputWrapper = $(`<div class="input-box-wrapper my-0"></div>`).append(tagLabel, tagInput);
	newTagWrapper.append(inputWrapper, button);
	manageFiltersWrapper.append(title, newTagWrapper);
	if (Object.keys(watchList.tags).length > 0) {
		Object.keys(watchList.tags).forEach(element => {
			let wrapper = $(`<div class="d-flex justify-content-around tag-wrapper"></div>`);
			wrapper.hover((e)=>{
				$(e.target)
					.find(".fa-arrow-right")
					.removeClass("fa-arrow-right")
					.addClass("fa-pencil-alt");
			}, (e)=>{
				$(e.target)
					.find(".fa-pencil-alt")
					.removeClass("fa-pencil-alt")
					.addClass("fa-arrow-right");
					$(e.target).find("input").blur();
			})
			let input = $(`<input type="text" value=${element}></input>`)
				.on('input', e => {
					if ($(e.target).val().length == 0) {
						delete watchList.tags[element];
					}
					else{
						watchList.tags[e.target.value] = watchList.tags[element];
						delete watchList.tags[element];
					}
					manageFilters();
					watchList.updateLocalStorage();
				})
				
					
				
			let arrow = $(`<div class="d-flex align-items-center"><i class="fas fa-arrow-right my-0"></i>`);
			let deleteButton = $(
				`<div class="d-flex justify-content-center align-items-center btn"><i class="far fa-trash-alt my-0"></i></i></div>`
			).on('click', () => {
				watchListDom.removeTag(element);
				watchListDom.renderTags();
				manageFilters();
			});
			wrapper.append(arrow, input, deleteButton);
			manageFiltersWrapper.append(wrapper);
		});
	}
	$('#add-or-edit-container').append(manageFiltersWrapper);
}

//render the search inteface and perform the searches.
function addNewMenu(type) {
	let searchPlaceholder = `Enter a`;
	switch (type) {
		case 'person':
			searchPlaceholder += "n Actor's Name";
			break;
		case 'movie':
			searchPlaceholder += ' Movie';
			break;
		case 'tv':
			searchPlaceholder += ' TV show';
	}
	if (type == 'person') $('#add-or-edit-container').html('');
	let searchBox = $(`<div id="search-box" class="row d-flex mx-0 justify-content-center align-items-center"></div>`);
	let searchBar = $(`<input type="text" placeholder="${searchPlaceholder}"></input>`).on('keydown', e => {
		if (searchBar.val().length == 0) {
			$('#results').html(`
                            <div class="mt-5 text-center">
                                <h1><i class="fas fa-search"></i></h1>
                                <p>Please type above to search for media</p>
                            </div>`);
		}
		if (e.keyCode == 13) {
			//validation
			if (searchBar.val().length > 0){
				searches[type](searchBar.val(), 1);
				$(e.target).blur();
			}
			else{
				$("#search-box input").effect("shake");
			}
			
		}
	});
	let searchIcon = $(`<i class="fas fa-search ml-2 mr-4"></i>`);
	searchBox.append(searchIcon, searchBar);
	let results = $(`<div id="results" data-page='1'>
                        <div class="mt-5 text-center">
                        <h1><i class="fas fa-search"></i></h1>
                        <p>Please type above to search for media</p>
                        </div>
                    </div>`);
	$('#add-or-edit-container').append(searchBox, results);
}

function displayHelp() {
	$('#add-or-edit-container').html('');
	let helpMenu = $(`<div class="help-menu p-4"></div>`)
		.append(
		`<h3 class="heading text-center mb-4">Welcome to Watch List</h3>
		<p class="mb-2">
			Has anybody ever recommended a great Movie to you, and then when you sat down to watch it,
			you couldn't remember what it was called?
		</p>
		<p class="mb-2">
			Have you ever been mid-way through a show then taken a break and forgotten what episode you were on? 
		</p>
		<p class="mb-4">
			If you answered yes to any of these questions then WatchList is for you allows you to keep track of any Movie or
			TV recommendations that you have received. It uses The TMBD API to search for up-to-date information about media 
			that you want to remember.
        </p>
		<p class="heading mb-3"> 
			<strong>Getting Started:</strong> 
		</p>
        <ul>
            <li>search for specific using the <i class="fas fa-plus my-0"></i> icon</li>
            <li>Browse new and popular items by selecting one of the recommendations from the menu</li> 
        </ul>
		<p class="my-2">
			<small class="text-center">
				<strong>User History and Watch List are stored using your browsers local storage</strong>
			</small>
		</p>`
	);
	let okButton = $(`<button type="button" class="btn btn-default mx-auto">OK</button>`).on('click', () => {
		watchList.returningUser = true;
		watchList.updateLocalStorage();
		closePopUp();
	});
	let buttonWrapper = $(`<div class="d-flex justify-content-center mb-5"></div>`).append(okButton);
	$('#add-or-edit-container').append(helpMenu, buttonWrapper);
}

function resetData() {
	$('#add-or-edit-container').html(``);
	let resetMenu = $(`<div class="reset-menu p-2"></div>`).append(`
        <h3 class="heading text-center mb-4">Delete Everything?</h3>
		<p class="mb-1">
			Thank you for using WatchList, I hope you enjoyed your time here and I'm sorry that maybe things didn't 
			work out quite as well as you hoped
		</p>
		<p class="mb-3">
			Please be cautious, there is no going back from this point.
		</p>
		<p>
			By clicking the button below you will delete:
		</p>
        <ul class="mb-4">
        	<li>The current watchlist</li>
        	<li>All your custom tags and groups</li>
        	<li>All the details about your watch history</li>
        </ul>
        `);
	let deleteButton = $(`<button type="button" class="btn btn-danger my-3">Yes Please, delete all my data</button>`)
	.on('click',() => {
			watchListDom.resetAll();
			closePopUp();
	});
	let buttonWrapper = $(`<div class="d-flex justify-content-center"></div>`).append(deleteButton);
	resetMenu.append(buttonWrapper);
	$('#add-or-edit-container').append(resetMenu);
}
