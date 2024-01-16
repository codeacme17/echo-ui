/**
 * A custom hook that combines properties from a component's props and a group context,
 * with an optional list of keys prioritizing values from the group context.
 *
 * @template P - The type of the component's props.
 * @template G - The type of the group context.
 * @param {P} props - The component's props.
 * @param {G | null} groupContext - The group context, which can be null.
 * @param {string[] | undefined} groupPriorKeys - An optional list of keys prioritizing values from the group context.
 * @returns {P} - A merged set of properties from props and group context, with optional prioritization.
 *
 * @example
 * const props = usePropsWithGroup(
 *  { color: 'red', size: 10 },
 *  { color: 'blue', size: 20 },
 *  ['color'],
 * )
 * -> props = { color: 'blue', size: 10 }
 */

export const usePropsWithGroup = <P extends Record<string, any>, G extends Record<string, any>>(
  props: P,
  groupContext: G | null,
  exclude: string[] | undefined = [],
): P => {
  if (!groupContext) return props

  const combinedProps = { ...props, ...groupContext }
  const res = { ...props } as Record<string, any>

  for (const key in combinedProps) {
    if (exclude.includes(key)) continue

    // Normal case:
    // If the key is in the props, then we should use the value from the props.
    if (key in props) res[key] = props[key]
    else {
      // These keys are special cases:
      // cant pass to children props
      if (key === 'children') continue
      if (key === 'className') continue
      if (key === 'style') continue
      res[key] = groupContext![key]
    }
  }

  return res as P
}
