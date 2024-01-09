/**
 * A custom hook that combines properties from a component's props and a group context,
 * with an optional list of keys prioritizing values from the group context.
 *
 * @template T - The type of the group context.
 * @param {Record<string, any>} props - The component's props.
 * @param {T | null} groupContext - The context provided by a parent component.
 * @param {string[] | undefined} groupPriorKeys - An optional list of keys prioritizing values from the group context.
 * @returns {Record<string, any>} - The merged properties with prioritized values.
 */

export const usePropsWithGroup = <T extends Record<string, any>>(
  props: Record<string, any>,
  groupContext: T | null,
  groupPriorKeys: string[] | undefined = [],
) => {
  if (!groupContext) return props

  const compondedProps = { ...props, ...groupContext }
  const res = { ...props }

  for (const key in compondedProps) {
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

  return res
}
