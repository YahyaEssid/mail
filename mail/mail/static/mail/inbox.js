document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-read-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Add event listener to the form submission
  document.querySelector('#compose-form').onsubmit = function(event) {
    // Get the values form each field
    event.preventDefault();
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector("#compose-subject").value;
    const body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
      .then(response => response.json())
      .then(result => {
        //print result 
        console.log(result)
      })
      load_mailbox("inbox")
    }
  }

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-read-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  const emails_box= document.createElement("div")
  emails_box.id = "emails-box";
  document.querySelector('#emails-view').appendChild(emails_box);
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    emails.forEach(email => {
        const div = document.createElement("div");
        div.classList.add("email");
        div.innerHTML = `
        <div class="header">
        <h3>${email.subject}</h3>
        <time>${email.timestamp}</time>
        </div>
        <div class="header">
        <strong>${email.sender}</strong>
        </div>`
        if (email.read == false){
          div.style.backgroundColor = "lightgray"
        }
        else{
          div.style.background = "white";
        }
        div.addEventListener('click', function(){ 
          load_email(email.id);
          fetch(`/emails/${email.id}`,{
            method:'PUT',
            body: JSON.stringify({
              read : true
            })
          })
          console.log('this email has been clicked');
        })
        document.getElementById("emails-box").append(div)
    })
    })
    }

    //show the selected email
function load_email(id){
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector('#email-read-view').style.display = 'block';
    document.querySelector('#email-read-view').innerHTML = '';
    fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const email = document.createElement('div');
      email.innerHTML = `<div class='header' >
      <h2>${data.subject}</h2>
      <time>${data.timestamp}</time>
      </div>
      sender : <strong>${data.sender}</strong>
      <br>
      recipients : ${data.recipients}
      <hr>
      <div>
      <p>${data.body}</p>
      <button id="archive"></button>
      </div>`
      document.getElementById("email-read-view").append(email);
      archivedButton = document.querySelector("#archive")
      if (data.archived){
        archivedButton.textContent = "unarchive"
      }
      else{
        archivedButton.textContent = "archive"
      }
      archivedButton.addEventListener("click", () => {
          archived = data.archived
          fetch(`/emails/${data.id}`,{
            method: 'PUT',
            body : JSON.stringify({
              archived : !archived
            })
          }).then(()=> load_email(data.id)
        )
          
      })
    })

    }

      