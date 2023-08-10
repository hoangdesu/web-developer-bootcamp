import React from 'react'
import axios from 'axios'

const Testing = () => {
  return (
    <div>
        <form action="/upload" method="post" encType='multipart/form-data'>
            <input type="file" />
            <button>Upload</button>
        </form>
    </div>
  )
}

export default Testing