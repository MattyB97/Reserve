const cancelReservation = (rid) => {
    fetch(`/deleteReserve?id=${rid}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (json.success) {
                console.log("Reservation Successfully Removed");
                let email = document.getElementById('email');
                if (email.value != "") {
                    checkReservation(email.value)
                } else {
                    alert("Missing Email");
                }
            } else {
                console.log("Something Went Wrong");
            }
        });
}

const addReservation = (r) => {
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

const updateReservations = (reservations) => {
    let container = document.getElementById('reservations-list');
    container.innerHTML = ''
    if (reservations.length < 1) {
        alert('You aint comin.');
        return;
    }
    reservations.forEach(r => {
        addReservation(r);
    });
}

const checkReservation = (email) => {
    fetch(`/checkReserve?email=${email}`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json)
            if (json.success) {
                console.log(json.data);
                updateReservations(json.data)
            } else {
                console.log("Something Went Wrong");
            }
        })
}
let checkReserveButton = document.getElementById('viewreserve');
checkReserveButton.addEventListener('click', () => {
    let email = document.getElementById('email');
    if (email.value != "") {
        checkReservation(email.value)
    } else {
        alert("Missing Email");
    }
});