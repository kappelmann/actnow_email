import React from "react";
import QRCodeReact from "qrcode.react";
import styled from "styled-components";

const ResponsiveSvgWrapper = styled.div`
  & > svg { display: block; /* svg is "inline" by default */
    height: auto; /* reset height */
    width: 100%; /* reset width */
  }
`;

export type QRCodeProps = {
  value: string
};

const QRCode = ({ value }: QRCodeProps) => (
  <ResponsiveSvgWrapper>
    <QRCodeReact
      renderAs="svg"
      xmlns="http://www.w3.org/2000/svg"
      value={value}
      size={1024}
    />
  </ResponsiveSvgWrapper>
);

export default QRCode;
