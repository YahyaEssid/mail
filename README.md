Mail

A single-page email client. Django handles accounts and the email API. JavaScript loads mailboxes, opens messages, and sends mail without full page reloads.

Features

Register, log in, and log out
Inbox, Sent, and Archived mailboxes
Compose and send email to other users on the site
Open an email to see sender, recipients, subject, timestamp, and body
Unread emails are gray; opened emails are marked read and shown white
Archive / unarchive from the email view
Reply: opens the compose form with the original sender, a Re: subject (not duplicated if it already starts with Re:), and a quoted body like On Jan 1 2020, 12:00 AM foo@example.com wrote:


Tech

Python / Django
JavaScript (fetch against the provided REST API)
HTML / CSS


How to run

cd mail
python manage.py migrate
python manage.py runserver
Open http://127.0.0.1:8000, create at least two accounts, then send mail between them.

Project layout

mail/views.py — login, register, and email API (/emails, /emails/<mailbox>, /emails/<id>)
mail/models.py — User and Email
mail/static/mail/inbox.js — mailbox list, email view, compose, archive, reply
mail/templates/mail/inbox.html — mailbox buttons and compose form
The backend API was provided with the assignment. Most of the client behavior lives in inbox.js.
