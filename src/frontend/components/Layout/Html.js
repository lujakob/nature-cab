import React from 'react'
import {Helmet} from 'react-helmet'

// disable server side rendering for debugging purposes
const isSSR = true

const Html = ({ content, state }) => {
  const helmet = Helmet.renderStatic();
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.2.1/css/tachyons.min.css"/>
        <link rel="stylesheet" href="/static/main.css"/>
        <link href="https://fonts.googleapis.com/css?family=Kalam|Open+Sans|Ruda:400,700" rel="stylesheet" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.script.toComponent()}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: isSSR ? content : '' }}></div>
        <script charSet="UTF-8" dangerouslySetInnerHTML={{__html: `window.__APOLLO_STATE__=${JSON.stringify(state)};`}}/>
        <script src="/static/bundle.js" charSet="UTF-8" />
      </body>
    </html>
  )
}

export default Html