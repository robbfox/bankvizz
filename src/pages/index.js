import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Dashboard from "../components/dashboard"

const SecondPage = () => (
  <Layout>

    <Link to="/">Go back to the homepage</Link>
    <Dashboard />
  </Layout>
)

export const Head = () => <Seo title="Page two" />

export default SecondPage
