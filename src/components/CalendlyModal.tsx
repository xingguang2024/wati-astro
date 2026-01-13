import { useEffect, useRef } from "react";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl: string;
}

export default function CalendlyModal({
  isOpen,
  onClose,
  calendlyUrl,
}: CalendlyModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";

      // Set iframe src
      if (iframeRef.current && calendlyUrl) {
        iframeRef.current.src = calendlyUrl;
      }
    } else if (dialogRef.current && !isOpen) {
      dialogRef.current.close();
      document.body.style.overflow = "";

      // Clear iframe src when closing
      if (iframeRef.current) {
        iframeRef.current.src = "";
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, calendlyUrl]);

  const handleClose = () => {
    document.body.style.overflow = "";
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} id="astraCalendlyModal" className="modal">
      {/* Modal Box - Large, Full Height */}
      <div className="modal-box w-11/12 max-w-7xl h-[90vh] p-0 bg-white border border-zinc-400 rounded-lg shadow-[0_3px_9px_rgba(0,0,0,0.5)]">
        {/* Close Button */}
        <div className="relative p-2.5">
          <button
            type="button"
            className="absolute right-4 top-2.5 z-10 text-[21px] font-bold leading-none text-black opacity-20 hover:opacity-50 transition-opacity bg-transparent border-0 p-0 cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        {/* Calendly Iframe */}
        <div className="h-[calc(100%-50px)]">
          <iframe
            ref={iframeRef}
            id="astraCalendlyIframe"
            className="w-full h-full border-0"
            frameBorder="0"
            title="Schedule a Demo"
          />
        </div>
      </div>

      {/* Modal Backdrop - Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
