/**
 * A custom hook that combines properties from a component's props and a group context,
 * with an optional list of keys prioritizing values from the group context.
 */

export const usePropsWithGroup = <P extends Record<string, any>, G extends Record<string, any>>(
  props: P,
  groupContext: G | null,
  groupPriorKeys: string[] | undefined = [],
): P => {
  if (!groupContext) return props

  const combinedProps = { ...props, ...groupContext }
  const res = { ...props } as Record<string, any>

  for (const key in combinedProps) {
    // If the key is in the groupPriorKeys,
    // then we should use the value from the groupContext.
    if (groupPriorKeys.includes(key)) {
      res[key] = groupContext[key]
      continue
    }

    // Normal case:
    // If the key is in the props, then we should use the value from the props.
    if (key in props) res[key] = props[key]
    else {
      if (key === 'children') continue
      res[key] = groupContext[key]
    }
  }

  return res as P
}
