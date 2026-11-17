// ponytail: route focus uses one heading; upgrade to route-specific landmarks if needed.
export function focusRoute() {
  const heading = document.querySelector('main h1, main h2')
  if (!heading) return
  heading.tabIndex = -1
  heading.focus({ preventScroll: true })
}
