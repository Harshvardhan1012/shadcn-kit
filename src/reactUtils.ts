import React from "react"
import { createRoot } from "react-dom/client"

export const ReactUtils = {
  React,
  createElement: React.createElement,
  createRoot,
  renderReactComponent: (
    component: any,
    props: any,
    container: HTMLElement
  ) => {
    const root = createRoot(container)
    const element = React.createElement(component, props)
    root.render(element)
    return root
  },
  unmountReactComponent: (root: any) => {
    if (root && root.unmount) {
      root.unmount()
    }
  },
}

const ReactUtilsModule = ReactUtils

export default ReactUtilsModule
