'use client';

export default function NotiPopup({
  message,
  onClose,
  title = "",
  description = ""
}: {
  message: string;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  const isSuccess = title.toLowerCase() === "success";

  const color = {
    iconBg: isSuccess ? 'bg-green-100' : 'bg-red-100',
    icon: isSuccess ? 'text-green-500' : 'text-red-500',
    border: isSuccess ? 'border-green-200' : 'border-red-200',
    title: isSuccess ? 'text-green-700' : 'text-red-700',
    buttonFrom: isSuccess ? 'from-green-500' : 'from-red-500',
    buttonTo: isSuccess ? 'to-green-600' : 'to-pink-500',
    buttonHoverFrom: isSuccess ? 'hover:from-green-600' : 'hover:from-red-600',
    buttonHoverTo: isSuccess ? 'hover:to-green-700' : 'hover:to-pink-600',
    iconSymbol: isSuccess ? '✓' : '!'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border-4 ${color.border} relative animate-bounce-in`}>
        <div className="flex flex-col items-center">
          <div className={`${color.iconBg} rounded-full p-4 mb-4 shadow`}>
            <svg
              className={`w-12 h-12 ${color.icon}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {
                isSuccess ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                )
              }
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${color.title}`}>{title}</h2>
          <p className="mb-4 text-gray-700">{message}</p>
          {description && <p className="mb-6 text-sm text-gray-500">{description}</p>}
          <button
            className={`px-6 py-2 bg-gradient-to-r ${color.buttonFrom} ${color.buttonTo} text-white rounded-full font-semibold shadow ${color.buttonHoverFrom} ${color.buttonHoverTo} transition`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s;
        }
      `}</style>
    </div>
  );
}
