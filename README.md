how to run:
1) Install Project Dependencies: run command "npm install"
2) Build the Angular Project: run command "ng serve"
3) Run JSON Server: run command  "json-server --watch db.json"

how to test:
1)
Navigate to the Edit Profile Page: Open the /edit-profile route in the browser to view the form.
Form Fields: Check if the following fields are present:
First Name (text)
Last Name (text)
Email (email)
Phone Number (optional, text)
Profile Picture (optional, file upload)
Form Buttons: Ensure there are "Save" and "Cancel" buttons available
2)
Required Fields: Leave the First Name, Last Name, and Email fields blank and try submitting the form. Check for validation error messages.
Valid Email Format: Enter an invalid email (e.g., "user@example") and attempt submission. Ensure an error message is shown for an invalid email format.
Phone Number Validation: Try entering non-numeric characters in the Phone Number field and check if the form handles it correctly.
3)
  Update form values. remove,add or change profile picture, click update and check if the user form is updated.
