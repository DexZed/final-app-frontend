import { ReactNode } from "react"


type Props = {children : ReactNode}

function AppContainer({children}: Props) {
  return (
    <><main className="max-w-5xl mx-auto">
        {children}</main></>
  )
}

export default AppContainer