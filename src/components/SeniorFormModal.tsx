"use client";

import SeniorForm from "./SeniorForm";
import { SeniorFormProps } from "./SeniorForm";

interface SeniorFormModalProps extends Omit<SeniorFormProps, 'onCancel'> {
  show: boolean;
  onHide: () => void;
  title: string;
}

export default function SeniorFormModal({
  show,
  onHide,
  title,
  ...formProps
}: SeniorFormModalProps) {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-0">
            <SeniorForm
              {...formProps}
              onCancel={onHide}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
