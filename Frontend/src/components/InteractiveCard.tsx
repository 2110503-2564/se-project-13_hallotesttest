'use client'

export default function InteractiveCard({ children }: { children: React.ReactNode }) {
  function onCardMouseAction(event: React.SyntheticEvent) {
    if (event.type === 'mouseover') {
      event.currentTarget.classList.remove('shadow-lg');
      event.currentTarget.classList.remove('bg-gradient-to-br');
      event.currentTarget.classList.remove('from-white');
      event.currentTarget.classList.remove('to-blue-50');
      
      event.currentTarget.classList.add('shadow-2xl');
      event.currentTarget.classList.add('bg-gradient-to-br');
      event.currentTarget.classList.add('from-indigo-50');
      event.currentTarget.classList.add('to-purple-50');
    } else {
      event.currentTarget.classList.remove('shadow-2xl');
      event.currentTarget.classList.remove('bg-gradient-to-br');
      event.currentTarget.classList.remove('from-indigo-50');
      event.currentTarget.classList.remove('to-purple-50');
      
      event.currentTarget.classList.add('shadow-lg');
      event.currentTarget.classList.add('bg-gradient-to-br');
      event.currentTarget.classList.add('from-white');
      event.currentTarget.classList.add('to-blue-50');
    }
  }
  
  return (
    <div 
      className="w-full rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 overflow-hidden transition-all duration-300"
      onMouseOver={(e) => onCardMouseAction(e)}
      onMouseOut={(e) => onCardMouseAction(e)}
    >
      {children}
    </div>
  )
}