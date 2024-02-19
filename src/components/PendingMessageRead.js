import React from 'react'

function PendingMessageRead() {
  return (
    <div className='space-y-4 p-4 max-w-md mx-auto'>
      <h2>Your Loved One Hasn't Read Your Message Yet!</h2>
      <p>
        To send a second message, you must wait until the first message is read. You will see the form again when sending a second message is available.
      </p>
    </div>
  )
}

export default PendingMessageRead
