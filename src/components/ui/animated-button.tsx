import { useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AnimatedButton = ({ children, className, ...props }: AnimatedButtonProps) => {
  useEffect(() => {
    const button = document.querySelector('.animated-button');
    if (!button) return;

    const handleClick = () => {
      if (button.classList.contains('active')) return;

      button.classList.add('active');

      gsap.to(button, {
        keyframes: [
          {
            '--rotate': 10,
            '--plane-x': -8,
            '--plane-y': 20,
            duration: 0.3
          },
          {
            '--rotate': 15,
            '--plane-x': 45,
            '--plane-y': -100,
            '--plane-opacity': 0,
            duration: 0.3,
            onComplete() {
              gsap.set(button, {
                '--rotate': 0,
                '--plane-x': 0,
                '--plane-y': 0,
                '--plane-opacity': 1
              });
              button.classList.remove('active');
            }
          }
        ]
      });
    };

    button.addEventListener('click', handleClick);
    return () => button.removeEventListener('click', handleClick);
  }, []);

  return (
    <button
      className={cn(
        'animated-button relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
        className
      )}
      {...props}
    >
      <span className="default">{children}</span>
      <span className="success">
        <svg viewBox="0 0 16 16">
          <polyline points="3.75 9 7 12 13 5"></polyline>
        </svg>
      </span>
      <svg className="trails" viewBox="0 0 33 64">
        <path d="M26,4 C28,13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60"></path>
        <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60"></path>
      </svg>
      <div className="plane">
        <div className="left"></div>
        <div className="right"></div>
      </div>
    </button>
  );
};