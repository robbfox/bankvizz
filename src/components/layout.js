import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header" // Make sure this import is correct
import "./layout.css"

// Accept the new props here
const Layout = ({ children, isFullWidth = false, isLoggedIn = false, onLogout }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const siteTitle = data.site.siteMetadata?.title || `BankViz`;

  return (
    <>
      {/* Pass the props down to the Header component */}
      <Header 
        siteTitle={siteTitle}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: isFullWidth ? 'none' : 'var(--size-content)',
          // Keep your full-width logic
        }}
      >
        <main>{children}</main>
        {/* ... your footer ... */}
      </div>
    </>
  )
}

export default Layout;