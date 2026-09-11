import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1A5CFF",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "system-ui",
            letterSpacing: "-1px",
            marginTop: 2,
          }}
        >
          f
        </span>
      </div>
    ),
    { ...size },
  );
}
