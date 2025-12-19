import { Button } from "@material-ui/core"
import React from "react"

export function LinkAccount(props) {
  const handleLinkOauth = async (socialProvider: string) => {
    const result = await (
      await fetch(`http://localhost:8083/link-social/${socialProvider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
    ).json()
    if (!!result.redirectUrl) {
      window.location.replace(result.redirectUrl)
    }
  }
  return (
    <React.Fragment>
      <p>link</p>
      <Button onClick={() => handleLinkOauth("google")}>Link Google Account</Button>
    </React.Fragment>
  )
}
