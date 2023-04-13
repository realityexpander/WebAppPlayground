import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

// Password Reset Page
// If no "passwordResetToken" is provided, then the user is prompted to enter their email address.
// If a "passwordResetToken" is provided, then the user is prompted to enter a new password.

class ResetPassword extends LitElement {

  static get properties() {
    return {
      passwordResetToken: { type: String },
      isPasswordVisible: { type: Boolean }
    }
  }

  // only needed for attributes, and only for non-page components.
  // static get observedAttributes() {
  //   return ['isPasswordVisible']; 
  // }

  //static styles = styles;

  constructor() {
    super();
    this.passwordResetToken = null;
    this.isPasswordVisible = false;
  }

  // only needed for attributes, and only for non-page components.
  // get isPasswordVisible() {
  //   return this.getAttribute('isPasswordVisible');
  // }
  // set isPasswordVisible(value) {
  //   this._isPasswordVisible = value;
  //   this.render();
  // }

  render() {
    // If provided, the properties for type and day are taking from the path.

    let sendPasswordResetEmailPageHtml = html`
      <style>
        ${styles}      
      </style>
      <div class="wrapper">
        <h1>Reset Password By Email</h1>
        <p>Please enter the email address that was associated with your account.</p>
        <br>
        <p>You should receive an email within 10 minutes. It will contain a link to reset your password .</p>
        <br>
        <br>
        <div class="mdc-text-field mdc-text-field--outlined" style="width: 40%;">
          <div class="mdc-notched-outline">
            <div class="mdc-notched-outline__leading"></div>
            <div class="mdc-notched-outline__notch" >
              <label for="my-text-field" class="mdc-floating-label" id="my-label-id">Email Address</label>
            </div>
            <div class="mdc-notched-outline__trailing"></div>
          </div>
          <input 
            type="email" 
            class="mdc-text-field__input" id="input-text-email-address" aria-labelledby="my-label-id" required minlength="8"
          >
        </div>
        <br>
        <br>
        <button @click=${() => this.sendPasswordResetEmail()} id="btn-send-reset-password-email" class="mdc-button mdc-button--raised">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Send Password Reset Email</span>
        </button>
      </div>
    `;

    let enterNewPasswordPageHtml = html`
      <style>
        ${styles}      
      </style>
      <div class="wrapper">
        <h1>Reset Password</h1>
        <p>Please choose a new password.</p>
        <br>
        <br>

        <p>PasswordResetToken: ${this.passwordResetToken}</p>
        <br>
        <br>
        <div class="mdc-text-field mdc-text-field--outlined" style="width: 40%;">
          <div class="mdc-notched-outline">
            <div class="mdc-notched-outline__leading"></div>
            <div class="mdc-notched-outline__notch" >
              <label for="my-text-field" class="mdc-floating-label" id="my-label-id">New Password</label>
            </div>
            <div class="mdc-notched-outline__trailing"></div>
          </div>
          <input 
            type="${this.isPasswordVisible ? 'text' : 'password'}" 
            class="mdc-text-field__input" id="text-new-password" aria-labelledby="my-label-id" required minlength="8"
          >
          <i @click="${() => this.togglePasswordVisibility()}" 
            class="mdc-itext-field-icon material-icons mdc-text-field__icon mdc-text-field__icon--trailing" 
            tabindex="100" 
            role="button">
              ${this.isPasswordVisible ? 'visibility_off' : 'visibility'}
          </i>
        </div>
        <br>
        <br>

        <div class="mdc-text-field mdc-text-field--outlined" style="width: 40%;">
          <span class="mdc-notched-outline">
            <span class="mdc-notched-outline__leading"></span>
            <span class="mdc-notched-outline__notch">
              <label class="mdc-floating-label" id="my-label-id">Confirm Password</label>
            </span>
            <span class="mdc-notched-outline__trailing"></span>
          </span>
          <input 
            type="${this.isPasswordVisible ? 'text' : 'password'}"
            class="mdc-text-field__input" id="text-confirm-password" aria-labelledby="my-label-id" required minlength="8"
          >
          <i @click="${() => this.togglePasswordVisibility()}" 
            class="mdc-itext-field-icon material-icons mdc-text-field__icon mdc-text-field__icon--trailing" 
            tabindex="100" 
            role="button">
              ${this.isPasswordVisible ? 'visibility_off' : 'visibility'}
          </i>
        </div>
        <br>
        <br>
        <h5>
          Password format: 8 characters minimum, 1 uppercase letter, 1 lowercase letter, 1 number 
          <p>1 special character: (!@#$%^&*()_+\-=\[\]{};':"|,.\/?)</p>
        </h5>
        <br>

        <br><br>

        <button @click=${() => this.resetPassword()} id="btn-reset-password" class="mdc-button mdc-button--raised">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Reset Password</span>
        </button>
      </div>`;


    if (this.passwordResetToken === undefined)
      return sendPasswordResetEmailPageHtml;
    else
      return enterNewPasswordPageHtml;
  }

  firstUpdated() {
    this.setupListeners();
  }

  setupListeners() {
    // add ripple effect to buttons
    const buttons = this.shadowRoot.querySelectorAll('.mdc-button');
    for (let i = 0, button; button = buttons[i]; i++) {
      mdc.ripple.MDCRipple.attachTo(button);
    }

    // add ripple effect to text fields
    const textFields = this.shadowRoot.querySelectorAll('.mdc-text-field');
    for (let i = 0, textField; textField = textFields[i]; i++) {
      mdc.textField.MDCTextField.attachTo(textField);
    }

    // setup all icons
    const icons = this.shadowRoot.querySelectorAll('.mdc-itext-field-icon');
    for (let i = 0, icon; icon = icons[i]; i++) {
      mdc.ripple.MDCRipple.attachTo(icon);
      mdc.textField.MDCTextFieldIcon.attachTo(icon);
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  sendPasswordResetEmail() {
    // get email address
    const emailAddress = this.shadowRoot.getElementById('input-text-email-address').value;

    // Check if blank
    if (emailAddress === "") {
      alert("Please enter an email address.");
      return;
    }

    // Check if email address is valid
    if (!emailAddress.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    // Send Password Reset Email
    const url = `${window.location.origin}/api/send-password-reset-email?emailAddress=${emailAddress}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        // Get the error Body (JSON)
        if (!response.ok) return response.json().then(data => { throw new Error(response.statusText + ":" + data.error) })

        return response.json()
      }).then(data => {
        if (data.success) {
          alert("Password reset email sent. Check your email.");
          window.location.href = "/login";
        } else {
          alert("Error sending password reset email. Please try again.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert("Error sending password reset email. Please try again. " + error);
      });
  }

  resetPassword() {
    // get new password
    const newPassword = this.shadowRoot.getElementById('text-new-password').value;
    const confirmPassword = this.shadowRoot.getElementById('text-confirm-password').value;

    // Check if blank
    if (newPassword === "" || confirmPassword === "") {
      alert("Please enter a password & confirm password.");
      return;
    }

    // Check if password is at least 8 characters
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      // Show error message
      alert("Passwords do not match");
      return;
    }

    // Confirm Reset Password with an option dialog
    if (window.confirm("Are you sure you want to reset your password?")) {
      const url = `${window.location.origin}/api/reset-password`;
      const data = {
        passwordResetToken: this.passwordResetToken,
        newPassword: newPassword
      };

      // Make sure the field visibility is set to hidden
      this.isPasswordVisible = false;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => {
          // Get the error Body (JSON)
          if (!res.ok) return res.json().then(data => { throw new Error(res.statusText + ":" + data.error) })

          return res.json()
        }).then(data => {
          if (data.success) {
            // Show success message
            alert("Password reset successful. Please login with your new password.");

            // Redirect to login page
            window.location.href = "/login";

          } else {
            // Show error message
            alert(`Password reset failed.Please try again.`);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(`Password reset failed.Please try again.${error} `);
        });

    }
  }

}
customElements.define('page-reset-password', ResetPassword);