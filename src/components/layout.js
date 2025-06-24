// In src/components/layout.js

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header"
import "./layout.css"

// Accept a new prop here, with a default value of false
const Layout = ({ children, isFullWidth = false }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div
        style={{
          margin: `0 auto`,
          // Use the prop to conditionally set the maxWidth
          maxWidth: isFullWidth ? 'none' : 'var(--size-content)',
          padding: `var(--size-gutter)`,
        }}
      >
        <main>{children}</main>
  
      </div>
    </>
  )
}

export default Layout