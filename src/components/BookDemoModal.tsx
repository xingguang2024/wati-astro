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

interface HubSpotForm {
  create: (config: {
    region: string;
    portalId: string;
    formId: string;
    target: HTMLElement;
    onFormReady?: () => void;
    onFormSubmit?: () => void;
  }) => void;
}

declare global {
  interface Window {
    hbspt?: {
      forms: HubSpotForm;
    };
  }
}

export default function BookDemoModal({
  isOpen,
  onClose,
  onFormSubmit,
}: BookDemoModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      document.body.style.overflow = "hidden";

      // Initialize HubSpot form if not already initialized
      if (!isInitialized) {
        initializeHubSpotForm();
      } else {
        setIsLoading(false);
      }
    } else if (dialogRef.current && !isOpen) {
      dialogRef.current.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isInitialized]);

  const initializeHubSpotForm = () => {
    setIsLoading(true);

    // Load HubSpot script if not loaded
    if (!window.hbspt) {
      const script = document.createElement("script");
      script.src = "//js.hsforms.net/forms/v2.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        createForm();
      };
      document.body.appendChild(script);
    } else {
      createForm();
    }
  };

  const createForm = () => {
    if (typeof window.hbspt !== "undefined" && formContainerRef.current) {
      window.hbspt.forms.create({
        region: "na1",
        portalId: "2858726",
        formId: "6dd802cc-f156-433b-ad75-27572cc84914",
        target: formContainerRef.current,
        onFormReady: () => {
          console.log("HubSpot form ready");
          setTimeout(() => {
            setIsLoading(false);
            setIsInitialized(true);
          }, 100);
        },
        onFormSubmit: () => {
          console.log("Form submitting...");
        },
      });

      // Listen for HubSpot form submission event (v4 forms)
      window.addEventListener("message", function (event) {
        if (
          event.data.type === "hsFormCallback" &&
          event.data.eventName === "onFormSubmitted"
        ) {
          console.log("Form submission complete");

          // Extract form data from event
          const formData: FormData = {
            firstname: "",
            email: "",
            phone: "",
          };

          // Get submitted data
          if (event.data.data) {
            event.data.data.forEach(
              (field: { name: string; value: string }) => {
                if (field.name === "firstname")
                  formData.firstname = field.value;
                if (field.name === "email") formData.email = field.value;
                if (field.name === "phone") formData.phone = field.value;
              },
            );
          }

          console.log("Form data extracted:", formData);

          // Callback to parent
          if (onFormSubmit) {
            onFormSubmit(formData);
          }
        }
      });
    } else {
      console.log("HubSpot not available, retrying...");
      setTimeout(createForm, 100);
    }
  };

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

          <div
            id="astra-hubspot-form"
            ref={formContainerRef}
            className={isLoading ? "hidden" : "block"}
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
