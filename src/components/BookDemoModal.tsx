import { useEffect, useRef, useState } from "react";

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit?: (data: FormData) => void;
}

interface FormData {
  firstname: string;
  email: string;
  phone: string;
}

declare global {
  interface Window {
    hbspt?: any;
    HubSpotFormsV4?: any;
  }
}

export default function BookDemoModal({
  isOpen,
  onClose,
  onFormSubmit,
}: BookDemoModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [useIframe, setUseIframe] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";

      // Try to initialize HubSpot form
      initializeHubSpotForm();
    } else if (dialogRef.current && !isOpen) {
      dialogRef.current.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const initializeHubSpotForm = () => {
    setIsLoading(true);

    // Load HubSpot script if not loaded
    if (!window.hbspt) {
      const script = document.createElement("script");
      script.src = "//js.hsforms.net/forms/embed/v2.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        createForm();
      };
      script.onerror = () => {
        console.error("Failed to load HubSpot script, falling back to iframe");
        setUseIframe(true);
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      createForm();
    }
  };

  const createForm = () => {
    if (typeof window.hbspt !== "undefined" && formContainerRef.current) {
      try {
        // Try to create form with v2/v3 API
        window.hbspt.forms.create({
          region: "na1",
          portalId: "2858726",
          formId: "6dd802cc-f156-433b-ad75-27572cc84914",
          target: formContainerRef.current,
          onFormReady: () => {
            console.log("HubSpot form ready (v2/v3)");
            setIsLoading(false);
          },
          onFormSubmit: () => {
            console.log("Form submitting...");
          },
        });
      } catch (error) {
        console.error("Error creating HubSpot form with API:", error);
        console.log("Falling back to iframe embed");
        setUseIframe(true);
        setIsLoading(false);
      }
    } else {
      console.log("HubSpot not available, using iframe");
      setUseIframe(true);
      setIsLoading(false);
    }
  };

  // Listen for HubSpot v4 form submission event
  useEffect(() => {
    const handleFormSubmission = async (event: any) => {
      // v4 form event
      if (event.detail && event.detail.type === "ON_FORM_SUBMITTED") {
        console.log("Form submission (v4) complete", event.detail);
        handleFormData(event.detail.data);
      }
      
      // v2/v3 form event via message
      if (event.data?.type === "hsFormCallback" && event.data?.eventName === "onFormSubmitted") {
        console.log("Form submission (v2/v3) complete", event.data);
        handleFormData(event.data.data);
      }
    };

    const handleFormData = (data: any) => {
      const formData: FormData = {
        firstname: "",
        email: "",
        phone: "",
      };

      if (Array.isArray(data)) {
        data.forEach((field: { name: string; value: string }) => {
          if (field.name === "firstname") formData.firstname = field.value;
          if (field.name === "email") formData.email = field.value;
          if (field.name === "phone") formData.phone = field.value;
        });
      }

      console.log("Form data extracted:", formData);

      if (onFormSubmit) {
        onFormSubmit(formData);
      }
    };

    // Listen for both v4 and message-based events
    window.addEventListener("hs-form-event", handleFormSubmission as any);
    window.addEventListener("message", handleFormSubmission);
    
    return () => {
      window.removeEventListener("hs-form-event", handleFormSubmission as any);
      window.removeEventListener("message", handleFormSubmission);
    };
  }, [onFormSubmit]);

  const handleClose = () => {
    document.body.style.overflow = "";
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      id="astraFormModal"
      className="modal"
      aria-labelledby="astraFormModalLabel"
    >
      {/* Modal Box */}
      <div className="modal-box max-w-[600px] p-0 bg-white border border-zinc-400 rounded-md shadow-[0_3px_9px_rgba(0,0,0,0.5)]">
        {/* Modal Header */}
        <div className="relative flex items-center justify-end px-4 py-3.5 border-b border-zinc-200">
          <h3
            id="astraFormModalLabel"
            className="absolute left-4 m-0 text-lg font-medium text-zinc-800"
          >
            Book a Demo
          </h3>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[21px] font-bold leading-none text-black opacity-20 hover:opacity-50 transition-opacity bg-transparent border-0 p-0 cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative p-5">
          {isLoading && (
            <div className="text-center py-10 px-5">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-zinc-100 border-t-[#30C5FF] rounded-full animate-spin" />
              <p className="text-zinc-600 text-sm m-0">Loading form...</p>
            </div>
          )}

          {/* HubSpot Form Container (for API embed) */}
          {!useIframe && (
            <div
              id="astra-hubspot-form"
              ref={formContainerRef}
              className={isLoading ? "hidden" : "block"}
            />
          )}

          {/* HubSpot Form iframe (fallback) */}
          {useIframe && (
            <iframe
              src="https://share.hsforms.com/1bdyAzMxTQ62tddJ1cshBFAfamea"
              width="100%"
              height="500"
              frameBorder="0"
              className="border-0"
              title="Book a Demo Form"
            />
          )}
        </div>
      </div>

      {/* Modal Backdrop - Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
