/**Function for Cancelling Reservations */
const cancelReservation = (rid) => {
    //Call the deleteReserve endpooint with id
    fetch(`/deleteReserve?id=${rid}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (json.success) {
                //On success, alert the user of removal of reservation
                console.log("Reservation Successfully Removed");
                let email = document.getElementById('email');
                if (email.value != "") {
                    //Rerun check reservation to reload the list
                    checkReservation(email.value)
                } else {
                    alert("Missing Email");
                }
            } else {
                console.log("Something Went Wrong");
            }
        });
}
/** Function for Adding Reservations */
const addReservation = (r) => {
    //For 'r', create a card and populate it with the reservation information
    let container = document.getElementById('reservations-list');
    container.innerHTML += `
    <div class="card">
        <div class="card-body">
            <p>First Name: ${r.fname} -  Last Name: ${r.lname}</p>
            <p>Restaurant : ${r.resname}</p>
            <p>Date: ${r.reservationdate}</p>
            <button class="btn btn-lg btn-primary" onclick="cancelReservation(${r.id})">Delete Reservation</button>
        </div>
    </div>
    `;
}
/** Function for Updating Reservations */
const updateReservations = (reservations) => {
    //Check the reservations list
    let container = document.getElementById('reservations-list');
    container.innerHTML = ''
    //If there are no reservations for the user, alert the user
    if (reservations.length < 1) {
        alert('You have no reservations');
        return;
    }
    //for each reservation call the addReservation function to create a card
    reservations.forEach(r => {
        addReservation(r);
    });
}
/** Function for Checking Reservations */
const checkReservation = (email) => {
    //Call the checkReserve endpoint and pass it the email
    fetch(`/checkReserve?email=${email}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json)
            if (json.success) {
                //Update the reservations
                console.log(json.data);
                updateReservations(json.data)
            } else {
                console.log("Something Went Wrong");
            }
        })
}
//Establish the checkReserveButton
let checkReserveButton = document.getElementById('viewreserve');
checkReserveButton.addEventListener('click', () => {
    let email = document.getElementById('email');
    if (email.value != "") {
        //Call the Check Reservation function with the email entered into the email input field
        checkReservation(email.value)
    } else {
        alert("Missing Email");
    }
});