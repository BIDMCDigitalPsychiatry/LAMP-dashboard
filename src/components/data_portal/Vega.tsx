import React from "react"
import vegaEmbed from "vega-embed"

export default function Vega({ spec, config, ...props }) {
  const ref = React.createRef()
  const [isRendered, setRenderedState] = React.useState(false)
  React.useEffect(() => {
    //todo: add message while vega renders
    setRenderedState(false)
    //@ts-ignore: as this is in a useEffect, the reference should always be ready in time
    vegaEmbed(ref.current, spec, config)
      .then(() => setRenderedState(true))
      .catch((e) => {
        console.log(e)
        ;(ref.current as HTMLElement).textContent = `This vega graph failed to render. ${e}`
      })
  }, [spec])

  return (
    //@ts-ignore:
    <div ref={ref} {...props}>
      &nbsp;{isRendered ? "" : "Rendering graph..."}
    </div>
  )
}
