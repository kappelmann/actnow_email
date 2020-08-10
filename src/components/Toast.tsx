import React from "react";
import styled from "styled-components";
import BootstrapToast from "react-bootstrap/Toast";

export type ToastProps = {
  children: React.ReactNode,
  className?: string,
  onClose?: () => void,
  show: boolean
}

export const Toast = ({
  children,
  className,
  onClose = () => {},
  show
} : ToastProps) => {
  return (
    <BootstrapToast
      className={className}
      onClose={onClose}
      show={show}
      autohide
    >
      <BootstrapToast.Body>
        {children}
      </BootstrapToast.Body>
    </BootstrapToast>
  );
};

export const StyledToast = styled(Toast)`
  position: fixed;
  top: 0;
  right: 0;
`;

export default StyledToast;
