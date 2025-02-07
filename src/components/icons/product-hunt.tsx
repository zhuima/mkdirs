import type { SVGProps } from "react";

/**
 * https://icon-sets.iconify.design/logos/producthunt/
 */
export function LogosProductHunt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      viewBox="0 0 256 256"
      {...props}
    >
      <title>Product Hunt</title>
      <defs>
        <linearGradient
          id="logosProducthunt0"
          x1="50%"
          x2="50%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#da552f" />
          <stop offset="100%" stopColor="#d04b25" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill="url(#logosProducthunt0)"
          d="M128 256c70.694 0 128-57.306 128-128S198.694 0 128 0S0 57.306 0 128s57.306 128 128 128"
        />
        <path
          fill="#fff"
          d="M96 76.8v102.4h19.2v-32h29.056c19.296-.512 34.944-16.16 34.944-35.2c0-19.552-15.648-35.2-34.944-35.2zm48.493 51.2H115.2V96h29.293c8.563 0 15.507 7.168 15.507 16s-6.944 16-15.507 16"
        />
      </g>
    </svg>
  );
}
