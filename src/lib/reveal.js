// ponytail: route focus uses the skip-link target; every route marks one main.
export function focusRoute() {
  const target = document.querySelector('#main-content') || document.querySelector('main')
  if (!target) return
  target.tabIndex = -1
  target.focus({ preventScroll: true })
}
