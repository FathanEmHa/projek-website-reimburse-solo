import React from 'react'
import { BouncyArc } from 'ldrs/react'
import 'ldrs/react/BouncyArc.css'
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

// Default values shown
<Bouncy
  size="45"
  speed="1.75"
  color="white" 
/>

function LoadingBouncyArc({
  size = 70,
  speed = 1.65,
  color = 'white',
  text = 'Loading...',
  fullscreen = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullscreen ? 'min-h-screen' : 'py-6'
      }`}
    >
      <BouncyArc size={size} speed={speed} color={color} />
      {text && (
        <p className="mt-3 text-sm text-gray-600 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

function LoadingBouncy({
    size = 70,
    speed = 1.65,
    color = 'white',
    text = 'Loading...',
    fullscreen = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullscreen ? 'min-h-screen' : 'py-6'
      }`}
    >
      <Bouncy size={size} speed={speed} color={color} />
      {text && (
        <p className="mt-3 text-sm text-gray-600 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export {
    LoadingBouncyArc,
    LoadingBouncy
}
