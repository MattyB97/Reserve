//Make Reservation Function
const makeReservation = (fname, lname, resname, email) => {
    //Calls the reserve endpoint with the required fields
    fetch(`/reserve?name=${fname}&lname=${lname}&resname=${resname}&email=${email}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (json.success) {
                //Alert the user that the data entry was a success
                console.log("Success!");
                alert("Reservation Successfully Made!");
            } else {
                console.log('Something went wrong!');
            }
        });
}
//Establish the reserveButton
let reserveButton = document.getElementById('reserve');
reserveButton.addEventListener('click', () => {
    //Get required information from the input fields
    let fname = document.getElementById('fname');
    let lname = document.getElementById('lname');
    let resname = document.getElementById('resname');
    let email = document.getElementById('email');
    //Check if all fields are not empty
    if (name.value != "" && lname.value != "" && resname != "" && email.value != "") {
        //Call the make reservation function
        makeReservation(fname.value, lname.value, resname.value, email.value)
    } else {
        alert("Missing Parameters");
    }
});
