import React from "react"
import vegaEmbed from "vega-embed"

export default function Vega({ spec, config, ...props }) {
  const ref = React.createRef()
  const [isRendered, setRenderedState] = React.useState(false)
  React.useEffect(() => {
    //todo: add message while vega renders
    setRenderedState(false)
    //@ts-ignore - as this returns a promise, the reference should always be ready in time
    vegaEmbed(ref.current, spec, config).then(() => setRenderedState(true))
  }, [spec])
  return (
    //@ts-ignore - see above
    <div ref={ref} {...props}>
      &nbsp;{isRendered ? "" : "Rendering graph..."}
    </div>
  )
}
