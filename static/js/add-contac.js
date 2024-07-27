setTimeout(function() {
    document.getElementById('spinner-container').style.display = 'none';
}, 1000);
let back_but = document.querySelector(".back_list");
document.addEventListener('DOMContentLoaded', function() {
    let addSubmit = document.querySelector(".adding-button");
    let addname = document.querySelector(".add-name");
    let addmail = document.querySelector(".add-mail");
    let addphone = document.querySelector(".add-phone");

    const iti = window.intlTelInput(addphone, {
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            fetch('https://ipinfo.io/json', { headers: { 'Accept': 'application/json' } })
                .then(response => response.json())
                .then(data => callback(data.country))
                .catch(() => callback('us'));
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
    });
    const form = document.querySelector('.form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        const name = addname.value.trim();
        const email = addmail.value.trim();
        const phone = iti.getNumber().replace(/\s+/g, ''); // Get the formatted phone number without spaces
        // Check for empty fields
        if (!name || !email || !phone) {
            Swal.fire({
                title: 'Error!',
                text: 'All fields are required.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            return;
        }
        // Validate name
        let regAddname = /^[a-zA-Z]+\s[a-zA-Z]+$/;
        let valueaddname = addname.value.trim();
        let checkname = regAddname.test(valueaddname);

        // Validate email
        let regAddmail = /^\w+@(gmail|outlook)\.(com|net)$/i;
        let valueaddmail = addmail.value.trim();
        let checkmail = regAddmail.test(valueaddmail);

        // Validate phone using intl-tel-input library
        let checkphone = iti.isValidNumber();

        if(checkname && checkmail &&checkphone ) {
            fetch('/det')
            .then(response => response.json())
            .then(details => {
                const contactExists = details.find(detail => detail.email === email && detail.phone_number === phone);
                if (contactExists) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Contact already exists.',
                        icon: 'error',
                        confirmButtonText: 'Try Again'
                    });
                } else {
                    // Add the contact if it does not exist
                    fetch('/add-contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({
                            name: name,
                            email: email,
                            phone_number: phone,
                            user_id:window.localStorage.getItem('user_id') // Get user ID from local storage

                        })
                    })
                    .then(response => {
                        if (response.redirected) {
                            window.location.href = response.url;
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                    Swal.fire({
                        title: 'Success!',
                        text: 'Contact added successfully. 😊',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching contact data:', error);
            });
        } else {
            Swal.fire({
                title: 'Error 🙄',
                text: 'Invalied Input',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }           
    });
});
