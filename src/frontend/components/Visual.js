import React from 'react'
import homeImg from '../img/home1.jpg'

const defaultAltText = 'NatureCab Mitfahrgelegenheit Visual'

export default ({src, alt}) => {
  const imgSrc = src || homeImg
  const altText = alt || defaultAltText

  return (
    <div className="visual">
      <img src={imgSrc} alt={altText}/>
    </div>
  )
}