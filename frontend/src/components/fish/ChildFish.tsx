import type { RoleKind } from "../../types/fish";
import { ScaledFish } from "./common";

export default function ChildFish({ kind }: { kind: Extract<RoleKind, "child"> }) {
  // Tu SVG: viewBox="0 0 290.74 71.84"
  return (
    <ScaledFish kind={kind} viewBoxW={290.74} viewBoxH={71.84}>
      <defs>
        <style>{`
          .cls-1 { fill: #414042; }
          .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-6, .cls-7 { stroke-width: 0px; }
          .cls-2 { fill: #231f20; }
          .cls-3 { fill: #dd545d; }
          .cls-4 { fill: #d4d4d4; }
          .cls-5 { fill: #fff; }
          .cls-6 { fill: #fdcb03; }
          .cls-7 { fill: #696a6d; }
        `}</style>
      </defs>
      {/* Pego el contenido exacto de tu <svg> (sin la etiqueta <svg>) */}
      <g id="Layer_1-2" data-name="Layer 1">
        <g>
          <path className="cls-5" d="m15.86,6.34s28.76,6.94,64.5,3.61C110.31,7.15,134.77-1.61,172.72.83s58.52,18.44,82.87,18.89c24.36.44,35.11-5.33,35.11-5.33,0,0,1.9,15.56-22.77,23.56,0,0,19.61,11.33,19.29,25.78,0,0-50.93-21.11-104.38-15.78s-59.15,14.22-101.54,21.56c-37.05,6.41-70.64-2.41-70.64-2.41L15.86,6.34Z"/>
          <ellipse className="cls-4" cx="12.74" cy="36.8" rx="12.74" ry="30.7"/>
          <ellipse className="cls-3" cx="12.74" cy="36.68" rx="10.98" ry="26.56"/>
          <ellipse className="cls-7" cx="12.74" cy="36.68" rx="10.98" ry="26.56"/>
          <path className="cls-2" d="m15.7,11.11c-4.63,3.13-8.02,13.39-8.02,25.58s3.39,22.45,8.02,25.58c4.63-3.13,8.02-13.39,8.02-25.58s-3.39-22.45-8.02-25.58Z"/>
          <path className="cls-1" d="m39.32,10.54s2.17,13.63-2.19,16.78c0,0,7.64,5.52,2.74,13.52-4.91,8-10.24,13.93,1.64,15.11,11.88,1.19,32.95-6.22,32.95-6.22,0,0,2.63,8.59-3.95,12.15,0,0,27.57-3.21,27.35,4.96,0,0,40-10,79.75-17.7s109.51,14.59,109.51,14.59c0,0,3.29-11.93-14.27-16.07,0,0-3.95-5.2-14.48-10.3,0,0,14.92-4.88,15.36-10.03,0,0,17.34-2.33,17.01-12.93,0,0-19.64,5.85-36.54,5.33-16.9-.52-50.83-19.72-91.67-19.72C115.01,0,60.23,12.35,39.32,10.54Z"/>
          <circle className="cls-6" cx="56.19" cy="27.31" r="12.33"/>
          <circle className="cls-2" cx="54.41" cy="29.61" r="8.56"/>
          <circle className="cls-5" cx="60.02" cy="24" r="2.94"/>
        </g>
      </g>
    </ScaledFish>
  );
}
