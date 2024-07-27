setTimeout(function() {
    document.getElementById('spinner-container').style.display = 'none';
}, 1000);

// Function to add animation on icon hover
document.addEventListener('mouseover', function (e) {
    if (e.target.classList.contains("fa-trash")) {
        e.target.classList.add("fa-bounce");
        e.target.addEventListener('mouseleave', function () {
            e.target.classList.remove("fa-bounce");
        });
    }
    if (e.target.classList.contains("fa-eye")) {
        e.target.classList.add("fa-beat");
        e.target.addEventListener('mouseleave', function () {
            e.target.classList.remove("fa-beat");
        });
    }
    if (e.target.classList.contains("fa-arrows-spin")) {
        e.target.classList.add("fa-spin");
        e.target.addEventListener('mouseleave', function () {
            e.target.classList.remove("fa-spin");
        });
    }
});

let addbut = document.querySelector('.add-button');
if (addbut != null) {
    addbut.onclick = function () {
        window.location.pathname = '/add-contact';
    }
}

let contactdiv = document.querySelector('.contact');
let detailsdiv = document.querySelector('.contact-detalis');
var theId = 0;
if(window.location.pathname == '/contact-list') {
document.addEventListener('DOMContentLoaded', () => {
    fetch('/det')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let box_con = document.querySelector(".box-con");
            data.forEach(contact => {
                if(contact.user_id === parseInt(window.localStorage.getItem("user_id")) ) {
                    // Clone icons
                let delIcon = document.querySelector('.fa-trash').cloneNode(true);
                let viewIcon = document.querySelector('.fa-eye').cloneNode(true);
                let updateIcon = document.querySelector('.fa-arrows-spin').cloneNode(true);

                // Create contact elements
                let newcontact = document.createElement("div");
                let namecontact = document.createElement("div");
                let buttons = document.createElement("div");

                // Set innerHTML and classes
                namecontact.innerHTML = contact.name;
                buttons.classList.add("buttons");
                newcontact.classList.add("box");
                namecontact.classList.add("name");
                delIcon.classList.add("remove");
                viewIcon.classList.add("view-list");
                updateIcon.classList.add("update-list");

                // Append elements
                buttons.appendChild(delIcon);
                buttons.appendChild(viewIcon);
                buttons.appendChild(updateIcon);
                newcontact.appendChild(namecontact);
                newcontact.appendChild(buttons);
                box_con.appendChild(newcontact);

                // Add event listener to delete icon
                delIcon.addEventListener('click', () => {
                    fetch(`/delete-contact/${contact.id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (response.ok) {
                            newcontact.remove(); // Remove the contact element from the DOM
                        } else {
                            console.error('Failed to delete contact');
                        }
                    })
                });
                updateIcon.addEventListener('click', function () {
                    theId = contact.id;
                    window.localStorage.setItem("id",`${theId}`);
                    window.location.href = '/view'
                })
                }
                
                
                if (contactdiv != null && detailsdiv != null) {
                    contactdiv.style.minHeight = `${detailsdiv.offsetHeight + 200}px`;
                }
            });







        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
        });

});
}



if(window.location.pathname == '/view') {

    const editToggle = document.getElementById('editToggle');
    const saveButton = document.getElementById('saveButton');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone');
    const contactForm = document.getElementById('contactForm');
    let isEditing = false; 
    theId = window.localStorage.getItem("id");
    const contactId = theId; 
    if (contactId) {
        fetch(`/det`)
            .then(response => response.json())
            .then(data => {
                data.forEach(contact=> {
                    if(contact.id == contactId) {
                contactName.value = contact.name;
                contactEmail.value = contact.email;
                contactPhone.value = contact.phone_number;
                }
                })
                
            })
            .catch(error => console.error('Error fetching contact details:', error));
    }

    // Toggle edit mode
    editToggle.addEventListener('click', () => {
        let span = document.querySelector(".circle")
        isEditing = !isEditing;
        contactName.readOnly = !isEditing;
        contactEmail.readOnly = !isEditing;
        contactPhone.readOnly = !isEditing;
        saveButton.style.display = isEditing ? 'inline' : 'none';
        editToggle.classList.toggle("clicked");
        span.classList.toggle("move");
    });


    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const formData = new FormData(contactForm);

        fetch(`/update-contact/${contactId}`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Contact updated successfully') {
                alert('Contact updated successfully');
                editToggle.click();
            } else {
                console.error('Failed to update contact:', data.message);
                alert('Failed to update contact');
            }
        })
        .catch(error => console.error('Error updating contact:', error));
    });
}
