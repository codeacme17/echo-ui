import { SVGProps } from 'react'

export function Square(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M244 128v56a12 12 0 0 1-12 12H128a12 12 0 0 1-12-12V84H36v44a12 12 0 0 1-24 0V72a12 12 0 0 1 12-12h104a12 12 0 0 1 12 12v100h80v-44a12 12 0 0 1 24 0Z"
      ></path>
    </svg>
  )
}
