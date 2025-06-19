import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Dashboard from "../components/dashboard"

const MainPage = () => (
  <Layout>

    <Dashboard />
  </Layout>
)

export const Head = () => <Seo title="main page" />

export default MainPage
