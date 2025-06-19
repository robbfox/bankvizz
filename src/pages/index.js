import * as React from "react"
import { Link } from "gatsby"
import ConnectBankButton from "../components/ConnectBankButton"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Dashboard from "../components/dashboard"

const MainPage = () => (
  <Layout>
    <ConnectBankButton />
    <Dashboard />
  </Layout>
)

export const Head = () => <Seo title="main page" />

export default MainPage
