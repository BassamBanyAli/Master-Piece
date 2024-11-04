
/* global tus */
/* eslint-disable no-console, no-alert */

'use strict'

let upload          = null
let uploadIsRunning = false
const toggleBtn       = document.querySelector('#toggle-btn')
const but_submit       = document.querySelector('#but_submit')
const input           = document.querySelector('input[type=file]')
const progress        = document.querySelector('.progress')
const progressBar     = progress.querySelector('.bar')
const alertBox        = document.querySelector('#support-alert')
const uploadList      = document.querySelector('#upload-list')
const parallelInput   = 1
const endpointInput   = document.querySelector('#endpoint')

function reset () {
  input.value = ''
  upload = null
  uploadIsRunning = false
}

function askToResumeUpload (previousUploads, currentUpload) {
  if (previousUploads.length === 0) return

  let text = 'You tried to upload this file previously at these times:\n\n'
  previousUploads.forEach((previousUpload, index) => {
    text += `[${index}] ${previousUpload.creationTime}\n`
  })
  text += '\nEnter the corresponding number to resume an upload or press Cancel to start a new upload'

  const answer = prompt(text)
  const index = parseInt(answer, 10)

  if (!Number.isNaN(index) && previousUploads[index]) {
    currentUpload.resumeFromPreviousUpload(previousUploads[index])
  }
}

function startUpload () {
  const file = input.files[0]
  console.log(file)
  // Only continue if a file has actually been selected.
  // IE will trigger a change event even if we reset the input element
  // using reset() and we do not want to blow up later.
  if (!file) {
    return
  }

  const endpoint = endpointInput.value
  let chunkSize = parseInt((file.size/4), 10)
  if (Number.isNaN(chunkSize)) {
    chunkSize = Infinity
  }

  let parallelUploads = parseInt(parallelInput.value, 10)
  if (Number.isNaN(parallelUploads)) {
    parallelUploads = 1
  }


  const options = {
    uploadUrl:endpoint,
    chunkSize,
    retryDelays: [0, 1000, 3000, 5000],
    parallelUploads,
    metadata   : {
      filename: file.name,
      filetype: file.type,
    },
    onError (error) {
      if (error.originalRequest) {
        if (window.confirm(`Failed because: ${error}\nDo you want to retry?`)) {
          upload.start()
          uploadIsRunning = true
          return
        }
      } else {
        window.alert(`Failed because: ${error}`)
      }

      reset()
    },
    onProgress (bytesUploaded, bytesTotal) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
      progressBar.style.width = `${percentage}%`
      console.log(bytesUploaded, bytesTotal, `${percentage}%`)
    },
    onSuccess () {
      const anchor = document.createElement('a')
      anchor.textContent = `Download ${upload.file.name} (${upload.file.size} bytes)`
      anchor.href = upload.url
localStorage.setItem("upload",upload.url);
const fileIdentifier = vimeoUrl.split('/').pop();

// Save the file identifier in local storage
localStorage.setItem('vimeoFileId', fileIdentifier);
      anchor.className = 'btn btn-success'
    //   uploadList.appendChild(anchor)
        //  document.getElementsByTagName("form")[0].submit();
      alert('Upload successfully');

      reset()
    },
  }

  upload = new tus.Upload(file, options)
  upload.findPreviousUploads().then((previousUploads) => {
    askToResumeUpload(previousUploads, upload)

    upload.start()
    uploadIsRunning = true
  })

}

if (!tus.isSupported) {
  alertBox.classList.remove('hidden')
}

if (!toggleBtn) {
//   throw new Error('Toggle button not found on this page. Aborting upload-demo. ')
}

// toggleBtn.addEventListener('click', (e) => {
//   e.preventDefault()
//       upload.start()
// })

endpointInput.addEventListener('change', startUpload)