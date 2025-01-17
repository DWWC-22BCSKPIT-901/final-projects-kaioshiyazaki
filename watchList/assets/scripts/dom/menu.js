/***********************MENU*************************/
//Animates the add new items quick dropdown menu, and attached event listeners.


//init start state of add menu
let addMenuVis = false;

//iteratively assign event listeners to the popup menu
["movie", "tv", "person"].forEach((element) => {
    $(`#${element}`).on("click", () => {
        makePopUp(`${element}`);
        $(`#${element}`).blur();
    })
})


//animate drop down
$(document).on("click", (e) => {
    if ($(e.target).closest('div[id]').attr("id") == "add") {
        let startPos = 60;
        ["movie", "tv", "person"].forEach((element) => {
            $(`#${element}`).animate({
                display: 'toggle',
                top: startPos,
                "z-index": 4
            }, 500, () => {
                $(`#${element}`).show();
                addMenuVis = true;
            });
            startPos += 50;
        })
    } else {
        if (addMenuVis) {
            ["movie", "tv", "person"].forEach((element) => {
                $(`#${element}`).animate({
                    display: "toggle",
                    top: 7,
                    "z-index": -1
                }, 500, () => {
                    $(`#${element}`).hide();
                    addMenuVis = false;
                });
            })
        }
    }

});

