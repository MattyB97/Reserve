const makeReservation = (fname, lname, resname, email) => {
    fetch(`/reserve?name=${fname}&lname=${lname}&resname=${resname}&email=${email}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (json.success) {
                console.log("Success!");
                alert("Reservation Successfully Made!");
            } else {
                console.log('Something went wrong!');
            }
        });
}

let reserveButton = document.getElementById('reserve');
reserveButton.addEventListener('click', () => {
    let fname = document.getElementById('fname');
    let lname = document.getElementById('lname');
    let resname = document.getElementById('resname');
    let email = document.getElementById('email');
    if (name.value != "" && lname.value != "" && resname != "" && email.value != "") {
        makeReservation(fname.value, lname.value, resname.value, email.value)
    } else {
        alert("Missing Parameters");
    }
});
