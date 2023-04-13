import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

// Source: 
// Steve Griffith - Prof3ssorSt3v3
// VIdeo: https://www.youtube.com/watch?v=7fybEXre70o
// https://gist.github.com/prof3ssorSt3v3/1ba5a0f01e5cb45d0d2f81b17036bc27
// https://gist.github.com/prof3ssorSt3v3/da1e00072c995cf657a33fef3ad63b74

import { endpointConfig } from './globalProp.js';

class Files extends LitElement {

  static get properties() {
    return {
      category: { type: String },
      someOtherGlobalProp: { type: String },
      files: { type: Array }
    }
  }

  static styles = styles;

  constructor() {
    super();
    this.category = '';
    this.someOtherGlobalProp = '';
  }

  firstUpdated() {
    this.shadowRoot.getElementById('inputFile').addEventListener('change', this.filesPicked.bind(this));

    this.shadowRoot.getElementById('btnToggle').addEventListener('click', this.toggleInput.bind(this));
    this.shadowRoot.getElementById('btnPick').addEventListener('click', this.askForFiles.bind(this));
    this.shadowRoot.getElementById('btnInfo').addEventListener('click', this.showFileInfo.bind(this));

    this.shadowRoot.getElementById('btnUpload').addEventListener('click', this.uploadFilesToServer.bind(this));

    //this.loadAllIncludeTags();
    this.updateUploadedFilesList();

    this.shadowRoot.getElementById('btnDownloadFile').addEventListener('click', this.createBlob.bind(this));
  }

  updateUploadedFilesList() {
    const fileListEl = this.shadowRoot.getElementById('uploadedFiles');

    fetch(endpointConfig.getDatabaseUrl() + '/uploads')
      .then(res => res.json())
      .then(data => {
        if (!data) throw new Error('No data');

        fileListEl.innerHTML = '';
        data.forEach(file => {
          fileListEl.insertAdjacentHTML('beforeend', `<li><a href="${file.link}" target="_blank">${file.name}</a></li>`);
        });
      })
      .catch(e => {
        console.log(e);
        fileListEl.innerHTML = `<p>ERROR: ${e}</p>`;
      });
  }


  // Replace the "include" tags with the fetched reults of the 'src' url on the tag
  loadAllIncludeTags() {
    const includes = this.shadowRoot.querySelectorAll('include');
    Array.from(includes).forEach(i => {
      let filePath = i.getAttribute('src');
      i.innerHTML = `<p>Loading ${filePath}...</p>`;
      fetch(filePath)
        .then(file =>
          file.text()
        )
        .then(content => {
          i.insertAdjacentHTML('afterend', content);
          i.remove();
        })
        .catch(e => {
          console.log(e);
          i.innerHTML = `<p>ERROR: ${e}</p>`;
          //i.insertAdjacentHTML('afterend', `<p>ERROR: ${e}</p>`); // show cumulative errors
        });
    });
  }

  // Called any time one or more files are picked in the file picker dialog
  filesPicked(ev) {
    let input = ev.target;
    let files = input.files;
    console.log({ files });
    if (files.length > 0) {
      this.showFileInfo(ev);
    }
  }

  toggleInput(ev) {
    //hide or show the <input type="file">
    ev.preventDefault();
    let control = this.shadowRoot.getElementById('inputFile').parentElement;
    //we want to apply this class to the parent
    control.classList.toggle('hidden');
  }

  askForFiles(ev) {
    //open the file picker dialog
    ev.preventDefault();
    let control = this.shadowRoot.getElementById('inputFile');
    control.click();
  }


  uploadFilesToServer(ev) {
    ev.preventDefault();
    let files = this.shadowRoot.getElementById('inputFile').files;
    let fileCount = files.length;
    if (fileCount > 0) {
      // let url = 'http://localhost:3000/upload'; // node server
      let url = "/api/upload-image" // ktor server
      // let h = new Headers();
      // h.append('content-type', files[0].type); // must be added manually for a single file
      // h.append('content-length', files[0].size); // must be added manually for a single file
      //  "Content-disposition": "Multipart/Form-Data;boundary=--asdlkasjdflksdjflkds" // automatically added by browser when using FormData
      let fd = new FormData();
      fd.append('name', 'Steve'); // add a field to the form dataå
      for (let i = 0, len = files.length; i < len; i++) {
        fd.append(`files-${i}`, files[i], files[i].name);
      }
      let request = new Request(url, {
        //body: files[0], // uploads a single file, requires use of manual added headers
        body: fd, // changes encoding to multipart/form-data
        // headers: h,
        // credentials: 'include',

        // Note: "mode: 'no-cors'" is not needed if the server is setup to allow CORS. 
        // If using "mode: 'no-cors'", the response will be opaque and the `response.ok` will be false 
        // but the `response.status` will be 200. The response will not be able to be parsed as JSON.
        // The request will still be sent to the server, but the response will not be returned to the client.
        // mode: 'no-cors', 
        method: 'POST',
      });

      fetch(request)
        .then((response) => {
          console.log(response.status, response.statusText);
          this.addMessageToOutput('info', `response.ok=${response.ok}, 
            status=${response.status}:${response.statusText}
          `.trim());

          // intercept for CORS invalid response
          if (!response.ok) {
            throw new Error(`Check CORS configuration. response.ok=${response.ok}, status=${response.status}:${response.statusText}`);
            return {};
          }

          return response.json();
        })
        .then(json => {
          console.log(json);
          // response: {
          //   "todo": {
          //      "id": String,
          //      "name": String,
          //      "status": "pending" | "complete",
          //      "user": { 
          //         "name": String
          //         "files": [url, url, url]
          //      },
          //   },
          //   "uploadedFiles": [url, url, url],
          // }

          this.addMessageToOutput('success', JSON.stringify(json));
          this.updateUploadedFilesList();
        }).catch((e) => {
          console.warn(e);
          this.addMessageToOutput('error', e.message);
        });

    }
  }

  addMessageToOutput(type, message) {
    let output = this.shadowRoot.getElementById('output');
    let li = document.createElement('li');

    if (type == undefined) type = 'info';
    li.classList.add(type);
    li.innerHTML = type + ": " + message;
    output.appendChild(li);
  }

  showFileInfo(ev) {
    if (ev.type == 'click') ev.preventDefault();
    //loop through all the files in the filelist
    //and display the name, size, type, and lastModified date
    let files = this.shadowRoot.getElementById('inputFile').files;
    let output = this.shadowRoot.getElementById('output');
    output.innerHTML = '';
    let len = files.length;
    for (let i = 0; i < len; i++) {
      console.group();
      console.log(files[i].name);
      console.log(files[i].size);
      console.log(files[i].type);
      console.log(files[i].lastModified);
      console.groupEnd();

      let li = document.createElement('li');
      li.innerHTML = `
        <p><strong>${files[i].name}</strong></p>
        <p>Size: ${files[i].size}</p>
        <p>Type: ${files[i].type}</p>
        <p>Last Modified: ${files[i].lastModified}</p>
      `;
      output.appendChild(li);
    }
  }


  /*
  new Blob([ data ], {type:"text/plain", endings: "transparent"||"native"})
  new File([ data ], filename, {type:"text/plain", lastModified: Date.now()})
  (data - Blob, ArrayBuffer, TypedArray, DataView, String (utf-8 string), a mixture)
  File is a sub-class of Blob. Can often be used interchangeably. 
  Once you have a Blob/File then you can use it:
  - upload via fetch as a file or stream
  - save it in the cache
  - add a link in a webpage to the file
  - display it as an image (if image)
  - read the text contents (json, txt, html...) and:
    - display on page
    - parse the html, xml, json, etc
    - save in localStorage or cookie
  ArrayBuffer - raw data as a fixed-length string of bytes. It is NOT an Array.
  DataView - an interpretation of some raw bytes expressed as 8-bit, 16-bit, 32-bit,
    or 64-bit integers. Used to add or edit data in an ArrayBuffer. Like a wrapper 
    for ArrayBuffers if you need to edit them. It is a View of the Data from the ArrayBuffer
  TypedArray - It is an Array-like view of raw bytes stored as 
    8-bit, 16-bit, 32-bit or 64-bit  integers, clamped integers, 
    signed and unsigned integers, or floats. 
  */

  createBlob(ev) {
    ev.preventDefault();
    let ab = new ArrayBuffer(2); //2 bytes / 1 byte = 8 bits 0 - 255
    let dataview = new DataView(ab);
    dataview.setInt8(0, 104); //h
    dataview.setInt8(1, 105); //i
    console.log(new Uint8Array(ab).toString());

    let b = new Blob([ab]);
    console.log(b);

    let f = new File([ab], 'myinfo.txt', { type: 'text/plain' });
    console.log(f);

    let url = URL.createObjectURL(f);
    let a = document.createElement('a');
    a.href = url;
    a.download = f.name;
    a.textContent = `Download ${f.name}`;
    this.shadowRoot.querySelector('#uploadedFiles').append(a);
  }

  render() {
    // If provided, the properties for type and day are taking from the path.
    return html`
    <style>
        * {
          box-sizing: border-box;
          font: inherit;
        }
        html {
          font-size: 20px;
          font-family: sans-serif;
          margin: 0;
        }
        body {
          margin: 0;
        }
        header {
          padding: 1rem 3rem;
          background-color: coral;
          color: white;
          border-bottom: 1px solid #000;
        }
        :is(main, footer) {
          padding: 1rem 3rem;
        }
        header h1 {
          font-size: 2rem;
        }
        form {
          padding: 0 4rem;
        }
        .hidden {
          opacity: 0;
          height: 0;
          line-height: 0;
          overflow: hidden;
          padding: 0;
          margin: 0;
        }
        footer img {
          width: 300px;
        }
    </style>
    <div class="wrapper">
      <main>
        <h2>Gather Your Files</h2>
        <form name="myform" id="myform" action="#">
          <p>
            <label>Pick Files</label>
            <input type="file" id="inputFile" multiple
              accept=".png,.jpg,.gif,.webp,image/jpeg,image/gif,image/webp,image/png" />
          </p>
          <!-- 
              text/html,.html,text/xml,.xml
              text/css,.css
              application/json,.json,text/json
              image/*,.png,.jpg,.gif,.webp,image/jpeg,image/gif,image/webp,image/png  
            -->
          <p><button id="btnToggle">Toogle File Input</button></p>
          <p><button id="btnPick">Pick Files</button></p>
        </form>

        <p><button id="btnInfo">Show File Info</button></p>
        <p><button id="btnUpload">Upload Files</button></p>
        <p><button id="btnDownloadFile">Download File</button></p>
        <br>
        <br>
        <p>Uploaded files:</p>
        <ul id="uploadedFiles"></ul>
        
        <!-- <include src="http://localhost:3000/uploads">Loading...</include> -->
        <br>
        <br>
        <p> Output log:</p>
        <ul id="output"></ul>
      </main>
    </div>
      `
  }

}
customElements.define('page-files', Files);