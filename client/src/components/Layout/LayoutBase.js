import React from 'react'
import Header from '../Header'

export const LayoutBase = ({client, children}) => {
  return (
    <div className='center'>
      <Header resetStore={client.resetStore}/>
      <div className='ph3 background-gray'>
        {children}
      </div>
    </div>
  )
}