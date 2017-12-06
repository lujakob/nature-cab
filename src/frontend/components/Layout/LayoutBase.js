import React from 'react'
import Header from '../Header'
import Footer from '../Footer'

export default ({client, children}) => {
  return (
    <div className='center'>
      <Header resetStore={client.resetStore}/>
      <div className='ph3 background-gray'>
        {children}
      </div>
      <Footer />
    </div>
  )
}